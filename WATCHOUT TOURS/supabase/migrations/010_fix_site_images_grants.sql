-- Watchout Tours — Arreglo de permisos para site_images
-- Ejecutar en el SQL Editor de Supabase.
-- Deja site_images con: lectura pública + escritura solo autenticados (el
-- panel /admin/imagenes). Es idempotente: puedes ejecutarlo aunque ya
-- hayas corrido las migraciones anteriores.

-- ── Permisos de tabla (por si el rol no los tenía) ──────────────────────
grant select on site_images to anon, authenticated;
grant insert, update, delete on site_images to authenticated;

-- ── RLS activado ───────────────────────────────────────────────────────
alter table site_images enable row level security;

-- ── Lectura pública (la web muestra las imágenes a cualquiera) ──────────
drop policy if exists "Public can read site images" on site_images;
create policy "Public can read site images"
  on site_images for select
  to anon, authenticated
  using (true);

-- ── Escritura solo para usuarios autenticados (el panel de admin) ───────
drop policy if exists "Authenticated users can manage site images" on site_images;
create policy "Authenticated users can manage site images"
  on site_images for all
  to authenticated
  using (true)
  with check (true);

-- ── Foto nueva del hero de home ──────────────────────────────────────────
-- El hero de Home tenía guardada en site_images la foto antigua de
-- Aoraki / Mount Cook, que tapaba a la nueva imagen empaquetada en el
-- código (el géiser Pōhutu, Te Puia, Rotorua) — por eso se veía un
-- parpadeo: carga la nueva y al momento la sustituye por la de la BD.
-- Al quitar el src guardado, el hero vuelve a usar la imagen del código
-- (ya actualizada) y su alt bilingüe. Si más adelante se sube otra foto
-- desde /admin/imagenes, esta fila se rellenará de nuevo con esa URL.
update site_images
  set src = null
where section = 'home' and key = 'hero';

-- ── Comprobación ───────────────────────────────────────────────────────
-- select policyname, roles, cmd from pg_policies where tablename = 'site_images';
-- select section, key, src from site_images where section = 'home' and key = 'hero';
