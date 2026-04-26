import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';

export interface WorkEntry {
  id: string;
  titleKey: string;
  roleBadgeKey?: string;
  stackKey: string;
  contextKey: string;
  contributionKey: string;
  noteKey?: string;
  isEarlierWork?: boolean;
  links: ProjectLink[];
}

export interface ProjectLink {
  labelKey: string;
  url: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    TextShadowOffsetDirective,
    BoxShadowOffsetDirective,
    TranslateModule,
    ScrollAnimationDirective,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  readonly selectedWork: WorkEntry[] = [
    {
      id: 'web-app',
      titleKey: 'portfolio.entries.webApp.title',
      roleBadgeKey: 'portfolio.labels.webApplication',
      stackKey: 'portfolio.entries.webApp.stack',
      contextKey: 'portfolio.entries.webApp.context',
      contributionKey: 'portfolio.entries.webApp.contribution',
      noteKey: 'portfolio.entries.webApp.note',
      links: [],
    },
    {
      id: 'ynspool',
      titleKey: 'portfolio.entries.ynspool.title',
      roleBadgeKey: 'portfolio.labels.mobileApplication',
      stackKey: 'portfolio.entries.ynspool.stack',
      contextKey: 'portfolio.entries.ynspool.context',
      contributionKey: 'portfolio.entries.ynspool.contribution',
      noteKey: 'portfolio.entries.ynspool.note',
      links: [],
    },
    {
      id: 'mybubble',
      titleKey: 'portfolio.entries.mybubble.title',
      stackKey: 'portfolio.entries.mybubble.stack',
      contextKey: 'portfolio.entries.mybubble.context',
      contributionKey: 'portfolio.entries.mybubble.contribution',
      isEarlierWork: true,
      links: [
        {
          labelKey: 'portfolio.links.github',
          url: 'https://github.com/CodeRacon/MyBubble',
        },
        {
          labelKey: 'portfolio.links.liveDemo',
          url: 'https://bubble.michael-buschmann.dev/',
        },
      ],
    },
  ];
}
