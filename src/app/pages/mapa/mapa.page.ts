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

escalaMapa = 1;
private distanciaInicial = 0;
private escalaInicial = 1;

  constructor() {
    addIcons({ optionsOutline, locationSharp, navigateOutline });
  }
  private calcularDistancia(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;

  return Math.sqrt(dx * dx + dy * dy);
}

iniciarPellizco(event: TouchEvent) {
  if (event.touches.length === 2) {
    this.distanciaInicial = this.calcularDistancia(event.touches);
    this.escalaInicial = this.escalaMapa;
  }
}

moverPellizco(event: TouchEvent) {
  if (event.touches.length === 2 && this.distanciaInicial > 0) {
    const distanciaActual = this.calcularDistancia(event.touches);
    const factor = distanciaActual / this.distanciaInicial;

    this.escalaMapa = Math.min(
      3,
      Math.max(1, this.escalaInicial * factor)
    );
  }
}

terminarPellizco() {
  this.distanciaInicial = 0;
}
}
