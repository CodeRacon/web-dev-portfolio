import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { ScrollObserverService } from './scroll-observer.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appScrollAnimation]',
  standalone: true,
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() animationClass = 'animated';
  @Input() threshold = 0.1;
  @Input() rootMargin = '-100px 0px -100px 0px';
  @Output() elementVisible = new EventEmitter<boolean>();

  private subscription!: Subscription;

  /**
   * Constructs a new instance of the `ScrollAnimationDirective`.
   * @param el - The `ElementRef` instance for the element the directive is applied to.
   * @param renderer - The `Renderer2` instance used to manipulate the DOM.
   * @param scrollObserver - The `ScrollObserverService` instance used to observe the element's visibility.
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private scrollObserver: ScrollObserverService
  ) {}

  /**
   * Initializes the scroll animation directive by observing the element's visibility
   * and triggering the animation when the element comes into view.
   *
   * The directive uses the `ScrollObserverService` to observe the element's visibility
   * based on the provided `threshold` and `rootMargin` options. When the element becomes
   * visible, the `triggerAnimation()` method is called to add the `animationClass` to
   * the element, triggering the animation. When the element goes out of view, the
   * `animationClass` is removed.
   *
   * The `elementVisible` event is emitted to notify when the element becomes visible or
   * goes out of view.
   *
   * The subscription to the `ScrollObserverService` is stored and unsubscribed in the
   * `ngOnDestroy()` method to prevent memory leaks.
   */
  ngOnInit() {
    const options: IntersectionObserverInit = {
      threshold: this.threshold,
      rootMargin: this.rootMargin,
    };

    this.subscription = this.scrollObserver
      .observe(this.el.nativeElement, options)
      .subscribe((entry) => {
        if (entry.isIntersecting) {
          this.triggerAnimation();
          this.elementVisible.emit(true);
        } else {
          this.renderer.removeClass(this.el.nativeElement, this.animationClass);
          this.elementVisible.emit(false);
        }
      });
  }

  /**
   * Triggers the animation by first removing the `animationClass` from the element,
   * then forcing a layout reflow by accessing the `offsetWidth` property, and finally
   * adding the `animationClass` back to the element to trigger the animation.
   *
   * This method is called when the element comes into view, as observed by the
   * `ScrollObserverService`.
   */
  private triggerAnimation() {
    this.renderer.removeClass(this.el.nativeElement, this.animationClass);
    void this.el.nativeElement.offsetWidth;
    this.renderer.addClass(this.el.nativeElement, this.animationClass);
  }

  /**
   * Unsubscribes from the `ScrollObserverService` subscription when the directive is destroyed.
   * This prevents memory leaks by ensuring the subscription is properly cleaned up.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
