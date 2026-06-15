import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { BoxShadowOffsetDirective } from '../../shared/common/box-shadow-offset.directive';
import { ScrollAnimationDirective } from '../../shared/common/scroll-animation.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    TextShadowOffsetDirective,
    BoxShadowOffsetDirective,
    ScrollAnimationDirective,
    TranslateModule,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent {
  readonly skillGroups = [
    {
      key: 'core',
      items: ['react', 'typescript', 'nextjs', 'reactNative'],
    },
    {
      key: 'frontendPractice',
      items: ['stateManagement', 'restApis', 'featureSlicedDesign'],
    },
    {
      key: 'backendData',
      items: ['nodejs', 'express', 'nestjs', 'postgresql', 'prisma', 'firebase'],
    },
    {
      key: 'styling',
      items: ['scss', 'tailwindCss'],
    },
    {
      key: 'additional',
      items: ['angular', 'vuejs', 'figma'],
    },
  ];
}
