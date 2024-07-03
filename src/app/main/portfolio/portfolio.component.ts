import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';

export interface Project {
  name: string;
  descriptionKey: string;
  technologies: string[];
  video: string;
  links: ProjectLink[];
}

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
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  projectList: Project[] = [
    {
      name: 'Join',
      descriptionKey: 'portfolio.projects.join.description',
      technologies: ['JavaScript | Firebase | HTML | CSS'],
      video: 'join.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/join' },
        { name: 'Live', url: 'https://www.join.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'CavernQuest',
      descriptionKey: 'portfolio.projects.cavernQuest.description',
      technologies: ['JavaScript | OOP | Firebase | HTML | CSS'],
      video: 'cq.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/CavernQuest' },
        { name: 'Live', url: 'https://www.cq.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'PokeDex',
      descriptionKey: 'portfolio.projects.pokeDex.description',
      technologies: ['REST API | JavaScript | HTML |  CSS'],
      video: 'poke.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/PokeDex' },
        { name: 'Live', url: 'https://www.pokedex.michael-buschmann.dev/' },
      ],
    },
  ];

  playVideo(video: HTMLVideoElement): void {
    video.play();
  }

  pauseVideo(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
  }
}
