import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';

/**
 * Represents a project in the portfolio, containing a name, description key, list of technologies used,
 * a video file, and a list of links (name and URL).
 */
export interface Project {
  name: string;
  descriptionKey: string;
  technologies: string[];
  video: string;
  links: ProjectLink[];
}

/**
 * Represents a link associated with a project, containing a name and URL.
 */
export interface ProjectLink {
  name: string;
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
  /**
   * An array of project objects, each representing a project in the portfolio.
   * Each project has a name, a description key, a list of technologies used,
   * a video file, and a list of links (name and URL).
   */
  projectList: Project[] = [
    {
      name: 'Join',
      descriptionKey: 'portfolio.projects.join.description',
      technologies: ['JavaScript | Firebase | HTML | CSS'],
      video: 'join.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/join' },
        { name: 'Live', url: 'https://join.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'M7 - Dashboard',
      descriptionKey: 'portfolio.projects.m7.description',
      technologies: ['REST API | JavaScript | VUE.JS | HTML | SCSS'],
      video: 'm7.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/MagSeven' },
        { name: 'Live', url: 'https://m7.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'CavernQuest',
      descriptionKey: 'portfolio.projects.cavernQuest.description',
      technologies: ['JavaScript | OOP | Firebase | HTML | CSS'],
      video: 'cq.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/CavernQuest' },
        { name: 'Live', url: 'https://cavernquest.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'PokeDex',
      descriptionKey: 'portfolio.projects.pokeDex.description',
      technologies: ['REST API | JavaScript | HTML |  CSS'],
      video: 'poke.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/PokeDex' },
        { name: 'Live', url: 'https://pokedex.michael-buschmann.dev/' },
      ],
    },
  ];

  /**
   * Handles the visibility of a video element on the page.
   * If the element becomes visible, it will play the video after a 100ms delay.
   * If the element becomes hidden, it will pause the video and reset the current time to 0.
   *
   * @param isVisible - A boolean indicating whether the element is visible or not.
   * @param video - The HTMLVideoElement to play or pause.
   */
  onElementVisible(isVisible: boolean, video: HTMLVideoElement): void {
    if (isVisible) {
      setTimeout(() => {
        this.playVideo(video);
      }, 100);
    } else {
      this.pauseVideo(video);
    }
  }

  /**
   * Plays the provided video element.
   *
   * @param video - The HTMLVideoElement to play.
   */
  playVideo(video: HTMLVideoElement): void {
    video.muted = true;
    video.play();
  }

  /**
   * Pauses the provided video element and resets its current time to 0.
   *
   * @param video - The HTMLVideoElement to pause.
   */
  pauseVideo(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
  }
}
