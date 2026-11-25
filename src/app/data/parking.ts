export interface Parqueo {
  id: number;
  nombre: string;
  tipo: string;
  distancia: string;
  precio: string;
  horario: string;
  disponibilidad: 'disponible' | 'no_confirmada';
  favorito: boolean;
}

export const PARQUEOS: Parqueo[] = [
  {
    id: 1,
    nombre: 'Parqueo Centro',
    tipo: 'Público',
    distancia: '0.5 km',
    precio: 'RD$ 100/h',
    horario: 'Abierto 24 h',
    disponibilidad: 'disponible',
    favorito: true,
  },
];
