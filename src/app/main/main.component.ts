import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { IndexArrowComponent } from '../shared/index-arrow/index-arrow.component';
import { SkillsComponent } from './skills/skills.component';
import { PortfolioComponent } from './portfolio/portfolio.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    IndexArrowComponent,
    SkillsComponent,
    PortfolioComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
