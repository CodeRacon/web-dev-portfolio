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

  /**
   * Constructs a new instance of the `HeroComponent`.
   *
   * @param elementRef - A reference to the element that the component is attached to.
   * @param renderer - A service that provides methods for manipulating the DOM.
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.strokeElement = null;
  }

  /**
   * Initializes the component and sets up event listeners for the stroke element.
   *
   * When the stroke element is hovered over, the 'animate-swing' CSS class is added to it, causing an animation to play.
   * When the animation ends, the 'animate-swing' class is removed from the stroke element.
   */
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

  /**
   * Scrolls the page to the specified section with an optional offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The vertical offset (in pixels) to apply when scrolling to the section.
   */
  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
