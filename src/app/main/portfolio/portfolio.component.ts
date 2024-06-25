import { Component } from '@angular/core';

export interface Project {
  name: string;
  description: string;
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
  imports: [],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  projectList: Project[] = [
    {
      name: 'Join',
      technologies: ['JavaScript | Firebase | HTML | CSS'],
      description:
        'Kanban-based project management tool designed to streamline your workflow and enhance collaboration within your team.',
      video: 'join.mp4',
      links: [
        { name: 'GitHub', url: 'https://github.com/CodeRacon/join' },
        {
          name: 'Live',
          url: 'https://www.join.michael-buschmann.dev/',
        },
      ],
    },
    {
      name: 'CavernQuest',
      technologies: ['JavaScript | OOP | Firebase | HTML | CSS'],
      description:
        "2D jump'n run browser game, where you help Woozle conquering a mossy cavern full of mystery and danger.",
      video: 'cq.mp4',
      links: [
        {
          name: 'GitHub',
          url: 'https://github.com/CodeRacon/CavernQuest',
        },
        { name: 'Live', url: 'https://www.cq.michael-buschmann.dev/' },
      ],
    },
    {
      name: 'PokeDex',
      technologies: ['REST API | JavaScript | HTML |  CSS'],
      description:
        'PokeAPI-powered Pokemon-Database to get all the information you need about your favorite little monsters!',
      video: 'poke.mp4',
      links: [
        {
          name: 'GitHub',
          url: 'https://github.com/CodeRacon/PokeDex',
        },
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
