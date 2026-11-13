-- WatchOut Tours — Huecos de imagen de Viajes +60 y Más allá de la vista
--
-- Rediseño de /sin-prisa y /mas-alla-de-la-vista con el sistema editorial de
-- la home. Crea una fila por hueco para que aparezcan en /admin/imagenes con
-- su texto alternativo (ES / EN) y su crédito. Con src = null la web usa la
-- foto por defecto del proyecto o, si no la hay, deja el bloque gris.
-- Requiere la migración 014 (columna credito).
-- Ejecutar una vez en el SQL Editor de Supabase. No pisa filas existentes.

insert into site_images (section, key, src, image_alt, image_alt_en, credito) values
  ('sin-prisa', 'sesenta-portada', null,
   'Una lancha navega entre icebergs en el lago glaciar Tasman, con montañas nevadas al fondo',
   'A boat weaves between icebergs on Tasman Glacier Lake, beneath snowy peaks',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-hobbiton', null,
   'Vista de las colinas de Hobbiton a través de una puerta redonda',
   'The hills of Hobbiton seen through a round hobbit door',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-rotorua', null,
   'Viajeros pasean por una pasarela de madera entre fumarolas y vapor geotérmico en Rotorua',
   'Travellers stroll along a boardwalk through geothermal steam in Rotorua',
   'Miles Holden / Tourism New Zealand'),
  ('sin-prisa', 'sesenta-kaikoura', null,
   'La cola de un cachalote se alza sobre el mar de Kaikōura',
   'A sperm whale''s tail rises from the sea off Kaikōura',
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
   'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes',
   'A traveller with a white cane and a companion holding a recording microphone beside a wooden fence where several sheep peer out, on a farm among green hills',
   ''),
  ('mas-alla-de-la-vista', 'cultura', null,
   'Joven maorí realizando un haka en una presentación cultural, con collar tradicional de hueso y falda piupiu, sacando la lengua en un gesto de desafío ceremonial',
   'Young Māori man performing a haka at a cultural show, wearing a traditional bone necklace and piupiu skirt, pulling out his tongue in a ceremonial gesture of challenge',
   '')
on conflict (section, key) do nothing;

-- Huecos que ya no usa ninguna página
delete from site_images
where (section = 'sin-prisa' and key in ('hero', 'para-quien', 'privado', 'solo', 'familia'))
   or (section = 'mas-alla-de-la-vista' and key in ('hero', 'como-viajamos'));

-- Comprobación:
-- select section, key, credito from site_images
-- where section in ('sin-prisa', 'mas-alla-de-la-vista') order by section, key;
