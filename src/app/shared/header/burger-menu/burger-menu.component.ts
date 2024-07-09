import { Component, Input, AfterViewInit } from '@angular/core';
import { TextShadowOffsetDirective } from '../../common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../common/box-shadow-offset.directive';
import { BurgerIconComponent } from '../burger-icon/burger-icon.component';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [TextShadowOffsetDirective, BoxShadowOffsetDirective, RouterModule],
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent implements AfterViewInit {
  @Input() burgerIcon!: BurgerIconComponent;

  constructor(private router: Router) {}

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

  async navigateAndScroll(sectionId: string, offset = 0): Promise<void> {
    if (this.router.url !== '/') {
      await this.router.navigate(['/']);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.scrollToSection(sectionId, offset);
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
