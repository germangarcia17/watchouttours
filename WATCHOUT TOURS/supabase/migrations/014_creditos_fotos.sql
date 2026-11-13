-- WatchOut Tours — Crédito de cada foto (fotos de Tourism New Zealand)
--
-- Añade a site_images la columna credito, que se edita en /admin/imagenes.
-- Se guarda sin prefijo ("Miles Holden / Tourism New Zealand") y la web lo
-- muestra como "Foto: …" / "Photo: …" debajo de la foto, fuera de ella.
-- Vacío ('') = foto propia, sin crédito. A null = la web usa el crédito por
-- defecto del código (src/lib/creditos.js).
-- Ejecutar una vez en el SQL Editor de Supabase. No pisa créditos ya
-- escritos a mano.

alter table site_images add column if not exists credito text;

insert into site_images (section, key, credito) values
  ('home', 'pais-panoramica',   'Miles Holden / Tourism New Zealand'),
  ('home', 'pais-vertical',     'Miles Holden / Tourism New Zealand'),
  ('home', 'panel-privado',     'Miles Holden / Tourism New Zealand'),
  ('home', 'panel-sesenta',     'Miles Holden / Tourism New Zealand'),
  ('home', 'salida-foto',       'Miles Holden / Tourism New Zealand'),
  ('home', 'tiaki-tohu',        'Tiaki: Tourism New Zealand'),
  ('home', 'destino-aoraki',    'Miles Holden / Tourism New Zealand'),
  ('home', 'destino-kaikoura',  'Miles Holden / Tourism New Zealand'),
  ('home', 'destino-waitomo',   'Shaun Jeffers / Tourism New Zealand'),
  ('home', 'galeria-01',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-04',        'Eric Hanson / Tourism New Zealand'),
  ('home', 'galeria-06',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-07',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-08',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-09',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-10',        'Miles Holden / Tourism New Zealand'),
  ('home', 'galeria-11',        'Miles Holden / Tourism New Zealand'),
  ('home', 'cierre',            'Miles Holden / Tourism New Zealand')
on conflict (section, key) do update
  set credito = excluded.credito
  where site_images.credito is null;

-- Fotos propias: sin crédito
update site_images set credito = ''
where section = 'home' and credito is null
  and key in ('panel-ciegos', 'destino-rotorua', 'destino-queenstown', 'galeria-02', 'galeria-03', 'galeria-05', 'galeria-12', 'nosotras');

-- Comprobación:
-- select key, credito from site_images where section = 'home' order by key;
