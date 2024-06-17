import { Component } from '@angular/core';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BurgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
