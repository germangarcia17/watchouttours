// scripts/charla-emails.mjs
// Genera todos los emails de la charla (confirmación, recordatorio 24 h,
// recordatorio 1 h y seguimiento) para cada sesión y cada idioma, en
// charla-emails/ (HTML y texto). Sirve para revisarlos o, si hiciera falta,
// copiarlos y enviarlos a mano.
//
//   npm run charla:emails
//
// Usa los enlaces de Teams/grabación/reserva de las variables de entorno si
// existen; si no, pone un marcador visible.

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { SESIONES, envTeams, envGrabacion } from '../src/config/charla.js'
import { emailConfirmacion, emailRecordatorio24h, emailRecordatorio1h, emailSeguimiento } from '../netlify/lib/charla/emails.js'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'charla-emails')
mkdirSync(OUT, { recursive: true })

const TIPOS = {
  '1-confirmacion': emailConfirmacion,
  '2-recordatorio-24h': emailRecordatorio24h,
  '3-recordatorio-1h': emailRecordatorio1h,
  '4-seguimiento': emailSeguimiento,
}

for (const sesion of SESIONES) {
  const teamsUrl = process.env[envTeams(sesion.id)] || `[ENLACE DE TEAMS: ${envTeams(sesion.id)}]`
  const grabacionUrl = process.env[envGrabacion(sesion.id)] || `[ENLACE DE LA GRABACIÓN: ${envGrabacion(sesion.id)}]`
  const reservaUrl = process.env.CHARLA_URL_RESERVA_LLAMADA || ''
  for (const lang of ['es', 'en']) {
    for (const [tipo, fn] of Object.entries(TIPOS)) {
      const nombre = lang === 'en' ? '[Name]' : '[Nombre]'
      const { subject, html, text } = fn({ nombre, sesion, lang, teamsUrl, grabacionUrl, reservaUrl })
      const base = join(OUT, `${sesion.id}-${lang}-${tipo}`)
      writeFileSync(`${base}.html`, html)
      writeFileSync(`${base}.txt`, `Asunto: ${subject}\n\n${text}\n`)
    }
  }
}
console.log(`[charla] Emails generados en ${OUT}`)
