// netlify/functions/contacto.js
// Receives POST { nombre, email, telefono, mensaje }
// and forwards the submission via Resend.

const RESEND_API = 'https://api.resend.com/emails'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { nombre, email, telefono, mensaje } = body

  if (!nombre || !email || !mensaje) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Campos obligatorios faltantes' }) }
  }

  // Basic email format check to prevent misuse at the edge
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Correo electrónico inválido' }) }
  }

  const apiKey = process.env.RESEND_API_KEY
  const to     = process.env.CONTACT_EMAIL

  if (!apiKey || !to) {
    console.error('Missing RESEND_API_KEY or CONTACT_EMAIL env vars')
    return { statusCode: 500, body: JSON.stringify({ error: 'Configuración del servidor incompleta' }) }
  }

  const html = `
    <h2>Nuevo mensaje de contacto — WatchOut! Sensory Tours</h2>
    <table>
      <tr><th>Nombre</th><td>${escapeHtml(nombre)}</td></tr>
      <tr><th>Correo</th><td>${escapeHtml(email)}</td></tr>
      ${telefono ? `<tr><th>Teléfono</th><td>${escapeHtml(telefono)}</td></tr>` : ''}
      <tr><th>Mensaje</th><td>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</td></tr>
    </table>
  `

  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'WatchOut! Sensory Tours <noreply@watchouttours.com>',
        to:      [to],
        replyTo: email,
        subject: `Nuevo mensaje de ${nombre}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return { statusCode: 500, body: JSON.stringify({ error: 'Error al enviar el mensaje' }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('Fetch error:', err)
    return { statusCode: 500, body: JSON.stringify({ error: 'Error de red' }) }
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
