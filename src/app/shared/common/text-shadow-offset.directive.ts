import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ShadowOffsetService } from './shadow-offset.service';
import { Subscription } from 'rxjs';

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
   * Subscribes to the `getMousePosition$()` observable from the `ShadowOffsetService` and calls the `updateShadow()` method whenever the mouse position changes.
   * This ensures that the text shadow offset is updated in response to mouse movements.
   */
  ngOnInit() {
    this.subscription = this.shadowOffsetService
      .getMousePosition$()
      .subscribe(() => {
        this.updateShadow();
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
}
