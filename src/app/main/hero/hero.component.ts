import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
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
}
