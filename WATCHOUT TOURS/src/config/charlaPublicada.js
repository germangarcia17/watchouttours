/* ¿Está publicada la página de la charla (/charla-nueva-zelanda)?
 *
 * Se activa con la variable de entorno de Netlify VITE_CHARLA_PUBLICADA=true
 * (y un nuevo deploy) cuando ya estén configurados los enlaces de Teams de
 * las dos sesiones. Mientras no lo esté, la página no existe (404), no se
 * prerenderiza ni aparece en el sitemap, la portada no muestra el aviso y la
 * política de privacidad no incluye el apartado de la charla.
 *
 * Los scripts de build (Node) leen la misma variable con process.env. */
export const CHARLA_PUBLICADA = import.meta.env.VITE_CHARLA_PUBLICADA === 'true'
