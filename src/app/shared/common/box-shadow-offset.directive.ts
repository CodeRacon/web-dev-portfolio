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

  constructor(
    private el: ElementRef,
    private shadowOffsetService: ShadowOffsetService
  ) {}

  ngOnInit() {
    this.subscription = this.shadowOffsetService
      .getMousePosition$()
      .subscribe(() => {
        this.updateShadow();
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

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
