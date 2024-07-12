import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    TextShadowOffsetDirective,
    BoxShadowOffsetDirective,
    ScrollAnimationDirective,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  /**
   * An array of objects representing the stack of technologies displayed in the skills-section.
   * Each object has a `caption` property, basically the technologies name, and an `icon`
   * property to be used in the templates for-loop to build the img tags.
   */
  techStack = [
    { caption: 'Angular', icon: 'angular' },
    { caption: 'TypeScript', icon: 'ts' },
    { caption: 'JavaScript', icon: 'js' },
    { caption: 'Firebase', icon: 'firebase' },
    { caption: 'API', icon: 'api' },
    { caption: 'Git', icon: 'git' },
    { caption: 'Material Design', icon: 'md' },
    { caption: 'Scrum', icon: 'scrum' },
    { caption: 'CSS', icon: 'css' },
    { caption: 'HTML', icon: 'html' },
  ];
}
