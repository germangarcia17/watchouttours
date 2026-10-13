// Conexiones reales para Supabase Edge Functions (Deno): base de datos y Brevo.
// SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY los pone Supabase automáticamente en cada función.
import { createClient } from 'npm:@supabase/supabase-js@2';

const R = 'live_event_registrations';
export const env = (name) => Deno.env.get(name);

export function supabaseDb({ url, serviceKey }) {
  const sb = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const must = ({ data, error }) => {
    if (error) throw Object.assign(new Error(error.message), { code: error.code === '23505' ? 'DUPLICATE' : error.code });
    return data;
  };
  return {
    async getEvent(slug) { return must(await sb.from('live_events').select('*').eq('slug', slug).maybeSingle()); },
    async listActiveEvents(sinceIso) { return must(await sb.from('live_events').select('*').gte('starts_at', sinceIso)); },
    async findRegistration(slug, emailNorm) {
      return must(await sb.from(R).select('*').eq('event_slug', slug).eq('email_normalized', emailNorm).maybeSingle());
    },
    async insertRegistration(row) { return must(await sb.from(R).insert(row).select().single()); },
    async update(id, patch) { must(await sb.from(R).update(patch).eq('id', id)); },
    async claim(id, field, from, to) {
      const data = must(await sb.from(R).update({ [field]: to }).eq('id', id).eq(field, from).select('id'));
      return data.length === 1;
    },
    async listByStatus(slug, field, statuses, createdBeforeIso) {
      let q = sb.from(R).select('*').eq('event_slug', slug).in(field, statuses).order('created_at').limit(1000);
      if (createdBeforeIso) q = q.lt('created_at', createdBeforeIso);
      return must(await q);
    },
    async listRegistrations(slug) { return must(await sb.from(R).select('*').eq('event_slug', slug).order('created_at')); },
    async listNewsletter() { return must(await sb.from('newsletter_subscribers').select('*').order('consented_at')); },
    async upsertNewsletter(row) { must(await sb.from('newsletter_subscribers').upsert(row, { onConflict: 'email_normalized' })); },
  };
}

export function brevoMailer({ apiKey, senderEmail, senderName, replyTo, fetchImpl = fetch }) {
  return {
    async send({ to, subject, html, text, tags }) {
      const res = await fetchImpl('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          replyTo: { email: replyTo || senderEmail, name: senderName },
          to: [{ email: to.email, name: to.name }],
          subject, htmlContent: html, textContent: text, tags,
        }),
      });
      if (!res.ok) throw new Error(`Brevo ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`);
      return res.json().catch(() => ({}));
    },
  };
}

export function makeDeps({ slug } = {}) {
  const need = (n) => {
    const v = env(n);
    if (!v) throw new Error(`Falta el secreto ${n} en Supabase`);
    return v;
  };
  return {
    db: supabaseDb({ url: need('SUPABASE_URL'), serviceKey: need('SUPABASE_SERVICE_ROLE_KEY') }),
    mailer: brevoMailer({
      apiKey: need('BREVO_API_KEY'),
      senderEmail: need('SENDER_EMAIL'),
      senderName: need('SENDER_NAME'),
      replyTo: env('REPLY_TO_EMAIL') || need('SENDER_EMAIL'),
    }),
    config: { slug: slug || need('DIRECTO_SLUG'), whatsapp: env('WHATSAPP_NUMBER') || '+64 27 267 7006' },
  };
}
