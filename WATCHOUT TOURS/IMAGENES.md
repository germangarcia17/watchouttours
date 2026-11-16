# Imágenes del sitio

## Dónde viven

Las imágenes de los huecos editables (`site_images`) y las portadas del blog
se sirven **desde este repositorio**, en `public/media/site/`, no desde
Supabase Storage.

El nombre de cada archivo es `<section>--<key>.webp`, con la misma `section`
y `key` que la fila de `site_images`. Las portadas del blog siguen el patrón
`blog--<slug>.webp`.

En la base de datos, la columna `src` guarda una **ruta relativa**
(`/media/site/home--hero-poster.webp`), no una URL absoluta. `Seo.jsx` y
`BlogPost.jsx` anteponen el dominio canónico donde hace falta (`og:image`,
`twitter:image` y JSON-LD exigen URL absoluta).

## Por qué

Las fotos se subían al bucket tal cual salían del móvil o del banco de
imágenes: archivos de hasta 48 MB. El plan gratuito de Supabase (1 GB) se
llenó hasta los 966 MB y, de paso, cada visitante se descargaba decenas de
megas. Al migrarlas, los mismos 67 archivos pasaron de 840 MB a 16 MB.

Además, el subidor usaba `upsert: false` con nombres con marca de tiempo, así
que cada reemplazo dejaba huérfano el archivo anterior: 129 MB del bucket eran
duplicados que ya no referenciaba nadie.

## Criterio de compresión

- Orientación EXIF aplicada (si no, las fotos verticales del móvil salen giradas).
- 1800 px de lado mayor, sin ampliar nunca las más pequeñas.
- WebP de calidad 80.

`src/lib/storage.js` aplica exactamente este criterio en el navegador antes de
subir, así que **todo lo que se suba desde el panel de admin ya va comprimido**.
Los vídeos, los subtítulos `.vtt` y los SVG se suben intactos.

## Añadir o reemplazar una imagen

Desde `/admin/imagenes` se puede seguir subiendo con normalidad: el archivo va
a Supabase ya comprimido y la fila apunta a él. Si se quiere que vuelva a
servirse desde el repositorio, basta con dejar el `.webp` en
`public/media/site/` con el nombre `<section>--<key>.webp` y poner ese mismo
valor en `src`.
