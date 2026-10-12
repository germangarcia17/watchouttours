// Archivo de calendario (.ics, RFC 5545) para una sesión de la charla.
// Usa siempre el instante UTC de la sesión (DTSTART/DTEND en Z), así cada
// calendario lo muestra en la hora local de quien lo abre.

import { finUtc } from '../../../src/config/charla.js'

function icsDate(iso) {
  // 2026-10-24T19:00:00.000Z → 20261024T190000Z
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeText(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Las líneas de un .ics no deben pasar de 75 octetos: se pliegan con
// CRLF + espacio, sin partir caracteres multibyte (tildes, ñ).
function fold(line) {
  const out = []
  let current = ''
  let bytes = 0
  for (const ch of line) {
    const len = Buffer.byteLength(ch)
    if (bytes + len > (out.length ? 74 : 75)) {
      out.push(current)
      current = ''
      bytes = 0
    }
    current += ch
    bytes += len
  }
  out.push(current)
  return out.join('\r\n ')
}

export function buildIcs({ sesion, titulo, descripcion, teamsUrl, uid, now = new Date() }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WatchOut! Sensory Tours//Charla Nueva Zelanda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${icsDate(now.toISOString())}`,
    `DTSTART:${icsDate(sesion.inicioUtc)}`,
    `DTEND:${icsDate(finUtc(sesion))}`,
    `SUMMARY:${escapeText(titulo)}`,
    `DESCRIPTION:${escapeText(descripcion)}`,
    `LOCATION:${escapeText(`Microsoft Teams: ${teamsUrl}`)}`,
    `URL:${teamsUrl}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(titulo)}`,
    'TRIGGER:-PT1H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

/* Enlaces «añadir al calendario» para quien no pueda abrir el adjunto. */
export function googleCalendarUrl({ sesion, titulo, descripcion, teamsUrl }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: titulo,
    dates: `${icsDate(sesion.inicioUtc)}/${icsDate(finUtc(sesion))}`,
    details: descripcion,
    location: teamsUrl,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

export function outlookCalendarUrl({ sesion, titulo, descripcion, teamsUrl }) {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: titulo,
    startdt: sesion.inicioUtc,
    enddt: finUtc(sesion),
    body: descripcion,
    location: teamsUrl,
  })
  return `https://outlook.live.com/calendar/0/action/compose?${params}`
}
