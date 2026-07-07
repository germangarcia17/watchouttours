-- WatchOut! Sensory Tours — bucket de imágenes
-- Ejecutar en el SQL Editor de Supabase

-- ─── BUCKET PÚBLICO ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'imagenes',
  'imagenes',
  true,
  5242880, -- 5 MB por archivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif']
)
on conflict (id) do nothing;

-- ─── POLÍTICAS DE ACCESO ────────────────────────────────────────────────────
-- Lectura pública (el sitio muestra las imágenes a cualquier visitante)
create policy "Public can read imagenes"
  on storage.objects for select
  using (bucket_id = 'imagenes');

-- NOTA: el panel de admin usa una sesión propia (RPC check_admin_credentials)
-- sobre la clave anon, no Supabase Auth. Por eso la subida se permite al rol
-- anon, limitada a este bucket. El bucket valida tipo MIME y tamaño (5 MB).
create policy "Anon can upload imagenes"
  on storage.objects for insert
  with check (bucket_id = 'imagenes');

create policy "Anon can update imagenes"
  on storage.objects for update
  using (bucket_id = 'imagenes')
  with check (bucket_id = 'imagenes');

create policy "Anon can delete imagenes"
  on storage.objects for delete
  using (bucket_id = 'imagenes');
