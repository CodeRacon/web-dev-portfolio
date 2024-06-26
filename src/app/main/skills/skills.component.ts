import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TextShadowOffsetDirective, BoxShadowOffsetDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  techStack = [
    { caption: 'Angular', icon: 'angular' },
    { caption: 'TypeScript', icon: 'ts' },
    { caption: 'JavaScript', icon: 'js' },
    { caption: 'API', icon: 'api' },
    { caption: 'Firebase', icon: 'firebase' },
    { caption: 'Git', icon: 'git' },
    { caption: 'Material Design', icon: 'md' },
    { caption: 'CSS', icon: 'css' },
    { caption: 'Scrum', icon: 'scrum' },
    { caption: 'HTML', icon: 'html' },
  ];
}
