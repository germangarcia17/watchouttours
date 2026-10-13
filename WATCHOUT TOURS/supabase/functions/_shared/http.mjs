// Manejadores HTTP de las funciones de Supabase (Request/Response estándar, testeables en Node).
import { register, runReminders, eventTimes, registrationsCsv, newsletterCsv } from './core.mjs';

const DEFAULT_ORIGINS = ['https://watchouttours.nz', 'https://www.watchouttours.nz', 'http://localhost:5173', 'http://localhost:8888'];
const SLUG_RE = /^[a-z0-9-]{3,60}$/;
const FALLO = 'No hemos podido completar la inscripción. Inténtalo de nuevo en un momento o escríbenos por WhatsApp al +64 27 267 7006.';

function cors(req, env) {
  const list = (env('ALLOWED_ORIGINS') || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allowed = list.length ? list : DEFAULT_ORIGINS;
  const origin = req.headers.get('origin');
  const h = { vary: 'Origin' };
  if (origin && allowed.includes(origin)) {
    h['access-control-allow-origin'] = origin;
    h['access-control-allow-methods'] = 'GET, POST, OPTIONS';
    h['access-control-allow-headers'] = 'content-type';
    h['access-control-max-age'] = '86400';
  }
  return h;
}

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });

function safeEqual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function inscripcionHandler({ makeDeps, env, now = () => new Date(), log = console }) {
  return async (req) => {
    const c = cors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c });
    if (req.method !== 'POST') return json(405, { ok: false, error: 'Método no permitido' }, c);
    const isForm = !(req.headers.get('content-type') || '').includes('application/json');
    const site = (env('SITE_URL') || 'https://watchouttours.nz').replace(/\/$/, '');
    const back = (qs) => Response.redirect(`${site}/directo/?${qs}#inscripcion`, 303);

    let input;
    try { input = isForm ? Object.fromEntries(await req.formData()) : await req.json(); }
    catch { return isForm ? back('error=' + encodeURIComponent('Datos no válidos.')) : json(400, { ok: false, error: 'Datos no válidos.' }, c); }

    const slug = SLUG_RE.test(String(input.evento || '')) ? input.evento : undefined;
    try {
      const { db, mailer, config } = makeDeps({ slug });
      const r = await register({ db, mailer, input, config, now: now(), log });
      if (isForm) {
        const msg = r.body.error || Object.values(r.body.errors || {})[0];
        return back(r.body.ok ? 'ok=1' : 'error=' + encodeURIComponent(msg || FALLO));
      }
      return json(r.status, r.body, c);
    } catch (err) {
      log.error('[directo] error en inscripción:', err?.message || err);
      return isForm ? back('error=' + encodeURIComponent(FALLO)) : json(500, { ok: false, error: FALLO }, c);
    }
  };
}

export function eventoHandler({ makeDeps, env, now = () => new Date(), log = console }) {
  return async (req) => {
    const c = cors(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c });
    const q = new URL(req.url).searchParams.get('evento');
    try {
      const { db, config } = makeDeps({ slug: SLUG_RE.test(q || '') ? q : undefined });
      const ev = await db.getEvent(config.slug);
      if (!ev) return json(404, { ok: false }, c);
      const { end } = eventTimes(ev);
      return json(200, {
        ok: true, slug: ev.slug, title: ev.title, starts_at: ev.starts_at,
        duration_minutes: ev.duration_minutes, open: ev.is_open && now().getTime() < end,
      }, { ...c, 'cache-control': 'public, max-age=60' });
    } catch (err) {
      log.error('[directo] error leyendo evento:', err?.message || err);
      return json(500, { ok: false }, c);
    }
  };
}

// Lo llama pg_cron cada 10 minutos con la cabecera x-cron-secret.
export function recordatoriosHandler({ makeDeps, env, now = () => new Date(), log = console }) {
  return async (req) => {
    const secret = env('CRON_SECRET');
    if (!secret || !safeEqual(req.headers.get('x-cron-secret') || '', secret)) return json(401, { ok: false });
    const { db, mailer, config } = makeDeps({ slug: 'todos' });
    const summary = await runReminders({ db, mailer, config, now: now(), log });
    log.log('[directo] recordatorios:', JSON.stringify(summary));
    return json(200, { ok: true, ...summary });
  };
}

export function exportarHandler({ makeDeps, env }) {
  return async (req) => {
    const p = new URL(req.url).searchParams;
    const expected = env('EXPORT_TOKEN');
    if (!expected || expected.length < 24 || !safeEqual(p.get('token') || '', expected)) {
      return new Response('No autorizado', { status: 401 });
    }
    const q = p.get('evento');
    const { db, config } = makeDeps({ slug: SLUG_RE.test(q || '') ? q : undefined });
    const lista = p.get('lista') === 'novedades' ? 'novedades' : 'inscritos';
    const news = await db.listNewsletter();
    const csv = lista === 'novedades' ? newsletterCsv(news) : registrationsCsv(await db.listRegistrations(config.slug), news);
    const file = lista === 'novedades' ? 'watchout-novedades.csv' : `watchout-inscritos-${config.slug}.csv`;
    return new Response(csv, {
      headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${file}"`, 'cache-control': 'no-store' },
    });
  };
}
