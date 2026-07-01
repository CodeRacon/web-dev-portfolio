import { Component, OnDestroy, OnInit } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';
import { FormsModule } from '@angular/forms';
import {
  ProtectedPortfolioProjectPayload,
  ProtectedPortfolioService,
} from '../../shared/common/protected-portfolio.service';
import { toDataURL } from 'qrcode';
import { Subscription } from 'rxjs';

export interface WorkEntry {
  id: string;
  titleKey: string;
  roleBadgeKey?: string;
  stackKey: string;
  contextKey: string;
  contributionKey: string;
  noteKey?: string;
  isEarlierWork?: boolean;
  linksEnabled?: boolean;
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

export interface ProtectedPortfolioScreenshot {
  url: string;
  alt: string;
}

export interface ProtectedPortfolioSnippet {
  language: string;
  sourceLabel: string;
  code: string;
  highlightedHtml: string;
}

export interface ProtectedPortfolioShowcase {
  id: string;
  title: string;
  caption: string;
  screenshot: ProtectedPortfolioScreenshot | null;
  snippet: ProtectedPortfolioSnippet | null;
}

export interface ProtectedPortfolioProject {
  title: string;
  summary: string;
  details: string[];
  note: string;
  links: ProtectedPortfolioLink[];
  showcases: ProtectedPortfolioShowcase[];
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
export class PortfolioComponent implements OnInit, OnDestroy {
  protectedPassword = '';
  protectedProjects: Record<string, ProtectedPortfolioProject> = {};
  publicLinkQrCodes: Record<string, string> = {};
  isUnlockingProtectedDetails = false;
  protectedAccessErrorKey = '';
  protectedAccessSuccess = false;
  expandedShowcaseCodeIds = new Set<string>();
  isMobileShowcaseCodeCollapseEnabled = false;
  private protectedLanguageSubscription: Subscription | null = null;
  private showcaseCodeCollapseMediaQuery: MediaQueryList | null = null;
  private readonly showcaseCodeCollapseMediaQueryListener = (
    event: MediaQueryListEvent
  ): void => {
    this.isMobileShowcaseCodeCollapseEnabled = event.matches;
  };

  constructor(
    private protectedPortfolioService: ProtectedPortfolioService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    void this.generatePublicLinkQrCodes();
    this.protectedLanguageSubscription =
      this.translateService.onLangChange.subscribe(() => {
        if (this.hasLoadedProtectedProjects()) {
          this.refreshProtectedDetails();
        }
      });

    this.showcaseCodeCollapseMediaQuery = window.matchMedia('(max-width: 425px)');
    this.isMobileShowcaseCodeCollapseEnabled =
      this.showcaseCodeCollapseMediaQuery.matches;
    this.showcaseCodeCollapseMediaQuery.addEventListener(
      'change',
      this.showcaseCodeCollapseMediaQueryListener
    );
  }

  ngOnDestroy(): void {
    this.protectedLanguageSubscription?.unsubscribe();
    this.showcaseCodeCollapseMediaQuery?.removeEventListener(
      'change',
      this.showcaseCodeCollapseMediaQueryListener
    );
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
      noteKey: 'portfolio.entries.roomfull.note',
      linksEnabled: false,
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

    this.protectedPortfolioService
      .unlock(password, this.getCurrentLanguage())
      .subscribe({
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

  getProtectedShowcases(entryId: string): ProtectedPortfolioShowcase[] {
    return this.protectedProjects[entryId]?.showcases ?? [];
  }

  getTextLinks(entry: WorkEntry): ProjectLink[] {
    if (entry.linksEnabled === false) {
      return [];
    }

    return entry.links.filter((link) => !link.showQrCode);
  }

  getQrLinks(entry: WorkEntry): ProjectLink[] {
    if (entry.linksEnabled === false) {
      return [];
    }

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

  isShowcaseCodeExpanded(showcaseId: string): boolean {
    if (!this.isMobileShowcaseCodeCollapseEnabled) {
      return true;
    }

    return this.expandedShowcaseCodeIds.has(showcaseId);
  }

  toggleShowcaseCode(showcaseId: string): void {
    if (!this.isMobileShowcaseCodeCollapseEnabled) {
      return;
    }

    if (this.expandedShowcaseCodeIds.has(showcaseId)) {
      this.expandedShowcaseCodeIds.delete(showcaseId);
      this.expandedShowcaseCodeIds = new Set(this.expandedShowcaseCodeIds);
      return;
    }

    this.expandedShowcaseCodeIds = new Set([
      ...this.expandedShowcaseCodeIds,
      showcaseId,
    ]);
  }

  getShowcaseCodeToggleLabel(showcaseId: string): string {
    return this.isShowcaseCodeExpanded(showcaseId)
      ? 'Collapse code snippet'
      : 'Expand code snippet';
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
            note: project.note ?? '',
            links,
            showcases: (project.showcases ?? []).map((showcase, index) => ({
              id: showcase.id ?? `showcase-${index + 1}`,
              title: showcase.title ?? '',
              caption: showcase.caption ?? '',
              screenshot:
                showcase.screenshot?.url && showcase.screenshot?.alt
                  ? {
                      url: showcase.screenshot.url,
                      alt: showcase.screenshot.alt,
                    }
                  : null,
              snippet: showcase.snippet?.code
                ? {
                    language: showcase.snippet.language ?? '',
                    sourceLabel: showcase.snippet.sourceLabel ?? '',
                    code: showcase.snippet.code,
                    highlightedHtml: this.highlightSnippetCode(
                      showcase.snippet.code,
                      showcase.snippet.language ?? ''
                    ),
                  }
                : null,
            })),
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

  private refreshProtectedDetails(): void {
    this.protectedPortfolioService.refresh(this.getCurrentLanguage()).subscribe({
      next: (response) => {
        void this.handleProtectedPortfolioResponse(response.projects ?? {});
      },
      error: () => {
        this.protectedAccessErrorKey =
          'portfolio.protectedAccess.errors.server';
      },
    });
  }

  private hasLoadedProtectedProjects(): boolean {
    return Object.keys(this.protectedProjects).length > 0;
  }

  private normalizePassword(password: string): string {
    return password.replace(/[\s\u0000-\u001f\u007f\u200b-\u200d\ufeff]+/g, '');
  }

  private getCurrentLanguage(): string {
    return (
      this.translateService.currentLang ||
      localStorage.getItem('preferredLanguage') ||
      'en'
    );
  }

  private async generatePublicLinkQrCodes(): Promise<void> {
    const qrLinks = this.selectedWork.flatMap((entry) =>
      entry.linksEnabled === false
        ? []
        : entry.links.filter((link) => link.showQrCode)
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

  private highlightSnippetCode(code: string, language: string): string {
    if (!code) {
      return '';
    }

    const normalizedLanguage = language.trim().toLowerCase();
    const supportedLanguages = new Set([
      'js',
      'jsx',
      'ts',
      'tsx',
      'javascript',
      'typescript',
    ]);

    if (!supportedLanguages.has(normalizedLanguage)) {
      return this.escapeHtml(code);
    }

    const tokenPattern =
      /\/\*[\s\S]*?\*\/|\/\/[^\n\r]*|`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[A-Za-z][\w.-]*|[A-Za-z_$][\w$-]*(?==)|@\w+|\b(?:import|from|export|default|return|const|let|var|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|new|class|extends|implements|interface|type|enum|as|async|await|function|typeof|instanceof|in|of|get|set|public|private|protected|readonly)\b|\b(?:true|false|null|undefined|this|super)\b|\b\d+(?:\.\d+)?\b|[A-Z][A-Za-z0-9_]*\b|[a-zA-Z_$][\w$]*(?=\()|[=><!+\-*/%&|^~?:]+|[{}[\]().,;]+/g;

    let cursor = 0;
    let highlightedHtml = '';

    for (const match of code.matchAll(tokenPattern)) {
      const value = match[0];
      const index = match.index ?? 0;

      if (index > cursor) {
        highlightedHtml += this.escapeHtml(code.slice(cursor, index));
      }

      highlightedHtml += `<span class="token ${this.getTokenClass(value)}">${this.escapeHtml(value)}</span>`;
      cursor = index + value.length;
    }

    if (cursor < code.length) {
      highlightedHtml += this.escapeHtml(code.slice(cursor));
    }

    return highlightedHtml;
  }

  private getTokenClass(token: string): string {
    if (token.startsWith('//') || token.startsWith('/*')) {
      return 'comment';
    }

    if (
      token.startsWith("'") ||
      token.startsWith('"') ||
      token.startsWith('`')
    ) {
      return 'string';
    }

    if (token.startsWith('@')) {
      return 'decorator';
    }

    if (/^<\/?[A-Za-z]/.test(token)) {
      return 'tag';
    }

    if (/^[A-Za-z_$][\w$-]*(?==)$/.test(token)) {
      return 'attribute';
    }

    if (
      /^(import|from|export|default|return|const|let|var|if|else|switch|case|break|continue|for|while|do|try|catch|finally|throw|new|class|extends|implements|interface|type|enum|as|async|await|function|typeof|instanceof|in|of|get|set|public|private|protected|readonly)$/.test(
        token
      )
    ) {
      return 'keyword';
    }

    if (/^(true|false|null|undefined|this|super)$/.test(token)) {
      return 'literal';
    }

    if (/^\d/.test(token)) {
      return 'number';
    }

    if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      return 'type';
    }

    if (/^[a-zA-Z_$][\w$]*$/.test(token)) {
      return 'function';
    }

    if (/^[=><!+\-*/%&|^~?:]+$/.test(token)) {
      return 'operator';
    }

    return 'punctuation';
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
}
