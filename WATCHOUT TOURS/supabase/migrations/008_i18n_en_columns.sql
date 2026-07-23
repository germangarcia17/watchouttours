-- Watchout Tours — Contenido bilingüe (fase 3)
-- Añade columnas en inglés al contenido gestionable desde el admin.
-- Si una columna _en está vacía, el sitio muestra el texto en español
-- (la lógica de respaldo vive en el frontend). Ejecutar en el SQL Editor.

-- ── Artículos del blog ──────────────────────────────────────
alter table blog_posts
  add column if not exists title_en            text,
  add column if not exists excerpt_en          text,
  add column if not exists content_en          text,
  add column if not exists meta_title_en        text,
  add column if not exists meta_description_en  text,
  add column if not exists keywords_en          text,
  add column if not exists cover_image_alt_en   text;

-- ── Reseñas ────────────────────────────────────────────────
alter table resenas
  add column if not exists content_en         text,
  add column if not exists author_context_en  text;

-- ── Metadatos SEO de las páginas principales ───────────────
alter table seo_metadata
  add column if not exists meta_title_en          text,
  add column if not exists meta_description_en     text,
  add column if not exists keywords_en             text,
  add column if not exists og_title_en             text,
  add column if not exists og_description_en       text,
  add column if not exists twitter_title_en        text,
  add column if not exists twitter_description_en  text;
