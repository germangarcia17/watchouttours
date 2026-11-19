# WatchOut Tours: reglas para trabajar en este repositorio

## Imágenes y vídeos

Las imágenes y vídeos se guardan solo en el repositorio de GitHub, nunca en Supabase Storage. Siempre optimizados al mínimo peso (AVIF/WebP, srcset, lazy). Las fotos de Tourism New Zealand nunca llevan nada encima ni se recortan en edición, y llevan su crédito debajo.

Cómo se hace (detalle en `IMAGENES.md`):

- El original va a `imagenes/fuentes/<nombre>.<jpg|webp|png>` (no se publica).
- `npm run imagenes` genera `public/img/<nombre>-<ancho>.avif|webp` (640, 1280 y 1920 px, sin ampliar) y el índice `src/data/imagenes.json`. Pesos máximos: 40 KB a 640 px, 100 KB a 1280 px, 250 KB a 1920 px (póster de la hero: 150 KB).
- En el código, una imagen es su nombre: `<Imagen src="<nombre>" sizes="…" />` (o `FotoHueco` / `ImagenHueco` para los huecos de `/admin/imagenes`). `width` y `height` siempre; `loading="lazy"` y `decoding="async"` salvo en la primera pantalla (`prioritaria`).
- En la base de datos (`site_images.src`, portadas del diario) solo se guarda el nombre de la imagen. El admin ya no sube archivos: elige una imagen del repositorio y edita el texto alternativo y el crédito.
- Vídeos: H.264, 720p como máximo, ≤ 8 MB, en `public/media/`, con póster ≤ 100 KB, `preload="none"` (o `metadata` si es la primera pantalla) y subtítulos o transcripción.
- Fotos de Tourism New Zealand: se pueden redimensionar y recomprimir, pero nunca recortar en edición ni retocar; el encuadre con `object-fit: cover` está permitido. Sin texto, velo ni nada encima. Crédito debajo de la foto, fuera de ella. Las fotos propias no llevan crédito.

## Textos

- Siempre «WatchOut Tours» y «Mónica». Nunca «furgoneta» ni «van»: «vehículo privado».
