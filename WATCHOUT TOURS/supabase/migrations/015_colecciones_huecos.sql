-- WatchOut Tours — Huecos de imagen de Viajes +60 y Más allá de la vista
--
-- Rediseño de /sin-prisa y /mas-alla-de-la-vista con el sistema editorial de
-- la home. Crea una fila por hueco para que aparezcan en /admin/imagenes con
-- su texto alternativo (ES / EN) y su crédito. Con src = null la web usa la
-- foto por defecto del proyecto o, si no la hay, deja el bloque gris.
-- vista-portada espera una foto nueva: su texto alternativo
-- y su crédito se escriben en el admin al subirla.
-- Requiere la migración 014 (columna credito).
-- Ejecutar una vez en el SQL Editor de Supabase. No pisa filas existentes.

insert into site_images (section, key, src, image_alt, image_alt_en, credito) values
  ('sin-prisa', 'sesenta-portada', null,
   'Cuatro caminantes recorren el valle Hooker entre la niebla, con las montañas nevadas de Aoraki / Mount Cook al fondo',
   'Four walkers follow the Hooker Valley Track through the mist, with the snowy peaks of Aoraki / Mount Cook beyond',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-hobbiton', null,
   'Un agujero hobbit con la puerta roja redonda, la valla de madera y el jardín en flor, en Hobbiton',
   'A hobbit hole with a round red door, a wooden fence and a garden in bloom at Hobbiton',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-rotorua', null,
   'Mujeres maoríes con vestimenta tradicional preparan comida con agua caliente junto a una casa tallada, en Rotorua',
   'Māori women in traditional dress prepare food with hot water beside a carved house in Rotorua',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-kaikoura', null,
   'La cola de un cachalote se sumerge en el mar de Kaikōura, con los Alpes nevados entre las nubes al fondo',
   'A sperm whale''s tail dives into the sea off Kaikōura, with the snowy Alps rising through the clouds beyond',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-anfitrionas', null,
   'Sylvie y Mónica, fundadoras de WatchOut Tours, sonriendo frente a un géiser humeante en Rotorua',
   'Sylvie and Mónica, founders of WatchOut Tours, smiling in front of a steaming geyser in Rotorua',
   ''),
  ('sin-prisa', 'sesenta-cierre', null,
   'El árbol solitario del lago Wanaka, con kayaks en el agua en calma y montañas al fondo',
   'The lone tree of Lake Wānaka, with kayaks on the still water and mountains beyond',
   'Miles Holden / Tourism New Zealand'),
  ('mas-alla-de-la-vista', 'vista-portada', null,
   null,
   null,
   ''),
  ('mas-alla-de-la-vista', 'vista-unico', null,
   'Una mano recorre los relieves de una talla maorí de madera en Te Puia, Rotorua',
   'A hand traces the relief of a carved Māori panel at Te Puia, Rotorua',
   'Graeme Murray / Tourism New Zealand'),
  ('mas-alla-de-la-vista', 'vista-vivir', null,
   'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes',
   'A traveller with a white cane and a companion holding a recording microphone beside a wooden fence where several sheep peer out, on a farm among green hills',
   '')
on conflict (section, key) do nothing;

-- Si alguno de estos huecos ya existía, se le ponen el texto alternativo y
-- el crédito de su foto actual
update site_images set image_alt = v.alt, image_alt_en = v.alt_en, credito = v.credito
from (values
  ('sin-prisa', 'sesenta-portada', 'Cuatro caminantes recorren el valle Hooker entre la niebla, con las montañas nevadas de Aoraki / Mount Cook al fondo', 'Four walkers follow the Hooker Valley Track through the mist, with the snowy peaks of Aoraki / Mount Cook beyond', 'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-hobbiton', 'Un agujero hobbit con la puerta roja redonda, la valla de madera y el jardín en flor, en Hobbiton', 'A hobbit hole with a round red door, a wooden fence and a garden in bloom at Hobbiton', 'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-rotorua', 'Mujeres maoríes con vestimenta tradicional preparan comida con agua caliente junto a una casa tallada, en Rotorua', 'Māori women in traditional dress prepare food with hot water beside a carved house in Rotorua', 'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-kaikoura', 'La cola de un cachalote se sumerge en el mar de Kaikōura, con los Alpes nevados entre las nubes al fondo', 'A sperm whale''s tail dives into the sea off Kaikōura, with the snowy Alps rising through the clouds beyond', 'Miles Holden / Tourism New Zealand'),
  ('mas-alla-de-la-vista', 'vista-unico', 'Una mano recorre los relieves de una talla maorí de madera en Te Puia, Rotorua', 'A hand traces the relief of a carved Māori panel at Te Puia, Rotorua', 'Graeme Murray / Tourism New Zealand')
) as v(section, key, alt, alt_en, credito)
where site_images.section = v.section and site_images.key = v.key;

-- Huecos que ya no usa ninguna página
delete from site_images
where (section = 'sin-prisa' and key in ('hero', 'para-quien', 'privado', 'solo', 'familia'))
   or (section = 'mas-alla-de-la-vista' and key in ('hero', 'como-viajamos', 'cultura'));

-- Comprobación:
-- select section, key, credito from site_images
-- where section in ('sin-prisa', 'mas-alla-de-la-vista') order by section, key;
