export interface Parqueo {
  id: number;
  nombre: string;
  tipo: 'Público' | 'Privado';
  distancia: string; // "0.5 km"
  precio: string;
  horario: string;
  abre: number; // hora en formato 24 h
  cierra: number;
  disponibilidad: 'disponible' | 'no_confirmada';
  favorito: boolean;
}

export interface Filtros {
  tipo: 'todos' | Parqueo['tipo'];
  soloAbiertos: boolean;
  soloConfirmados: boolean;
}

export const SIN_FILTROS: Filtros = { tipo: 'todos', soloAbiertos: false, soloConfirmados: false };

// Datos de demostración: los parqueos no son reales
export const PARQUEOS: Parqueo[] = [
  {
    id: 1,
    nombre: 'Parqueo Centro',
    tipo: 'Público',
    distancia: '0.5 km',
    precio: 'RD$ 100/h',
    horario: 'Abierto 24 h',
    abre: 0,
    cierra: 24,
    disponibilidad: 'disponible',
    favorito: true,
  },
  {
    id: 2,
    nombre: 'Parqueo Calle del Sol',
    tipo: 'Privado',
    distancia: '0.8 km',
    precio: 'RD$ 75/h',
    horario: '7:00 a. m. – 10:00 p. m.',
    abre: 7,
    cierra: 22,
    disponibilidad: 'no_confirmada',
    favorito: true,
  },
  {
    id: 3,
    nombre: 'Parqueo Monumento',
    tipo: 'Público',
    distancia: '1.2 km',
    precio: 'RD$ 50/h',
    horario: '6:00 a. m. – 11:00 p. m.',
    abre: 6,
    cierra: 23,
    disponibilidad: 'disponible',
    favorito: true,
  },
  {
    id: 4,
    nombre: 'Parqueo Las Carreras',
    tipo: 'Público',
    distancia: '1.6 km',
    precio: 'RD$ 60/h',
    horario: '7:00 a. m. – 5:00 p. m.',
    abre: 7,
    cierra: 17,
    disponibilidad: 'no_confirmada',
    favorito: false,
  },
  {
    id: 5,
    nombre: 'Parqueo Los Jardines',
    tipo: 'Privado',
    distancia: '2.1 km',
    precio: 'RD$ 120/h',
    horario: 'Abierto 24 h',
    abre: 0,
    cierra: 24,
    disponibilidad: 'disponible',
    favorito: false,
  },
];

// Quita tildes y mayúsculas para que "publico" encuentre "Público"
function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function coincideBusqueda(parqueo: Parqueo, texto: string): boolean {
  const buscado = normalizar(texto);
  return (
    !buscado ||
    normalizar(parqueo.nombre).includes(buscado) ||
    normalizar(parqueo.tipo).includes(buscado)
  );
}

// Las distancias son de demostración, no vienen del GPS
export function ordenarPorDistancia(lista: Parqueo[]): Parqueo[] {
  return [...lista].sort((a, b) => parseFloat(a.distancia) - parseFloat(b.distancia));
}

export function estaAbierto(parqueo: Parqueo, fecha = new Date()): boolean {
  const hora = fecha.getHours() + fecha.getMinutes() / 60;
  return hora >= parqueo.abre && hora < parqueo.cierra;
}

export function cumpleFiltros(parqueo: Parqueo, filtros: Filtros, fecha = new Date()): boolean {
  return (
    (filtros.tipo === 'todos' || parqueo.tipo === filtros.tipo) &&
    (!filtros.soloAbiertos || estaAbierto(parqueo, fecha)) &&
    (!filtros.soloConfirmados || parqueo.disponibilidad === 'disponible')
  );
}
