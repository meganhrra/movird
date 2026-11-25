import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { refreshOutline, trashOutline } from 'ionicons/icons';
import { Parqueo, PARQUEOS } from '../../data/parking';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage {
  favoritos: Parqueo[] = PARQUEOS.filter((parqueo) => parqueo.favorito);

  constructor() {
    addIcons({ refreshOutline, trashOutline });
  }
  quitarFavorito(parqueo: Parqueo) {
  parqueo.favorito = false;

  this.favoritos = this.favoritos.filter(
    (p) => p.id !== parqueo.id
  );
}
actualizarFavoritos(event: any) {
  this.favoritos = PARQUEOS.filter((parqueo) => parqueo.favorito);
  event.target.complete();
}
}
