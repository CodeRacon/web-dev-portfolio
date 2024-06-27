import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { ScrollObserverService } from './scroll-observer.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appScrollAnimation]',
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() animationClass = 'animated';
  @Input() threshold = 0.1;
  @Input() rootMargin = '-100px 0px -100px 0px';

  private subscription!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private scrollObserver: ScrollObserverService
  ) {}

  ngOnInit() {
    const options: IntersectionObserverInit = {
      threshold: this.threshold,
      rootMargin: this.rootMargin,
    };

    this.subscription = this.scrollObserver
      .observe(this.el.nativeElement, options)
      .subscribe((entry) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
        } else {
          this.renderer.removeClass(this.el.nativeElement, this.animationClass);
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
