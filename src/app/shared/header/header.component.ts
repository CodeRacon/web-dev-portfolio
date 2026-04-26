import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { BurgerIconComponent } from './burger-icon/burger-icon.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements AfterViewInit, OnDestroy {
  currentLang: string;
  activeSection = '';
  private readonly sectionOffset = 96;
  private readonly supportedLangs = ['en', 'de'];
  private readonly navLinks = [
    { id: 'about', labelKey: 'menu.navLinks.about' },
    { id: 'skills', labelKey: 'menu.navLinks.skills' },
    { id: 'portfolio', labelKey: 'menu.navLinks.portfolio' },
    { id: 'contact', labelKey: 'menu.navLinks.contact' },
  ];
  private routerSubscription: Subscription;

  /**
   * Initializes the header component with the user's preferred language.
   * Retrieves the preferred language from local storage, or defaults to 'en' if not found.
   * Sets the current language and updates the translation service to use the preferred language.
   */
  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator?.language ?? 'en';
    this.currentLang = this.normalizeLang(savedLang || browserLang);
    localStorage.setItem('preferredLanguage', this.currentLang);
    this.translate.use(this.currentLang).subscribe({
      error: () => {
        this.currentLang = 'en';
        localStorage.setItem('preferredLanguage', this.currentLang);
        this.translate.use('en');
      },
    });

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.syncActiveSection();
      }
    });
  }

  ngAfterViewInit(): void {
    this.syncActiveSection();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  /**
   * Changes the current language and updates the translation service and local storage.
   *
   * @param lang - The new language to set.
   */
  changeLanguage(lang: string): void {
    this.currentLang = this.normalizeLang(lang);
    localStorage.setItem('preferredLanguage', this.currentLang);
    this.translate.use(this.currentLang);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.syncActiveSection();
  }

  get links() {
    return this.navLinks;
  }

  /**
   * Scrolls the page to the specified section with an optional offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The number of pixels to offset the scroll position (default is 0).
   */
  async navigateAndScroll(sectionId: string, offset = this.sectionOffset) {
    if (this.router.url !== '/') {
      await this.router.navigate(['/']);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.scrollToSection(sectionId, offset);
  }

  scrollToSection(sectionId: string, offset = this.sectionOffset): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  private syncActiveSection(): void {
    if (this.router.url !== '/') {
      this.activeSection = '';
      return;
    }

    const firstSection = document.getElementById(this.navLinks[0].id);
    if (!firstSection) {
      this.activeSection = '';
      return;
    }

    const viewportMarker = window.scrollY + this.sectionOffset + 24;
    if (viewportMarker < firstSection.offsetTop) {
      this.activeSection = '';
      return;
    }

    let currentSection = this.navLinks[0].id;

    for (const link of this.navLinks) {
      const section = document.getElementById(link.id);
      if (!section) {
        continue;
      }

      if (viewportMarker >= section.offsetTop) {
        currentSection = link.id;
      }
    }

    this.activeSection = currentSection;
  }

  private normalizeLang(lang: string): string {
    const normalized = lang.toLowerCase();
    if (normalized === 'en' || normalized === 'eng') {
      return 'en';
    }

    if (normalized === 'de' || normalized === 'ger' || normalized === 'deu') {
      return 'de';
    }

    return 'en';
  }
}
