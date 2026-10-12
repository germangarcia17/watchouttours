// Textos de los emails de la charla (confirmación, recordatorios y
// seguimiento), en español e inglés según el idioma de la página desde la
// que se inscribió la persona. La charla es siempre en español.
//
// Cada builder devuelve { subject, html, text }. El HTML es deliberadamente
// sencillo (encabezados, párrafos, listas y enlaces descriptivos, sin
// imágenes) para que se lea bien con lector de pantalla; la versión de texto
// lleva la misma información con las URL completas.

import {
  REGIONES, DURACION_MINUTOS, CONTACTO, SITE_URL, RUTA_CHARLA, RUTA_VIAJE,
  GRABACION_ACTIVADA,
} from '../../../src/config/charla.js'
import { googleCalendarUrl, outlookCalendarUrl } from './ics.js'

const T = {
  es: {
    titulo: 'Descubre Nueva Zelanda a través de los sentidos',
    firma: 'Mónica y Sylvie\nWatchOut! Sensory Tours',
    hola: n => `Hola, ${n}:`,
    cuando: 'Fecha',
    horarios: 'Horarios',
    duracion: 'Duración aproximada: una hora.',
    plataforma: 'Plataforma: Microsoft Teams.',
    idioma: 'Idioma: español.',
    enlaceTitulo: 'Enlace para entrar a la charla',
    enlaceTexto: 'Entrar a la charla en Microsoft Teams',
    comoTitulo: 'Cómo entrar',
    comoOrdenador: 'Desde ordenador: abre el enlace y elige «Continuar en este explorador». No necesitas cuenta de Microsoft ni instalar nada. Escribe tu nombre y pulsa «Unirse ahora».',
    comoMovil: 'Desde el móvil o la tableta: instala antes la app gratuita Microsoft Teams. Después abre el enlace y únete como invitado escribiendo tu nombre.',
    comoAntes: 'Te recomendamos entrar unos minutos antes para comprobar el sonido.',
    ayudaTitulo: '¿Necesitas ayuda para conectarte?',
    ayuda: 'Responde a este email o escríbenos antes de la charla y te ayudamos:',
    ayudaEmail: 'Email',
    ayudaWhatsapp: 'WhatsApp',
    grabacion: 'Vamos a grabar la charla. En la grabación aparecerán la voz y la imagen de quien active el micrófono o la cámara. Si prefieres no aparecer, puedes mantenerlos apagados y escribir tus preguntas en el chat de la reunión. Más información en nuestra política de privacidad:',
    privacidadUrl: `${SITE_URL}/privacidad`,

    confAsunto: s => `Tu plaza para la charla «Descubre Nueva Zelanda a través de los sentidos» · ${s.fechaCorta.es}`,
    confIntro: '¡Gracias por apuntarte! Te esperamos en nuestra charla online gratuita «Descubre Nueva Zelanda a través de los sentidos». Aquí tienes todos los datos de tu sesión.',
    confSesionUnica: s => `Tu inscripción es para la sesión del ${s.fechaCorta.es.toLowerCase()}. Si no puedes venir o prefieres cambiar de fecha, respóndenos a este email.`,
    calTitulo: 'Añádela a tu calendario',
    calAdjunto: n => `Te adjuntamos el archivo de calendario «${n}»: ábrelo para añadir la charla a tu calendario. También puedes usar estos enlaces:`,
    calGoogle: 'Añadir a Google Calendar',
    calOutlook: 'Añadir a Outlook',
    confRecordatorios: 'Te enviaremos un recordatorio 24 horas antes y otro 1 hora antes de empezar.',

    r24Asunto: s => `Mañana: charla «Descubre Nueva Zelanda a través de los sentidos» · ${s.fechaCorta.es}, ${s.horas.es} (España peninsular)`,
    r24Intro: 'Te recordamos que mañana es nuestra charla online gratuita «Descubre Nueva Zelanda a través de los sentidos». ¡Tenemos muchas ganas de conocerte!',
    r1Asunto: s => `Empezamos en 1 hora: charla «Descubre Nueva Zelanda a través de los sentidos» · ${s.horas.es} (España peninsular)`,
    r1Intro: 'En una hora empieza nuestra charla online gratuita «Descubre Nueva Zelanda a través de los sentidos». Te esperamos.',

    segAsunto: 'Gracias por apuntarte a nuestra charla sobre Nueva Zelanda',
    segIntro: s => `Gracias por apuntarte a la charla «Descubre Nueva Zelanda a través de los sentidos» del ${s.fechaCorta.es.toLowerCase()}. Ha sido un placer compartir lo que vivimos en cada viaje.`,
    segGrabacionTitulo: 'La grabación',
    segGrabacion: 'Si quieres volver a escucharla, o no pudiste conectarte, aquí tienes la grabación:',
    segGrabacionEnlace: 'Ver la grabación de la charla',
    segLlamadaTitulo: 'Hablemos 15 minutos',
    segLlamadaConEnlace: 'Si te has quedado con ganas de más, te invitamos a reservar una llamada individual de 15 minutos con nosotras para resolver tus dudas sobre el viaje, sin compromiso:',
    segLlamadaEnlace: 'Reservar una llamada de 15 minutos',
    segLlamadaSinEnlace: 'Si te has quedado con ganas de más, te invitamos a una llamada individual de 15 minutos con nosotras para resolver tus dudas sobre el viaje, sin compromiso. Responde a este email o escríbenos por WhatsApp y buscamos un momento que te venga bien.',
    segViajeTitulo: 'Nuestro próximo viaje',
    segViaje: 'Toda la información del viaje está en nuestra web:',
    segViajeEnlace: 'Ver los viajes de WatchOut! por Nueva Zelanda',
    segWhatsapp: 'Y si prefieres escribirnos o mandarnos un audio, estamos en WhatsApp:',
    segWhatsappEnlace: `Escribir a WatchOut! por WhatsApp (${CONTACTO.whatsappNumero})`,
  },

  en: {
    titulo: 'Discover New Zealand through the senses',
    firma: 'Mónica and Sylvie\nWatchOut! Sensory Tours',
    hola: n => `Hi ${n},`,
    cuando: 'Date',
    horarios: 'Times',
    duracion: 'Approximate length: one hour.',
    plataforma: 'Platform: Microsoft Teams.',
    idioma: 'Language: the talk is in Spanish.',
    enlaceTitulo: 'Link to join the talk',
    enlaceTexto: 'Join the talk on Microsoft Teams',
    comoTitulo: 'How to join',
    comoOrdenador: 'On a computer: open the link and choose “Continue on this browser”. You don’t need a Microsoft account or to install anything. Type your name and press “Join now”.',
    comoMovil: 'On a phone or tablet: first install the free Microsoft Teams app. Then open the link and join as a guest by typing your name.',
    comoAntes: 'We recommend joining a few minutes early to check your sound.',
    ayudaTitulo: 'Need help connecting?',
    ayuda: 'Reply to this email or message us before the talk and we’ll help you:',
    ayudaEmail: 'Email',
    ayudaWhatsapp: 'WhatsApp',
    grabacion: 'We are going to record the talk. The recording will include the voice and image of anyone who turns on their microphone or camera. If you’d rather not appear, keep them off and type your questions in the meeting chat. More information in our privacy policy:',
    privacidadUrl: `${SITE_URL}/en/privacidad`,

    confAsunto: s => `Your place at the talk “Discover New Zealand through the senses” · ${s.fechaCorta.en}`,
    confIntro: 'Thank you for signing up! We look forward to seeing you at our free online talk “Discover New Zealand through the senses”. Here are all the details of your session. Please note: the talk is in Spanish.',
    confSesionUnica: s => `You are registered for the session on ${s.fechaCorta.en}. If you can’t make it or would like to change dates, just reply to this email.`,
    calTitulo: 'Add it to your calendar',
    calAdjunto: n => `We’ve attached the calendar file “${n}”: open it to add the talk to your calendar. You can also use these links:`,
    calGoogle: 'Add to Google Calendar',
    calOutlook: 'Add to Outlook',
    confRecordatorios: 'We’ll send you a reminder 24 hours before and another one 1 hour before we start.',

    r24Asunto: s => `Tomorrow: talk “Discover New Zealand through the senses” · ${s.fechaCorta.en}, ${s.horas.es} (mainland Spain)`,
    r24Intro: 'Just a reminder that our free online talk “Discover New Zealand through the senses” is tomorrow. We can’t wait to meet you! The talk is in Spanish.',
    r1Asunto: s => `Starting in 1 hour: talk “Discover New Zealand through the senses” · ${s.horas.es} (mainland Spain)`,
    r1Intro: 'Our free online talk “Discover New Zealand through the senses” starts in one hour. See you there! The talk is in Spanish.',

    segAsunto: 'Thank you for signing up for our talk about New Zealand',
    segIntro: s => `Thank you for signing up for the talk “Discover New Zealand through the senses” on ${s.fechaCorta.en}. It was a pleasure to share what we experience on every trip.`,
    segGrabacionTitulo: 'The recording',
    segGrabacion: 'If you’d like to listen again, or couldn’t make it, here is the recording:',
    segGrabacionEnlace: 'Watch the recording of the talk',
    segLlamadaTitulo: 'Let’s talk for 15 minutes',
    segLlamadaConEnlace: 'If you’d like to know more, we invite you to book a free, no-obligation 15-minute one-to-one call with us to answer your questions about the trip:',
    segLlamadaEnlace: 'Book a 15-minute call',
    segLlamadaSinEnlace: 'If you’d like to know more, we invite you to a free, no-obligation 15-minute one-to-one call with us to answer your questions about the trip. Reply to this email or message us on WhatsApp and we’ll find a time that suits you.',
    segViajeTitulo: 'Our next trip',
    segViaje: 'You’ll find all the trip information on our website:',
    segViajeEnlace: 'See WatchOut! trips in New Zealand',
    segWhatsapp: 'And if you prefer to write or send us a voice message, we’re on WhatsApp:',
    segWhatsappEnlace: `Message WatchOut! on WhatsApp (${CONTACTO.whatsappNumero})`,
  },
}

export function textos(lang) {
  return T[lang === 'en' ? 'en' : 'es']
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function localUrl(path, lang) {
  return `${SITE_URL}${lang === 'en' ? `/en${path}` : path}`
}

/* ── Bloques compartidos. Cada uno devuelve { html, text } ─────────────── */

function bloqueDetalles(sesion, lang) {
  const t = textos(lang)
  const filas = REGIONES.map(r => ({ region: r[lang], hora: sesion.horas[r.id], destacada: r.id === 'es' || r.id === 'ic' }))
  const html = `
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.cuando)}: ${esc(sesion.fecha[lang])}</h2>
    <h3 style="font-size:16px;margin:16px 0 4px">${esc(t.horarios)}</h3>
    <ul>
      ${filas.map(f => `<li>${f.destacada ? `<strong>${esc(f.region)}: ${esc(f.hora)}</strong>` : `${esc(f.region)}: ${esc(f.hora)}`}</li>`).join('\n      ')}
    </ul>
    <p>${esc(t.duracion)}<br>${esc(t.plataforma)}<br>${esc(t.idioma)}</p>`
  const text = [
    `${t.cuando}: ${sesion.fecha[lang]}`,
    '',
    `${t.horarios}:`,
    ...filas.map(f => `- ${f.region}: ${f.hora}`),
    '',
    t.duracion,
    t.plataforma,
    t.idioma,
  ].join('\n')
  return { html, text }
}

function bloqueEnlace(teamsUrl, lang) {
  const t = textos(lang)
  return {
    html: `
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.enlaceTitulo)}</h2>
    <p><a href="${esc(teamsUrl)}" style="font-size:18px;font-weight:bold;color:#0E5F73">${esc(t.enlaceTexto)}</a></p>`,
    text: `${t.enlaceTitulo}:\n${teamsUrl}`,
  }
}

function bloqueComoEntrar(lang) {
  const t = textos(lang)
  return {
    html: `
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.comoTitulo)}</h2>
    <ul>
      <li>${esc(t.comoOrdenador)}</li>
      <li>${esc(t.comoMovil)}</li>
    </ul>
    <p>${esc(t.comoAntes)}</p>`,
    text: `${t.comoTitulo}:\n- ${t.comoOrdenador}\n- ${t.comoMovil}\n${t.comoAntes}`,
  }
}

function bloqueGrabacion(lang) {
  if (!GRABACION_ACTIVADA) return { html: '', text: '' }
  const t = textos(lang)
  return {
    html: `\n    <p>${esc(t.grabacion)} <a href="${esc(t.privacidadUrl)}">${esc(t.privacidadUrl)}</a></p>`,
    text: `${t.grabacion} ${t.privacidadUrl}`,
  }
}

function bloqueAyuda(lang) {
  const t = textos(lang)
  return {
    html: `
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.ayudaTitulo)}</h2>
    <p>${esc(t.ayuda)}</p>
    <ul>
      <li>${esc(t.ayudaEmail)}: <a href="mailto:${CONTACTO.email}">${CONTACTO.email}</a></li>
      <li>${esc(t.ayudaWhatsapp)}: <a href="${CONTACTO.whatsappUrl}">${esc(CONTACTO.whatsappNumero)}</a></li>
    </ul>`,
    text: `${t.ayudaTitulo}\n${t.ayuda}\n- ${t.ayudaEmail}: ${CONTACTO.email}\n- ${t.ayudaWhatsapp}: ${CONTACTO.whatsappNumero} (${CONTACTO.whatsappUrl})`,
  }
}

function documento({ lang, titulo, cuerpoHtml }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titulo)}</title>
</head>
<body style="margin:0;padding:0;background:#FFFFFF">
  <div style="max-width:600px;margin:0 auto;padding:24px 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#15140F">
    ${cuerpoHtml}
  </div>
</body>
</html>`
}

function firmaHtml(lang) {
  const t = textos(lang)
  const url = localUrl(RUTA_CHARLA, lang)
  return `
    <p>${t.firma.split('\n').map(esc).join('<br>')}<br><a href="${esc(url)}">${esc(url.replace('https://', ''))}</a></p>`
}

function firmaText(lang) {
  return `${textos(lang).firma}\n${localUrl(RUTA_CHARLA, lang)}`
}

/* Descripción del evento de calendario (también para los enlaces de
   Google/Outlook). */
export function descripcionCalendario(lang, teamsUrl) {
  const t = textos(lang)
  return [
    `${t.enlaceTitulo}: ${teamsUrl}`,
    t.idioma,
    '',
    `${t.comoOrdenador}`,
    `${t.comoMovil}`,
    '',
    `${t.ayudaTitulo} ${CONTACTO.email} · WhatsApp ${CONTACTO.whatsappNumero}`,
  ].join('\n')
}

export function nombreArchivoIcs(sesion) {
  return `charla-watchout-${sesion.id}.ics`
}

/* ── Emails ─────────────────────────────────────────────────────────── */

export function emailConfirmacion({ nombre, sesion, lang, teamsUrl }) {
  const t = textos(lang)
  const detalles = bloqueDetalles(sesion, lang)
  const enlace = bloqueEnlace(teamsUrl, lang)
  const como = bloqueComoEntrar(lang)
  const grab = bloqueGrabacion(lang)
  const ayuda = bloqueAyuda(lang)
  const calArgs = { sesion, titulo: t.titulo, descripcion: descripcionCalendario(lang, teamsUrl), teamsUrl }
  const google = googleCalendarUrl(calArgs)
  const outlook = outlookCalendarUrl(calArgs)
  const ics = nombreArchivoIcs(sesion)

  const cuerpoHtml = `
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">${esc(t.titulo)}</h1>
    <p>${esc(t.hola(nombre))}</p>
    <p>${esc(t.confIntro)}</p>
    ${detalles.html}
    ${enlace.html}
    ${como.html}
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.calTitulo)}</h2>
    <p>${esc(t.calAdjunto(ics))}</p>
    <ul>
      <li><a href="${esc(google)}">${esc(t.calGoogle)}</a></li>
      <li><a href="${esc(outlook)}">${esc(t.calOutlook)}</a></li>
    </ul>
    <p>${esc(t.confRecordatorios)}</p>${grab.html}
    <p>${esc(t.confSesionUnica(sesion))}</p>
    ${ayuda.html}
    ${firmaHtml(lang)}`

  const text = [
    t.titulo,
    '',
    t.hola(nombre),
    '',
    t.confIntro,
    '',
    detalles.text,
    '',
    enlace.text,
    '',
    como.text,
    '',
    `${t.calTitulo}: ${t.calAdjunto(ics)}`,
    `- ${t.calGoogle}: ${google}`,
    `- ${t.calOutlook}: ${outlook}`,
    '',
    t.confRecordatorios,
    grab.text ? `\n${grab.text}` : null,
    '',
    t.confSesionUnica(sesion),
    '',
    ayuda.text,
    '',
    firmaText(lang),
  ].filter(l => l !== null).join('\n')

  return { subject: t.confAsunto(sesion), html: documento({ lang, titulo: t.titulo, cuerpoHtml }), text }
}

function emailRecordatorio({ nombre, sesion, lang, teamsUrl, asunto, intro }) {
  const t = textos(lang)
  const detalles = bloqueDetalles(sesion, lang)
  const enlace = bloqueEnlace(teamsUrl, lang)
  const como = bloqueComoEntrar(lang)
  const grab = bloqueGrabacion(lang)
  const ayuda = bloqueAyuda(lang)

  const cuerpoHtml = `
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">${esc(t.titulo)}</h1>
    <p>${esc(t.hola(nombre))}</p>
    <p>${esc(intro)}</p>
    ${enlace.html}
    ${detalles.html}
    ${como.html}${grab.html}
    ${ayuda.html}
    ${firmaHtml(lang)}`

  const text = [
    t.titulo, '', t.hola(nombre), '', intro, '',
    enlace.text, '', detalles.text, '', como.text,
    grab.text ? `\n${grab.text}` : null,
    '', ayuda.text, '', firmaText(lang),
  ].filter(l => l !== null).join('\n')

  return { subject: asunto, html: documento({ lang, titulo: t.titulo, cuerpoHtml }), text }
}

export function emailRecordatorio24h({ nombre, sesion, lang, teamsUrl }) {
  const t = textos(lang)
  return emailRecordatorio({ nombre, sesion, lang, teamsUrl, asunto: t.r24Asunto(sesion), intro: t.r24Intro })
}

export function emailRecordatorio1h({ nombre, sesion, lang, teamsUrl }) {
  const t = textos(lang)
  return emailRecordatorio({ nombre, sesion, lang, teamsUrl, asunto: t.r1Asunto(sesion), intro: t.r1Intro })
}

/* grabacionUrl: solo si GRABACION_ACTIVADA y existe el enlace.
   reservaUrl: enlace opcional a una herramienta de reservas (Calendly,
   Microsoft Bookings…); sin él, se invita a responder o escribir por
   WhatsApp. */
export function emailSeguimiento({ nombre, sesion, lang, grabacionUrl, reservaUrl }) {
  const t = textos(lang)
  const viajeUrl = localUrl(RUTA_VIAJE, lang)
  const grabar = GRABACION_ACTIVADA && grabacionUrl

  const cuerpoHtml = `
    <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">${esc(t.titulo)}</h1>
    <p>${esc(t.hola(nombre))}</p>
    <p>${esc(t.segIntro(sesion))}</p>
    ${grabar ? `
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.segGrabacionTitulo)}</h2>
    <p>${esc(t.segGrabacion)}</p>
    <p><a href="${esc(grabacionUrl)}" style="font-weight:bold;color:#0E5F73">${esc(t.segGrabacionEnlace)}</a></p>` : ''}
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.segLlamadaTitulo)}</h2>
    ${reservaUrl
      ? `<p>${esc(t.segLlamadaConEnlace)}</p>
    <p><a href="${esc(reservaUrl)}" style="font-weight:bold;color:#0E5F73">${esc(t.segLlamadaEnlace)}</a></p>`
      : `<p>${esc(t.segLlamadaSinEnlace)}</p>`}
    <h2 style="font-size:18px;margin:24px 0 8px">${esc(t.segViajeTitulo)}</h2>
    <p>${esc(t.segViaje)} <a href="${esc(viajeUrl)}">${esc(t.segViajeEnlace)}</a></p>
    <p>${esc(t.segWhatsapp)} <a href="${CONTACTO.whatsappUrl}">${esc(t.segWhatsappEnlace)}</a></p>
    ${firmaHtml(lang)}`

  const text = [
    t.titulo, '', t.hola(nombre), '', t.segIntro(sesion), '',
    grabar ? `${t.segGrabacionTitulo}\n${t.segGrabacion}\n${grabacionUrl}\n` : null,
    t.segLlamadaTitulo,
    reservaUrl ? `${t.segLlamadaConEnlace}\n${reservaUrl}` : t.segLlamadaSinEnlace,
    '',
    t.segViajeTitulo,
    `${t.segViaje} ${viajeUrl}`,
    '',
    `${t.segWhatsapp} ${CONTACTO.whatsappNumero} (${CONTACTO.whatsappUrl})`,
    '',
    firmaText(lang),
  ].filter(l => l !== null).join('\n')

  return { subject: t.segAsunto, html: documento({ lang, titulo: t.titulo, cuerpoHtml }), text }
}

/* Aviso interno al equipo por cada nueva inscripción (incluye la pregunta,
   que es lo que más interesa leer antes de la charla). */
export function emailAvisoInterno({ nombre, email, sesion, pregunta, noticias, lang }) {
  const filas = [
    ['Nombre', nombre],
    ['Email', email],
    ['Sesión', `${sesion.fecha.es}, ${sesion.horas.es} (España peninsular)`],
    ['Idioma de la web', lang === 'en' ? 'Inglés' : 'Español'],
    ['Quiere noticias de futuros viajes', noticias ? 'Sí' : 'No'],
    ['Pregunta', pregunta || '—'],
  ]
  return {
    subject: `Nueva inscripción a la charla (${sesion.fechaCorta.es}): ${nombre}`,
    html: `<h1>Nueva inscripción a la charla</h1><table>${filas.map(([k, v]) => `<tr><th scope="row" style="text-align:left;padding-right:12px">${esc(k)}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`,
    text: filas.map(([k, v]) => `${k}: ${v}`).join('\n'),
  }
}
