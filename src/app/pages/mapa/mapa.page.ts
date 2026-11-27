import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SegmentValue } from '@ionic/angular/lazy';
import { addIcons } from 'ionicons';
import { locationSharp, navigateOutline, optionsOutline } from 'ionicons/icons';
import {
  Filtros,
  Parqueo,
  PARQUEOS,
  SIN_FILTROS,
  coincideBusqueda,
  cumpleFiltros,
  ordenarPorDistancia,
} from '../../data/parqueos';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage {
  busqueda = signal('');
  filtros = signal<Filtros>(SIN_FILTROS);
  filtrosAbiertos = signal(false);
  seleccionado = signal<Parqueo>(PARQUEOS[0]);
  escalaMapa = 1;

  private ahora = signal(new Date());
  private distanciaInicial = 0;
  private escalaInicial = 1;

  hayFiltros = computed(() => {
    const f = this.filtros();
    return f.tipo !== 'todos' || f.soloAbiertos || f.soloConfirmados;
  });

  // Sin búsqueda ni filtros, los 3 más cercanos; con alguno, todos los que coincidan
  cercanos = computed(() => {
    const texto = this.busqueda();
    const lista = ordenarPorDistancia(PARQUEOS).filter(
      (p) => coincideBusqueda(p, texto) && cumpleFiltros(p, this.filtros(), this.ahora()),
    );
    return texto.trim() || this.hayFiltros() ? lista : lista.slice(0, 3);
  });

  constructor() {
    addIcons({ locationSharp, navigateOutline, optionsOutline });

    // "Ver en el mapa" desde la pulsación larga llega con ?id=
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const parqueo = PARQUEOS.find((p) => p.id === Number(params.get('id')));
        if (parqueo) {
          this.seleccionado.set(parqueo);
        }
      });
  }

  buscar(texto: string) {
    this.busqueda.set(texto);
    this.ajustarSeleccion();
  }

  abrirFiltros() {
    this.ahora.set(new Date());
    this.filtrosAbiertos.set(true);
  }

  elegirTipo(valor?: SegmentValue) {
    if (valor === 'todos' || valor === 'Público' || valor === 'Privado') {
      this.cambiarFiltros({ tipo: valor });
    }
  }

  cambiarFiltros(cambio: Partial<Filtros>) {
    this.filtros.update((f) => ({ ...f, ...cambio }));
    this.ajustarSeleccion();
  }

  limpiarFiltros() {
    this.filtros.set(SIN_FILTROS);
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

      this.escalaMapa = Math.min(3, Math.max(1, this.escalaInicial * factor));
    }
  }

  terminarPellizco() {
    this.distanciaInicial = 0;
  }

  recentrarMapa() {
    this.escalaMapa = 1;
  }

  // Si el parqueo de la tarjeta queda fuera de la lista, se muestra el primero que sí aparece
  private ajustarSeleccion() {
    const lista = this.cercanos();
    if (lista.length > 0 && !lista.some((p) => p.id === this.seleccionado().id)) {
      this.seleccionado.set(lista[0]);
    }
  }

  private calcularDistancia(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
