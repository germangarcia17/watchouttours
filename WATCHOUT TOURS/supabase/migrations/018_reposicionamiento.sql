-- WatchOut Tours — Reposicionamiento: agencia de viajes de autor
--
-- Sustituye a la antigua 018_rutas.sql (no llegó a ejecutarse): las rutas
-- publicadas se han retirado y esta migración no crea nada para ellas (ni
-- page_types de ruta, ni la tabla solicitudes_rutas, ni huecos "rutas").
--
-- 1. seo_metadata admite la nueva página /viajes ('viajes'). La página de
--    personas ciegas conserva su clave interna 'mas-alla-de-la-vista'.
-- 2. Título y descripción (ES y EN, también og:) de la home, /viajes, la
--    página de personas ciegas y Fundadoras, iguales a los textos del código.
-- 3. Imágenes solo en el repositorio: site_images.src y las portadas del
--    diario pasan de la ruta antigua /media/site/<nombre>.webp al nombre de
--    la imagen en src/data/imagenes.json (la web ya entiende las dos, así
--    que el orden del despliegue no importa). La og:image del diario se
--    vacía: se usa la portada. La columna antigua storage_path se vacía.
-- 4. Huecos de imagen de la nueva sección "viajes" en /admin/imagenes.
-- 5. La portada de la página de personas ciegas tenía foto pero no texto
--    alternativo: se le pone (el mismo que la foto 02 de la galería).
-- Ejecutar una vez en el SQL Editor de Supabase, al fusionar en main.

alter table seo_metadata drop constraint if exists seo_metadata_page_type_check;
alter table seo_metadata add constraint seo_metadata_page_type_check check (page_type in (
  'home', 'viajes', 'productos', 'sin-prisa', 'mas-alla-de-la-vista', 'sobre-nosotras', 'blog', 'blog_post',
  'reseñas', 'contacto', 'accesibilidad', 'privacidad', 'aviso-legal', 'blind-travel-new-zealand'
));

create temporary table seo_nuevo (page_type text, t text, d text, t_en text, d_en text) on commit drop;
insert into seo_nuevo values
  ('home',
   'WatchOut Tours · Agencia de viajes de autor en Nueva Zelanda',
   'Agencia de viajes de autor especializada en Nueva Zelanda. Lunas de miel, viajes en familia, lujo, esquí, salidas en grupo y viajes a medida, diseñados al detalle desde Nueva Zelanda.',
   'WatchOut Tours · Bespoke travel agency in New Zealand',
   'A bespoke travel agency specialising in New Zealand. Honeymoons, family journeys, luxury, skiing, group departures and tailor-made trips, designed in every detail from New Zealand.'),
  ('viajes',
   'Viajes de autor a medida por Nueva Zelanda · WatchOut Tours',
   'Lunas de miel, viajes en familia, extra lujo, esquí, naturaleza, cultura maorí, viajes +60 y para personas ciegas. Diseñamos tu viaje a Nueva Zelanda al detalle.',
   'Bespoke tailor-made journeys through New Zealand · WatchOut Tours',
   'Honeymoons, family holidays, luxury, skiing, nature, Māori culture, 60+ journeys and travel for blind people. We design your New Zealand journey in every detail.'),
  ('mas-alla-de-la-vista',
   'Viajes para personas ciegas y con baja visión en Nueva Zelanda · WatchOut Tours',
   'Viajes a Nueva Zelanda para personas ciegas y con baja visión, en grupo o en privado: todo incluido, maquetas táctiles y acompañamiento las 24 horas.',
   'Travel for blind and low-vision people in New Zealand · WatchOut Tours',
   'New Zealand journeys for blind and low-vision travellers, in a group or privately: all inclusive, tactile models and round-the-clock hosting.'),
  ('sobre-nosotras',
   'Las fundadoras · WatchOut Tours',
   'Sylvie y Mónica dejaron Barcelona hace más de ocho años y hicieron de Nueva Zelanda su hogar. Hoy diseñan viajes de autor por el país que las enamoró.',
   'The founders · WatchOut Tours',
   'Sylvie and Mónica left Barcelona more than eight years ago and made New Zealand their home. Today they design bespoke journeys through the country they fell in love with.');

insert into seo_metadata (page_type)
select n.page_type from seo_nuevo n
where not exists (select 1 from seo_metadata s where s.page_type = n.page_type and s.blog_post_id is null);

update seo_metadata s set
  meta_title = n.t, og_title = n.t, meta_description = n.d, og_description = n.d,
  meta_title_en = n.t_en, og_title_en = n.t_en, meta_description_en = n.d_en, og_description_en = n.d_en
from seo_nuevo n
where s.page_type = n.page_type and s.blog_post_id is null;

update site_images
set src = regexp_replace(src, '^/media/site/([^/]+)\.(webp|jpe?g|png)$', '\1')
where src ~ '^/media/site/[^/]+\.(webp|jpe?g|png)$';

update site_images set storage_path = null where storage_path is not null;

update blog_posts
set cover_image_url = regexp_replace(cover_image_url, '^/media/site/([^/]+)\.(webp|jpe?g|png)$', '\1'),
    og_image_url = null
where cover_image_url ~ '^/media/site/[^/]+\.(webp|jpe?g|png)$';

insert into site_images (section, key, src, image_alt, image_alt_en, credito)
values
  ('viajes', 'viajes-portada', null, 'Aoraki / Mount Cook, nevado, sobre el agua turquesa del lago Pukaki', 'Snow-capped Aoraki / Mount Cook above the turquoise waters of Lake Pukaki', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-pareja', null, 'El árbol solitario del lago Wanaka, con kayaks en el agua en calma y montañas al fondo', 'The lone tree of Lake Wānaka, with kayaks on the still water and mountains beyond', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-familia', null, 'Un agujero hobbit con la puerta roja redonda, la valla de madera y el jardín en flor, en Hobbiton', 'A hobbit hole with a round red door, a wooden fence and a garden in bloom at Hobbiton', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-lujo', null, 'Un lago en calma con montañas nevadas al fondo, en la región de Queenstown', 'A calm lake beneath snow-capped mountains in the Queenstown region', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-esqui', null, null, null, ''),
  ('viajes', 'viajes-naturaleza', null, 'Dos personas saltan de alegría a orillas del lago Pukaki, frente a Aoraki / Mount Cook nevado', 'Two people leap for joy on the shore of Lake Pukaki, before snow-capped Aoraki / Mount Cook', 'Will Patino / Tourism New Zealand'),
  ('viajes', 'viajes-maori', null, 'Mujeres maoríes con vestimenta tradicional preparan comida con agua caliente junto a una casa tallada, en Rotorua', 'Māori women in traditional dress prepare food with hot water beside a carved house in Rotorua', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-sesenta', null, 'Viajeros pasean por una pasarela de madera entre fumarolas y vapor geotérmico en Rotorua', 'Travellers stroll along a boardwalk through geothermal steam in Rotorua', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'viajes-ciegos', null, 'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes', 'A traveller with a white cane and a companion holding a recording microphone by a wooden fence where several sheep lean over, on a farm among green hills', ''),
  ('viajes', 'viajes-amigos', null, 'Una lancha navega entre icebergs en el lago glaciar Tasman, con montañas nevadas al fondo', 'A boat weaves between icebergs on Tasman Glacier Lake, beneath snowy peaks', 'Miles Holden / Tourism New Zealand'),
  ('viajes', 'ampliacion-cook', null, null, null, ''),
  ('viajes', 'ampliacion-australia', null, null, null, '')
on conflict (section, key) do nothing;

update site_images set
  image_alt = 'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
  image_alt_en = 'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it'
where section = 'mas-alla-de-la-vista' and key = 'vista-portada' and coalesce(image_alt, '') = '';

-- Comprobación:
-- select page_type, meta_title from seo_metadata where blog_post_id is null order by 1;
-- select section, key, src from site_images order by 1, 2;
