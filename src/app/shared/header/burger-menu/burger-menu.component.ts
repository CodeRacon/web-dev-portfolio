import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import gsap from 'gsap';
import * as gsapCore from 'gsap/gsap-core';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',
})
export class BurgerMenuComponent {
  tl: gsap.core.Timeline;
  tl_hover: gsap.core.Timeline;
  hamburgerIcon: Element | null;

  constructor() {
    this.tl = new gsap.core.Timeline();
    this.tl_hover = new gsap.core.Timeline();
    this.hamburgerIcon = null;
  }

  ngOnInit() {
    this.tl = new gsap.core.Timeline({ paused: true });
    this.tl_hover = new gsap.core.Timeline({ paused: true });

    this.tl.to(
      document.querySelector(
        '.hamburger-icon-animated .icon-burger .line:nth-child(2)'
      ),
      { duration: 0.3, transform: 'rotate(135deg)' },
      0.3
    );
    this.tl.to(
      document.querySelector(
        '.hamburger-icon-animated .icon-burger .line:nth-child(1)'
      ),
      { duration: 0.15, left: '50%', width: '0' },
      0
    );
    this.tl.to(
      document.querySelector(
        '.hamburger-icon-animated .icon-burger .line:nth-child(3)'
      ),
      { duration: 0.15, left: '50%', width: '0' },
      0.15
    );
    this.tl.set(
      document.querySelector('.hamburger-icon-animated .icon-close .line'),
      { opacity: '1' }
    );
    this.tl.to(
      document.querySelector(
        '.hamburger-icon-animated .icon-burger .line:nth-child(2)'
      ),
      { duration: 0.15, transform: 'rotate(45deg)' },
      0.6
    );

    this.tl_hover.to(
      document.querySelector('.hamburger-icon-animated .icon'),
      { duration: 0.3, transform: 'scale(1.1)' },
      0
    );

    const hamburgerIconElement = document.querySelector(
      '.hamburger-icon-animated'
    );
    if (hamburgerIconElement) {
      this.hamburgerIcon = hamburgerIconElement;
      this.hamburgerIcon.addEventListener('click', (evt) => {
        if (this.hamburgerIcon) {
          this.hamburgerIcon.classList.toggle('menu-closed');

          if (this.hamburgerIcon.classList.contains('menu-closed')) {
            if (this.tl) {
              this.tl.reverse();
            }
          } else {
            if (this.tl) {
              this.tl.play();
            }
          }
        }
      });
    }
  }
}
