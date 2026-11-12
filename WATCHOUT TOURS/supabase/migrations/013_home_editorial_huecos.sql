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
   'Milford Sound al amanecer: las paredes del fiordo se levantan sobre el agua en calma, con el pico Mitre al fondo',
   'Milford Sound at dawn: the walls of the fiord rise above still water, with Mitre Peak in the distance'),
  ('home', 'pais-vertical', null,
   'Un sendero entre helechos gigantes en un bosque nativo de Nueva Zelanda',
   'A track between giant tree ferns in a native New Zealand forest'),
  ('home', 'pais-panoramica', null,
   'Aoraki / Mount Cook, nevado, sobre el agua turquesa del lago Pukaki',
   'Snow-covered Aoraki / Mount Cook above the turquoise water of Lake Pukaki'),
  ('home', 'panel-privado', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, sonriendo, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, smiling, with mountains and a cloudy sky behind'),
  ('home', 'panel-sesenta', null,
   'Tres personas bajo secuoyas altísimas levantan los brazos para tocar una rama baja mientras la luz se filtra entre las copas',
   'Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy'),
  ('home', 'panel-ciegos', null,
   'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes',
   'A traveller with a white cane and a companion holding a recording microphone by a wooden fence where several sheep lean over, on a farm among green hills'),
  ('home', 'salida-foto', null,
   'Siete viajeros y guías reunidos en una pasarela de madera, con el vapor del géiser Pōhutu elevándose detrás',
   'Seven travellers and guides gather on a boardwalk with steam from the Pōhutu Geyser rising behind them'),
  ('home', 'tiaki-tohu', null,
   'Tohu de Tiaki, Care for New Zealand, sobre un delfín saltando en el mar',
   'Tiaki, Care for New Zealand, emblem over a dolphin leaping from the sea'),
  ('home', 'destino-rotorua', null,
   'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
   'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush'),
  ('home', 'destino-fiordland', null,
   'Milford Sound: una cascada cae desde lo alto del fiordo junto a un barco',
   'Milford Sound: a waterfall pours from the top of the fiord beside a boat'),
  ('home', 'destino-aoraki', null,
   'Icebergs flotando en el lago glaciar Tasman, a los pies de Aoraki / Mount Cook',
   'Icebergs floating on Tasman Glacier Lake at the foot of Aoraki / Mount Cook'),
  ('home', 'destino-queenstown', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, sonriendo, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, smiling, with mountains and a cloudy sky behind'),
  ('home', 'destino-kaikoura', null,
   'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, con chalecos de Seal Kayak Kaikoura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
   'Two travellers sitting in a yellow kayak on the waters of Kaikōura, wearing Seal Kayak Kaikoura life jackets, looking towards another kayak with more travellers under a clear sky'),
  ('home', 'destino-waitomo', null,
   'Miles de luciérnagas iluminan de azul el techo de una cueva de Waitomo',
   'Thousands of glowworms light the roof of a Waitomo cave in blue'),
  ('home', 'galeria-01', null,
   'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
   'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush'),
  ('home', 'galeria-02', null,
   'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
   'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it'),
  ('home', 'galeria-03', null,
   'Tres personas bajo secuoyas altísimas levantan los brazos para tocar una rama baja mientras la luz se filtra entre las copas',
   'Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy'),
  ('home', 'galeria-04', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, sonriendo, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, smiling, with mountains and a cloudy sky behind'),
  ('home', 'galeria-05', null,
   'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, con chalecos de Seal Kayak Kaikoura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
   'Two travellers sitting in a yellow kayak on the waters of Kaikōura, wearing Seal Kayak Kaikoura life jackets, looking towards another kayak with more travellers under a clear sky'),
  ('home', 'galeria-06', null,
   'Joven maorí realizando un haka en una presentación cultural, con collar tradicional de hueso y falda piupiu, sacando la lengua en un gesto de desafío ceremonial',
   'Young Māori man performing a haka at a cultural show, wearing a traditional bone necklace and piupiu skirt, pulling out his tongue in a ceremonial gesture of challenge'),
  ('home', 'galeria-07', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'galeria-08', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'galeria-09', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'galeria-10', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'galeria-11', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'galeria-12', null,
   'Fotografía de Nueva Zelanda',
   'Photograph of New Zealand'),
  ('home', 'cierre', null,
   'Un lago de la Isla Sur al atardecer, con las montañas reflejadas en el agua',
   'A South Island lake at dusk, with the mountains reflected in the water')
on conflict (section, key) do nothing;

-- Huecos de versiones anteriores de la home que ya no se usan. Solo se
-- borran si nunca se les subió una foto.
delete from site_images
where section = 'home'
  and src is null
  and key in ('porque-grupo', 'tiaki-infografia', 'tiaki-fondo', 'ruta-auckland', 'ruta-hobbiton-rotorua',
              'ruta-queenstown', 'ruta-milford', 'ruta-aoraki', 'ruta-tekapo', 'ruta-kaikoura');

-- Comprobación:
-- select key, src is not null as tiene_foto from site_images where section = 'home' order by key;
