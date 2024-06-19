import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  techStack = [
    { caption: 'Angular', icon: 'angular' },
    { caption: 'API', icon: 'api' },
    { caption: 'CSS', icon: 'css' },
    { caption: 'Firebase', icon: 'firebase' },
    { caption: 'Git', icon: 'git' },
    { caption: 'HTML', icon: 'html' },
    { caption: 'JavaScript', icon: 'js' },
    { caption: 'TypeScript', icon: 'ts' },
    { caption: 'Scrum', icon: 'scrum' },
    { caption: 'Material Design', icon: 'md' },
  ];
}
