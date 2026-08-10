/* Datos precargados en tiempo de build para el renderizado estático (SSG).
   Solo existen durante el prerenderizado en Node (scripts/prerender.mjs),
   que los deja en globalThis.__PRELOAD__ antes de renderizar cada ruta.
   En el navegador esta función siempre devuelve un objeto vacío: el
   comportamiento en tiempo real no cambia, los componentes siguen pidiendo
   sus datos a Supabase como antes. */
export function getPreload() {
  if (typeof window !== 'undefined') return {}
  return globalThis.__PRELOAD__ || {}
}
