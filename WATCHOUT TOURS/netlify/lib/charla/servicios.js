// Acceso mínimo a Supabase (API REST) y a Resend desde las Netlify Functions
// de la charla. Se usa fetch directamente, como en netlify/functions/contacto.js.
//
// Variables de entorno (Netlify → Site configuration → Environment variables):
//   SUPABASE_URL (o VITE_SUPABASE_URL)  URL del proyecto de Supabase
//   SUPABASE_SERVICE_ROLE_KEY           clave service_role (solo en servidor)
//   RESEND_API_KEY                      clave de la API de Resend
//   CHARLA_EMAIL_FROM                   remitente (dominio verificado en Resend)
//   CONTACT_EMAIL                       buzón que recibe el aviso interno

const RESEND_API = 'https://api.resend.com'
export const TABLA = 'charla_inscripciones'

export const REPLY_TO = 'info@watchouttours.nz'

export function config() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/+$/, ''),
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    resendKey: process.env.RESEND_API_KEY || '',
    from: process.env.CHARLA_EMAIL_FROM || 'WatchOut! Sensory Tours <info@watchouttours.nz>',
    avisoInterno: process.env.CONTACT_EMAIL || '',
  }
}

export function configCompleta(c = config()) {
  return Boolean(c.supabaseUrl && c.supabaseKey && c.resendKey)
}

/* ── Supabase ─────────────────────────────────────────────────────────── */

function sbHeaders(c, extra = {}) {
  return {
    apikey: c.supabaseKey,
    Authorization: `Bearer ${c.supabaseKey}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function sbFetch(c, path, init) {
  const res = await fetch(`${c.supabaseUrl}/rest/v1/${path}`, init)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Supabase ${init.method ?? 'GET'} ${path.split('?')[0]} → ${res.status} ${body}`)
  }
  return res.status === 204 ? null : res.json()
}

/* Guarda (o actualiza, si ya estaba inscrita en esa sesión con el mismo
   email) una inscripción y devuelve la fila. */
export async function guardarInscripcion(c, fila) {
  const rows = await sbFetch(c, `${TABLA}?on_conflict=email,sesion`, {
    method: 'POST',
    headers: sbHeaders(c, { Prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify(fila),
  })
  return rows[0]
}

export async function marcar(c, ids, campo, cuando = new Date()) {
  if (!ids.length) return
  await sbFetch(c, `${TABLA}?id=in.(${ids.join(',')})`, {
    method: 'PATCH',
    headers: sbHeaders(c, { Prefer: 'return=minimal' }),
    body: JSON.stringify({ [campo]: cuando.toISOString() }),
  })
}

/* Inscritos confirmados de una sesión que aún no han recibido `campo`
   (recordatorio_24h_at, recordatorio_1h_at o seguimiento_at). */
export async function pendientes(c, { sesion, campo, inscritosAntesDe, limite = 100 }) {
  const q = new URLSearchParams({
    select: 'id,nombre,email,idioma',
    sesion: `eq.${sesion}`,
    confirmacion_enviada_at: 'not.is.null',
    [campo]: 'is.null',
    order: 'created_at.asc',
    limit: String(limite),
  })
  if (inscritosAntesDe) q.append('created_at', `lt.${inscritosAntesDe}`)
  return sbFetch(c, `${TABLA}?${q}`, { method: 'GET', headers: sbHeaders(c) })
}

/* ── Resend ───────────────────────────────────────────────────────────── */

async function resendFetch(c, path, payload, idempotencyKey) {
  const headers = { Authorization: `Bearer ${c.resendKey}`, 'Content-Type': 'application/json' }
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey
  const res = await fetch(`${RESEND_API}${path}`, { method: 'POST', headers, body: JSON.stringify(payload) })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Resend ${path} → ${res.status} ${body}`)
  }
  return res.json()
}

export function enviarEmail(c, { to, subject, html, text, attachments, replyTo = REPLY_TO }) {
  return resendFetch(c, '/emails', {
    from: c.from,
    to: [to],
    reply_to: replyTo,
    subject,
    html,
    text,
    ...(attachments ? { attachments } : {}),
  })
}

/* Hasta 100 emails en una sola llamada (la API batch de Resend no admite
   adjuntos, que los recordatorios no necesitan). La Idempotency-Key evita
   duplicados si una ejecución se repite antes de marcar las filas. */
export function enviarLote(c, emails, idempotencyKey) {
  return resendFetch(c, '/emails/batch', emails.map(e => ({
    from: c.from,
    to: [e.to],
    reply_to: REPLY_TO,
    subject: e.subject,
    html: e.html,
    text: e.text,
  })), idempotencyKey)
}
