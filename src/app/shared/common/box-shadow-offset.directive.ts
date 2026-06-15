import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appBoxShadowOffset]',
  standalone: true,
})
export class BoxShadowOffsetDirective implements OnInit, OnDestroy {
  @Input() maxOffset: number = 6;
  @Input() shadowColors: string[] = ['#9edfd4', '#f1aa2d'];
  @Input() layerStep: number = 6;
  @Input() shadowBorderColor: string = '#11100f';
  @Input() shadowBorderWidth: number = 1;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setFixedShadow();
  }

  ngOnDestroy() {
    this.clearShadow();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.isButtonElement()) {
      return;
    }
    this.clearShadow();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.isButtonElement()) {
      return;
    }
    this.setFixedShadow();
  }

  private setFixedShadow() {
    this.el.nativeElement.style.boxShadow = this.buildLayeredShadow(0, 0);
    this.el.nativeElement.style.transition =
      'all 0.125s ease-in-out, box-shadow 0.125s ease-in-out';
  }

  private clearShadow(): void {
    this.el.nativeElement.style.boxShadow = 'none';
  }

  private isButtonElement(): boolean {
    return this.el.nativeElement.tagName.toLowerCase() === 'button';
  }

  private buildLayeredShadow(x: number, y: number): string {
    const signX = x < 0 ? -1 : 1;
    const signY = y < 0 ? -1 : 1;
    const stepX = x + signX * this.layerStep;
    const stepY = y + signY * this.layerStep;

    return this.shadowColors
      .flatMap((color, index) => {
        const depth = index + 1;
        const layerX = stepX * depth;
        const layerY = stepY * depth;
        const offset = `${layerX.toFixed(4)}px ${layerY.toFixed(4)}px`;

        return [
          `${offset} 0 0 ${color}`,
          `${offset} 0 ${this.shadowBorderWidth}px ${this.shadowBorderColor}`,
        ];
      })
      .join(', ');
  }
}
