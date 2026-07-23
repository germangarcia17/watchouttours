-- Watchout Tours — Texto alternativo bilingüe para las imágenes del sitio
-- Añade la versión en inglés del alt de las imágenes gestionadas desde
-- /admin/imagenes. Si image_alt_en está vacío, en la web en inglés se usa
-- el alt en español (respaldo en el frontend). Ejecutar en el SQL Editor.

alter table site_images
  add column if not exists image_alt_en text;
