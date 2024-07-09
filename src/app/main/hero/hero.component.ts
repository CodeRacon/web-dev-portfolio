import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TextShadowOffsetDirective, BoxShadowOffsetDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  private strokeElement: HTMLElement | null;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.strokeElement = null;
  }

  ngOnInit() {
    this.strokeElement = this.elementRef.nativeElement.querySelector('.stroke');

    if (this.strokeElement) {
      this.renderer.listen(this.strokeElement, 'mouseenter', () => {
        this.renderer.addClass(this.strokeElement, 'animate-swing');
      });

      this.renderer.listen(this.strokeElement, 'animationend', () => {
        this.renderer.removeClass(this.strokeElement, 'animate-swing');
      });
    }
  }

  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
