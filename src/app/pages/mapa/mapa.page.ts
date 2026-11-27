import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Gesture, GestureController, SegmentValue } from '@ionic/angular/lazy';
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

// Medidas de mapa-santiago.webp. Se muestra a 1 punto por cada 5 píxeles como mínimo,
// así las calles se leen aunque el visor sea pequeño
const ANCHO_IMAGEN = 3300;
const ALTO_IMAGEN = 2795;
const PIXELES_POR_PUNTO = 5;
const ESCALA_MAXIMA = 3;
// Punto de la imagen (fracción del ancho y del alto) que queda en medio de los parqueos
const CENTRO_PARQUEOS = { x: 0.6, y: 0.39 };
// Alto que ocupa el buscador encima del mapa
const ALTO_BUSCADOR = 64;
// Parte del panel que se sigue viendo cuando está bajado
const PANEL_ASOMADO = 92; // igual que en .panel-inferior.bajado

interface Punto {
  x: number;
  y: number;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: false,
})
export class MapaPage implements OnInit, OnDestroy {
  @ViewChild('visor', { static: true }) visor!: ElementRef<HTMLElement>;
  @ViewChild('panel', { static: true }) panel!: ElementRef<HTMLElement>;

  busqueda = signal('');
  filtros = signal<Filtros>(SIN_FILTROS);
  filtrosAbiertos = signal(false);
  seleccionado = signal<Parqueo>(PARQUEOS[0]);

  // Mapa: tamaño de la imagen a escala 1, zoom y desplazamiento
  anchoImagen = signal(0);
  altoImagen = signal(0);
  escalaMapa = signal(1);
  posicionMapa = signal<Punto>({ x: 0, y: 0 });
  transformacionMapa = computed(() => {
    const { x, y } = this.posicionMapa();
    return `translate(${x}px, ${y}px) scale(${this.escalaMapa()})`;
  });

  // Panel de abajo: se baja y se sube
  panelBajado = signal(false);
  arrastrePanel = signal<string | null>(null);

  private ahora = signal(new Date());
  private gestureCtrl = inject(GestureController);
  private gestoPanel?: Gesture;
  private observador?: ResizeObserver;
  private altoPanel = 0;
  private vistaInicial = true;
  private ultimoPunto: Punto | null = null;
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

  ngOnInit() {
    // Si cambia el tamaño de la pantalla o del panel, se vuelve a ajustar el mapa
    this.observador = new ResizeObserver(() => this.medirMapa());
    this.observador.observe(this.visor.nativeElement);
    this.observador.observe(this.panel.nativeElement);

    // El panel usa GestureController y no un ion-modal tipo sheet porque el modal se abre
    // por encima de toda la app, también del menú lateral
    this.gestoPanel = this.gestureCtrl.create({
      el: this.panel.nativeElement,
      gestureName: 'panel-mapa',
      direction: 'y',
      threshold: 10,
      canStart: (detail) => this.puedeArrastrarPanel(detail.event.target),
      onMove: (detail) => {
        this.arrastrePanel.set(`translateY(${this.posicionPanel(detail.deltaY)}px)`);
      },
      onEnd: (detail) => {
        // Se baja si el dedo va rápido hacia abajo o si pasó de la mitad del recorrido
        const pasoMitad = this.posicionPanel(detail.deltaY) > this.recorridoPanel() / 2;
        this.cambiarPanel(detail.velocityY > 0.3 || (pasoMitad && detail.velocityY > -0.3));
        this.arrastrePanel.set(null);
      },
    });
    this.gestoPanel.enable();
  }

  ngOnDestroy() {
    this.gestoPanel?.destroy();
    this.observador?.disconnect();
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

  cambiarPanel(bajado: boolean) {
    this.panelBajado.set(bajado);
    this.medirMapa();
  }

  tocarMapa(event: TouchEvent) {
    this.prepararToques(event.touches);
  }

  moverMapa(event: TouchEvent) {
    const toques = event.touches;

    if (toques.length === 1 && this.ultimoPunto) {
      const punto = this.puntoEnVisor(toques[0]);
      this.desplazar(punto.x - this.ultimoPunto.x, punto.y - this.ultimoPunto.y);
      this.ultimoPunto = punto;
    } else if (toques.length === 2 && this.distanciaInicial > 0) {
      const centro = this.centroDeToques(toques);
      const escala = Math.min(
        ESCALA_MAXIMA,
        Math.max(1, (this.escalaInicial * this.calcularDistancia(toques)) / this.distanciaInicial),
      );

      // El punto entre los dos dedos se queda en su sitio mientras se acerca
      const factor = escala / this.escalaMapa();
      const { x, y } = this.posicionMapa();
      this.escalaMapa.set(escala);
      this.moverA({
        x: centro.x - (centro.x - x) * factor,
        y: centro.y - (centro.y - y) * factor,
      });
    }
  }

  soltarMapa(event: TouchEvent) {
    // Si queda un dedo en la pantalla, se sigue moviendo desde ahí
    this.prepararToques(event.touches);
  }

  // Vista inicial: los parqueos quedan entre el buscador y el panel de abajo
  recentrarMapa() {
    this.vistaInicial = true;
    this.escalaMapa.set(1);
    const { clientWidth: ancho, clientHeight: alto } = this.visor.nativeElement;
    const centroLibre = (ALTO_BUSCADOR + alto - this.altoPanelVisible()) / 2;
    this.posicionMapa.set(
      this.limitar({
        x: ancho / 2 - this.anchoImagen() * CENTRO_PARQUEOS.x,
        y: centroLibre - this.altoImagen() * CENTRO_PARQUEOS.y,
      }),
    );
  }

  // Si el parqueo de la tarjeta queda fuera de la lista, se muestra el primero que sí aparece
  private ajustarSeleccion() {
    const lista = this.cercanos();
    if (lista.length > 0 && !lista.some((p) => p.id === this.seleccionado().id)) {
      this.seleccionado.set(lista[0]);
    }
  }

  // La imagen cubre el mapa visible (como object-fit: cover, pero se puede mover) y nunca
  // se muestra más pequeña que el mínimo para leer las calles
  private medirMapa() {
    const { clientWidth: ancho } = this.visor.nativeElement;
    this.altoPanel = this.panel.nativeElement.offsetHeight;
    const alto = this.altoCubierto();
    if (ancho === 0 || alto <= 0) {
      return;
    }

    const proporcion = ANCHO_IMAGEN / ALTO_IMAGEN;
    const anchoQueCubre = ancho / alto <= proporcion ? alto * proporcion : ancho;
    const anchoInicial = Math.max(anchoQueCubre, ANCHO_IMAGEN / PIXELES_POR_PUNTO);
    this.anchoImagen.set(anchoInicial);
    this.altoImagen.set(anchoInicial / proporcion);

    if (this.vistaInicial) {
      this.recentrarMapa();
    } else {
      this.moverA(this.posicionMapa());
    }
  }

  // En el teléfono el panel ocupa todo el ancho, así que la imagen solo tiene que cubrir hasta
  // él y caben todos los parqueos. En la tablet el panel es más angosto y la imagen también
  // cubre lo que queda a sus lados
  private altoCubierto(): number {
    const visor = this.visor.nativeElement;
    if (this.panel.nativeElement.offsetWidth < visor.clientWidth) {
      return visor.clientHeight;
    }
    return visor.clientHeight - this.altoPanelVisible();
  }

  private altoPanelVisible(): number {
    return this.panelBajado() ? PANEL_ASOMADO : this.altoPanel;
  }

  private prepararToques(toques: TouchList) {
    this.ultimoPunto = toques.length === 1 ? this.puntoEnVisor(toques[0]) : null;
    this.distanciaInicial = toques.length === 2 ? this.calcularDistancia(toques) : 0;
    this.escalaInicial = this.escalaMapa();
  }

  private desplazar(dx: number, dy: number) {
    const { x, y } = this.posicionMapa();
    this.moverA({ x: x + dx, y: y + dy });
  }

  private moverA(punto: Punto) {
    const nuevo = this.limitar(punto);
    const anterior = this.posicionMapa();
    if (nuevo.x !== anterior.x || nuevo.y !== anterior.y || this.escalaMapa() !== 1) {
      this.vistaInicial = false;
    }
    this.posicionMapa.set(nuevo);
  }

  // Ajusta la posición para no dejar espacios vacíos en los bordes del visor
  private limitar(punto: Punto): Punto {
    const ancho = this.visor.nativeElement.clientWidth;
    const alto = this.altoCubierto();
    const anchoActual = this.anchoImagen() * this.escalaMapa();
    const altoActual = this.altoImagen() * this.escalaMapa();
    return {
      x: Math.min(0, Math.max(ancho - anchoActual, punto.x)),
      y: Math.min(0, Math.max(alto - altoActual, punto.y)),
    };
  }

  private puedeArrastrarPanel(destino: EventTarget | null): boolean {
    // Si la lista tiene scroll propio, arrastrar sobre ella la desplaza a ella
    const lista = (destino as HTMLElement | null)?.closest('.cercanos');
    return !lista || lista.scrollHeight <= lista.clientHeight;
  }

  private recorridoPanel(): number {
    return Math.max(0, this.altoPanel - PANEL_ASOMADO);
  }

  // Cuánto baja el panel mientras se arrastra (0 = arriba, recorrido completo = bajado)
  private posicionPanel(deltaY: number): number {
    const inicio = this.panelBajado() ? this.recorridoPanel() : 0;
    return Math.min(this.recorridoPanel(), Math.max(0, inicio + deltaY));
  }

  private puntoEnVisor(toque: Touch): Punto {
    const caja = this.visor.nativeElement.getBoundingClientRect();
    return { x: toque.clientX - caja.left, y: toque.clientY - caja.top };
  }

  private centroDeToques(toques: TouchList): Punto {
    const a = this.puntoEnVisor(toques[0]);
    const b = this.puntoEnVisor(toques[1]);
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  private calcularDistancia(toques: TouchList): number {
    const dx = toques[0].clientX - toques[1].clientX;
    const dy = toques[0].clientY - toques[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
