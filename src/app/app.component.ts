import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { HeroComponent } from './main/hero/hero.component';
import { AboutComponent } from './main/about/about.component';
import { SkillsComponent } from './main/skills/skills.component';
import { PortfolioComponent } from './main/portfolio/portfolio.component';
import { IndexArrowComponent } from './shared/index-arrow/index-arrow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    IndexArrowComponent,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    PortfolioComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';
}
