import { useSiteImage } from '../lib/siteImages'

/* ── Hueco de imagen editable desde /admin/imagenes ──────────────────────
 * Muestra la imagen de la fila (sección, clave) si se ha subido una en el
 * admin; si no, la imagen por defecto del proyecto con su srcset, ancho y
 * alto (para que no salte el diseño). Si no hay ninguna de las dos, no
 * pinta nada: quien lo usa deja ver su fondo petróleo liso.
 *
 * `defecto`: { src, srcSet, width, height } o null.
 * `alt`: texto alternativo; "" si la imagen es decorativa.
 * `prioritaria`: true solo para el hero (sin carga diferida).
 * ──────────────────────────────────────────────────────────────────────── */
export function ImagenHueco({ seccion, clave, defecto, alt, sizes, prioritaria = false, className = '' }) {
  const img = useSiteImage(seccion, clave, defecto?.src ?? null, alt)
  if (!img.src) return null
  const esDefecto = defecto && img.src === defecto.src
  const decorativa = alt === ''
  return (
    <img
      className={className}
      src={img.src}
      srcSet={esDefecto ? defecto.srcSet : undefined}
      sizes={esDefecto ? sizes : undefined}
      width={esDefecto ? defecto.width : undefined}
      height={esDefecto ? defecto.height : undefined}
      alt={decorativa ? '' : img.alt}
      aria-hidden={decorativa ? 'true' : undefined}
      lang={decorativa ? undefined : img.lang}
      loading={prioritaria ? 'eager' : 'lazy'}
      decoding={prioritaria ? 'sync' : 'async'}
      fetchpriority={prioritaria ? 'high' : undefined}
    />
  )
}

/* Construye { src, srcSet, width, height } a partir de variantes
   [{ src, w, h }] ordenadas de menor a mayor. */
export function variantes(lista) {
  const mayor = lista[lista.length - 1]
  return {
    src: mayor.src,
    srcSet: lista.map(v => `${v.src} ${v.w}w`).join(', '),
    width: mayor.w,
    height: mayor.h,
  }
}
