import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/* Imágenes del sitio gestionables desde el panel de admin.
   - Una sola consulta a site_images por sesión (caché a nivel de módulo).
   - Cada imagen tiene un fallback empaquetado: si la fila no existe, no
     tiene src, o la consulta falla, la web se ve exactamente igual. */

let cachePromise = null

function loadSiteImages() {
  if (!cachePromise) {
    cachePromise = supabase
      .from('site_images')
      .select('section, key, src, image_alt')
      .then(({ data }) => data ?? [])
      .catch(() => [])
  }
  return cachePromise
}

export function useSiteImage(section, key, fallbackSrc, fallbackAlt) {
  const [img, setImg] = useState({ src: fallbackSrc, alt: fallbackAlt })

  useEffect(() => {
    let cancelled = false
    loadSiteImages().then(rows => {
      if (cancelled) return
      const row = rows.find(r => r.section === section && r.key === key)
      if (row?.src) {
        setImg({ src: row.src, alt: row.image_alt || fallbackAlt })
      } else if (row?.image_alt) {
        setImg({ src: fallbackSrc, alt: row.image_alt })
      }
    })
    return () => { cancelled = true }
  }, [section, key, fallbackSrc, fallbackAlt])

  return img
}
