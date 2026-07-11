import { useEffect, useState } from 'react'
import { supabase } from './supabase'

/* Metadatos SEO editables desde el panel de admin (tabla seo_metadata).
   Una sola consulta por sesión, cacheada a nivel de módulo. Si la fila no
   existe o la consulta falla, la página usa los valores por defecto. */

let cachePromise = null

function loadSeo() {
  if (!cachePromise) {
    cachePromise = supabase
      .from('seo_metadata')
      .select('*')
      .then(({ data }) => data ?? [])
      .catch(() => [])
  }
  return cachePromise
}

export function useSeo(pageType) {
  const [row, setRow] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadSeo().then(rows => {
      if (cancelled) return
      setRow(rows.find(r => r.page_type === pageType) ?? null)
    })
    return () => { cancelled = true }
  }, [pageType])

  return row
}
