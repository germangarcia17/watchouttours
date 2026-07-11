-- WatchOut! Sensory Tours — Arreglo del 403 al guardar SEO
-- Ejecutar en el SQL Editor de Supabase.
-- Deja seo_metadata con: lectura pública + escritura solo autenticados.
-- Es idempotente: puedes ejecutarlo aunque ya hayas corrido la 004.

-- ── Permisos de tabla (por si el rol no los tenía) ──────────────────────
grant select on seo_metadata to anon, authenticated;
grant insert, update, delete on seo_metadata to authenticated;

-- ── RLS activado ───────────────────────────────────────────────────────
alter table seo_metadata enable row level security;

-- ── Lectura pública (la web muestra los metadatos a cualquiera) ─────────
drop policy if exists "Lectura pública" on seo_metadata;
drop policy if exists "Public can read seo" on seo_metadata;
create policy "Public can read seo"
  on seo_metadata for select
  to anon, authenticated
  using (true);

-- ── Escritura solo para usuarios autenticados (el panel de admin) ───────
drop policy if exists "Authenticated can manage seo" on seo_metadata;
create policy "Authenticated can manage seo"
  on seo_metadata for all
  to authenticated
  using (true)
  with check (true);

-- ── Comprobación ───────────────────────────────────────────────────────
-- select policyname, roles, cmd from pg_policies where tablename = 'seo_metadata';
