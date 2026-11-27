import { Component, computed, signal } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular/lazy';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  chevronDownCircle,
  homeOutline,
  locateOutline,
  locationSharp,
  timeOutline,
} from 'ionicons/icons';
import { PARQUEOS, coincideBusqueda } from '../../data/parqueos';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage {
  // Cada acceso abre Resultados con su filtro
  readonly categorias = [
    { id: 'publicos', icono: 'home-outline', texto: 'Públicos' },
    { id: 'privados', icono: 'car-sport-outline', texto: 'Privados' },
    { id: 'abiertos', icono: 'time-outline', texto: 'Abiertos ahora' },
  ];

  busqueda = signal('');

  // Sin búsqueda se muestran 3; con búsqueda, todos los que coincidan
  opciones = computed(() => {
    const texto = this.busqueda();
    return texto.trim() ? PARQUEOS.filter((p) => coincideBusqueda(p, texto)) : PARQUEOS.slice(0, 3);
  });

  constructor() {
    addIcons({
      carSportOutline,
      chevronDownCircle,
      homeOutline,
      locateOutline,
      locationSharp,
      timeOutline,
    });
  }

  actualizarOpciones(event: RefresherCustomEvent) {
    setTimeout(() => event.target.complete(), 800);
  }
}
