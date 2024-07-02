import { Component, Input, AfterViewInit } from '@angular/core';
import { TextShadowOffsetDirective } from '../../common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../common/box-shadow-offset.directive';
import { BurgerIconComponent } from '../burger-icon/burger-icon.component';

@Component({
  standalone: true,
  imports: [TextShadowOffsetDirective, BoxShadowOffsetDirective],
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent implements AfterViewInit {
  @Input() burgerIcon!: BurgerIconComponent;

  ngAfterViewInit() {
    const burgerMenu = document.getElementById('burger-menu');
    if (burgerMenu instanceof HTMLElement) {
      burgerMenu.addEventListener('toggle', (event: Event) => {
        const popover = event.target as HTMLElement;
        if (!popover.matches(':popover-open')) {
          this.burgerIcon.closeMenu();
        }
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

  closePopover(): void {
    const popover = document.getElementById('burger-menu');
    if (popover instanceof HTMLElement) {
      popover.hidePopover();
    }

    const burgerIcon = document.getElementById('burger-icon');
    if (burgerIcon) {
      burgerIcon.classList.add('menu-closed');
    }
  }
}
