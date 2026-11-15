-- WatchOut Tours — SEO actualizado de todas las páginas
--
-- 1. La tabla solo admitía siete páginas: amplía la lista para que
--    /admin/seo pueda guardar el SEO de todas las páginas actuales.
-- 2. Escribe título, descripción, og:title y og:description (ES y EN) de las
--    páginas principales, iguales a los textos del código. Vacía el resto de
--    campos (palabras clave antiguas, Twitter, imagen y canónica), para que
--    se usen los del código: la canónica se calcula para cada idioma y la
--    og:image es la foto de la portada de cada página.
-- 3. Las demás páginas (reseñas, contacto, accesibilidad, legales y Blind
--    Travel) quedan con todos los campos vacíos: usan los textos del código.
-- Ejecutar una vez en el SQL Editor de Supabase.

alter table seo_metadata drop constraint if exists seo_metadata_page_type_check;
alter table seo_metadata add constraint seo_metadata_page_type_check check (page_type in (
  'home', 'productos', 'sin-prisa', 'mas-alla-de-la-vista', 'sobre-nosotras', 'blog', 'blog_post',
  'reseñas', 'contacto', 'accesibilidad', 'privacidad', 'aviso-legal', 'blind-travel-new-zealand'
));

insert into seo_metadata (page_type, meta_title, meta_description, meta_title_en, meta_description_en)
values
  ('home',
   'WatchOut Tours · Viajes de autor por Nueva Zelanda',
   'Viajes privados y salidas en grupo reducido por Nueva Zelanda, diseñados y acompañados por sus fundadoras, dos barcelonesas que viven en el país. Hoteles de 4 y 5 estrellas y experiencias privadas.',
   'WatchOut Tours · Bespoke journeys through New Zealand',
   'Private journeys and small-group departures through New Zealand, designed and hosted by their founders, two women from Barcelona who call the country home. 4- and 5-star hotels and private experiences.'),
  ('productos',
   'Viajes privados a medida por Nueva Zelanda · WatchOut Tours',
   'Tu viaje a Nueva Zelanda diseñado desde cero, en tus fechas: con nuestras fundadoras como anfitrionas o en self drive, con todo reservado y asistencia antes, durante y después.',
   'Private bespoke journeys through New Zealand · WatchOut Tours',
   'Your New Zealand journey designed from scratch, on your dates: hosted by our founders or self-drive, with everything booked and support before, during and after.'),
  ('sin-prisa',
   'Viajes +60 por Nueva Zelanda · WatchOut Tours',
   'El viaje de tu vida, con todo resuelto: grupo reducido, hoteles de 4 y 5 estrellas, desayuno y cena cada día, vehículo privado y dos anfitrionas que se adelantan a cada detalle.',
   '60+ Journeys through New Zealand · WatchOut Tours',
   'The journey of a lifetime, every detail taken care of: a small group, 4- and 5-star hotels, breakfast and dinner every day, a private vehicle and two hosts who anticipate every need.'),
  ('mas-alla-de-la-vista',
   'Viajes para personas ciegas y con baja visión · WatchOut Tours',
   'Aotearoa a través de los sentidos: viajes por Nueva Zelanda para personas ciegas y con baja visión, con todo incluido, maquetas táctiles y acompañamiento las 24 horas.',
   'Journeys for blind and low-vision travellers · WatchOut Tours',
   'Aotearoa through the senses: journeys through New Zealand for blind and low-vision travellers, all inclusive, with tactile models and round-the-clock hosting.'),
  ('sobre-nosotras',
   'Las fundadoras · WatchOut Tours',
   'Sylvie y Mónica dejaron Barcelona hace más de ocho años y hicieron de Nueva Zelanda su hogar. Hoy diseñan y acompañan viajes de autor por el país que las enamoró.',
   'The founders · WatchOut Tours',
   'Sylvie and Mónica left Barcelona more than eight years ago and made New Zealand their home. Today they design and host bespoke journeys through the country they fell in love with.'),
  ('blog',
   'Diario de viaje · Nueva Zelanda desde dentro · WatchOut Tours',
   'Historias, lugares y experiencias de Nueva Zelanda contadas desde dentro: rutas, cultura maorí, naturaleza y la promesa Tiaki.',
   'Travel journal · New Zealand from within · WatchOut Tours',
   'Stories, places and experiences from New Zealand, told from within: routes, Māori culture, nature and the Tiaki Promise.')
on conflict (page_type, blog_post_id) do update set
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  meta_title_en = excluded.meta_title_en,
  meta_description_en = excluded.meta_description_en;

-- og:title y og:description = título y descripción; el resto, vacío
update seo_metadata set
  og_title = meta_title, og_description = meta_description,
  og_title_en = meta_title_en, og_description_en = meta_description_en,
  keywords = null, keywords_en = null, canonical_url = null, og_image_url = null,
  twitter_title = null, twitter_description = null, twitter_image_url = null,
  twitter_title_en = null, twitter_description_en = null
where page_type in ('home', 'productos', 'sin-prisa', 'mas-alla-de-la-vista', 'sobre-nosotras', 'blog');

-- Páginas que usan los textos del código: todos los campos vacíos
update seo_metadata set
  meta_title = null, meta_description = null, keywords = null, canonical_url = null,
  og_title = null, og_description = null, og_image_url = null,
  twitter_title = null, twitter_description = null, twitter_image_url = null,
  meta_title_en = null, meta_description_en = null, keywords_en = null,
  og_title_en = null, og_description_en = null,
  twitter_title_en = null, twitter_description_en = null
where page_type in ('reseñas', 'contacto', 'accesibilidad', 'privacidad', 'aviso-legal', 'blind-travel-new-zealand');

-- Comprobación:
-- select page_type, meta_title, meta_title_en, og_title, canonical_url from seo_metadata
-- where page_type <> 'blog_post' order by page_type;
