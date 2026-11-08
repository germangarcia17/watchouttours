-- Watchout Tours — Testimonios en vídeo accesibles
-- Ejecutar en el SQL Editor de Supabase (una sola vez).

-- 1. Imagen de portada, subtítulos (.vtt) y transcripción de cada vídeo
alter table resenas add column if not exists video_poster_url    text;
alter table resenas add column if not exists video_vtt_url       text;
alter table resenas add column if not exists video_transcript    text;
alter table resenas add column if not exists video_transcript_en text;

-- 2. El bucket acepta también subtítulos WebVTT (text/vtt)
update storage.buckets
set allowed_mime_types = array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'text/vtt'
  ]
where id = 'imagenes';
