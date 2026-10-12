// netlify/functions/charla-envios.js
// Función programada (cada 10 minutos, ver netlify.toml) que envía a los
// inscritos de cada sesión, y solo a ellos:
//   - recordatorio 24 horas antes,
//   - recordatorio 1 hora antes,
//   - email de seguimiento el día siguiente (SESIONES[].seguimientoUtc).
//
// Cada envío queda marcado en la fila (recordatorio_24h_at,
// recordatorio_1h_at, seguimiento_at), así que nadie recibe el mismo email
// dos veces aunque la función se ejecute muchas veces.

import { createHash } from 'node:crypto'
import { SESIONES, GRABACION_ACTIVADA, envTeams, envGrabacion } from '../../src/config/charla.js'
import { emailRecordatorio24h, emailRecordatorio1h, emailSeguimiento } from '../lib/charla/emails.js'
import { config, configCompleta, pendientes, marcar, enviarLote } from '../lib/charla/servicios.js'

const HORA = 3_600_000
const DIA = 24 * HORA
// Margen para enviar el seguimiento si en su momento faltaba algo (p. ej.
// el enlace de la grabación): después de esto ya no se envía.
const VENTANA_SEGUIMIENTO = 7 * DIA
// Las funciones programadas tienen ~30 s; dejamos margen.
const TIEMPO_MAX_MS = 20_000

/* Qué envíos tocan ahora para una sesión. Devuelve una lista de tareas
   { tipo, campo, inscritosAntesDe, construir } o [] si no toca nada. */
export function tareasPendientes(sesion, ahora, env = process.env) {
  const teamsUrl = env[envTeams(sesion.id)]
  if (!teamsUrl) return []
  const inicio = Date.parse(sesion.inicioUtc)
  const t = ahora.getTime()
  const tareas = []

  // 24 h antes: solo a quien se inscribió antes de ese momento (quien se
  // inscribe después acaba de recibir la confirmación con todos los datos).
  if (t >= inicio - DIA && t < inicio - HORA) {
    tareas.push({
      tipo: '24h',
      campo: 'recordatorio_24h_at',
      inscritosAntesDe: new Date(inicio - DIA).toISOString(),
      construir: f => emailRecordatorio24h({ nombre: f.nombre, sesion, lang: f.idioma, teamsUrl }),
    })
  }

  if (t >= inicio - HORA && t < inicio) {
    tareas.push({
      tipo: '1h',
      campo: 'recordatorio_1h_at',
      inscritosAntesDe: new Date(inicio - HORA).toISOString(),
      construir: f => emailRecordatorio1h({ nombre: f.nombre, sesion, lang: f.idioma, teamsUrl }),
    })
  }

  const seguimiento = Date.parse(sesion.seguimientoUtc)
  if (t >= seguimiento && t < seguimiento + VENTANA_SEGUIMIENTO) {
    const grabacionUrl = env[envGrabacion(sesion.id)]
    if (GRABACION_ACTIVADA && !grabacionUrl) {
      console.warn(`[charla] Seguimiento de ${sesion.id} en espera: falta ${envGrabacion(sesion.id)}`)
    } else {
      const reservaUrl = env.CHARLA_URL_RESERVA_LLAMADA || ''
      tareas.push({
        tipo: 'seguimiento',
        campo: 'seguimiento_at',
        inscritosAntesDe: null,
        construir: f => emailSeguimiento({ nombre: f.nombre, sesion, lang: f.idioma, grabacionUrl, reservaUrl }),
      })
    }
  }

  return tareas
}

export async function ejecutar(ahora = new Date(), env = process.env) {
  const resumen = []
  const tareas = SESIONES.flatMap(sesion =>
    tareasPendientes(sesion, ahora, env).map(tarea => ({ sesion, tarea })))
  if (!tareas.length) return resumen

  const c = config()
  if (!configCompleta(c)) {
    console.error('[charla] Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY o RESEND_API_KEY: no se envían recordatorios')
    return resumen
  }

  const limite = Date.now() + TIEMPO_MAX_MS
  for (const { sesion, tarea } of tareas) {
    let enviados = 0
    try {
      while (Date.now() < limite) {
        const filas = await pendientes(c, { sesion: sesion.id, campo: tarea.campo, inscritosAntesDe: tarea.inscritosAntesDe })
        if (!filas.length) break
        const emails = filas.map(f => ({ to: f.email, ...tarea.construir(f) }))
        const ids = filas.map(f => f.id)
        const clave = `charla-${tarea.tipo}-${sesion.id}-${createHash('sha256').update(ids.join(',')).digest('hex').slice(0, 32)}`
        await enviarLote(c, emails, clave)
        await marcar(c, ids, tarea.campo)
        enviados += filas.length
      }
    } catch (err) {
      console.error(`[charla] Error en ${tarea.tipo} de ${sesion.id} (se reintentará en la próxima ejecución):`, err.message)
    }
    resumen.push({ sesion: sesion.id, tipo: tarea.tipo, enviados })
    console.log(`[charla] ${tarea.tipo} ${sesion.id}: ${enviados} emails enviados`)
  }
  return resumen
}

export async function handler() {
  await ejecutar()
  return { statusCode: 200 }
}
