import { Component } from '@angular/core';
import { TextShadowOffsetDirective } from '../../shared/common/text-shadow-offset.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [TextShadowOffsetDirective, TranslateModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent {}
