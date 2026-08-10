// scripts/prerender.mjs
//
// Prerenderizado estático (SSG) del sitio ya compilado por Vite.
//
// Renderiza cada página pública (español + inglés) y cada artículo de blog
// publicado con react-dom/server, usando los mismos componentes React que
// la app cliente, y escribe el HTML resultante en dist/ en la ruta exacta
// de cada URL (p. ej. dist/productos/index.html). Netlify sirve un archivo
// estático existente antes de aplicar cualquier redirect, así que estas
// páginas llegan a Googlebot con el título, meta description, canonical,
// hreflang, encabezados y JSON-LD ya en el HTML inicial, sin depender de
// que se ejecute JavaScript.
//
// Antes de escribir nada se guarda una copia intacta de dist/index.html en
// dist/app-shell.html: esa es la plantilla que netlify.toml usa como
// fallback para cualquier ruta que no se prerenderice aquí (admin, rutas
// desconocidas, futuras páginas). Así nunca se rompe la SPA.
//
// Si Supabase no responde (sin credenciales, red caída, etc.) el script no
// falla: cada página se prerenderiza igualmente con el contenido estático
// de i18n, y las secciones que dependían de datos dinámicos simplemente
// quedan vacías (tal como ya ocurre hoy antes de que el cliente las cargue).

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve, join } from 'node:path'
import { STATIC_ROUTES } from './routes.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = resolve(__dirname, '..', 'dist')
const SSR_ENTRY = resolve(__dirname, '..', 'dist-server', 'entry-server.js')

function enPath(path) {
  return path === '/' ? '/en' : `/en${path}`
}

async function fetchBuildTimeData() {
  const url  = process.env.VITE_SUPABASE_URL
  const anon = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anon) {
    console.warn('[prerender] Sin credenciales de Supabase; se omite el contenido dinámico.')
    return { blogList: [], resenas: [], homeResenas: [], homeBlogPreview: null }
  }
  try {
    const supabase = createClient(url, anon)

    const [blogListRes, resenasRes, homeResenasRes, homeBlogRes] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false }),
      supabase.from('resenas').select('*').eq('published', true)
        .order('featured', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('resenas').select('*').eq('published', true).eq('featured', true).limit(3),
      supabase.from('blog_posts').select('*').eq('status', 'published').eq('resena', true)
        .order('published_at', { ascending: false }).limit(1).maybeSingle(),
    ])

    return {
      blogList: blogListRes.data ?? [],
      resenas: resenasRes.data ?? [],
      homeResenas: homeResenasRes.data ?? [],
      homeBlogPreview: homeBlogRes.data ?? null,
    }
  } catch (err) {
    console.warn('[prerender] No se pudo leer Supabase:', err.message)
    return { blogList: [], resenas: [], homeResenas: [], homeBlogPreview: null }
  }
}

/* Inserta el HTML/head generados por Helmet en la plantilla base de Vite. */
function buildHtmlDocument(template, { url, lang, html, titleStr, linkStr, metaStr, scriptStr }) {
  let doc = template.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)

  doc = doc.replace(/<title[^>]*>[\s\S]*?<\/title>/, () => titleStr)

  const headExtras = [linkStr, metaStr, scriptStr].filter(Boolean).join('\n    ')
  doc = doc.replace('</head>', () => `    ${headExtras}\n  </head>`)

  doc = doc.replace('<div id="root"></div>', () => `<div id="root">${html}</div>`)

  return doc
}

async function writeRoute(template, renderFn, url, outFile) {
  const lang = url === '/en' || url.startsWith('/en/') ? 'en' : 'es'
  try {
    const { html, helmet } = await renderFn(url)
    const titleStr = helmet.title.toString()
    const linkStr = helmet.link.toString()
    const metaStr = helmet.meta.toString()
    const scriptStr = helmet.script.toString()
    const doc = buildHtmlDocument(template, { url, lang, html, titleStr, linkStr, metaStr, scriptStr })
    mkdirSync(dirname(outFile), { recursive: true })
    writeFileSync(outFile, doc, 'utf8')
    return true
  } catch (err) {
    console.warn(`[prerender] No se pudo prerenderizar ${url}:`, err.message)
    return false
  }
}

async function main() {
  const indexPath = join(DIST_DIR, 'index.html')
  if (!existsSync(indexPath)) {
    console.warn('[prerender] No existe dist/index.html; ¿se ejecutó "vite build" antes? Se omite el prerenderizado.')
    return
  }
  if (!existsSync(SSR_ENTRY)) {
    console.warn('[prerender] No existe el bundle SSR (dist-server/entry-server.js). Se omite el prerenderizado.')
    return
  }

  // Copia intacta de la plantilla SPA genérica: es el fallback para todo lo
  // que no se prerenderiza aquí (admin, rutas desconocidas).
  const template = readFileSync(indexPath, 'utf8')
  copyFileSync(indexPath, join(DIST_DIR, 'app-shell.html'))

  const { render } = await import(`${SSR_ENTRY}?t=${Date.now()}`)
  const data = await fetchBuildTimeData()

  let ok = 0
  let total = 0

  async function render1(url, preload, outFile) {
    total++
    globalThis.__PRELOAD__ = preload
    if (await writeRoute(template, render, url, outFile)) ok++
  }

  // ── Páginas estáticas (ES + EN) ──────────────────────────────────────
  for (const { path } of STATIC_ROUTES) {
    const preloadEs = path === '/'
      ? { homeResenas: data.homeResenas, homeBlogPreview: data.homeBlogPreview }
      : path === '/resenas' ? { resenas: data.resenas }
      : path === '/blog' ? { blogList: data.blogList }
      : {}

    const esOut = path === '/' ? join(DIST_DIR, 'index.html') : join(DIST_DIR, path.slice(1), 'index.html')
    const enOut = path === '/' ? join(DIST_DIR, 'en', 'index.html') : join(DIST_DIR, 'en', path.slice(1), 'index.html')

    await render1(path, preloadEs, esOut)
    await render1(enPath(path), preloadEs, enOut)
  }

  // ── Artículos del blog (ES + EN) ─────────────────────────────────────
  for (const post of data.blogList) {
    const preload = { blogPosts: { [post.slug]: post } }
    await render1(`/blog/${post.slug}`, preload, join(DIST_DIR, 'blog', post.slug, 'index.html'))
    await render1(`/en/blog/${post.slug}`, preload, join(DIST_DIR, 'en', 'blog', post.slug, 'index.html'))
  }

  delete globalThis.__PRELOAD__
  console.log(`[prerender] ${ok}/${total} páginas prerenderizadas (${data.blogList.length} artículos de blog).`)
}

main()
