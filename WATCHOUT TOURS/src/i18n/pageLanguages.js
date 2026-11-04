/* Idiomas y slugs de cada página pública.
 *
 * Por defecto, toda página pública de Watchout Tours existe en ambos
 * idiomas con el mismo slug, con o sin prefijo /en (p. ej. /productos ↔
 * /en/productos). Este módulo es la única fuente de verdad para las
 * excepciones:
 *
 *   - MONOLINGUAL_ROUTES: páginas que, de momento, solo existen en un idioma.
 *   - LOCALIZED_SLUGS: páginas que existen en los dos idiomas pero con un
 *     slug distinto en inglés (p. ej. /sin-prisa ↔ /en/unhurried).
 *
 * Lo consultan tanto los scripts de build en Node (scripts/prerender.mjs,
 * scripts/generate-sitemap.mjs) como el cliente (enlaces internos y
 * selector de idioma en src/i18n/routing.jsx, hreflang en Layout.jsx,
 * canonical en Seo.jsx), para que ninguno de los dos genere nunca un enlace
 * a una versión que no existe.
 *
 * La clave es siempre la ruta base española (sin prefijo), igual que en
 * scripts/routes.mjs — p. ej. '/sin-prisa'.
 */
export const MONOLINGUAL_ROUTES = {
  '/blind-travel-new-zealand': ['en'],
}

/* Ruta base española → slug inglés (sin el prefijo /en). */
export const LOCALIZED_SLUGS = {
  '/mas-alla-de-la-vista': '/beyond-sight',
  '/sin-prisa':            '/unhurried',
}

/* Idiomas disponibles para una ruta base dada. ['es', 'en'] si no está
   listada como excepción. */
export function availableLangs(basePath) {
  return MONOLINGUAL_ROUTES[basePath] ?? ['es', 'en']
}

/* URL inglesa completa (con /en) de una ruta base española. */
export function enPathFor(basePath) {
  const slug = LOCALIZED_SLUGS[basePath] ?? basePath
  return slug === '/' ? '/en' : `/en${slug}`
}

/* Ruta base española a partir de la parte de una URL inglesa que va detrás
   de /en (p. ej. '/unhurried' → '/sin-prisa'). Si el slug no está
   traducido, es el mismo. */
export function baseFromEnSlug(enSlug) {
  for (const [base, slug] of Object.entries(LOCALIZED_SLUGS)) {
    if (slug === enSlug) return base
  }
  return enSlug
}
