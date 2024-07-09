import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [TextShadowOffsetDirective, TranslateModule, RouterModule],
  templateUrl: './imprint.component.html',
  styleUrl: '../mandatory.scss',
})
export class ImprintComponent {}
