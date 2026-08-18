/* Idiomas en los que existe cada página pública.
 *
 * Por defecto, toda página pública de Watchout Tours existe en ambos
 * idiomas (mismo slug, con o sin prefijo /en). Este módulo es la única
 * fuente de verdad para las excepciones: páginas que, de momento, solo
 * existen en un idioma. Lo consultan tanto los scripts de build en Node
 * (scripts/prerender.mjs, scripts/generate-sitemap.mjs) como el cliente
 * (hreflang en Layout.jsx, selector de idioma en Header.jsx), para que
 * ninguno de los dos genere nunca un enlace a una versión que no existe.
 *
 * La clave es la ruta base (española/sin prefijo), igual que en
 * scripts/routes.mjs — p. ej. '/blind-travel-new-zealand'.
 */
export const MONOLINGUAL_ROUTES = {
  '/blind-travel-new-zealand': ['en'],
}

/* Idiomas disponibles para una ruta base dada. ['es', 'en'] si no está
   listada como excepción. */
export function availableLangs(basePath) {
  return MONOLINGUAL_ROUTES[basePath] ?? ['es', 'en']
}
