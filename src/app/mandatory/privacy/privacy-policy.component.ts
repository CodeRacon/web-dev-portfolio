import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [TextShadowOffsetDirective, TranslateModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {}
