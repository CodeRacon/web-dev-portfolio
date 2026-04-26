import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslateModule, TextShadowOffsetDirective, BoxShadowOffsetDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  /**
   * Scrolls the page to the specified section with an optional offset.
   *
   * @param sectionId - The ID of the section to scroll to.
   * @param offset - The vertical offset (in pixels) to apply when scrolling to the section.
   */
  scrollToSection(sectionId: string, offset = 96): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
