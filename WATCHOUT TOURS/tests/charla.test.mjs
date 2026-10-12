// Tests de la charla online: horarios, calendario (.ics), inscripción y
// envíos programados. Se ejecutan con `npm test` (node:test, sin
// dependencias). Supabase y Resend se simulan sustituyendo fetch.

import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { SESIONES, REGIONES, getSesion, etiquetaSesion } from '../src/config/charla.js'
import { buildIcs } from '../netlify/lib/charla/ics.js'
import { handler, validar } from '../netlify/functions/charla-inscripcion.js'
import { tareasPendientes, ejecutar } from '../netlify/functions/charla-envios.js'

const TEAMS = {
  '2026-10-24': 'https://teams.microsoft.com/l/meetup-join/SESION-UNO',
  '2026-11-07': 'https://teams.microsoft.com/l/meetup-join/SESION-DOS',
}

function horaEn(zona, iso) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: zona, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso))
}

function fechaEn(zona, iso) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso))
}

/* ── Horarios ──────────────────────────────────────────────────────── */

test('las horas publicadas coinciden con el instante UTC de cada sesión', () => {
  for (const s of SESIONES) {
    for (const r of REGIONES) {
      assert.equal(horaEn(r.zona, s.inicioUtc), s.horas[r.id], `${s.id} ${r.id}`)
      assert.equal(fechaEn(r.zona, s.inicioUtc), s.id, `${s.id} ${r.id}: mismo día`)
    }
  }
})

test('la hora de Nueva Zelanda (anfitrionas) es domingo a las 8:00', () => {
  assert.equal(horaEn('Pacific/Auckland', SESIONES[0].inicioUtc), '08:00')
  assert.equal(fechaEn('Pacific/Auckland', SESIONES[0].inicioUtc), '2026-10-25')
  assert.equal(horaEn('Pacific/Auckland', SESIONES[1].inicioUtc), '08:00')
  assert.equal(fechaEn('Pacific/Auckland', SESIONES[1].inicioUtc), '2026-11-08')
})

test('el seguimiento sale al día siguiente a las 9:00 en España peninsular', () => {
  for (const s of SESIONES) {
    assert.equal(horaEn('Europe/Madrid', s.seguimientoUtc), '09:00')
    const dia = new Date(Date.parse(s.inicioUtc) + 86_400_000).toISOString().slice(0, 10)
    assert.equal(fechaEn('Europe/Madrid', s.seguimientoUtc), dia)
  }
})

test('etiquetas de las opciones del formulario', () => {
  assert.equal(etiquetaSesion(SESIONES[0], 'es'), 'Sábado 24 de octubre, 21:00 (España peninsular)')
  assert.equal(etiquetaSesion(SESIONES[1], 'es'), 'Sábado 7 de noviembre, 20:00 (España peninsular)')
  assert.equal(etiquetaSesion(SESIONES[1], 'en'), 'Saturday 7 November, 20:00 (Mainland Spain)')
})

/* ── Calendario ────────────────────────────────────────────────────── */

test('el .ics usa el instante UTC y respeta el formato', () => {
  const ics = buildIcs({ sesion: SESIONES[1], titulo: 'Descubre Nueva Zelanda a través de los sentidos', descripcion: 'Línea uno, con coma; y punto y coma\nLínea dos '.repeat(5), teamsUrl: TEAMS['2026-11-07'], uid: 'x@watchouttours.nz' })
  assert.match(ics, /\r\nDTSTART:20261107T190000Z\r\n/)
  assert.match(ics, /\r\nDTEND:20261107T200000Z\r\n/)
  assert.match(ics, /\\, con coma\\; y punto/)
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, `línea demasiado larga: ${line}`)
  // Al desplegar las líneas plegadas se recupera la URL de Teams completa.
  assert.ok(ics.replace(/\r\n /g, '').includes(`URL:${TEAMS['2026-11-07']}`))
})

/* ── Simulación de Supabase y Resend ───────────────────────────────── */

let llamadas
let fallos
const fetchOriginal = globalThis.fetch
const envOriginal = { ...process.env }

function instalarFetch() {
  llamadas = []
  fallos = {}
  globalThis.fetch = async (url, init = {}) => {
    const u = new URL(url)
    const body = init.body ? JSON.parse(init.body) : null
    llamadas.push({ url: u, method: init.method ?? 'GET', headers: init.headers ?? {}, body })
    const responder = (status, data) => new Response(data === null ? null : JSON.stringify(data), { status })
    if (u.hostname === 'sb.test') {
      if (fallos.supabase) return responder(500, { message: 'caído' })
      if (init.method === 'POST') return responder(201, [{ id: '11111111-1111-1111-1111-111111111111', ...body }])
      if (init.method === 'PATCH') return responder(204, null)
      if (init.method === 'GET') return responder(200, fallos.filas ? fallos.filas.splice(0) : [])
    }
    if (u.hostname === 'api.resend.com') {
      if (fallos.resend) return responder(500, { message: 'caído' })
      return responder(200, u.pathname.endsWith('batch') ? { data: body.map((_, i) => ({ id: `b${i}` })) } : { id: 'e1' })
    }
    throw new Error(`fetch inesperado: ${url}`)
  }
}

beforeEach(() => {
  instalarFetch()
  Object.assign(process.env, {
    SUPABASE_URL: 'https://sb.test',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role',
    RESEND_API_KEY: 're_test',
    CONTACT_EMAIL: 'equipo@watchouttours.nz',
    CHARLA_TEAMS_URL_2026_10_24: TEAMS['2026-10-24'],
    CHARLA_TEAMS_URL_2026_11_07: TEAMS['2026-11-07'],
  })
  delete process.env.ALLOWED_ORIGIN
})

afterEach(() => {
  globalThis.fetch = fetchOriginal
  for (const k of Object.keys(process.env)) if (!(k in envOriginal)) delete process.env[k]
  Object.assign(process.env, envOriginal)
})

function post(body) {
  return handler({ httpMethod: 'POST', headers: {}, body: JSON.stringify(body) })
}

const resendEmails = () => llamadas.filter(l => l.url.hostname === 'api.resend.com')
const supabase = (method) => llamadas.filter(l => l.url.hostname === 'sb.test' && l.method === method)

/* ── Inscripción ───────────────────────────────────────────────────── */

for (const [sesionId, otra] of [['2026-10-24', '2026-11-07'], ['2026-11-07', '2026-10-24']]) {
  test(`inscripción completa en la sesión ${sesionId}`, async () => {
    const sesion = getSesion(sesionId)
    const res = await post({ nombre: '  Ana   García ', email: 'Ana@Example.com', sesion: sesionId, pregunta: '¿Hace frío?', noticias: true, idioma: 'es' })
    assert.equal(res.statusCode, 200)
    assert.deepEqual(JSON.parse(res.body), { ok: true })

    // Guardado, con la sesión elegida.
    const [insert] = supabase('POST')
    assert.equal(insert.url.searchParams.get('on_conflict'), 'email,sesion')
    assert.deepEqual(insert.body, { nombre: 'Ana García', email: 'ana@example.com', sesion: sesionId, pregunta: '¿Hace frío?', acepta_noticias: true, idioma: 'es' })

    // Email a la persona inscrita: solo datos de su sesión.
    const [conf, aviso] = resendEmails()
    const m = conf.body
    assert.deepEqual(m.to, ['ana@example.com'])
    assert.equal(m.reply_to, 'info@watchouttours.nz')
    for (const parte of [m.subject, m.text, m.html]) assert.ok(parte.includes(sesion.fechaCorta.es) || parte.includes(sesion.fechaCorta.es.toLowerCase()), 'fecha de la sesión')
    for (const parte of [m.text, m.html]) {
      assert.ok(parte.includes(TEAMS[sesionId]), 'enlace de Teams de la sesión')
      assert.ok(!parte.includes(TEAMS[otra]), 'no incluye el enlace de la otra sesión')
      assert.ok(!parte.includes(getSesion(otra).fechaCorta.es), 'no incluye la otra fecha')
      assert.ok(parte.includes(sesion.fecha.es))
    }
    for (const r of REGIONES) assert.ok(m.text.includes(`- ${r.es}: ${sesion.horas[r.id]}`), `hora de ${r.es}`)
    assert.match(m.text, /Duración aproximada: una hora\./)
    assert.match(m.text, /Continuar en este explorador/)
    assert.match(m.text, /app gratuita Microsoft Teams/)
    assert.match(m.text, /info@watchouttours\.nz/)
    assert.match(m.text, /\+64 27 267 7006/)
    assert.match(m.html, /<html lang="es">/)
    assert.ok(!/<img/i.test(m.html), 'sin imágenes')
    assert.ok(!/grabar/i.test(m.text), 'sin aviso de grabación mientras esté desactivado')

    // Calendario adjunto con el instante UTC correcto.
    const [adj] = m.attachments
    assert.equal(adj.filename, `charla-watchout-${sesionId}.ics`)
    const ics = Buffer.from(adj.content, 'base64').toString('utf8')
    const dt = sesion.inicioUtc.replace(/[-:]/g, '').replace('Z', 'Z')
    assert.ok(ics.includes(`DTSTART:${dt}`), `DTSTART ${dt}`)
    assert.ok(ics.replace(/\r\n /g, '').includes(TEAMS[sesionId]))
    const dates = new URL(m.text.match(/https:\/\/calendar\.google\.com\S+/)[0]).searchParams.get('dates')
    assert.equal(dates, `${dt}/${dt.replace('T19', 'T20')}`)

    // Marcada como confirmada (para recibir los recordatorios).
    const [patch] = supabase('PATCH')
    assert.ok(patch.body.confirmacion_enviada_at)

    // Aviso interno al equipo con la pregunta.
    assert.deepEqual(aviso.body.to, ['equipo@watchouttours.nz'])
    assert.match(aviso.body.text, /¿Hace frío\?/)
    assert.match(aviso.body.text, /noticias de futuros viajes: Sí/)
  })
}

test('inscripción desde la versión inglesa: email en inglés que avisa de que la charla es en español', async () => {
  const res = await post({ nombre: 'Jo', email: 'jo@example.com', sesion: '2026-10-24', idioma: 'en' })
  assert.equal(res.statusCode, 200)
  const m = resendEmails()[0].body
  assert.match(m.html, /<html lang="en">/)
  assert.match(m.text, /the talk is in Spanish/i)
  assert.match(m.text, /- Mainland Spain: 21:00/)
})

test('si falla el email, no se confirma ni se marca la inscripción', async () => {
  fallos.resend = true
  const res = await post({ nombre: 'Ana', email: 'ana@example.com', sesion: '2026-10-24', idioma: 'es' })
  assert.equal(res.statusCode, 502)
  assert.deepEqual(JSON.parse(res.body), { ok: false, error: 'email' })
  assert.equal(supabase('PATCH').length, 0)
})

test('si falla el guardado, no se envía ningún email', async () => {
  fallos.supabase = true
  const res = await post({ nombre: 'Ana', email: 'ana@example.com', sesion: '2026-10-24', idioma: 'es' })
  assert.equal(res.statusCode, 502)
  assert.equal(JSON.parse(res.body).error, 'guardar')
  assert.equal(resendEmails().length, 0)
})

test('sin enlace de Teams la inscripción a esa sesión no está activa', async () => {
  delete process.env.CHARLA_TEAMS_URL_2026_11_07
  const res = await post({ nombre: 'Ana', email: 'ana@example.com', sesion: '2026-11-07', idioma: 'es' })
  assert.equal(res.statusCode, 503)
  assert.equal(JSON.parse(res.body).error, 'no_activa')
  assert.equal(llamadas.length, 0)
})

test('validación del servidor', async () => {
  assert.deepEqual(validar({ nombre: 'A', email: 'no-email', sesion: '2026-01-01', pregunta: 'x'.repeat(1001) }).campos, ['nombre', 'email', 'sesion', 'pregunta'])
  const res = await post({ nombre: '', email: '', sesion: '' })
  assert.equal(res.statusCode, 400)
  assert.deepEqual(JSON.parse(res.body).campos, ['nombre', 'email', 'sesion'])
  assert.equal(llamadas.length, 0)
  // La casilla de noticias solo cuenta si viene marcada explícitamente.
  assert.equal(validar({ nombre: 'Ana', email: 'a@b.co', sesion: '2026-10-24', noticias: 'true' }).datos.noticias, false)
})

test('honeypot: no guarda ni envía nada', async () => {
  const res = await post({ nombre: 'Bot', email: 'bot@example.com', sesion: '2026-10-24', web: 'spam' })
  assert.equal(res.statusCode, 200)
  assert.equal(llamadas.length, 0)
})

/* ── Recordatorios y seguimiento ───────────────────────────────────── */

const at = iso => new Date(iso)
const tipos = (sesion, iso, env = process.env) => tareasPendientes(sesion, at(iso), env).map(t => t.tipo)

test('ventanas de envío de cada sesión', () => {
  const [s1, s2] = SESIONES
  assert.deepEqual(tipos(s1, '2026-10-23T18:59:00Z'), [])
  assert.deepEqual(tipos(s1, '2026-10-23T19:00:00Z'), ['24h'])
  assert.deepEqual(tipos(s1, '2026-10-24T17:59:00Z'), ['24h'])
  assert.deepEqual(tipos(s1, '2026-10-24T18:00:00Z'), ['1h'])
  assert.deepEqual(tipos(s1, '2026-10-24T19:00:00Z'), [])
  assert.deepEqual(tipos(s1, '2026-10-25T08:00:00Z'), ['seguimiento'])
  assert.deepEqual(tipos(s2, '2026-10-24T18:00:00Z'), [], 'la sesión 2 no recibe nada de la sesión 1')
  assert.deepEqual(tipos(s2, '2026-11-06T19:00:00Z'), ['24h'])
  assert.deepEqual(tipos(s2, '2026-11-07T18:30:00Z'), ['1h'])
  assert.deepEqual(tipos(s2, '2026-11-08T08:00:00Z'), ['seguimiento'])
  assert.deepEqual(tipos(s2, '2026-11-15T08:00:00Z'), [])
  assert.deepEqual(tipos(s1, '2026-10-23T19:00:00Z', {}), [], 'sin enlace de Teams no se envía nada')
})

test('recordatorio de 1 hora: solo a inscritos confirmados de esa sesión, con su enlace', async () => {
  fallos.filas = [
    { id: 'a', nombre: 'Ana', email: 'ana@example.com', idioma: 'es' },
    { id: 'b', nombre: 'Jo', email: 'jo@example.com', idioma: 'en' },
  ]
  const resumen = await ejecutar(at('2026-11-07T18:10:00Z'))
  assert.deepEqual(resumen, [{ sesion: '2026-11-07', tipo: '1h', enviados: 2 }])

  const [consulta] = supabase('GET')
  assert.equal(consulta.url.searchParams.get('sesion'), 'eq.2026-11-07')
  assert.equal(consulta.url.searchParams.get('confirmacion_enviada_at'), 'not.is.null')
  assert.equal(consulta.url.searchParams.get('recordatorio_1h_at'), 'is.null')
  assert.equal(consulta.url.searchParams.get('created_at'), 'lt.2026-11-07T18:00:00.000Z')

  const [lote] = resendEmails()
  assert.ok(lote.url.pathname.endsWith('/emails/batch'))
  assert.ok(lote.headers['Idempotency-Key'])
  const [es, en] = lote.body
  assert.deepEqual(es.to, ['ana@example.com'])
  assert.match(es.subject, /Empezamos en 1 hora/)
  assert.match(es.subject, /20:00 \(España peninsular\)/)
  assert.ok(es.text.includes(TEAMS['2026-11-07']) && !es.text.includes(TEAMS['2026-10-24']))
  assert.ok(es.text.includes('Sábado 7 de noviembre de 2026'))
  assert.match(en.subject, /Starting in 1 hour/)

  const [patch] = supabase('PATCH')
  assert.equal(patch.url.searchParams.get('id'), 'in.(a,b)')
  assert.ok(patch.body.recordatorio_1h_at)
})

test('recordatorio de 24 horas de la sesión 1', async () => {
  fallos.filas = [{ id: 'a', nombre: 'Ana', email: 'ana@example.com', idioma: 'es' }]
  await ejecutar(at('2026-10-23T19:05:00Z'))
  const [lote] = resendEmails()
  const [m] = lote.body
  assert.match(m.subject, /^Mañana: /)
  assert.match(m.subject, /Sábado 24 de octubre, 21:00 \(España peninsular\)/)
  assert.ok(m.text.includes(TEAMS['2026-10-24']))
  assert.match(m.text, /- Canarias: 20:00/)
})

test('seguimiento: invitación a la llamada, página del viaje y WhatsApp', async () => {
  fallos.filas = [{ id: 'a', nombre: 'Ana', email: 'ana@example.com', idioma: 'es' }]
  await ejecutar(at('2026-10-25T08:05:00Z'))
  const [m] = resendEmails()[0].body
  assert.match(m.text, /llamada individual de 15 minutos/)
  assert.match(m.text, /https:\/\/watchouttours\.nz\/productos/)
  assert.match(m.text, /\+64 27 267 7006/)
  assert.ok(!m.text.includes('teams.microsoft.com'))
})

test('si falla el envío del lote, no se marca y se reintenta después', async () => {
  fallos.filas = [{ id: 'a', nombre: 'Ana', email: 'ana@example.com', idioma: 'es' }]
  fallos.resend = true
  const resumen = await ejecutar(at('2026-10-24T18:10:00Z'))
  assert.deepEqual(resumen, [{ sesion: '2026-10-24', tipo: '1h', enviados: 0 }])
  assert.equal(supabase('PATCH').length, 0)
})
