import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [TextShadowOffsetDirective, TranslateModule, RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: '../mandatory.scss',
})
export class PrivacyPolicyComponent {}
