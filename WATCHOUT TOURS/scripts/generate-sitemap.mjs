// scripts/generate-sitemap.mjs
// Genera dist/sitemap.xml tras el build de Vite.
//
// Incluye las páginas públicas indexables en los idiomas en que existan
// (español sin prefijo, inglés bajo /en — ver src/i18n/pageLanguages.js
// para las páginas que solo existen en un idioma) con enlaces alternos
// hreflang, y los artículos del blog publicados, que se leen en tiempo de
// build desde Supabase.
//
// Se ejecuta con las mismas variables de entorno que el build de Vite
// (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Si no puede leer Supabase,
// genera igualmente el sitemap con las páginas estáticas.

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { STATIC_ROUTES } from './routes.mjs'
import { availableLangs } from '../src/i18n/pageLanguages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Dominio de producción. Configurable con SITE_URL por si cambia. Sin barra final. */
const SITE_URL = (process.env.SITE_URL || 'https://watchouttours.nz').replace(/\/+$/, '')

/* URL española (sin prefijo) e inglesa (/en) para una ruta base dada. */
function esUrl(path) {
  return `${SITE_URL}${path}`
}
function enUrl(path) {
  return `${SITE_URL}${path === '/' ? '/en' : `/en${path}`}`
}

/* Bloque <url> con enlaces alternos hreflang, solo para los idiomas en que
   la página exista realmente (ver availableLangs). x-default apunta al
   español cuando existe, o al inglés si la página es solo-inglés. */
function urlEntry({ loc, path, langs, lastmod, changefreq, priority }) {
  const es = esUrl(path)
  const en = enUrl(path)
  const defaultHref = langs.includes('es') ? es : en
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    langs.includes('es') ? `    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>` : null,
    langs.includes('en') ? `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>` : null,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>`,
    '  </url>',
  ]
  return lines.filter(Boolean).join('\n')
}

/* Cada ruta produce una entrada por idioma en que exista (ver
   availableLangs en src/i18n/pageLanguages.js), todas con los mismos
   enlaces alternos. Por defecto ese es ['es', 'en']. */
function routeToEntries({ path, changefreq, priority, lastmod }) {
  const langs = availableLangs(path)
  const entries = []
  if (langs.includes('es')) entries.push(urlEntry({ loc: esUrl(path), path, langs, changefreq, priority, lastmod }))
  if (langs.includes('en')) entries.push(urlEntry({ loc: enUrl(path), path, langs, changefreq, priority, lastmod }))
  return entries
}

async function fetchBlogRoutes() {
  const url  = process.env.VITE_SUPABASE_URL
  const anon = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) {
    console.warn('[sitemap] Sin credenciales de Supabase; se omiten los artículos del blog.')
    return []
  }
  try {
    const supabase = createClient(url, anon)
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
    if (error) throw error
    return (data || []).map(p => ({
      path: `/blog/${p.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: (p.updated_at || p.published_at || '').slice(0, 10) || undefined,
    }))
  } catch (err) {
    console.warn('[sitemap] No se pudieron leer los artículos del blog:', err.message)
    return []
  }
}

async function main() {
  const blogRoutes = await fetchBlogRoutes()
  const allRoutes = [...STATIC_ROUTES, ...blogRoutes]

  const urlEntries = allRoutes.flatMap(routeToEntries)
  const entries = urlEntries.join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`

  const out = resolve(__dirname, '..', 'dist', 'sitemap.xml')
  writeFileSync(out, xml, 'utf8')
  // No siempre son el doble de rutas: las páginas solo-idioma (ver
  // src/i18n/pageLanguages.js) aportan una única URL en vez de dos.
  console.log(`[sitemap] Generado ${out} con ${allRoutes.length} rutas (${urlEntries.length} URLs).`)
}

main()
