import { Component } from '@angular/core';
import { ProjectComponent } from './project/project.component';

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
  imports: [ProjectComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
})
export class PortfolioComponent {
  projectList: Project[] = [
    {
      name: 'Join',
      technologies: ['JavaScript', 'Firebase', 'HTML', 'CSS'],
      description:
        'Kanban-based project management tool designed to streamline your workflow and enhance collaboration within your team.',
      video: 'cq.mp4',
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
      technologies: ['JavaScript', 'OOP', 'Firebase', 'HTML', 'CSS'],
      description:
        "2D jump'n run browser game, where you play as the brave wizard Woozle, conquering a mossy cavern full of toxic plants, thorns, stings and many more angry, blobby things!",
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
      technologies: ['REST API', 'JavaScript', 'HTML', 'CSS'],
      description:
        'PokeAPI-powered Pokemon-Database to get all the information you need about your favorite litlle monsters!',
      video: 'cq.mp4',
      links: [
        {
          name: 'GitHub',
          url: 'https://github.com/CodeRacon/PokeDex',
        },
        { name: 'Live', url: 'https://www.pokedex.michael-buschmann.dev/' },
      ],
    },
  ];
}
