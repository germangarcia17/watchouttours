// scripts/routes.mjs
// Lista única de rutas públicas estáticas indexables, compartida por
// generate-sitemap.mjs y prerender.mjs para que nunca queden desincronizadas.
// Se excluyen a propósito: /admin*, /filosofia (redirige) y cualquier ruta
// no pública.
//
// Por defecto cada ruta se genera en español y en inglés (mismo slug, con o
// sin prefijo /en). Las rutas que solo existen en un idioma
// (MONOLINGUAL_ROUTES) y las que cambian de slug en inglés (LOCALIZED_SLUGS)
// se declaran en src/i18n/pageLanguages.js; tanto prerender.mjs como
// generate-sitemap.mjs consultan ese módulo. Aquí `path` es siempre la ruta
// base española.

export const STATIC_ROUTES = [
  { path: '/',               changefreq: 'weekly',  priority: '1.0' },
  // Las dos líneas de viaje. En inglés tienen otro slug (/en/unhurried,
  // /en/beyond-sight): ver LOCALIZED_SLUGS en src/i18n/pageLanguages.js.
  { path: '/sin-prisa',            changefreq: 'monthly', priority: '0.9' },
  { path: '/mas-alla-de-la-vista', changefreq: 'monthly', priority: '0.9' },
  { path: '/sobre-nosotras', changefreq: 'monthly', priority: '0.8' },
  { path: '/productos',      changefreq: 'weekly',  priority: '0.9' },
  { path: '/resenas',        changefreq: 'weekly',  priority: '0.7' },
  { path: '/blog',           changefreq: 'weekly',  priority: '0.7' },
  { path: '/contacto',       changefreq: 'monthly', priority: '0.6' },
  { path: '/accesibilidad',  changefreq: 'yearly',  priority: '0.4' },
  { path: '/privacidad',     changefreq: 'yearly',  priority: '0.3' },
  { path: '/aviso-legal',    changefreq: 'yearly',  priority: '0.3' },
  // Solo en inglés (ver MONOLINGUAL_ROUTES en src/i18n/pageLanguages.js).
  { path: '/blind-travel-new-zealand', changefreq: 'monthly', priority: '0.8' },
  // Charla online: solo se publica con VITE_CHARLA_PUBLICADA=true (ver
  // src/config/charlaPublicada.js).
  ...(process.env.VITE_CHARLA_PUBLICADA === 'true'
    ? [{ path: '/charla-nueva-zelanda', changefreq: 'weekly', priority: '0.9' }]
    : []),
]
