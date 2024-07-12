import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ShadowOffsetService } from './shadow-offset.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appBoxShadowOffset]',
  standalone: true,
})
export class BoxShadowOffsetDirective implements OnInit, OnDestroy {
  @Input() maxOffset: number = 8;
  private subscription!: Subscription;

  /**
   * Constructs a new instance of the `BoxShadowOffsetDirective`.
   * @param el - The `ElementRef` instance for the element the directive is applied to.
   * @param shadowOffsetService - The `ShadowOffsetService` instance used to calculate the shadow offset.
   */
  constructor(
    private el: ElementRef,
    private shadowOffsetService: ShadowOffsetService
  ) {}

  /**
   * Subscribes to the `shadowOffsetService.getMousePosition$()` observable and updates the box shadow of the element when the mouse position changes.
   */
  ngOnInit() {
    this.subscription = this.shadowOffsetService
      .getMousePosition$()
      .subscribe(() => {
        this.updateShadow();
      });
  }

  /**
   * Unsubscribes from the `shadowOffsetService` subscription when the directive is destroyed.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Updates the box shadow of the element based on the current mouse position.
   * The box shadow is offset by a maximum of `maxOffset` pixels in both the x and y directions.
   * The box shadow color is set to `#f0dbc7`.
   * The box shadow transition is set to a 0.125s ease-in-out transition for the box shadow, and a 0.675s ease-out transition for all other properties.
   */
  private updateShadow() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const { x, y } = this.shadowOffsetService.calculateShadowOffset(
      rect,
      this.maxOffset
    );

    this.el.nativeElement.style.boxShadow = `${x}px ${y}px 0 #f0dbc7`;
    this.el.nativeElement.style.transition =
      'all 0.125s ease-in-out, box-shadow 0.675s ease-out';
  }
}
