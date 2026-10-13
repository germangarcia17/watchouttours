// WatchOut! · Directos online — lógica central (sin dependencias externas)

export const SUCCESS_MESSAGE =
  '¡Ya estás dentro! Te hemos enviado un correo con los detalles. Si no lo encuentras, revisa la carpeta de spam.';

export const NEWSLETTER_CONSENT_TEXT =
  'Quiero recibir por email novedades y viajes de WatchOut! Sensory Tours.';

// Ordenados del más lejano al más cercano al inicio.
export const REMINDERS = [
  { key: 'reminder_24h', offsetMs: 24 * 3600e3, kind: 'r24' },
  { key: 'reminder_2h', offsetMs: 2 * 3600e3, kind: 'r2' },
];

const CONFIRM_RESEND_MS = 10 * 60e3; // si alguien se reinscribe, reenviamos como mucho cada 10 min
const CONFIRM_RETRY_AFTER_MS = 2 * 60e3; // el programador reintenta confirmaciones fallidas
const MAX_ATTEMPTS = 3;
const SEND_CONCURRENCY = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (e) => String(e ?? '').trim().toLowerCase();

export function validateInput(input = {}) {
  const errors = {};
  const name = String(input.nombre ?? '').trim().replace(/\s+/g, ' ');
  const email = String(input.email ?? '').trim();
  if (!name) errors.nombre = 'Escribe tu nombre.';
  else if (name.length > 80) errors.nombre = 'El nombre es demasiado largo.';
  if (!email) errors.email = 'Escribe tu email.';
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = 'Revisa el email, parece que le falta algo.';
  const nv = input.novedades;
  const novedades = nv === true || nv === 'on' || nv === 'true' || nv === 'si';
  const isBot = String(input.web ?? '').trim().length > 0; // campo trampa invisible
  return { ok: Object.keys(errors).length === 0, errors, name, email, novedades, isBot };
}

export function eventTimes(event) {
  const start = new Date(event.starts_at).getTime();
  return { start, end: start + (event.duration_minutes ?? 60) * 60e3 };
}

// Quien se inscribe tarde solo recibe los recordatorios que todavía no han pasado.
export function initialReminderStatus(event, now) {
  const { start } = eventTimes(event);
  const out = {};
  for (const r of REMINDERS) {
    out[`${r.key}_status`] = now.getTime() >= start - r.offsetMs ? 'skipped' : 'pending';
  }
  return out;
}

// ---------- Fechas y zonas horarias ----------

const ZONES = [
  ['España (península y Baleares)', 'Europe/Madrid'],
  ['Canarias', 'Atlantic/Canary'],
  ['Argentina y Uruguay', 'America/Argentina/Buenos_Aires'],
  ['Chile', 'America/Santiago'],
  ['Colombia, Perú y Ecuador', 'America/Bogota'],
  ['México (Ciudad de México)', 'America/Mexico_City'],
  ['Estados Unidos (costa este)', 'America/New_York'],
  ['Nueva Zelanda', 'Pacific/Auckland'],
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmt = (d, timeZone, opts) => new Intl.DateTimeFormat('es-ES', { timeZone, ...opts }).format(d);
const hhmm = (d, tz) => fmt(d, tz, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

function utcOffset(d, timeZone) {
  const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
    .formatToParts(d)
    .find((p) => p.type === 'timeZoneName');
  const v = (part?.value || 'GMT').replace('GMT', 'UTC');
  return v === 'UTC' ? 'UTC+0' : v;
}

export function describeTimes(event) {
  const d = new Date(event.starts_at);
  return {
    dateLine: cap(fmt(d, 'Europe/Madrid', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })),
    hourLine: `${hhmm(d, 'Europe/Madrid')} hora de España peninsular (${utcOffset(d, 'Europe/Madrid')})`,
    shortHour: hhmm(d, 'Europe/Madrid'),
    rows: ZONES.map(([label, tz]) => ({
      label,
      value: `${cap(fmt(d, tz, { weekday: 'long', day: 'numeric', month: 'long' }))}, ${hhmm(d, tz)}`,
    })),
  };
}

function calendarLink(event) {
  const { start, end } = eventTimes(event);
  const f = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${f(start)}/${f(end)}`,
    details: `Entrar al directo: ${event.teams_url}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

// ---------- Plantillas de email ----------

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function upcomingRemindersText(row) {
  const r24 = row.reminder_24h_status === 'pending';
  const r2 = row.reminder_2h_status === 'pending';
  if (r24 && r2) return 'Te mandaremos un recordatorio un día antes y otro dos horas antes, los dos con el enlace.';
  if (r2) return 'Te mandaremos un último recordatorio con el enlace dos horas antes.';
  return '';
}

export function buildEmail(kind, { event, row, config = {} }) {
  const t = describeTimes(event);
  const name = row.name;
  const whatsapp = config.whatsapp || '+64 27 267 7006';
  let subject;
  let intro;
  let extra = '';

  if (kind === 'confirm') {
    subject = `Ya estás dentro: ${event.title}`;
    intro = 'Tu plaza para el directo está confirmada.';
    extra = upcomingRemindersText(row);
  } else if (kind === 'confirm_live') {
    subject = 'El directo ya ha empezado: entra ahora';
    intro = 'Tu plaza está confirmada y el directo ya está en marcha. Puedes entrar ahora mismo con el botón de abajo.';
  } else if (kind === 'r24') {
    subject = `Mañana: ${event.title}`;
    intro = 'Mañana nos vemos en el directo. Te dejamos aquí todo lo que necesitas para entrar.';
  } else if (kind === 'r2') {
    subject = `Queda poco: hoy a las ${t.shortHour} (hora de España)`;
    intro = 'En un rato empieza el directo. Guarda este correo a mano para entrar con un toque.';
  } else {
    throw new Error(`Tipo de email desconocido: ${kind}`);
  }

  const hosts = 'Estaremos Sylvie y Moni desde Nueva Zelanda, y con nosotras Nuria, que ya hizo el viaje y te contará cómo lo vivió.';
  const howTo = 'En el ordenador funciona desde el navegador, sin instalar nada. En el móvil necesitas la app gratuita de Microsoft Teams. Al entrar esperarás unos segundos en la sala de espera hasta que te demos paso.';
  const sr = 'Teams funciona con VoiceOver, TalkBack, JAWS y NVDA.';
  const help = `Si tienes cualquier duda, responde a este correo o escríbenos por WhatsApp al ${whatsapp}.`;
  const footer = 'Recibes este correo porque te has inscrito en un directo de WatchOut! Sensory Tours. Si no quieres recibir los recordatorios, responde con la palabra BAJA.';

  const text = [
    `Hola ${name}:`,
    '',
    intro,
    '',
    `${event.title}`,
    `${t.dateLine}`,
    `${t.hourLine}`,
    '',
    'Hora en otros países:',
    ...t.rows.map((r) => `- ${r.label}: ${r.value}`),
    '',
    `Entrar al directo: ${event.teams_url}`,
    '',
    howTo,
    sr,
    kind === 'confirm' ? hosts : '',
    extra,
    '',
    `Añadir a Google Calendar: ${calendarLink(event)}`,
    '',
    help,
    '',
    'Sylvie y Moni',
    'WatchOut! Sensory Tours',
    'Not all vision needs eyes.',
    '',
    footer,
  ]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n');

  const p = (s) => (s ? `<p style="margin:0 0 16px">${s}</p>` : '');
  const rowsHtml = t.rows
    .map(
      (r) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #D7E3E6"><span style="display:block;font-size:15px;color:#3C5A63">${esc(r.label)}</span><strong>${esc(r.value)}</strong></td></tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F3F8F9">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F8F9"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden">
<tr><td style="background:#0E5F73;color:#FFFFFF;padding:20px 28px;font-family:Verdana,Arial,sans-serif;font-size:20px;font-weight:bold">WatchOut! Sensory Tours</td></tr>
<tr><td style="padding:28px;font-family:Verdana,Arial,sans-serif;font-size:18px;line-height:1.6;color:#0B2A33">
<p style="margin:0 0 16px">Hola ${esc(name)}:</p>
${p(esc(intro))}
<h1 style="font-size:24px;line-height:1.25;margin:8px 0 8px;color:#0B2A33">${esc(event.title)}</h1>
<p style="margin:0 0 4px;font-weight:bold">${esc(t.dateLine)}</p>
<p style="margin:0 0 24px;font-weight:bold">${esc(t.hourLine)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px"><tr><td style="border-radius:999px;background:#FF6B4A">
<a href="${esc(event.teams_url)}" style="display:inline-block;padding:16px 32px;font-family:Verdana,Arial,sans-serif;font-size:20px;font-weight:bold;color:#0B2A33;text-decoration:none;border-radius:999px">Entrar al directo</a>
</td></tr></table>
<p style="margin:0 0 24px;font-size:15px;color:#3C5A63">Si el botón no funciona, copia este enlace en tu navegador:<br><a href="${esc(event.teams_url)}" style="color:#0E5F73;word-break:break-all">${esc(event.teams_url)}</a></p>
<h2 style="font-size:19px;margin:0 0 8px">Hora en otros países</h2>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:16px;margin:0 0 24px">${rowsHtml}</table>
${p(esc(howTo))}
${p(esc(sr))}
${kind === 'confirm' ? p(esc(hosts)) : ''}
${p(esc(extra))}
<p style="margin:0 0 24px"><a href="${esc(calendarLink(event))}" style="color:#0E5F73">Añadir a Google Calendar</a></p>
${p(esc(help))}
<p style="margin:0">Sylvie y Moni<br>WatchOut! Sensory Tours<br><span lang="en">Not all vision needs eyes.</span></p>
</td></tr>
<tr><td style="padding:16px 28px 24px;font-family:Verdana,Arial,sans-serif;font-size:13px;line-height:1.5;color:#3C5A63;border-top:1px solid #D7E3E6">${esc(footer)}</td></tr>
</table></td></tr></table></body></html>`;

  return { subject, html, text };
}

// ---------- Envío con registro de estado ----------

const FIELDS = {
  confirmation: { status: 'confirmation_status', sentAt: 'confirmation_sent_at', attempts: 'confirmation_attempts' },
  reminder_24h: { status: 'reminder_24h_status', sentAt: 'reminder_24h_sent_at', attempts: 'reminder_24h_attempts' },
  reminder_2h: { status: 'reminder_2h_status', sentAt: 'reminder_2h_sent_at', attempts: 'reminder_2h_attempts' },
};

async function deliver({ db, mailer, config, event, row, kind, fieldKey, now, log }) {
  const f = FIELDS[fieldKey];
  const email = buildEmail(kind, { event, row, config });
  try {
    await mailer.send({ to: { email: row.email, name: row.name }, ...email, tags: ['directo', event.slug, kind] });
    await db.update(row.id, { [f.status]: 'sent', [f.sentAt]: now.toISOString() });
    return 'sent';
  } catch (err) {
    const attempts = (row[f.attempts] ?? 0) + 1;
    log.error(`[directo] fallo enviando ${kind} a ${row.email}:`, err?.message || err);
    await db.update(row.id, {
      [f.status]: attempts >= MAX_ATTEMPTS ? 'failed' : 'pending',
      [f.attempts]: attempts,
      last_error: String(err?.message || err).slice(0, 500),
    });
    return 'failed';
  }
}

async function inBatches(items, size, fn) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(fn));
}

// ---------- Inscripción ----------

export async function register({ db, mailer, input, config, now = new Date(), log = console }) {
  const v = validateInput(input);
  if (v.isBot) return { status: 200, body: { ok: true, message: SUCCESS_MESSAGE } };
  if (!v.ok) return { status: 422, body: { ok: false, errors: v.errors } };

  const event = await db.getEvent(config.slug);
  if (!event || !event.is_open) {
    return { status: 409, body: { ok: false, error: 'Las inscripciones para este directo están cerradas.' } };
  }
  const { start, end } = eventTimes(event);
  if (now.getTime() >= end) {
    return { status: 409, body: { ok: false, error: 'Este directo ya ha terminado. Escríbenos y te avisamos del próximo.' } };
  }

  const emailNormalized = normalizeEmail(v.email);
  const confirmKind = now.getTime() >= start ? 'confirm_live' : 'confirm';
  let row = await db.findRegistration(event.slug, emailNormalized);
  let created = false;

  if (!row) {
    try {
      row = await db.insertRegistration({
        event_slug: event.slug,
        name: v.name,
        email: v.email,
        email_normalized: emailNormalized,
        created_at: now.toISOString(),
        confirmation_status: 'sending',
        ...initialReminderStatus(event, now),
      });
      created = true;
    } catch (err) {
      if (err?.code !== 'DUPLICATE') throw err;
      row = await db.findRegistration(event.slug, emailNormalized); // dos envíos casi simultáneos
    }
  }

  if (created) {
    await deliver({ db, mailer, config, event, row, kind: confirmKind, fieldKey: 'confirmation', now, log });
  } else {
    if (row.name !== v.name) {
      await db.update(row.id, { name: v.name });
      row = { ...row, name: v.name };
    }
    const last = row.confirmation_sent_at ? Date.parse(row.confirmation_sent_at) : 0;
    if (row.confirmation_status !== 'sending' && now.getTime() - last >= CONFIRM_RESEND_MS) {
      await deliver({ db, mailer, config, event, row, kind: confirmKind, fieldKey: 'confirmation', now, log });
    }
  }

  if (v.novedades) {
    try {
      await db.upsertNewsletter({
        name: v.name,
        email: v.email,
        email_normalized: emailNormalized,
        source: `directo:${event.slug}`,
        consent_text: NEWSLETTER_CONSENT_TEXT,
        consented_at: now.toISOString(),
        unsubscribed_at: null,
      });
    } catch (err) {
      log.error('[directo] no se pudo guardar la suscripción a novedades:', err?.message || err);
    }
  }

  return { status: 200, body: { ok: true, message: SUCCESS_MESSAGE, duplicate: !created } };
}

// ---------- Recordatorios (lo ejecuta el programador cada hora) ----------

export async function runReminders({ db, mailer, config = {}, now = new Date(), log = console }) {
  const summary = { sent: 0, skipped: 0, failed: 0 };
  const count = (r) => { summary[r === 'sent' ? 'sent' : 'failed']++; };
  const events = await db.listActiveEvents(new Date(now.getTime() - 2 * 24 * 3600e3).toISOString());

  for (const event of events) {
    const { start, end } = eventTimes(event);
    const nowMs = now.getTime();

    // Confirmaciones que fallaron: reintento mientras el directo no haya terminado.
    if (nowMs < end) {
      const pending = await db.listByStatus(event.slug, 'confirmation_status', ['pending'],
        new Date(nowMs - CONFIRM_RETRY_AFTER_MS).toISOString());
      await inBatches(pending, SEND_CONCURRENCY, async (row) => {
        if (!(await db.claim(row.id, 'confirmation_status', 'pending', 'sending'))) return;
        count(await deliver({ db, mailer, config, event, row, kind: nowMs >= start ? 'confirm_live' : 'confirm', fieldKey: 'confirmation', now, log }));
      });
    }

    for (let i = 0; i < REMINDERS.length; i++) {
      const r = REMINDERS[i];
      const due = start - r.offsetMs;
      if (nowMs < due) continue;
      const next = REMINDERS[i + 1];
      const supersededAt = next ? start - next.offsetMs : start; // si ya toca el siguiente, este sobra
      const field = `${r.key}_status`;
      const rows = await db.listByStatus(event.slug, field, ['pending']);
      await inBatches(rows, SEND_CONCURRENCY, async (row) => {
        if (!(await db.claim(row.id, field, 'pending', 'sending'))) return;
        if (nowMs >= supersededAt) {
          await db.update(row.id, { [field]: 'skipped' });
          summary.skipped++;
          return;
        }
        count(await deliver({ db, mailer, config, event, row, kind: r.kind, fieldKey: r.key, now, log }));
      });
    }
  }
  return summary;
}

// ---------- Exportación CSV (Excel en español: separador ;) ----------

const nzDate = (iso) =>
  iso ? new Intl.DateTimeFormat('sv-SE', { timeZone: 'Pacific/Auckland', dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso)) : '';

const csvCell = (v) => {
  const s = String(v ?? '');
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const STATUS_ES = { pending: 'pendiente', sending: 'enviando', sent: 'enviado', skipped: 'no aplica', failed: 'fallido' };

export function registrationsCsv(rows, newsletterRows = []) {
  const subs = new Set(newsletterRows.filter((n) => !n.unsubscribed_at).map((n) => n.email_normalized));
  const header = ['Nombre', 'Email', 'Inscripción (hora NZ)', 'Confirmación', 'Recordatorio 24 h', 'Recordatorio 2 h', 'Quiere novedades'];
  const lines = rows.map((r) => [
    r.name, r.email, nzDate(r.created_at),
    STATUS_ES[r.confirmation_status] || r.confirmation_status,
    STATUS_ES[r.reminder_24h_status] || r.reminder_24h_status,
    STATUS_ES[r.reminder_2h_status] || r.reminder_2h_status,
    subs.has(r.email_normalized) ? 'sí' : 'no',
  ]);
  return '\uFEFF' + [header, ...lines].map((l) => l.map(csvCell).join(';')).join('\r\n');
}

export function newsletterCsv(rows) {
  const header = ['Nombre', 'Email', 'Alta (hora NZ)', 'Origen'];
  const lines = rows.filter((r) => !r.unsubscribed_at).map((r) => [r.name, r.email, nzDate(r.consented_at), r.source]);
  return '\uFEFF' + [header, ...lines].map((l) => l.map(csvCell).join(';')).join('\r\n');
}
