import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  Filtros,
  PARQUEOS,
  SIN_FILTROS,
  cumpleFiltros,
  ordenarPorDistancia,
} from '../../data/parqueos';

type Filtro = 'todos' | 'publicos' | 'privados' | 'abiertos';

const FILTROS: Record<Filtro, Filtros> = {
  todos: SIN_FILTROS,
  publicos: { ...SIN_FILTROS, tipo: 'Público' },
  privados: { ...SIN_FILTROS, tipo: 'Privado' },
  abiertos: { ...SIN_FILTROS, soloAbiertos: true },
};

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: false,
})
export class ResultadosPage {
  readonly chips: { id: Filtro; texto: string }[] = [
    { id: 'todos', texto: 'Todos' },
    { id: 'publicos', texto: 'Públicos' },
    { id: 'privados', texto: 'Privados' },
    { id: 'abiertos', texto: 'Abiertos ahora' },
  ];

  filtro = signal<Filtro>('todos');
  private ahora = signal(new Date());

  titulo = computed(() =>
    this.filtro() === 'todos'
      ? 'Cerca de ti'
      : this.chips.find((c) => c.id === this.filtro())?.texto,
  );

  resultados = computed(() =>
    ordenarPorDistancia(
      PARQUEOS.filter((p) => cumpleFiltros(p, FILTROS[this.filtro()], this.ahora())),
    ),
  );

  constructor() {
    // Los accesos de Inicio llegan con ?filtro=publicos, privados o abiertos
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const chip = this.chips.find((c) => c.id === params.get('filtro'));
        this.filtro.set(chip?.id ?? 'todos');
      });
  }

  ionViewWillEnter() {
    this.ahora.set(new Date());
  }

  elegirFiltro(id: Filtro) {
    this.ahora.set(new Date());
    this.filtro.set(id);
  }
}
