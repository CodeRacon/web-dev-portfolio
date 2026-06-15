import { Component, OnInit } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';
import { FormsModule } from '@angular/forms';
import {
  ProtectedPortfolioProjectPayload,
  ProtectedPortfolioService,
} from '../../shared/common/protected-portfolio.service';
import { toDataURL } from 'qrcode';

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
  showQrCode?: boolean;
}

export interface ProtectedPortfolioLink {
  label: string;
  url: string;
  qrCodeDataUrl: string;
}

export interface ProtectedPortfolioProject {
  title: string;
  summary: string;
  details: string[];
  links: ProtectedPortfolioLink[];
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    TextShadowOffsetDirective,
    BoxShadowOffsetDirective,
    TranslateModule,
    ScrollAnimationDirective,
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent implements OnInit {
  protectedPassword = '';
  protectedProjects: Record<string, ProtectedPortfolioProject> = {};
  publicLinkQrCodes: Record<string, string> = {};
  isUnlockingProtectedDetails = false;
  protectedAccessErrorKey = '';
  protectedAccessSuccess = false;

  constructor(private protectedPortfolioService: ProtectedPortfolioService) {}

  ngOnInit(): void {
    void this.generatePublicLinkQrCodes();
  }

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
      id: 'roomFull',
      titleKey: 'portfolio.entries.roomfull.title',
      roleBadgeKey: 'portfolio.labels.webApplication',
      stackKey: 'portfolio.entries.roomfull.stack',
      contextKey: 'portfolio.entries.roomfull.context',
      contributionKey: 'portfolio.entries.roomfull.contribution',
      links: [
        {
          labelKey: 'portfolio.links.github',
          url: 'https://github.com/CodeRacon/roomfull-2.0',
        },
        {
          labelKey: 'portfolio.links.liveApp',
          url: 'https://roomfull.michael-buschmann.dev',
          showQrCode: true,
        },
      ],
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
          showQrCode: true,
        },
      ],
    },
  ];

  unlockProtectedDetails(): void {
    const password = this.normalizePassword(this.protectedPassword);

    if (!password || this.isUnlockingProtectedDetails) {
      return;
    }

    this.isUnlockingProtectedDetails = true;
    this.protectedAccessErrorKey = '';
    this.protectedAccessSuccess = false;

    this.protectedPortfolioService.unlock(password).subscribe({
      next: (response) => {
        void this.handleProtectedPortfolioResponse(response.projects ?? {});
      },
      error: (error) => {
        this.protectedAccessErrorKey =
          error.status === 401
            ? 'portfolio.protectedAccess.errors.invalid'
            : 'portfolio.protectedAccess.errors.server';
        this.isUnlockingProtectedDetails = false;
      },
    });
  }

  getProtectedDetail(entryId: string): ProtectedPortfolioProject | null {
    return this.protectedProjects[entryId] ?? null;
  }

  getProtectedTitle(entryId: string): string | null {
    return this.protectedProjects[entryId]?.title || null;
  }

  getProtectedLinks(entryId: string): ProtectedPortfolioLink[] {
    return this.protectedProjects[entryId]?.links ?? [];
  }

  getTextLinks(entry: WorkEntry): ProjectLink[] {
    return entry.links.filter((link) => !link.showQrCode);
  }

  getQrLinks(entry: WorkEntry): ProjectLink[] {
    return entry.links.filter((link) => link.showQrCode);
  }

  getPublicLinkQrCode(url: string): string {
    return this.publicLinkQrCodes[url] ?? '';
  }

  shouldHideNote(entryId: string): boolean {
    return Boolean(this.protectedProjects[entryId]);
  }

  shouldShowFsd(entryId: string): boolean {
    return entryId === 'web-app' && Boolean(this.protectedProjects[entryId]);
  }

  hasProtectedPassword(): boolean {
    return this.normalizePassword(this.protectedPassword).length > 0;
  }

  private normalizeProjects(
    projects: Record<string, ProtectedPortfolioProjectPayload>
  ): Promise<Record<string, ProtectedPortfolioProject>> {
    const normalizedProjects = Object.entries(projects).map(
      async ([projectId, project]) => {
        const links = await Promise.all(
          (project.links ?? []).map(async (link) => ({
            ...link,
            qrCodeDataUrl: await this.createQrCodeDataUrl(link.url),
          }))
        );

        return [
          projectId,
          {
            title: project.title ?? '',
            summary: project.summary ?? '',
            details: project.details ?? [],
            links,
          },
        ] as const;
      }
    );

    return Promise.all(normalizedProjects).then((projectEntries) =>
      Object.fromEntries(projectEntries)
    );
  }

  private async handleProtectedPortfolioResponse(
    projects: Record<string, ProtectedPortfolioProjectPayload>
  ): Promise<void> {
    try {
      this.protectedProjects = await this.normalizeProjects(projects);
      this.protectedAccessSuccess = true;
      this.protectedPassword = '';
    } catch {
      this.protectedAccessErrorKey = 'portfolio.protectedAccess.errors.server';
    } finally {
      this.isUnlockingProtectedDetails = false;
    }
  }

  private normalizePassword(password: string): string {
    return password.replace(/[\s\u0000-\u001f\u007f\u200b-\u200d\ufeff]+/g, '');
  }

  private async generatePublicLinkQrCodes(): Promise<void> {
    const qrLinks = this.selectedWork.flatMap((entry) =>
      entry.links.filter((link) => link.showQrCode)
    );
    const qrCodeEntries = await Promise.all(
      qrLinks.map(async (link) => [
        link.url,
        await this.createQrCodeDataUrl(link.url),
      ])
    );

    this.publicLinkQrCodes = Object.fromEntries(qrCodeEntries);
  }

  private createQrCodeDataUrl(url: string): Promise<string> {
    return toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      scale: 4,
      width: 112,
      color: {
        dark: '#11100f',
        light: '#fff1dc',
      },
    });
  }
}
