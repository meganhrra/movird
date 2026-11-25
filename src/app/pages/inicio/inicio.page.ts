import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  homeOutline,
  locateOutline,
  locationSharp,
  menuOutline,
  timeOutline,
} from 'ionicons/icons';
import { PARQUEOS } from '../../data/parking';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage {
  readonly opciones = PARQUEOS.slice(0, 1);

  readonly categorias = [
    { icono: 'home-outline', texto: 'Públicos' },
    { icono: 'car-sport-outline', texto: 'Privados' },
    { icono: 'time-outline', texto: 'Abiertos ahora' },
  ];

  constructor() {
    addIcons({
      menuOutline,
      homeOutline,
      carSportOutline,
      timeOutline,
      locateOutline,
      locationSharp,
    });
  }
}
