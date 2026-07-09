-- WatchOut! Sensory Tours — Correcciones RLS tras auditoría de políticas
-- Ejecutar en el SQL Editor de Supabase.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. seo_metadata: solo tenía política de LECTURA.
--    Sin política de escritura, o el panel SEO no puede guardar (si RLS
--    está activo) o la tabla está abierta (si RLS está desactivado).
--    Esto activa RLS y permite gestionar solo a usuarios autenticados.
-- ═══════════════════════════════════════════════════════════════════════
alter table seo_metadata enable row level security;

drop policy if exists "Authenticated can manage seo" on seo_metadata;
create policy "Authenticated can manage seo"
  on seo_metadata for all
  to authenticated
  using (true)
  with check (true);

-- ═══════════════════════════════════════════════════════════════════════
-- 2. site_images tenía DOS políticas de lectura idénticas. Quitamos la
--    duplicada y dejamos solo "Public can read site images".
-- ═══════════════════════════════════════════════════════════════════════
drop policy if exists "Lectura pública" on site_images;

-- ═══════════════════════════════════════════════════════════════════════
-- Comprobación: vuelve a ejecutar esto y confirma que cada tabla tiene
-- exactamente una política de lectura pública y una de gestión (ALL):
--   select tablename, policyname, roles, cmd
--   from pg_policies
--   where tablename in ('blog_posts','resenas','site_images','seo_metadata')
--   order by tablename, cmd;
-- ═══════════════════════════════════════════════════════════════════════
