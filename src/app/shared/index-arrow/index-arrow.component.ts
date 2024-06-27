import {
  Component,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowOffsetService } from '../common/shadow-offset.service';

@Component({
  selector: 'app-index-arrow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-arrow.component.html',
  styleUrls: ['./index-arrow.component.scss'],
})
export class IndexArrowComponent {
  @Input() alignment: 'left' | 'right' = 'left';
  @Input() sectionId: string = this.generateUniqueId();
  @Input() maxOffset: number = 4;

  private animationState:
    | 'idle'
    | 'animatingForward'
    | 'expanded'
    | 'animatingBackward' = 'idle';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private shadowOffsetService: ShadowOffsetService
  ) {}

  @HostListener('mouseover')
  onMouseOver(): void {
    this.triggerAnimation('forward');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.triggerAnimation('backward');
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.updateShadow(event);
  }

  private triggerAnimation(direction: 'forward' | 'backward'): void {
    if (direction === 'forward' && this.animationState !== 'idle') return;
    if (direction === 'backward' && this.animationState !== 'expanded') return;

    const animationId =
      direction === 'forward' ? this.sectionId : `${this.sectionId}return`;
    const animElement = document.getElementById(
      animationId
    ) as SVGAnimateElement | null;

    if (animElement) {
      animElement.beginElement();
      this.animationState =
        direction === 'forward' ? 'animatingForward' : 'animatingBackward';

      setTimeout(() => {
        this.animationState = direction === 'forward' ? 'expanded' : 'idle';
      }, 500);
    }
  }

  private generateUniqueId(): string {
    return `section_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateShadow(event: MouseEvent): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const { x, y } = this.shadowOffsetService.calculateShadowOffset(
      rect,
      this.maxOffset
    );

    const feDropShadow =
      this.elementRef.nativeElement.querySelector('feDropShadow');
    if (feDropShadow) {
      this.renderer.setAttribute(feDropShadow, 'dx', `${x}`);
      this.renderer.setAttribute(feDropShadow, 'dy', `${y}`);
    }
  }
}
