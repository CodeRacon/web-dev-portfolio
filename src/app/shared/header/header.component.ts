import { Component } from '@angular/core';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { BurgerIconComponent } from './burger-icon/burger-icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BurgerIconComponent, BurgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
