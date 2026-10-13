// BD y correo simulados para las pruebas.
export const EVENT = {
  slug: 'prueba', title: 'Descubre Nueva Zelanda con todos los sentidos',
  starts_at: '2026-10-24T19:00:00Z', duration_minutes: 60, teams_url: 'https://teams.live.com/meet/PRUEBA', is_open: true,
};
export function memoryDeps(event = EVENT) {
  const regs = [], news = new Map(), sent = []; let id = 0;
  const db = {
    async getEvent(s) { return s === event.slug ? event : null; },
    async listActiveEvents(since) { return Date.parse(event.starts_at) >= Date.parse(since) ? [event] : []; },
    async findRegistration(s, n) { const r = regs.find((x) => x.event_slug === s && x.email_normalized === n); return r ? { ...r } : null; },
    async insertRegistration(row) {
      if (regs.some((r) => r.event_slug === row.event_slug && r.email_normalized === row.email_normalized)) throw Object.assign(new Error('dup'), { code: 'DUPLICATE' });
      const f = { id: String(++id), confirmation_attempts: 0, reminder_24h_attempts: 0, reminder_2h_attempts: 0, ...row }; regs.push(f); return { ...f };
    },
    async update(i, p) { Object.assign(regs.find((r) => r.id === i), p); },
    async claim(i, f, a, b) { const r = regs.find((x) => x.id === i); if (r[f] !== a) return false; r[f] = b; return true; },
    async listByStatus(s, f, st, before) { return regs.filter((r) => r.event_slug === s && st.includes(r[f]) && (!before || r.created_at < before)).map((r) => ({ ...r })); },
    async listRegistrations() { return regs.map((r) => ({ ...r })); },
    async listNewsletter() { return [...news.values()]; },
    async upsertNewsletter(row) { news.set(row.email_normalized, row); },
  };
  const mailer = { async send(m) { sent.push({ to: m.to.email, subject: m.subject, kind: m.tags[2] }); } };
  return { regs, news, sent, makeDeps: ({ slug } = {}) => ({ db, mailer, config: { slug: slug || 'prueba' } }) };
}
