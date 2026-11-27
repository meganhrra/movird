import {
  Filtros,
  Parqueo,
  PARQUEOS,
  SIN_FILTROS,
  coincideBusqueda,
  cumpleFiltros,
  estaAbierto,
  ordenarPorDistancia,
} from './parqueos';

const centro = PARQUEOS[0]; // abierto 24 h
const lasCarreras = PARQUEOS[3]; // 7:00 a. m. – 5:00 p. m.

describe('coincideBusqueda', () => {
  it('ignora tildes y mayúsculas', () => {
    expect(coincideBusqueda(centro, 'PUBLICO')).toBe(true);
    expect(coincideBusqueda(centro, 'centro')).toBe(true);
  });

  it('sin texto acepta cualquier parqueo', () => {
    expect(coincideBusqueda(centro, '   ')).toBe(true);
  });

  it('rechaza lo que no coincide', () => {
    expect(coincideBusqueda(centro, 'jardines')).toBe(false);
  });
});

describe('estaAbierto', () => {
  it('respeta la hora de cierre', () => {
    expect(estaAbierto(lasCarreras, new Date(2026, 10, 26, 16, 59))).toBe(true);
    expect(estaAbierto(lasCarreras, new Date(2026, 10, 26, 17, 0))).toBe(false);
    expect(estaAbierto(lasCarreras, new Date(2026, 10, 26, 6, 30))).toBe(false);
  });

  it('un parqueo de 24 h siempre está abierto', () => {
    expect(estaAbierto(centro, new Date(2026, 10, 26, 3, 0))).toBe(true);
  });
});

describe('ordenarPorDistancia', () => {
  it('ordena del más cercano al más lejano sin cambiar la lista original', () => {
    const desordenados: Parqueo[] = [PARQUEOS[4], PARQUEOS[0], PARQUEOS[2]];
    const ordenados = ordenarPorDistancia(desordenados);

    expect(ordenados.map((p) => p.id)).toEqual([1, 3, 5]);
    expect(desordenados.map((p) => p.id)).toEqual([5, 1, 3]);
  });
});

describe('cumpleFiltros', () => {
  const tarde = new Date(2026, 10, 26, 18, 0);

  it('sin filtros acepta todos los parqueos', () => {
    expect(PARQUEOS.every((p) => cumpleFiltros(p, SIN_FILTROS, tarde))).toBe(true);
  });

  it('combina tipo, horario y disponibilidad', () => {
    const filtros: Filtros = { tipo: 'Público', soloAbiertos: true, soloConfirmados: true };
    const ids = PARQUEOS.filter((p) => cumpleFiltros(p, filtros, tarde)).map((p) => p.id);

    expect(ids).toEqual([1, 3]);
  });
});
