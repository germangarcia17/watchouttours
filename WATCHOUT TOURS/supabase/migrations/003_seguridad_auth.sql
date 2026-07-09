-- WatchOut! Sensory Tours — Migración de seguridad
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de crear el usuario admin
-- en Authentication → Users → "Add user" (email + contraseña, Auto Confirm).

-- ═══════════════════════════════════════════════════════════════════════
-- 1. ENDURECER EL BUCKET: solo usuarios autenticados pueden escribir
--    (la lectura sigue siendo pública: la web muestra las imágenes a todos)
-- ═══════════════════════════════════════════════════════════════════════
drop policy if exists "Anon can upload imagenes" on storage.objects;
drop policy if exists "Anon can update imagenes" on storage.objects;
drop policy if exists "Anon can delete imagenes" on storage.objects;

create policy "Authenticated can upload imagenes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagenes');

create policy "Authenticated can update imagenes"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'imagenes')
  with check (bucket_id = 'imagenes');

create policy "Authenticated can delete imagenes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagenes');

-- ═══════════════════════════════════════════════════════════════════════
-- 2. ELIMINAR EL LOGIN ANTIGUO: la función RPC era invocable por anon
--    sin límite de intentos (fuerza bruta). Ya no se usa.
--    Si da error de firma, mira el nombre exacto en Database → Functions.
-- ═══════════════════════════════════════════════════════════════════════
drop function if exists check_admin_credentials(text, text);
drop function if exists check_admin_credentials(p_email text, p_password text);

-- Si existía una tabla propia de credenciales, revísala y elimínala cuando
-- confirmes que el login nuevo funciona (descomenta la línea):
-- drop table if exists admin_users;

-- ═══════════════════════════════════════════════════════════════════════
-- 3. LIMPIAR POLÍTICAS PERMISIVAS AÑADIDAS A MANO (si las hay)
--    Las migraciones originales solo permiten escribir al rol authenticated.
--    Si en algún momento se añadió una política para anon desde el
--    dashboard, este bloque la detectará para que la revises:
-- ═══════════════════════════════════════════════════════════════════════
-- Ejecuta esto y revisa el resultado; borra con drop policy las que
-- permitan INSERT/UPDATE/DELETE a anon en blog_posts, resenas o site_images:
--   select schemaname, tablename, policyname, roles, cmd
--   from pg_policies
--   where tablename in ('blog_posts', 'resenas', 'site_images')
--   order by tablename;

-- ═══════════════════════════════════════════════════════════════════════
-- 4. SEMBRAR LAS IMÁGENES DEL SITIO
--    Con src = null la web usa la imagen empaquetada de siempre.
--    En cuanto subas una desde el panel de admin, la web mostrará la nueva.
-- ═══════════════════════════════════════════════════════════════════════
insert into site_images (section, key, src, image_alt) values
  ('home', 'hero', null,
   'Dos manos acercándose hasta casi tocarse, recortadas contra un cielo de atardecer'),
  ('home', 'nosotras', null,
   'Sylvie y Moni, guías de WatchOut!, sonriendo frente a un géiser humeante en Rotorua'),
  ('sobre-nosotras', 'hero', null,
   'Mónica y Sylvie sonriendo en un selfie frente a un géiser humeante en Rotorua, Nueva Zelanda')
on conflict (section, key) do nothing;
