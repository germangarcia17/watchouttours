# Imágenes del sitio

## Regla

Las imágenes y vídeos se guardan solo en el repositorio de GitHub, nunca en
Supabase Storage. Siempre optimizados al mínimo peso (AVIF/WebP, srcset,
lazy). Las fotos de Tourism New Zealand nunca llevan nada encima ni se
recortan en edición, y llevan su crédito debajo.

## Dónde viven

| Qué | Dónde |
|---|---|
| Originales (no se publican) | `imagenes/fuentes/<nombre>.<jpg\|webp\|png>` |
| Versiones publicadas | `public/img/<nombre>-<ancho>.avif` y `.webp` |
| Índice (medidas y anchos) | `src/data/imagenes.json` |
| Vídeos, pósters, audios | `public/media/` y `src/images/` (los que importa el código) |

Las imágenes de los huecos de `/admin/imagenes` se llaman
`<section>--<key>` (p. ej. `home--galeria-10`); las portadas del diario,
`blog--<slug>`; el resto tiene un nombre descriptivo
(`tnz-233933-aoraki-mt-cook`, `nosotras`…).

En la base de datos (`site_images.src`, `blog_posts.cover_image_url`) se
guarda solo el **nombre**. Las rutas antiguas `/media/site/<nombre>.webp`
se siguen entendiendo (`nombreImagen` en `src/components/Imagen.jsx`).

## Generar las versiones

```
npm run imagenes
```

`scripts/imagenes/optimizar.mjs` (con su propio `package.json` y `sharp`,
aparte de las dependencias de la web) recorre `imagenes/fuentes/` y, para
cada imagen nueva o cambiada:

- aplica la orientación EXIF y redimensiona a 640, 1280 y 1920 px de ancho,
  sin ampliar nunca (si el original es más estrecho, el último ancho es el
  suyo);
- busca la calidad más alta que cabe en el peso máximo: 40 KB a 640 px,
  100 KB a 1280 px y 250 KB a 1920 px (el póster de la hero, 150 KB);
- nunca recorta ni retoca (licencia de Tourism New Zealand);
- genera una sola vez las imágenes idénticas.

Con `--todo` lo rehace todo.

## Usarlas en el código

```jsx
<Imagen src="tnz-233933-aoraki-mt-cook" alt="…" sizes="100vw" />
```

`<Imagen>` pinta un `<picture>` con AVIF y WebP en `srcset`, `width` y
`height` del original, `loading="lazy"` y `decoding="async"` (o
`fetchpriority="high"` con `prioritaria`, para la primera pantalla).
`urlImagen(nombre, ancho)` da la URL de una versión (para `og:image` o un
póster).

## Añadir o cambiar una foto

1. Deja el original en `imagenes/fuentes/` con su nombre.
2. `npm run imagenes` y haz commit de `public/img/`, `src/data/imagenes.json`
   y el original.
3. En `/admin/imagenes`, elige la imagen en el desplegable del hueco y
   escribe su texto alternativo y su crédito. El admin no sube archivos.
