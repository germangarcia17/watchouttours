-- Watchout Tours — Testimonios en vídeo
-- Ejecutar en el SQL Editor de Supabase.

-- 1. URL del vídeo corto del testimonio (opcional)
alter table resenas add column if not exists video_url text;

-- 2. El bucket de imágenes acepta también vídeo (para testimonios y blog)
--    y sube el límite a 60 MB por archivo.
update storage.buckets
set
  file_size_limit = 62914560, -- 60 MB
  allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
where id = 'imagenes';
