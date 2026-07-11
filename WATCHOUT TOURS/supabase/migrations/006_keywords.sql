-- WatchOut! Sensory Tours — Columna de palabras clave (keywords)
-- Ejecutar en el SQL Editor de Supabase.
-- Guarda una lista de palabras clave separadas por coma para la
-- etiqueta <meta name="keywords">.

alter table blog_posts   add column if not exists keywords text;
alter table seo_metadata add column if not exists keywords text;
