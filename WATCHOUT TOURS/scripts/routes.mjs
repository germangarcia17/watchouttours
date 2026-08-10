// scripts/routes.mjs
// Lista única de rutas públicas estáticas indexables, compartida por
// generate-sitemap.mjs y prerender.mjs para que nunca queden desincronizadas.
// Se excluyen a propósito: /admin*, /filosofia (redirige) y cualquier ruta
// no pública.

export const STATIC_ROUTES = [
  { path: '/',               changefreq: 'weekly',  priority: '1.0' },
  { path: '/sobre-nosotras', changefreq: 'monthly', priority: '0.8' },
  { path: '/productos',      changefreq: 'weekly',  priority: '0.9' },
  { path: '/resenas',        changefreq: 'weekly',  priority: '0.7' },
  { path: '/blog',           changefreq: 'weekly',  priority: '0.7' },
  { path: '/contacto',       changefreq: 'monthly', priority: '0.6' },
  { path: '/accesibilidad',  changefreq: 'yearly',  priority: '0.4' },
  { path: '/privacidad',     changefreq: 'yearly',  priority: '0.3' },
  { path: '/aviso-legal',    changefreq: 'yearly',  priority: '0.3' },
]
