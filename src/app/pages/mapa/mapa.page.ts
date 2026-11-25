import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { optionsOutline, locationSharp, navigateOutline } from 'ionicons/icons';
import { PARQUEOS } from '../../data/parking';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage {
  readonly seleccionado = PARQUEOS[0];

  constructor() {
    addIcons({ optionsOutline, locationSharp, navigateOutline });
  }
}
