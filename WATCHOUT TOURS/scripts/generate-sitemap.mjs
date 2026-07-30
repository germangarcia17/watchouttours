// scripts/generate-sitemap.mjs
// Genera dist/sitemap.xml tras el build de Vite.
//
// Incluye las páginas públicas indexables en sus dos idiomas (español, sin
// prefijo, e inglés bajo /en) con enlaces alternos hreflang, y los artículos
// del blog publicados, que se leen en tiempo de build desde Supabase.
//
// Se ejecuta con las mismas variables de entorno que el build de Vite
// (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY). Si no puede leer Supabase,
// genera igualmente el sitemap con las páginas estáticas.

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Dominio de producción. Configurable con SITE_URL por si cambia. Sin barra final. */
const SITE_URL = (process.env.SITE_URL || 'https://watchouttours.nz').replace(/\/+$/, '')

/* Rutas públicas indexables. changefreq/priority son orientativos para Google.
   Se excluyen a propósito: /admin*, /filosofia (redirige) y las páginas legales
   se marcan con prioridad baja. */
const STATIC_ROUTES = [
  { path: '/',               changefreq: 'weekly',  priority: '1.0' },
  { path: '/sobre-nosotras', changefreq: 'monthly', priority: '0.8' },
  { path: '/productos',      changefreq: 'weekly',  priority: '0.9' },
  { path: '/resenas',        changefreq: 'weekly',  priority: '0.7' },
  { path: '/blog',           changefreq: 'weekly',  priority: '0.7' },
  { path: '/contacto',       changefreq: 'monthly', priority: '0.6' },
  { path: '/accesibilidad',  changefreq: 'yearly',  priority: '0.4' },
  { path: '/privacidad',     changefreq: 'yearly',  priority: '0.3' },
  { path: '/aviso-legal',    changefreq: 'yearly',  priority: '0.3' },
]

/* URL española (sin prefijo) e inglesa (/en) para una ruta base dada. */
function esUrl(path) {
  return `${SITE_URL}${path}`
}
function enUrl(path) {
  return `${SITE_URL}${path === '/' ? '/en' : `/en${path}`}`
}

/* Bloque <url> con enlaces alternos hreflang (es, en y x-default→es). */
function urlEntry({ loc, path, lastmod, changefreq, priority }) {
  const es = esUrl(path)
  const en = enUrl(path)
  const lines = [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    `    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${es}"/>`,
    '  </url>',
  ]
  return lines.filter(Boolean).join('\n')
}

/* Cada ruta produce dos entradas (una por idioma), ambas con los mismos
   enlaces alternos. */
function routeToEntries({ path, changefreq, priority, lastmod }) {
  return [
    urlEntry({ loc: esUrl(path), path, changefreq, priority, lastmod }),
    urlEntry({ loc: enUrl(path), path, changefreq, priority, lastmod }),
  ]
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

  const entries = allRoutes.flatMap(routeToEntries).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`

  const out = resolve(__dirname, '..', 'dist', 'sitemap.xml')
  writeFileSync(out, xml, 'utf8')
  console.log(`[sitemap] Generado ${out} con ${allRoutes.length} rutas (${allRoutes.length * 2} URLs).`)
}

main()
