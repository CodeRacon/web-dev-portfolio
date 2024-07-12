import { Component } from '@angular/core';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { BurgerIconComponent } from './burger-icon/burger-icon.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    BurgerIconComponent,
    BurgerMenuComponent,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentLang: string;

  /**
   * Initializes the header component with the user's preferred language.
   * Retrieves the preferred language from local storage, or defaults to 'en' if not found.
   * Sets the current language and updates the translation service to use the preferred language.
   */
  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('preferredLanguage');
    this.currentLang = savedLang || 'en';
    this.translate.use(this.currentLang);
  }

  /**
   * Changes the current language and updates the translation service and local storage.
   *
   * @param lang - The new language to set.
   */
  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
  }

  /**
   * Scrolls the page to the specified section with an optional offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The number of pixels to offset the scroll position (default is 0).
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
