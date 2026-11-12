-- Watchout Tours — Huecos de imagen de la home editorial (rediseño 2026)
--
-- Crea en site_images una fila por cada hueco nuevo de la home para que
-- aparezcan en /admin/imagenes y se pueda subir su foto y editar su texto
-- alternativo en español y en inglés. Con src = null la web usa la imagen
-- por defecto del proyecto (o no muestra el hueco si no hay ninguna).
-- Ejecutar una vez en el SQL Editor de Supabase. No pisa filas existentes.

insert into site_images (section, key, src, image_alt, image_alt_en) values
  ('home', 'hero-poster', null,
   'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
   'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush'),
  ('home', 'pais-vertical', null,
   'Joven maorí realizando un haka en una presentación cultural, con collar tradicional de hueso y falda piupiu, sacando la lengua en un gesto de desafío ceremonial',
   'Young Māori man performing a haka at a cultural show, wearing a traditional bone necklace and piupiu skirt, pulling out his tongue in a ceremonial gesture of challenge'),
  ('home', 'pais-panoramica', null,
   'Milford Sound: paredes de roca verticales que se levantan sobre el agua del fiordo',
   'Milford Sound: sheer rock walls rising straight out of the fiord'),
  ('home', 'porque-grupo', null,
   'Moni y Sylvie con el grupo de viajeros durante el viaje por Nueva Zelanda',
   'Moni and Sylvie with the group of travellers on their journey through New Zealand'),
  ('home', 'panel-ciegos', null,
   'Una viajera con bastón blanco y un compañero con un micrófono de grabación junto a una valla de madera donde asoman varias ovejas, en una granja entre colinas verdes',
   'A traveller with a white cane and a companion holding a recording microphone by a wooden fence where several sheep lean over, on a farm among green hills'),
  ('home', 'panel-sesenta', null,
   'Tres personas bajo secuoyas altísimas levantan los brazos para tocar una rama baja mientras la luz se filtra entre las copas',
   'Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy'),
  ('home', 'panel-privado', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, with mountains and a cloudy sky behind'),
  ('home', 'salida-foto', null,
   'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
   'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it'),
  ('home', 'ruta-auckland', null,
   'Un velero navega por el puerto de Auckland, con los edificios de la ciudad al fondo',
   'A sailing boat crosses Auckland harbour with the city skyline behind'),
  ('home', 'ruta-hobbiton-rotorua', null,
   'Hobbiton: casas hobbit con puertas redondas entre colinas verdes',
   'Hobbiton: hobbit holes with round doors among green hills'),
  ('home', 'ruta-queenstown', null,
   'Un viajero y su piloto vuelan en parapente biplaza sobre los valles de Queenstown, sonriendo, con montañas y un cielo de nubes al fondo',
   'A traveller and pilot tandem paragliding over the valleys of Queenstown, smiling, with mountains and a cloudy sky behind'),
  ('home', 'ruta-milford', null,
   'Milford Sound: una cascada cae desde lo alto del fiordo junto a un barco',
   'Milford Sound: a waterfall pours from the top of the fiord beside a boat'),
  ('home', 'ruta-aoraki', null,
   'Aoraki / Mount Cook, nevado, sobre el agua turquesa de un lago glaciar',
   'Snow-covered Aoraki / Mount Cook above the turquoise water of a glacial lake'),
  ('home', 'ruta-tekapo', null,
   'Cielo nocturno lleno de estrellas sobre el lago Tekapo',
   'A night sky full of stars over Lake Tekapo'),
  ('home', 'ruta-kaikoura', null,
   'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
   'Two travellers sitting in a yellow kayak on the waters of Kaikōura, looking towards another kayak with more travellers under a clear sky'),
  ('home', 'galeria-01', null, null, null),
  ('home', 'galeria-02', null, null, null),
  ('home', 'galeria-03', null, null, null),
  ('home', 'galeria-04', null, null, null),
  ('home', 'galeria-05', null, null, null),
  ('home', 'galeria-06', null, null, null),
  ('home', 'galeria-07', null, null, null),
  ('home', 'galeria-08', null, null, null),
  ('home', 'galeria-09', null, null, null),
  ('home', 'galeria-10', null, null, null),
  ('home', 'galeria-11', null, null, null),
  ('home', 'galeria-12', null, null, null),
  ('home', 'tiaki-infografia', null,
   'Infografía oficial de la promesa Tiaki: cuidar la tierra, el mar y la naturaleza, viajar con seguridad y respetar la cultura',
   'Official Tiaki Promise infographic: care for land, sea and nature, travel safely and respect culture'),
  ('home', 'cierre', null, '', '')
on conflict (section, key) do nothing;

-- Comprobación:
-- select key, src is not null as tiene_foto from site_images where section = 'home' order by key;
