import { Component } from '@angular/core';

interface MenuPage {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  protected readonly appPages: MenuPage[] = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Mapa', url: '/mapa', icon: 'map' },
    { title: 'Favoritos', url: '/favoritos', icon: 'heart' },
  ];
}
