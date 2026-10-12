/* Configuración de la charla online «Descubre Nueva Zelanda a través de los
 * sentidos».
 *
 * Este módulo es JavaScript puro (sin nada de Vite ni de Node): lo importan
 * tanto la página pública (src/pages/CharlaNuevaZelanda.jsx) como las
 * Netlify Functions que guardan las inscripciones y envían los emails
 * (netlify/functions/charla-*.js). Así la página y los emails nunca muestran
 * fechas u horas distintas.
 *
 * Lo que NO vive aquí, porque son datos privados o de despliegue, se
 * configura como variables de entorno en Netlify (ver CHARLA.md):
 *   - Enlaces de Teams de cada sesión  → CHARLA_TEAMS_URL_<id con _>
 *   - Enlaces de las grabaciones       → CHARLA_GRABACION_URL_<id con _>
 *   - Publicar la página               → VITE_CHARLA_PUBLICADA=true
 */

/* ── Grabación ───────────────────────────────────────────────────────────
 * Pon true si vais a grabar la charla. Activa a la vez:
 *   - el aviso en la página de la charla,
 *   - el aviso en el email de confirmación y en los recordatorios,
 *   - el apartado correspondiente de la política de privacidad,
 *   - el enlace a la grabación en el email de seguimiento (que no se envía
 *     hasta que exista CHARLA_GRABACION_URL_<sesión> en Netlify).
 * Cambiarlo requiere un nuevo deploy. */
export const GRABACION_ACTIVADA = false

export const DURACION_MINUTOS = 60

export const CONTACTO = {
  email: 'info@watchouttours.nz',
  whatsappNumero: '+64 27 267 7006',
  whatsappUrl: 'https://wa.me/64272677006',
}

export const SITE_URL = 'https://watchouttours.nz'
export const RUTA_CHARLA = '/charla-nueva-zelanda'
/* Página del viaje a la que enlaza el email de seguimiento. */
export const RUTA_VIAJE = '/productos'

/* Regiones de la tabla «¿A qué hora es en tu país?», en el orden en que se
   muestran. `zona` es la zona IANA con la que se comprueba (tests) que las
   horas escritas a mano coinciden con el instante UTC de cada sesión. */
export const REGIONES = [
  { id: 'es',  zona: 'Europe/Madrid',                  es: 'España peninsular',         en: 'Mainland Spain' },
  { id: 'ic',  zona: 'Atlantic/Canary',                es: 'Canarias',                  en: 'Canary Islands' },
  { id: 'uy',  zona: 'America/Montevideo',             es: 'Uruguay',                   en: 'Uruguay' },
  { id: 'cl',  zona: 'America/Santiago',               es: 'Chile continental',         en: 'Mainland Chile' },
  { id: 'ar',  zona: 'America/Argentina/Buenos_Aires', es: 'Argentina',                 en: 'Argentina' },
  { id: 'co',  zona: 'America/Bogota',                 es: 'Colombia',                  en: 'Colombia' },
  { id: 'mx',  zona: 'America/Mexico_City',            es: 'México (Ciudad de México)', en: 'Mexico (Mexico City)' },
]

/* Las dos sesiones (mismo contenido). `inicioUtc` es la única fuente de
   verdad para calendarios (.ics), recordatorios y conversiones automáticas.
   Las horas por región están escritas tal cual se publican; un test
   (tests/charla.test.mjs) verifica que coinciden con `inicioUtc`.

   `seguimientoUtc`: cuándo se envía el email de seguimiento (día siguiente
   a la charla, 9:00 en España peninsular). */
export const SESIONES = [
  {
    id: '2026-10-24',
    inicioUtc: '2026-10-24T19:00:00Z',
    seguimientoUtc: '2026-10-25T08:00:00Z',
    fecha: { es: 'Sábado 24 de octubre de 2026', en: 'Saturday 24 October 2026' },
    fechaCorta: { es: 'Sábado 24 de octubre', en: 'Saturday 24 October' },
    horas: { es: '21:00', ic: '20:00', uy: '16:00', cl: '16:00', ar: '16:00', co: '14:00', mx: '13:00' },
    nz: { es: 'domingo 25 de octubre a las 8:00', en: 'Sunday 25 October at 8:00' },
  },
  {
    id: '2026-11-07',
    inicioUtc: '2026-11-07T19:00:00Z',
    seguimientoUtc: '2026-11-08T08:00:00Z',
    fecha: { es: 'Sábado 7 de noviembre de 2026', en: 'Saturday 7 November 2026' },
    fechaCorta: { es: 'Sábado 7 de noviembre', en: 'Saturday 7 November' },
    horas: { es: '20:00', ic: '19:00', uy: '16:00', cl: '16:00', ar: '16:00', co: '14:00', mx: '13:00' },
    nz: { es: 'domingo 8 de noviembre a las 8:00', en: 'Sunday 8 November at 8:00' },
  },
]

export function getSesion(id) {
  return SESIONES.find(s => s.id === id) ?? null
}

/* Nombre de la variable de entorno con el enlace de Teams de una sesión:
   2026-10-24 → CHARLA_TEAMS_URL_2026_10_24 */
export function envTeams(id) {
  return `CHARLA_TEAMS_URL_${id.replace(/-/g, '_')}`
}

export function envGrabacion(id) {
  return `CHARLA_GRABACION_URL_${id.replace(/-/g, '_')}`
}

export function finUtc(sesion) {
  return new Date(Date.parse(sesion.inicioUtc) + DURACION_MINUTOS * 60_000).toISOString()
}

/* Etiqueta de la opción del formulario: «Sábado 24 de octubre, 21:00
   (España peninsular)». */
export function etiquetaSesion(sesion, lang) {
  return `${sesion.fechaCorta[lang]}, ${sesion.horas.es} (${REGIONES[0][lang]})`
}
