// scripts/imagenes/optimizar.mjs
//
// Genera las versiones optimizadas de todas las imágenes del sitio.
//
//   npm run imagenes
//
// Entrada:  imagenes/fuentes/<nombre>.<webp|jpg|png>  (el original, no se publica)
// Salida:   public/img/<nombre>-<ancho>.avif y .webp   (lo que sirve Netlify)
//           src/data/imagenes.json                      (índice: medidas y anchos)
//
// Reglas (ver CLAUDE.md):
// - Anchos 640, 1280 y 1920 px, sin ampliar nunca: si el original es más
//   estrecho, el último ancho es el del original.
// - Peso máximo por ancho: 640 → 40 KB, 1280 → 100 KB, 1920 → 250 KB. Se
//   busca la calidad más alta que cabe en ese peso (con un mínimo, para que
//   no aparezcan defectos).
// - Solo se redimensiona y se recomprime: nunca se recorta ni se retoca
//   (licencia de Tourism New Zealand). Se respeta la orientación EXIF.
// - Las imágenes idénticas (mismo contenido) se generan una sola vez: el
//   índice apunta las demás a la primera.
// Solo procesa lo nuevo o lo que ha cambiado (compara la fecha del original
// con la de sus versiones); con --todo lo rehace todo.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, parse, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const FUENTES = join(raiz, 'imagenes', 'fuentes')
const SALIDA = join(raiz, 'public', 'img')
const INDICE = join(raiz, 'src', 'data', 'imagenes.json')

const ANCHOS = [640, 1280, 1920]
const LIMITE = { 640: 40, 1280: 100, 1920: 250 } // KB
// Excepciones de peso (KB por ancho), p. ej. el póster del vídeo de la hero
const LIMITE_ESPECIAL = {
  'home--hero-poster': { 1920: 150 },
}
const CALIDAD = {
  avif: { max: 58, min: 14 },
  webp: { max: 80, min: 15 },
}

const todo = process.argv.includes('--todo')
mkdirSync(SALIDA, { recursive: true })
const anterior = existsSync(INDICE) ? JSON.parse(readFileSync(INDICE, 'utf8')) : {}

async function codificar(entrada, ancho, formato, limiteKB) {
  // Búsqueda binaria de la calidad más alta que cabe en el límite
  let { min, max } = CALIDAD[formato]
  let mejor = null
  let menor = null
  while (min <= max) {
    const q = Math.round((min + max) / 2)
    const tubo = sharp(entrada).rotate().resize({ width: ancho, withoutEnlargement: true })
    const buf = formato === 'avif'
      ? await tubo.avif({ quality: q, effort: 4 }).toBuffer()
      : await tubo.webp({ quality: q, effort: 5 }).toBuffer()
    if (buf.length <= limiteKB * 1024) { mejor = buf; min = q + 1 } else { max = q - 1; if (!menor || buf.length < menor.length) menor = buf }
  }
  // Si ni con la calidad mínima cabe, la versión más ligera que se probó
  return mejor ?? menor
}

const indice = {}
const porHash = {}
const resumen = []
const archivos = readdirSync(FUENTES).filter(f => /\.(webp|jpe?g|png|avif)$/i.test(f)).sort()

for (const archivo of archivos) {
  const nombre = parse(archivo).name
  const ruta = join(FUENTES, archivo)
  const datos = readFileSync(ruta)
  const hash = createHash('sha1').update(datos).digest('hex').slice(0, 12)
  if (porHash[hash]) { indice[nombre] = { ...indice[porHash[hash]], igualA: porHash[hash] }; continue }
  porHash[hash] = nombre

  const meta = await sharp(datos).rotate().metadata()
  // Con la orientación EXIF aplicada, ancho y alto pueden intercambiarse
  const girada = (meta.orientation ?? 1) >= 5
  const w = girada ? meta.height : meta.width
  const h = girada ? meta.width : meta.height
  const anchos = ANCHOS.filter(a => a < w)
  if (anchos.length < ANCHOS.length) anchos.push(Math.min(w, ANCHOS[ANCHOS.length - 1]))
  const entrada = { w, h, anchos: [...new Set(anchos)], hash }
  indice[nombre] = entrada

  const previa = anterior[nombre]
  const topeDe = a => LIMITE_ESPECIAL[nombre]?.[ANCHOS.find(x => x >= a) ?? 1920] ?? LIMITE[ANCHOS.find(x => x >= a) ?? 1920]
  const alDia = !todo && previa?.hash === hash && entrada.anchos.every(a =>
    ['avif', 'webp'].every(f => {
      const d = join(SALIDA, `${nombre}-${a}.${f}`)
      return existsSync(d) && statSync(d).size <= topeDe(a) * 1024
    }))
  const pesos = []
  for (const a of entrada.anchos) {
    // Ancho intermedio (original más estrecho): límite del ancho estándar
    // inmediatamente superior
    const tope = topeDe(a)
    for (const f of ['avif', 'webp']) {
      const destino = join(SALIDA, `${nombre}-${a}.${f}`)
      if (!alDia) writeFileSync(destino, await codificar(datos, a, f, tope))
      pesos.push(`${a}.${f} ${Math.round(statSync(destino).size / 1024)} KB`)
    }
  }
  resumen.push(`${nombre} (${w}×${h}, original ${Math.round(datos.length / 1024)} KB): ${pesos.join(' · ')}`)
  console.log(resumen[resumen.length - 1])
  // Índice parcial tras cada imagen: si se interrumpe, se reanuda donde iba
  writeFileSync(INDICE, JSON.stringify({ ...anterior, ...indice }, null, 1) + '\n')
}

writeFileSync(INDICE, JSON.stringify(indice, null, 1) + '\n')
console.log(`\n${Object.keys(indice).length} imágenes en el índice (${Object.keys(porHash).length} distintas).`)
