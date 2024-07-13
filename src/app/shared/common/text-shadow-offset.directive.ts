import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ShadowOffsetService } from './shadow-offset.service';
import { Subscription, combineLatest } from 'rxjs';

@Directive({
  selector: '[appTextShadowOffset]',
  standalone: true,
})
export class TextShadowOffsetDirective implements OnInit, OnDestroy {
  @Input() maxOffset: number = 8;
  private subscription!: Subscription;

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
    this.subscription = combineLatest([
      this.shadowOffsetService.getMousePosition$(),
      this.shadowOffsetService.getIsDesktopDevice$(),
    ]).subscribe(([_, isDesktop]) => {
      if (isDesktop) {
        this.updateShadow();
      } else {
        this.setFixedShadow();
      }
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

    this.el.nativeElement.style.textShadow = `${x}px ${y}px 0 #f0dbc7`;
    this.el.nativeElement.style.transition = 'text-shadow 0.675s ease-out';
  }

  private setFixedShadow() {
    this.el.nativeElement.style.textShadow = `0.25rem 0.25rem 0 #f0dbc7`;
    this.el.nativeElement.style.transition = 'unset';
  }
}
