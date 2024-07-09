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

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('preferredLanguage');
    this.currentLang = savedLang || 'en';
    this.translate.use(this.currentLang);
  }

  changeLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
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
