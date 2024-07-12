import { Component, ViewChildren, QueryList } from '@angular/core';

import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { IndexArrowComponent } from '../shared/index-arrow/index-arrow.component';
import { SkillsComponent } from './skills/skills.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ScrollAnimationDirective } from '../shared/common/scroll-animation.directive';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    IndexArrowComponent,
    SkillsComponent,
    PortfolioComponent,
    ScrollAnimationDirective,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  @ViewChildren(IndexArrowComponent)
  indexArrows!: QueryList<IndexArrowComponent>;

  /**
   * Handles the visibility change of an index arrow component.
   *
   * @param isVisible - A boolean indicating whether the index arrow is visible or not.
   * @param index - The index of the index arrow component.
   */
  onArrowVisible(isVisible: boolean, index: number): void {
    const arrow = this.indexArrows.toArray()[index];
    if (arrow) {
      arrow.triggerAnimation(isVisible ? 'forward' : 'backward');
    }
  }
}
