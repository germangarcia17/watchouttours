import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useLang } from '../i18n/routing'

/* Imágenes del sitio gestionables desde el panel de admin.
   - Una sola consulta a site_images por sesión (caché a nivel de módulo).
   - Cada imagen tiene un fallback empaquetado: si la fila no existe, no
     tiene src, o la consulta falla, la web se ve exactamente igual.
   - El texto alternativo es bilingüe: en inglés usa image_alt_en si existe,
     y si no, cae al alt en español; y si tampoco hay fila en la BD, usa el
     fallback que pasa la página (que ya viene traducido). */

let cachePromise = null

function loadSiteImages() {
  if (!cachePromise) {
    cachePromise = supabase
      .from('site_images')
      .select('*')
      .then(({ data }) => data ?? [])
      .catch(() => [])
  }
  return cachePromise
}

export function useSiteImage(section, key, fallbackSrc, fallbackAlt) {
  const lang = useLang()
  const [row, setRow] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadSiteImages().then(rows => {
      if (cancelled) return
      setRow(rows.find(r => r.section === section && r.key === key) ?? null)
    })
    return () => { cancelled = true }
  }, [section, key])

  // Se calcula en cada render para que el alt siga al idioma activo aunque
  // no haya fila en la base de datos.
  const altEn = row?.image_alt_en
  const dbAlt = (lang === 'en' && altEn && String(altEn).trim() !== '')
    ? altEn
    : row?.image_alt

  return {
    src: row?.src || fallbackSrc,
    alt: dbAlt || fallbackAlt,
  }
}
