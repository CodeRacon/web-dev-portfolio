import { Component, ElementRef, ViewChild } from '@angular/core';
import { TextShadowOffsetDirective } from '../../common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../common/box-shadow-offset.directive';

@Component({
  standalone: true,
  imports: [TextShadowOffsetDirective, BoxShadowOffsetDirective],
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent {
  @ViewChild('navLinks', { static: true }) navLinks!: ElementRef<HTMLElement>;

  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
