import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';
import { Parqueo, PARQUEOS } from '../../data/parking';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage {
  readonly favoritos: Parqueo[] = PARQUEOS.filter((parqueo) => parqueo.favorito);

  constructor() {
    addIcons({ refreshOutline });
  }
}
