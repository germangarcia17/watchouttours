-- WatchOut Tours — Huecos de imagen de la home (rediseño, fases 2 y 3)
--
-- Crea en site_images una fila por cada hueco de la home para que aparezcan
-- en /admin/imagenes y se pueda subir su foto y editar su texto alternativo
-- en español y en inglés. Con src = null la web usa la imagen por defecto
-- del proyecto o, si no la hay, deja el bloque gris.
-- (El hueco home/nosotras, el retrato de las fundadoras, ya existe desde la
-- migración 003.)
-- Ejecutar una vez en el SQL Editor de Supabase. No pisa filas existentes.
-- También se pueden crear una a una desde /admin/imagenes ("Imágenes
-- sugeridas"), sin ejecutar este archivo.

insert into site_images (section, key, src, image_alt, image_alt_en) values
  ('home', 'hero-poster', null,
   'Milford Sound, en Fiordland: decenas de cascadas bajan por las paredes del fiordo, cubiertas de selva y con las cumbres entre la niebla, y un pequeño barco navega a sus pies',
   'Milford Sound, Fiordland: dozens of waterfalls run down the rainforest-covered walls of the fiord, the peaks lost in mist, as a small boat sails below'),
  ('home', 'pais-vertical', null,
   'Una pequeña talla maorí entre helechos y vegetación nativa, iluminada por la luz que se filtra en el bosque',
   'A small carved Māori figure among ferns and native bush, lit by sunlight filtering through the forest'),
  ('home', 'pais-panoramica', null,
   'Aoraki / Mount Cook, nevado, sobre el agua turquesa del lago Pukaki',
   'Snow-capped Aoraki / Mount Cook above the turquoise waters of Lake Pukaki'),
  ('home', 'panel-privado', null,
   'El árbol solitario del lago Wanaka, con kayaks en el agua en calma y montañas al fondo',
   'The lone tree of Lake Wānaka, with kayaks on the still water and mountains beyond'),
  ('home', 'panel-sesenta', null,
   'Viajeros pasean por una pasarela de madera entre fumarolas y vapor geotérmico en Rotorua',
   'Travellers stroll along a boardwalk through geothermal steam in Rotorua'),
  ('home', 'panel-ciegos', null,
   'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes',
   'A traveller with a white cane and a companion holding a recording microphone by a wooden fence where several sheep lean over, on a farm among green hills'),
  ('home', 'salida-foto', null,
   'Una viajera abre los brazos en la proa de un barco mientras un cachalote sumerge la cola frente a la costa de Kaikōura',
   'A traveller opens her arms at the bow as a sperm whale dives off the Kaikōura coast'),
  ('home', 'tiaki-tohu', null,
   'Tohu de Tiaki, Care for New Zealand, sobre un delfín saltando en el mar',
   'Tiaki, Care for New Zealand, emblem over a dolphin leaping from the sea'),
  ('home', 'destino-rotorua', null,
   'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
   'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush'),
  ('home', 'destino-aoraki', null,
   'Un iceberg turquesa flota en un lago glaciar a los pies de las montañas de Aoraki / Mount Cook',
   'A turquoise iceberg floats on a glacial lake beneath the peaks of Aoraki / Mount Cook'),
  ('home', 'destino-queenstown', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, sonriendo, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, smiling, with mountains and a cloudy sky behind'),
  ('home', 'destino-kaikoura', null,
   'La cola de un cachalote se alza sobre el mar de Kaikōura mientras el agua cae en cascada',
   'A sperm whale''s tail rises from the sea off Kaikōura, water streaming from its flukes'),
  ('home', 'destino-waitomo', null,
   'Viajeros en una barca bajo miles de luciérnagas que iluminan de azul el techo de una cueva de Waitomo',
   'Travellers in a boat beneath thousands of glowworms lighting a Waitomo cave in blue'),
  ('home', 'galeria-01', null,
   'Un cráter volcánico de tierra rojiza cerca de Rotorua, con bosques y volcanes en el horizonte',
   'A volcanic crater of red earth near Rotorua, with forests and volcanoes on the horizon'),
  ('home', 'galeria-02', null,
   'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
   'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it'),
  ('home', 'galeria-03', null,
   'Tres personas bajo secuoyas altísimas levantan los brazos para tocar una rama baja mientras la luz se filtra entre las copas',
   'Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy'),
  ('home', 'galeria-04', null,
   'Una talla maorí de madera en la cima del monte Hikurangi, con las montañas entre nubes al fondo',
   'A carved Māori pou on Mount Hikurangi, with cloud-wrapped peaks behind'),
  ('home', 'galeria-05', null,
   'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, con chalecos de Seal Kayak Kaikoura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
   'Two travellers sitting in a yellow kayak on the waters of Kaikōura, wearing Seal Kayak Kaikoura life jackets, looking towards another kayak with more travellers under a clear sky'),
  ('home', 'galeria-06', null,
   'Las bahías verdes y el agua en calma de los Marlborough Sounds',
   'The green inlets and calm waters of the Marlborough Sounds'),
  ('home', 'galeria-07', null,
   'Vista de las colinas de Hobbiton a través de una puerta redonda',
   'The hills of Hobbiton seen through a round hobbit door'),
  ('home', 'galeria-08', null,
   'Pingüinos azules de noche en Oamaru',
   'Little blue penguins at night in Oamaru'),
  ('home', 'galeria-09', null,
   'Delfines nadando bajo el agua turquesa de Kaikōura',
   'Dolphins swimming through the turquoise waters of Kaikōura'),
  ('home', 'galeria-10', null,
   'Una lancha navega entre icebergs en el lago glaciar Tasman, con montañas nevadas al fondo',
   'A boat weaves between icebergs on Tasman Glacier Lake, beneath snowy peaks'),
  ('home', 'galeria-11', null,
   'Cathedral Cove, en Coromandel: acantilados blancos y bosque sobre el mar',
   'Cathedral Cove, Coromandel: white cliffs and forest above the sea'),
  ('home', 'galeria-12', null,
   'Una carretera serpentea entre el bosque y el mar en la costa oeste, cerca de Haast',
   'A road winds between forest and sea on the West Coast, near Haast'),
  ('home', 'cierre', null,
   'La costa de Kaikōura al anochecer, con los Alpes nevados reflejados en el mar en calma',
   'The Kaikōura coast at dusk, with the snowy Alps mirrored in the calm sea')
on conflict (section, key) do nothing;

-- Huecos de versiones anteriores de la home que ya no se usan. Solo se
-- borran si nunca se les subió una foto.
delete from site_images
where section = 'home'
  and src is null
  and key in ('porque-grupo', 'tiaki-infografia', 'tiaki-fondo', 'destino-fiordland', 'ruta-auckland', 'ruta-hobbiton-rotorua',
              'ruta-queenstown', 'ruta-milford', 'ruta-aoraki', 'ruta-tekapo', 'ruta-kaikoura');

-- Comprobación:
-- select key, src is not null as tiene_foto from site_images where section = 'home' order by key;
