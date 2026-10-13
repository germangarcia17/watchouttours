// node --test test/  → simula inscripciones y el programador horario sin tocar Supabase ni Brevo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { register, runReminders, describeTimes, buildEmail, registrationsCsv, SUCCESS_MESSAGE } from '../supabase/functions/_shared/core.mjs';

// Evento de PRUEBA (no es el dato real): 24 oct 2026 21:00 Madrid = 25 oct 08:00 Auckland.
const EVENT = {
  slug: 'prueba', title: 'Descubre Nueva Zelanda con todos los sentidos',
  starts_at: '2026-10-24T19:00:00Z', duration_minutes: 60, teams_url: 'https://teams.live.com/meet/PRUEBA', is_open: true,
};
const START = Date.parse(EVENT.starts_at);
const H = 3600e3;
const at = (ms) => new Date(ms);
const silent = { error() {}, log() {} };

function memoryDb(event = EVENT) {
  const regs = []; const news = new Map(); let id = 0;
  return {
    regs, news,
    async getEvent(slug) { return slug === event.slug ? event : null; },
    async listActiveEvents(since) { return Date.parse(event.starts_at) >= Date.parse(since) ? [event] : []; },
    async findRegistration(slug, n) { return regs.find((r) => r.event_slug === slug && r.email_normalized === n) ? { ...regs.find((r) => r.event_slug === slug && r.email_normalized === n) } : null; },
    async insertRegistration(row) {
      if (regs.some((r) => r.event_slug === row.event_slug && r.email_normalized === row.email_normalized)) throw Object.assign(new Error('dup'), { code: 'DUPLICATE' });
      const full = { id: String(++id), confirmation_sent_at: null, confirmation_attempts: 0, reminder_24h_attempts: 0, reminder_2h_attempts: 0, ...row };
      regs.push(full); return { ...full };
    },
    async update(rid, patch) { Object.assign(regs.find((r) => r.id === rid), patch); },
    async claim(rid, f, from, to) { const r = regs.find((x) => x.id === rid); if (r[f] !== from) return false; r[f] = to; return true; },
    async listByStatus(slug, f, st, before) { return regs.filter((r) => r.event_slug === slug && st.includes(r[f]) && (!before || r.created_at < before)).map((r) => ({ ...r })); },
    async listRegistrations() { return regs.map((r) => ({ ...r })); },
    async listNewsletter() { return [...news.values()]; },
    async upsertNewsletter(row) { news.set(row.email_normalized, row); },
  };
}
function fakeMailer({ failTimes = 0 } = {}) {
  const sent = []; let fails = failTimes;
  return { sent, async send(m) { if (fails > 0) { fails--; throw new Error('Brevo 503'); } sent.push(m); } };
}
const cfg = { slug: 'prueba' };
const kinds = (m) => m.sent.map((s) => s.tags[2]);

test('inscripción temprana: confirmación al momento + 24 h + 2 h, sin repetir', async () => {
  const db = memoryDb(); const m = fakeMailer();
  const r = await register({ db, mailer: m, config: cfg, now: at(START - 10 * 24 * H), input: { nombre: 'Ana', email: 'Ana@Correo.com' }, log: silent });
  assert.equal(r.status, 200); assert.equal(r.body.message, SUCCESS_MESSAGE);
  assert.deepEqual(kinds(m), ['confirm']);
  assert.match(m.sent[0].text, /un día antes y otro dos horas antes/);
  for (const h of [30, 25]) await runReminders({ db, mailer: m, now: at(START - h * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm']);
  await runReminders({ db, mailer: m, now: at(START - 24 * H), log: silent });
  await runReminders({ db, mailer: m, now: at(START - 23 * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm', 'r24']);
  await runReminders({ db, mailer: m, now: at(START - 2 * H), log: silent });
  await runReminders({ db, mailer: m, now: at(START - 1 * H), log: silent });
  await runReminders({ db, mailer: m, now: at(START + 1 * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm', 'r24', 'r2']);
});

test('duplicados: mismo email con mayúsculas o espacios no crea otra fila', async () => {
  const db = memoryDb(); const m = fakeMailer(); const now = START - 5 * 24 * H;
  await register({ db, mailer: m, config: cfg, now: at(now), input: { nombre: 'Luis', email: 'luis@x.com' }, log: silent });
  await register({ db, mailer: m, config: cfg, now: at(now + 60e3), input: { nombre: 'Luis Pérez', email: '  LUIS@X.COM ' }, log: silent });
  assert.equal(db.regs.length, 1);
  assert.equal(db.regs[0].name, 'Luis Pérez');
  assert.equal(m.sent.length, 1, 'no reenvía si han pasado menos de 10 min');
  await register({ db, mailer: m, config: cfg, now: at(now + 15 * 60e3), input: { nombre: 'Luis Pérez', email: 'luis@x.com' }, log: silent });
  assert.equal(m.sent.length, 2, 'reenvía la confirmación pasados 10 min');
  assert.equal(db.regs.length, 1);
});

test('inscripción tardía (5 h antes): confirmación + solo el de 2 h', async () => {
  const db = memoryDb(); const m = fakeMailer();
  await register({ db, mailer: m, config: cfg, now: at(START - 5 * H), input: { nombre: 'Eva', email: 'eva@x.com' }, log: silent });
  assert.match(m.sent[0].text, /último recordatorio con el enlace dos horas antes/);
  assert.equal(db.regs[0].reminder_24h_status, 'skipped');
  await runReminders({ db, mailer: m, now: at(START - 2 * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm', 'r2']);
});

test('inscripción 1 h antes: solo confirmación', async () => {
  const db = memoryDb(); const m = fakeMailer();
  await register({ db, mailer: m, config: cfg, now: at(START - 1 * H), input: { nombre: 'Leo', email: 'leo@x.com' }, log: silent });
  await runReminders({ db, mailer: m, now: at(START - 0.5 * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm']);
  assert.doesNotMatch(m.sent[0].text, /Te mandaremos/);
});

test('inscripción con el directo empezado: email "entra ahora"; después de terminar: cerrado', async () => {
  const db = memoryDb(); const m = fakeMailer();
  await register({ db, mailer: m, config: cfg, now: at(START + 10 * 60e3), input: { nombre: 'Sol', email: 'sol@x.com' }, log: silent });
  assert.deepEqual(kinds(m), ['confirm_live']);
  const r = await register({ db, mailer: m, config: cfg, now: at(START + 61 * 60e3), input: { nombre: 'Tom', email: 'tom@x.com' }, log: silent });
  assert.equal(r.status, 409); assert.equal(db.regs.length, 1);
});

test('si el programador se salta horas, no manda dos recordatorios seguidos', async () => {
  const db = memoryDb(); const m = fakeMailer();
  await register({ db, mailer: m, config: cfg, now: at(START - 3 * 24 * H), input: { nombre: 'Ada', email: 'ada@x.com' }, log: silent });
  await runReminders({ db, mailer: m, now: at(START - 1.5 * H), log: silent });
  assert.deepEqual(kinds(m), ['confirm', 'r2']);
  assert.equal(db.regs[0].reminder_24h_status, 'skipped');
});

test('fallo de Brevo en la confirmación: se reintenta en la siguiente pasada', async () => {
  const db = memoryDb(); const m = fakeMailer({ failTimes: 1 });
  const r = await register({ db, mailer: m, config: cfg, now: at(START - 2 * 24 * H), input: { nombre: 'Rut', email: 'rut@x.com' }, log: silent });
  assert.equal(r.body.ok, true); assert.equal(m.sent.length, 0);
  assert.equal(db.regs[0].confirmation_status, 'pending');
  await runReminders({ db, mailer: m, now: at(START - 2 * 24 * H + H), log: silent });
  assert.deepEqual(kinds(m), ['confirm']); assert.equal(db.regs[0].confirmation_status, 'sent');
});

test('novedades: solo si marca la casilla, y en tabla aparte', async () => {
  const db = memoryDb(); const m = fakeMailer(); const now = at(START - 3 * 24 * H);
  await register({ db, mailer: m, config: cfg, now, input: { nombre: 'A', email: 'a@x.com' }, log: silent });
  await register({ db, mailer: m, config: cfg, now, input: { nombre: 'B', email: 'b@x.com', novedades: 'on' }, log: silent });
  assert.deepEqual([...db.news.keys()], ['b@x.com']);
  const csv = registrationsCsv(db.regs, [...db.news.values()]);
  assert.match(csv, /a@x\.com;.*;no\r?\n/); assert.match(csv, /b@x\.com;.*;sí$/);
});

test('campo trampa (bots) y validación', async () => {
  const db = memoryDb(); const m = fakeMailer(); const now = at(START - 3 * 24 * H);
  const bot = await register({ db, mailer: m, config: cfg, now, input: { nombre: 'X', email: 'x@x.com', web: 'spam' }, log: silent });
  assert.equal(bot.body.ok, true); assert.equal(db.regs.length, 0);
  const bad = await register({ db, mailer: m, config: cfg, now, input: { nombre: '', email: 'no-es-email' }, log: silent });
  assert.equal(bad.status, 422); assert.ok(bad.body.errors.nombre && bad.body.errors.email);
});

test('zonas horarias calculadas, no escritas a mano', () => {
  const t = describeTimes(EVENT);
  assert.equal(t.dateLine, 'Sábado, 24 de octubre de 2026');
  assert.equal(t.hourLine, '21:00 hora de España peninsular (UTC+2)');
  const get = (l) => t.rows.find((r) => r.label === l).value;
  assert.equal(get('Nueva Zelanda'), 'Domingo, 25 de octubre, 08:00');
  assert.equal(get('Canarias'), 'Sábado, 24 de octubre, 20:00');
  assert.equal(get('México (Ciudad de México)'), 'Sábado, 24 de octubre, 13:00');
  assert.equal(get('Argentina y Uruguay'), 'Sábado, 24 de octubre, 16:00');
  const e = buildEmail('confirm', { event: EVENT, row: { name: 'Ana <b>', reminder_24h_status: 'pending', reminder_2h_status: 'pending' } });
  assert.match(e.html, />Entrar al directo</); assert.match(e.html, /Ana &lt;b&gt;/); assert.match(e.text, /Entrar al directo: https:\/\/teams/);
});
