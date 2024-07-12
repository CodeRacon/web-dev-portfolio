import { Component, Input, AfterViewInit } from '@angular/core';
import { TextShadowOffsetDirective } from '../../common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../common/box-shadow-offset.directive';
import { BurgerIconComponent } from '../burger-icon/burger-icon.component';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    TextShadowOffsetDirective,
    BoxShadowOffsetDirective,
    RouterModule,
    TranslateModule,
  ],
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss'],
})
export class BurgerMenuComponent implements AfterViewInit {
  @Input() burgerIcon!: BurgerIconComponent;

  constructor(private router: Router) {}

  /**
   * Listens for the 'toggle' event on the burger menu element and closes the menu if it is not open.
   * This ensures that the burger menu is closed when the user clicks outside of it.
   */
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

  /**
   * Navigates to the root path ('/') if the current URL is not the root path, waits 100 milliseconds, and then scrolls to the specified section with the given offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The offset (in pixels) to apply when scrolling to the section.
   * @returns A Promise that resolves when the navigation and scrolling are complete.
   */
  async navigateAndScroll(sectionId: string, offset = 0): Promise<void> {
    if (this.router.url !== '/') {
      await this.router.navigate(['/']);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.scrollToSection(sectionId, offset);
  }

  /**
   * Scrolls to the specified section with the given offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The offset (in pixels) to apply when scrolling to the section.
   */
  scrollToSection(sectionId: string, offset = 0): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  /**
   * Closes the burger menu popover and adds the 'menu-closed' class to the burger icon element.
   */
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
