// netlify/functions/charla-inscripcion.js
// Recibe POST { nombre, email, sesion, pregunta, noticias, idioma, web }
// desde la página /charla-nueva-zelanda, guarda la inscripción en Supabase
// (tabla charla_inscripciones) y envía el email de confirmación con Resend.
//
// Solo responde { ok: true } cuando la inscripción se ha guardado Y el email
// se ha enviado; si falla cualquiera de los dos, responde con un código de
// error para que la página no muestre la confirmación.

import { getSesion, envTeams } from '../../src/config/charla.js'
import { emailConfirmacion, emailAvisoInterno, descripcionCalendario, nombreArchivoIcs, textos } from '../lib/charla/emails.js'
import { buildIcs } from '../lib/charla/ics.js'
import { config, configCompleta, guardarInscripcion, marcar, enviarEmail } from '../lib/charla/servicios.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  }
}

/* Validación del lado del servidor (la página valida lo mismo antes de
   enviar). Devuelve { datos } o { campos } con los campos erróneos. */
export function validar(body) {
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim().replace(/\s+/g, ' ') : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const sesion = getSesion(typeof body.sesion === 'string' ? body.sesion : '')
  const pregunta = typeof body.pregunta === 'string' ? body.pregunta.trim() : ''
  const campos = []
  if (nombre.length < 2 || nombre.length > 100) campos.push('nombre')
  if (!EMAIL_RE.test(email) || email.length > 254) campos.push('email')
  if (!sesion) campos.push('sesion')
  if (pregunta.length > 1000) campos.push('pregunta')
  if (campos.length) return { campos }
  return {
    datos: {
      nombre,
      email,
      sesion,
      pregunta: pregunta || null,
      noticias: body.noticias === true,
      idioma: body.idioma === 'en' ? 'en' : 'es',
    },
  }
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const allowedOrigin = process.env.ALLOWED_ORIGIN
  if (allowedOrigin) {
    const origin = event.headers?.origin ?? event.headers?.referer ?? ''
    if (!origin.startsWith(allowedOrigin)) return json(403, { ok: false, error: 'origen' })
  }

  let body
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return json(400, { ok: false, error: 'validacion', campos: [] })
  }

  // Honeypot antibot: un campo oculto que una persona nunca rellena. Se
  // responde como si todo fuera bien para no dar pistas, pero no se guarda
  // ni se envía nada.
  if (body.web) return json(200, { ok: true })

  const { datos, campos } = validar(body)
  if (campos) return json(400, { ok: false, error: 'validacion', campos })

  const { sesion } = datos
  if (Date.now() >= Date.parse(sesion.inicioUtc)) {
    return json(409, { ok: false, error: 'sesion_cerrada' })
  }

  // Sin enlace de Teams configurado para esta sesión las inscripciones no
  // están activas: no se guarda nada ni se envía un email sin enlace.
  const teamsUrl = process.env[envTeams(sesion.id)]
  if (!teamsUrl) {
    console.error(`[charla] Falta ${envTeams(sesion.id)}: inscripciones desactivadas para ${sesion.id}`)
    return json(503, { ok: false, error: 'no_activa' })
  }

  const c = config()
  if (!configCompleta(c)) {
    console.error('[charla] Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o RESEND_API_KEY')
    return json(500, { ok: false, error: 'config' })
  }

  // 1. Guardar la inscripción (incluida la sesión elegida).
  let fila
  try {
    fila = await guardarInscripcion(c, {
      nombre: datos.nombre,
      email: datos.email,
      sesion: sesion.id,
      pregunta: datos.pregunta,
      acepta_noticias: datos.noticias,
      idioma: datos.idioma,
    })
  } catch (err) {
    console.error('[charla] Error al guardar la inscripción:', err.message)
    return json(502, { ok: false, error: 'guardar' })
  }

  // 2. Enviar el email de confirmación con el .ics adjunto.
  try {
    const mail = emailConfirmacion({ nombre: datos.nombre, sesion, lang: datos.idioma, teamsUrl })
    const ics = buildIcs({
      sesion,
      titulo: textos(datos.idioma).titulo,
      descripcion: descripcionCalendario(datos.idioma, teamsUrl),
      teamsUrl,
      uid: `charla-${sesion.id}-${fila.id}@watchouttours.nz`,
    })
    await enviarEmail(c, {
      to: datos.email,
      ...mail,
      attachments: [{
        filename: nombreArchivoIcs(sesion),
        content: Buffer.from(ics, 'utf8').toString('base64'),
        content_type: 'text/calendar; charset=utf-8; method=PUBLISH',
      }],
    })
  } catch (err) {
    console.error('[charla] Error al enviar la confirmación:', err.message)
    return json(502, { ok: false, error: 'email' })
  }

  // A partir de aquí la inscripción está completa: lo que falle ya no
  // cambia la respuesta (solo se registra en el log).
  try {
    await marcar(c, [fila.id], 'confirmacion_enviada_at')
  } catch (err) {
    // Sin esta marca la persona no recibiría los recordatorios: se reintenta
    // una vez y, si vuelve a fallar, queda en el log para revisarlo.
    console.error('[charla] No se pudo marcar la confirmación, reintentando:', err.message)
    try { await marcar(c, [fila.id], 'confirmacion_enviada_at') } catch (err2) {
      console.error(`[charla] Inscripción ${fila.id} sin marcar como confirmada:`, err2.message)
    }
  }

  if (c.avisoInterno) {
    try {
      await enviarEmail(c, { to: c.avisoInterno, replyTo: datos.email, ...emailAvisoInterno({ ...datos, sesion, lang: datos.idioma }) })
    } catch (err) {
      console.error('[charla] Aviso interno no enviado:', err.message)
    }
  }

  return json(200, { ok: true })
}
