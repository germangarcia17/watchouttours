-- WatchOut Tours — Fotos nuevas de /viajes
--
-- Esquí (viajes-esqui) y personas ciegas (viajes-ciegos, también en las
-- especialidades de la home): las fotos están en el repositorio
-- (esqui-tekapo y pareja-tongariro, por defecto en el código); aquí solo se
-- actualiza su texto alternativo, que en la base de datos manda sobre el del
-- código. Se ejecuta al fusionar en main (antes, la web publicada aún
-- muestra las fotos anteriores y su texto no coincidiría).

update site_images set src = null, image_alt = 'Una persona baja esquiando por una pista nevada hacia una pequeña cabaña, con un lago turquesa y montañas nevadas al fondo', image_alt_en = 'A skier carves down a snowy slope towards a small hut, with a turquoise lake and snow-capped mountains beyond'
where section = 'viajes' and key = 'viajes-esqui';

update site_images set src = null, image_alt = 'Una pareja sentada sobre una roca, abrazada y de espaldas, se sonríe frente a un volcán con la cima entre nubes', image_alt_en = 'A couple sit arm in arm on a rock, seen from behind, smiling at each other before a volcano with its summit in the clouds'
where section = 'viajes' and key = 'viajes-ciegos';
