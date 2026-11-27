import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, IonicModule, ToastController } from '@ionic/angular/lazy';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  chevronForwardOutline,
  closeOutline,
  heart,
  heartOutline,
  mapOutline,
} from 'ionicons/icons';
import { Parqueo } from '../../data/parqueos';

@Component({
  selector: 'app-tarjeta-parqueo',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './tarjeta-parqueo.component.html',
  styleUrls: ['./tarjeta-parqueo.component.scss'],
})
export class TarjetaParqueoComponent implements OnDestroy {
  @Input({ required: true }) parqueo!: Parqueo;
  @Output() favoritoChange = new EventEmitter<Parqueo>();

  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private temporizador?: ReturnType<typeof setTimeout>;
  private inicioX = 0;
  private inicioY = 0;

  constructor() {
    addIcons({
      carSportOutline,
      chevronForwardOutline,
      closeOutline,
      heart,
      heartOutline,
      mapOutline,
    });
  }

  ngOnDestroy() {
    this.cancelarPulsacion();
  }

  // La pulsación larga usa eventos pointer y no GestureController: con threshold 0,
  // GestureController captura el dedo y ion-item-sliding ya no puede deslizar
  iniciarPulsacion(event: PointerEvent) {
    this.cancelarPulsacion();
    this.inicioX = event.clientX;
    this.inicioY = event.clientY;
    this.temporizador = setTimeout(() => this.abrirOpciones(), 500);
  }

  // Si el dedo se mueve (swipe o scroll), ya no es una pulsación larga
  revisarMovimiento(event: PointerEvent) {
    const dx = Math.abs(event.clientX - this.inicioX);
    const dy = Math.abs(event.clientY - this.inicioY);
    if (dx > 10 || dy > 10) {
      this.cancelarPulsacion();
    }
  }

  cancelarPulsacion() {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = undefined;
    }
  }

  async cambiarFavorito() {
    this.parqueo.favorito = !this.parqueo.favorito;
    this.favoritoChange.emit(this.parqueo);
    this.cdr.markForCheck();

    const aviso = await this.toastCtrl.create({
      message: this.parqueo.favorito ? 'Guardado en favoritos' : 'Quitado de favoritos',
      duration: 1500,
      position: 'bottom',
    });
    await aviso.present();
  }

  private async abrirOpciones() {
    this.temporizador = undefined;
    const hoja = await this.actionSheetCtrl.create({
      header: this.parqueo.nombre,
      subHeader: `${this.parqueo.tipo} · ${this.parqueo.distancia}`,
      cssClass: 'hoja-movird',
      buttons: [
        {
          text: 'Ver en el mapa',
          icon: 'map-outline',
          handler: () => {
            this.router.navigate(['/mapa'], { queryParams: { id: this.parqueo.id } });
          },
        },
        {
          text: this.parqueo.favorito ? 'Quitar de favoritos' : 'Guardar en favoritos',
          icon: this.parqueo.favorito ? 'heart-outline' : 'heart',
          handler: () => {
            this.cambiarFavorito();
          },
        },
        { text: 'Cancelar', icon: 'close-outline', role: 'cancel' },
      ],
    });
    await hoja.present();
  }
}
