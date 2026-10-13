import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inscripcionHandler, eventoHandler, recordatoriosHandler, exportarHandler } from '../supabase/functions/_shared/http.mjs';
import { memoryDeps } from './memoria.mjs';

const ENV = { CRON_SECRET: 's'.repeat(32), EXPORT_TOKEN: 't'.repeat(32), SITE_URL: 'https://watchouttours.nz' };
const env = (n) => ENV[n];
const silent = { error() {}, log() {} };
const NOW = () => new Date('2026-10-14T08:00:00Z');
const BASE = 'https://ref.supabase.co/functions/v1/';

test('CORS: la web puede llamar, otras webs no', async () => {
  const d = memoryDeps(); const h = eventoHandler({ makeDeps: d.makeDeps, env, now: NOW, log: silent });
  const pre = await h(new Request(BASE + 'directo-evento', { method: 'OPTIONS', headers: { origin: 'https://watchouttours.nz' } }));
  assert.equal(pre.status, 204); assert.equal(pre.headers.get('access-control-allow-origin'), 'https://watchouttours.nz');
  const ajena = await h(new Request(BASE + 'directo-evento', { headers: { origin: 'https://malvada.com' } }));
  assert.equal(ajena.headers.get('access-control-allow-origin'), null);
});

test('evento: devuelve fecha y título, nunca el enlace de Teams', async () => {
  const d = memoryDeps(); const h = eventoHandler({ makeDeps: d.makeDeps, env, now: NOW, log: silent });
  const r = await h(new Request(BASE + 'directo-evento', { headers: { origin: 'https://watchouttours.nz' } }));
  const txt = await r.text(); const j = JSON.parse(txt);
  assert.equal(j.ok, true); assert.equal(j.open, true); assert.equal(j.starts_at, '2026-10-24T19:00:00Z');
  assert.doesNotMatch(txt, /teams/);
});

test('inscripción JSON y envío sin JavaScript (redirige a la web)', async () => {
  const d = memoryDeps(); const h = inscripcionHandler({ makeDeps: d.makeDeps, env, now: NOW, log: silent });
  const r1 = await h(new Request(BASE + 'directo-inscripcion', { method: 'POST', headers: { origin: 'https://watchouttours.nz', 'content-type': 'application/json' }, body: JSON.stringify({ nombre: 'Ana', email: 'ana@x.com', novedades: true }) }));
  assert.equal(r1.status, 200); assert.equal((await r1.json()).ok, true);
  const fd = new URLSearchParams({ nombre: 'Leo', email: 'leo@x.com' });
  const r2 = await h(new Request(BASE + 'directo-inscripcion', { method: 'POST', body: fd }));
  assert.equal(r2.status, 303); assert.equal(r2.headers.get('location'), 'https://watchouttours.nz/directo/?ok=1#inscripcion');
  const r3 = await h(new Request(BASE + 'directo-inscripcion', { method: 'POST', body: new URLSearchParams({ nombre: '', email: 'x' }) }));
  assert.match(r3.headers.get('location'), /error=Escribe%20tu%20nombre/);
  assert.equal(d.regs.length, 2); assert.equal(d.news.size, 1); assert.equal(d.sent.length, 2);
});

test('recordatorios: sin el secreto correcto no hace nada', async () => {
  const d = memoryDeps(); const h = recordatoriosHandler({ makeDeps: d.makeDeps, env, now: NOW, log: silent });
  assert.equal((await h(new Request(BASE + 'directo-recordatorios', { method: 'POST' }))).status, 401);
  assert.equal((await h(new Request(BASE + 'directo-recordatorios', { method: 'POST', headers: { 'x-cron-secret': 'mal' } }))).status, 401);
  const ok = await h(new Request(BASE + 'directo-recordatorios', { method: 'POST', headers: { 'x-cron-secret': ENV.CRON_SECRET } }));
  assert.equal(ok.status, 200);
});

test('exportar: CSV solo con la contraseña', async () => {
  const d = memoryDeps(); const ins = inscripcionHandler({ makeDeps: d.makeDeps, env, now: NOW, log: silent });
  await ins(new Request(BASE, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nombre: 'Ana', email: 'ana@x.com' }) }));
  const h = exportarHandler({ makeDeps: d.makeDeps, env });
  assert.equal((await h(new Request(BASE + 'directo-exportar?token=mal'))).status, 401);
  const r = await h(new Request(BASE + 'directo-exportar?lista=inscritos&token=' + ENV.EXPORT_TOKEN));
  assert.equal(r.status, 200); const buf = new Uint8Array(await r.arrayBuffer());
  assert.deepEqual([...buf.slice(0, 3)], [0xef, 0xbb, 0xbf], 'BOM para que Excel lea las tildes');
  const csv = new TextDecoder().decode(buf);
  assert.match(csv, /^Nombre;Email/); assert.match(csv, /Ana;ana@x\.com/);
});
