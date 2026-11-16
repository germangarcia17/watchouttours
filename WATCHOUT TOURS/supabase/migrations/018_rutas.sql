-- WatchOut Tours — Rutas de autor
--
-- 1. seo_metadata admite la página /rutas ('rutas') y una fila por ruta
--    ('ruta-<slug>', ver src/data/rutas.js), para editarlas en /admin/seo.
-- 2. Nueva descripción de la home (especialistas en Nueva Zelanda), igual a
--    la del código.
-- 3. Tabla solicitudes_rutas: copia de cada solicitud del formulario
--    «Recibe el itinerario completo» de las páginas de ruta (el aviso llega
--    también por correo). El público solo puede insertar; el panel de admin
--    (usuario autenticado) solo puede leer.
-- 4. Huecos de imagen de la sección "rutas" en /admin/imagenes.
-- Ejecutar una vez en el SQL Editor de Supabase.

alter table seo_metadata drop constraint if exists seo_metadata_page_type_check;
alter table seo_metadata add constraint seo_metadata_page_type_check check (
  page_type in (
    'home', 'rutas', 'productos', 'sin-prisa', 'mas-alla-de-la-vista', 'sobre-nosotras', 'blog', 'blog_post',
    'reseñas', 'contacto', 'accesibilidad', 'privacidad', 'aviso-legal', 'blind-travel-new-zealand'
  )
  or page_type ~ '^ruta-[a-z0-9-]+$'
);

update seo_metadata set
  meta_description = 'Especialistas en Nueva Zelanda: rutas de autor y viajes a medida para parejas, familias, amantes de la naturaleza, del lujo y del esquí. Con nuestras fundadoras como anfitrionas o en self drive.',
  og_description = 'Especialistas en Nueva Zelanda: rutas de autor y viajes a medida para parejas, familias, amantes de la naturaleza, del lujo y del esquí. Con nuestras fundadoras como anfitrionas o en self drive.',
  meta_description_en = 'New Zealand specialists: signature routes and bespoke journeys for couples, families and lovers of nature, luxury and skiing. Hosted by our founders or self-drive.',
  og_description_en = 'New Zealand specialists: signature routes and bespoke journeys for couples, families and lovers of nature, luxury and skiing. Hosted by our founders or self-drive.'
where page_type = 'home';

create table if not exists solicitudes_rutas (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  ruta         text not null check (char_length(ruta) <= 80),
  nombre       text not null check (char_length(nombre) between 2 and 100),
  email        text not null check (char_length(email) <= 254),
  fechas       text check (char_length(fechas) <= 200),
  viajeros     text check (char_length(viajeros) <= 10),
  modalidad    text check (char_length(modalidad) <= 40),
  ampliacion   boolean not null default false,
  comentarios  text check (char_length(comentarios) <= 2000),
  idioma       text not null default 'es' check (idioma in ('es', 'en'))
);

alter table solicitudes_rutas enable row level security;

drop policy if exists "Public can insert solicitudes rutas" on solicitudes_rutas;
create policy "Public can insert solicitudes rutas"
  on solicitudes_rutas for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated can read solicitudes rutas" on solicitudes_rutas;
create policy "Authenticated can read solicitudes rutas"
  on solicitudes_rutas for select
  to authenticated
  using (true);

grant insert on solicitudes_rutas to anon;
grant select, insert on solicitudes_rutas to authenticated;

insert into site_images (section, key, src, image_alt, image_alt_en, credito)
select 'rutas', k, null, null, null, ''
from unnest(array[
  'rutas-portada', 'ampliacion-cook', 'ampliacion-australia',
  'ruta-isla-norte-portada', 'ruta-isla-norte-momento', 'ruta-isla-sur-portada', 'ruta-isla-sur-momento', 'ruta-esencial-portada', 'ruta-esencial-momento', 'ruta-de-punta-a-punta-portada', 'ruta-de-punta-a-punta-momento', 'ruta-luna-de-miel-portada', 'ruta-luna-de-miel-momento', 'ruta-esqui-portada', 'ruta-esqui-momento', 'ruta-gran-lujo-portada', 'ruta-gran-lujo-momento', 'ruta-tierra-media-portada', 'ruta-tierra-media-momento'
]) as k
on conflict (section, key) do nothing;

-- Comprobación:
-- select count(*) from site_images where section = 'rutas';
-- select page_type, meta_description from seo_metadata where page_type = 'home';
