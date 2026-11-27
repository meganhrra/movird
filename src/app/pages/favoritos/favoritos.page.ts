import { Component, inject, signal } from '@angular/core';
import { RefresherCustomEvent, ToastController } from '@ionic/angular/lazy';
import { addIcons } from 'ionicons';
import { chevronDownCircle, trashOutline } from 'ionicons/icons';
import { Parqueo, PARQUEOS } from '../../data/parqueos';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false,
})
export class FavoritosPage {
  private toastCtrl = inject(ToastController);

  favoritos = signal<Parqueo[]>(this.leerFavoritos());

  constructor() {
    addIcons({ chevronDownCircle, trashOutline });
  }

  // Al volver a la pantalla, la lista refleja lo que se cambió en Inicio o Mapa
  ionViewWillEnter() {
    this.favoritos.set(this.leerFavoritos());
  }

  async quitarFavorito(parqueo: Parqueo) {
    const posicion = this.favoritos().indexOf(parqueo);
    parqueo.favorito = false;
    this.favoritos.update((lista) => lista.filter((p) => p.id !== parqueo.id));

    const aviso = await this.toastCtrl.create({
      message: `${parqueo.nombre} se quitó de favoritos`,
      duration: 3000,
      position: 'bottom',
      buttons: [{ text: 'Deshacer', handler: () => this.deshacer(parqueo, posicion) }],
    });
    await aviso.present();
  }

  // Cuando se quita con el corazón o con la pulsación larga
  alCambiarFavorito(parqueo: Parqueo) {
    if (!parqueo.favorito) {
      this.favoritos.update((lista) => lista.filter((p) => p.id !== parqueo.id));
    }
  }

  actualizarFavoritos(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.favoritos.set(this.leerFavoritos());
      event.target.complete();
    }, 800);
  }

  private deshacer(parqueo: Parqueo, posicion: number) {
    parqueo.favorito = true;
    this.favoritos.update((lista) => {
      if (lista.some((p) => p.id === parqueo.id)) {
        return lista;
      }
      const copia = [...lista];
      copia.splice(posicion, 0, parqueo);
      return copia;
    });
  }

  private leerFavoritos(): Parqueo[] {
    return PARQUEOS.filter((p) => p.favorito);
  }
}
