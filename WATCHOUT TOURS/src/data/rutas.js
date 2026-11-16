/* ── Rutas de autor ──────────────────────────────────────────────────────
 * Datos de cada ruta (/rutas/<slug> · /en/routes/<slug>). Para añadir una
 * ruta nueva:
 *   1. Añade aquí su entrada (slug, filtros, días, paradas con coordenadas).
 *   2. Añade sus textos en es.json y en.json, en rutas.lista.<slug> (nombre,
 *      subtítulo, duración, época, frase, introducción, momento firma, lo que
 *      vivirás y el nombre de cada parada, con las mismas claves que aquí).
 * La página, el mapa, el sitemap, el SEO del admin y los huecos de imagen
 * (ruta-<slug>-portada y ruta-<slug>-momento) se generan solos.
 *
 * filtros: claves de rutas.filtros (primer, parejas, familias, naturaleza,
 *   cultura, aventura, lujo, invierno).
 * destacada: orden en la home (sección Rutas de autor); 0 = no sale.
 * paradas: en orden de recorrido; lat/lon aproximadas para el mapa.
 * ──────────────────────────────────────────────────────────────────────── */

const P = {
  auckland:      [-36.85, 174.76],
  bayOfIslands:  [-35.27, 174.08],
  waitomo:       [-38.26, 175.10],
  hobbiton:      [-37.87, 175.68],
  rotorua:       [-38.14, 176.25],
  taupo:         [-38.69, 176.07],
  tongariro:     [-39.20, 175.58],
  wellington:    [-41.29, 174.78],
  christchurch:  [-43.53, 172.64],
  kaikoura:      [-42.40, 173.68],
  tekapo:        [-44.00, 170.48],
  aoraki:        [-43.73, 170.10],
  oamaru:        [-45.10, 170.97],
  dunedin:       [-45.88, 170.50],
  catlins:       [-46.50, 169.40],
  fiordland:     [-44.67, 167.93],
  queenstown:    [-45.03, 168.66],
  wanaka:        [-44.70, 169.13],
  costaOeste:    [-43.39, 170.18],
  arthursPass:   [-42.94, 171.56],
  caboReinga:    [-34.43, 172.68],
  coromandel:    [-36.76, 175.50],
  estrechoCook:  [-41.29, 174.00],
  marlborough:   [-41.51, 173.95],
  abelTasman:    [-40.90, 172.97],
  stewart:       [-46.90, 168.13],
  waiheke:       [-36.80, 175.10],
  mountHutt:     [-43.47, 171.53],
  northland:     [-35.72, 174.32],
  hawkesBay:     [-39.49, 176.91],
  nelson:        [-41.27, 173.28],
  mountSunday:   [-43.60, 171.03],
  twizel:        [-44.26, 170.10],
  glenorchy:     [-44.85, 168.39],
  arrowtown:     [-44.94, 168.83],
  milford:       [-44.67, 167.93],
}

const paradas = ids => ids.map(id => ({ id, lat: P[id][0], lon: P[id][1] }))

export const RUTAS = [
  {
    slug: 'isla-norte', dias: 12, destacada: 0,
    filtros: ['cultura', 'naturaleza', 'familias', 'primer'],
    paradas: paradas(['auckland', 'bayOfIslands', 'waitomo', 'hobbiton', 'rotorua', 'taupo', 'tongariro', 'wellington']),
  },
  {
    slug: 'isla-sur', dias: 16, destacada: 2,
    filtros: ['naturaleza', 'aventura', 'parejas'],
    paradas: paradas(['christchurch', 'kaikoura', 'tekapo', 'aoraki', 'oamaru', 'dunedin', 'catlins', 'fiordland', 'queenstown', 'wanaka', 'costaOeste', 'arthursPass']),
  },
  {
    slug: 'esencial', dias: 18, destacada: 1,
    filtros: ['primer', 'parejas', 'familias'],
    paradas: paradas(['auckland', 'hobbiton', 'rotorua', 'queenstown', 'milford', 'aoraki', 'tekapo', 'kaikoura', 'christchurch']),
  },
  {
    slug: 'de-punta-a-punta', dias: 24, destacada: 0,
    filtros: ['naturaleza', 'aventura', 'cultura'],
    paradas: paradas(['caboReinga', 'bayOfIslands', 'auckland', 'coromandel', 'rotorua', 'tongariro', 'wellington', 'estrechoCook', 'marlborough', 'abelTasman', 'costaOeste', 'wanaka', 'queenstown', 'fiordland', 'catlins', 'stewart']),
  },
  {
    slug: 'luna-de-miel', dias: 14, destacada: 3,
    filtros: ['parejas', 'lujo'],
    paradas: paradas(['auckland', 'waiheke', 'bayOfIslands', 'rotorua', 'queenstown', 'fiordland', 'wanaka', 'marlborough']),
  },
  {
    slug: 'esqui', dias: 12, destacada: 0,
    filtros: ['invierno', 'aventura', 'familias'],
    paradas: paradas(['christchurch', 'mountHutt', 'tekapo', 'wanaka', 'queenstown', 'milford']),
  },
  {
    slug: 'gran-lujo', dias: 16, destacada: 4,
    filtros: ['lujo', 'parejas'],
    paradas: paradas(['northland', 'bayOfIslands', 'taupo', 'hawkesBay', 'queenstown', 'fiordland', 'aoraki']),
  },
  {
    slug: 'tierra-media', dias: 15, destacada: 0,
    filtros: ['cultura', 'aventura', 'familias'],
    paradas: paradas(['hobbiton', 'tongariro', 'wellington', 'nelson', 'mountSunday', 'twizel', 'glenorchy', 'arrowtown', 'fiordland']),
  },
]

export const FILTROS = ['primer', 'parejas', 'familias', 'naturaleza', 'cultura', 'aventura', 'lujo', 'invierno']

export const rutaPorSlug = slug => RUTAS.find(r => r.slug === slug) ?? null
