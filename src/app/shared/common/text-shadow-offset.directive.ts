import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ShadowOffsetService } from './shadow-offset.service';
import { Subscription, combineLatest } from 'rxjs';

@Directive({
  selector: '[appTextShadowOffset]',
  standalone: true,
})
export class TextShadowOffsetDirective implements OnInit, OnDestroy {
  @Input() maxOffset: number = 4;
  @Input() shadowColors: string[] = ['#128f94', '#df553d', '#f1aa2d'];
  @Input() layerStep: number = 1;
  @Input() outlineWidth: number = 0;
  @Input() outlineColor: string = '#11100f';
  @Input() activeClass: string = '';
  private subscription!: Subscription;
  private classObserver?: MutationObserver;
  private isDesktopDevice = false;

  /**
   * Constructs a new `TextShadowOffsetDirective` instance.
   * @param el - The `ElementRef` instance for the element the directive is applied to.
   * @param shadowOffsetService - The `ShadowOffsetService` instance used to calculate the text shadow offset.
   */
  constructor(
    private el: ElementRef,
    private shadowOffsetService: ShadowOffsetService
  ) {}

  /**
   * Subscribes to the `getMousePosition$()` and `getIsDesktopDevice$()` observables from the `ShadowOffsetService`.
   * When the mouse position changes and the device is a desktop, it updates the text shadow dynamically.
   * When the device is not a desktop, it sets a fixed text shadow.
   */
  ngOnInit() {
    this.watchActiveClass();

    this.subscription = combineLatest([
      this.shadowOffsetService.getMousePosition$(),
      this.shadowOffsetService.getIsDesktopDevice$(),
    ]).subscribe(([_, isDesktop]) => {
      this.isDesktopDevice = isDesktop;
      this.applyShadow();
    });
  }

  /**
   * Unsubscribes from the `getMousePosition$()` observable when the directive is destroyed.
   * This ensures that the directive does not continue to listen for mouse position changes
   * after it has been removed from the DOM.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.classObserver?.disconnect();
  }

  /**
   * Updates the text shadow of the element to create a parallax-like effect based on the current mouse position.
   * The text shadow is calculated using the `ShadowOffsetService` and the `maxOffset` input property.
   * The text shadow is updated with a smooth transition effect.
   */
  private updateShadow() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const { x, y } = this.shadowOffsetService.calculateShadowOffset(
      rect,
      this.maxOffset
    );

    this.el.nativeElement.style.textShadow = this.buildLayeredShadow(x, y);
    this.el.nativeElement.style.transition = 'text-shadow 0.675s ease-out';
  }

  private setFixedShadow() {
    this.el.nativeElement.style.textShadow = this.buildLayeredShadow(2, 2);
    this.el.nativeElement.style.transition = 'unset';
  }

  private applyShadow(): void {
    if (!this.isActive()) {
      this.clearShadow();
      return;
    }

    if (this.isDesktopDevice) {
      this.updateShadow();
    } else {
      this.setFixedShadow();
    }
  }

  private clearShadow(): void {
    this.el.nativeElement.style.textShadow = 'none';
  }

  private isActive(): boolean {
    if (!this.activeClass) {
      return true;
    }

    return this.el.nativeElement.classList.contains(this.activeClass);
  }

  private watchActiveClass(): void {
    if (!this.activeClass) {
      return;
    }

    this.classObserver = new MutationObserver(() => this.applyShadow());
    this.classObserver.observe(this.el.nativeElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  private buildLayeredShadow(x: number, y: number): string {
    const signX = x < 0 ? -1 : 1;
    const signY = y < 0 ? -1 : 1;
    const stepX = x + signX * this.layerStep;
    const stepY = y + signY * this.layerStep;

    const outlineShadows = this.buildOutlineShadows();
    const colorShadows = this.shadowColors
      .map((color, index) => {
        const depth = index + 1;
        const layerX = stepX * depth;
        const layerY = stepY * depth;
        return `${layerX.toFixed(2)}px ${layerY.toFixed(2)}px 0 ${color}`;
      });

    return [...outlineShadows, ...colorShadows].join(', ');
  }

  private buildOutlineShadows(): string[] {
    const shadows: string[] = [];

    for (let x = -this.outlineWidth; x <= this.outlineWidth; x++) {
      for (let y = -this.outlineWidth; y <= this.outlineWidth; y++) {
        if (x === 0 && y === 0) {
          continue;
        }

        shadows.push(`${x}px ${y}px 0 ${this.outlineColor}`);
      }
    }

    return shadows;
  }
}
