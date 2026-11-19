import indice from '../data/imagenes.json'

/* ── Imágenes optimizadas del repositorio ────────────────────────────────
 * Cada imagen del sitio tiene su original en imagenes/fuentes/<nombre>.* y
 * sus versiones en public/img/<nombre>-<ancho>.avif|webp, generadas con
 * `npm run imagenes` (scripts/imagenes/optimizar.mjs). El índice
 * src/data/imagenes.json guarda sus medidas y anchos.
 * Las imágenes y vídeos se guardan solo en el repositorio, nunca en
 * Supabase Storage (ver CLAUDE.md).
 * ──────────────────────────────────────────────────────────────────────── */

/* Nombre de la imagen a partir de lo que guarde un hueco o una portada:
   el nombre tal cual ("home--galeria-01"), "img:<nombre>" o una ruta antigua
   "/media/site/<nombre>.webp". null si no es una imagen del repositorio. */
export function nombreImagen(ref) {
  if (!ref || typeof ref !== 'string') return null
  if (indice[ref]) return ref
  const m = ref.match(/^img:(.+)$/) ?? ref.match(/\/media\/site\/([^/?#]+)\.(?:webp|jpe?g|png)$/)
  return m && indice[m[1]] ? m[1] : null
}

export function datosImagen(nombre) {
  const d = indice[nombre]
  if (!d) return null
  return { ...d, archivo: d.igualA ?? nombre }
}

/* URL de una versión concreta: el ancho disponible más cercano por arriba a
   `ancho` (o el mayor). Para og:image, pósteres y similares. */
export function urlImagen(ref, ancho = 1280, formato = 'webp') {
  const nombre = nombreImagen(ref)
  if (!nombre) return ref ?? null
  const d = datosImagen(nombre)
  const a = d.anchos.find(x => x >= ancho) ?? d.anchos[d.anchos.length - 1]
  return `/img/${d.archivo}-${a}.${formato}`
}

const srcset = (d, formato) => d.anchos.map(a => `/img/${d.archivo}-${a}.${formato} ${a}w`).join(', ')

/* <picture> con AVIF y WebP de respaldo, srcset y medidas declaradas. Fuera
   de la primera pantalla, carga diferida. Si `src` no es una imagen del
   repositorio (una URL externa antigua), pinta una <img> normal. */
export function Imagen({ src, alt = '', sizes = '100vw', prioritaria = false, className, ...resto }) {
  const nombre = nombreImagen(src)
  const carga = {
    loading: prioritaria ? 'eager' : 'lazy',
    decoding: prioritaria ? 'sync' : 'async',
    fetchpriority: prioritaria ? 'high' : undefined,
  }
  if (!nombre) return src ? <img src={src} alt={alt} className={className} {...carga} {...resto} /> : null
  const d = datosImagen(nombre)
  const mayor = d.anchos[d.anchos.length - 1]
  return (
    <picture className="imagen">
      <source type="image/avif" srcSet={srcset(d, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(d, 'webp')} sizes={sizes} />
      <img
        src={`/img/${d.archivo}-${mayor}.webp`} width={d.w} height={d.h}
        alt={alt} className={className} {...carga} {...resto}
      />
    </picture>
  )
}
