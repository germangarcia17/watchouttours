import { useSiteImage } from '../lib/siteImages'
import { Imagen, nombreImagen } from './Imagen'

/* ── Hueco de imagen editable desde /admin/imagenes ──────────────────────
 * Todas las imágenes viven en el repositorio (public/img, ver Imagen.jsx y
 * CLAUDE.md). La fila del hueco (sección, clave) en site_images guarda el
 * nombre de la imagen que usa, su texto alternativo y su crédito; si no hay
 * fila o no tiene imagen, se usa `defecto` y, si tampoco, la imagen del
 * repositorio llamada "<sección>--<clave>". Sin ninguna, no pinta nada (el
 * contenedor deja ver su bloque gris).
 *
 * `defecto`: nombre de una imagen del repositorio (o null).
 * `alt`: texto alternativo; "" si la imagen es decorativa.
 * `prioritaria`: true solo para la primera pantalla (sin carga diferida).
 * ──────────────────────────────────────────────────────────────────────── */
export function defectoHueco(seccion, clave, defecto) {
  return nombreImagen(defecto) ?? nombreImagen(`${seccion}--${clave}`)
}

export function ImagenHueco({ seccion, clave, defecto, alt, sizes, prioritaria = false, className = '' }) {
  const img = useSiteImage(seccion, clave, defectoHueco(seccion, clave, defecto), alt)
  if (!img.src) return null
  const decorativa = alt === ''
  return (
    <Imagen
      src={img.src} sizes={sizes} prioritaria={prioritaria} className={className}
      alt={decorativa ? '' : img.alt}
      aria-hidden={decorativa ? 'true' : undefined}
      lang={decorativa ? undefined : img.lang}
    />
  )
}
