import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import '../styles/pagestyle/Contacto.css'
import '../styles/pagestyle/HomeNueva.css'
import { Seo } from '../components/Seo'
import { ImagenHueco, variantes } from '../components/ImagenHueco'
import { ResenasDestacadas } from '../components/home/BloquesHome'
import { BotonVideollamada } from '../components/Videollamada'
import { Desplegable } from '../components/Desplegable'
import { useSiteImage } from '../lib/siteImages'
import { L, useLang } from '../i18n/routing'
// Imágenes por defecto de algunos huecos (versiones a varios anchos en src/images/home)
import hero900 from '../images/home/hero-900.webp'
import hero1400 from '../images/home/hero-1400.webp'
import hero1800 from '../images/home/hero-1800.webp'
import qt600 from '../images/home/queenstown-600.webp'
import qt1200 from '../images/home/queenstown-1200.webp'
import kai480 from '../images/home/kaikoura-480.webp'
import kai900 from '../images/home/kaikoura-900.webp'
import ciegos600 from '../images/home/viaje-ciegos-600.webp'
import ciegos1200 from '../images/home/viaje-ciegos-1200.webp'
import sesenta500 from '../images/home/viaje-60-500.webp'
import sesenta1000 from '../images/home/viaje-60-1000.webp'
import nos600 from '../images/home/nosotras-600.webp'
import nos1100 from '../images/home/nosotras-1100.webp'
import secuoyas from '../images/blind-travel-redwoods.webp'
import talla from '../images/blind-travel-maori-carving.webp'
import parapente from '../images/parapente-poster.jpg'
import kayak from '../images/kayak-kaikoura.jpg'
import haka from '../images/haka-cultura-maori.jpg'

const una = (src, w, h) => variantes([{ src, w, h }])
const GEISER = variantes([{ src: hero900, w: 900, h: 675 }, { src: hero1400, w: 1400, h: 1050 }, { src: hero1800, w: 1800, h: 1350 }])
const PARAPENTE = una(parapente, 1600, 1400)

/* Huecos de imagen de la home (sección "home" en /admin/imagenes) y su foto
   por defecto. null = el proyecto todavía no tiene una foto adecuada: el
   hueco se ve como un bloque gris hasta que se suba la suya desde el admin.
   El texto alternativo por defecto de cada uno está en home.huecos.<clave>
   (es.json / en.json) y se edita también desde el admin. */
const IMG = {
  'hero-poster': null,
  'pais-vertical': null,
  'pais-panoramica': null,
  'panel-privado': PARAPENTE,
  'panel-sesenta': una(secuoyas, 844, 1125),
  'panel-ciegos': variantes([{ src: ciegos600, w: 600, h: 800 }, { src: ciegos1200, w: 1200, h: 1600 }]),
  'salida-foto': variantes([{ src: sesenta500, w: 500, h: 666 }, { src: sesenta1000, w: 1000, h: 1333 }]),
  'tiaki-fondo': null,
  'destino-rotorua': GEISER,
  'destino-fiordland': null,
  'destino-aoraki': null,
  'destino-queenstown': variantes([{ src: qt600, w: 600, h: 525 }, { src: qt1200, w: 1200, h: 1050 }]),
  'destino-kaikoura': variantes([{ src: kai480, w: 480, h: 642 }, { src: kai900, w: 900, h: 1204 }]),
  'destino-waitomo': null,
  'galeria-01': GEISER,
  'galeria-02': una(talla, 1000, 1333),
  'galeria-03': una(secuoyas, 844, 1125),
  'galeria-04': PARAPENTE,
  'galeria-05': una(kayak, 1312, 1755),
  'galeria-06': una(haka, 1129, 2000),
  'galeria-07': null, 'galeria-08': null, 'galeria-09': null,
  'galeria-10': null, 'galeria-11': null, 'galeria-12': null,
  nosotras: variantes([{ src: nos600, w: 600, h: 800 }, { src: nos1100, w: 1100, h: 1467 }]),
  cierre: null,
}

const WHATSAPP = 'https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20WatchOut%20Tours'
const TIAKI = 'https://www.tiakinewzealand.com'

/* Valores que recibe el equipo en el correo (siempre en español). */
const VIAJES_EQUIPO = {
  'viajes-60': 'Viajes +60',
  'personas-ciegas': 'Viajes para personas ciegas y con baja visión',
  'privado': 'Viaje en privado',
  'no-se': 'Aún no lo sé',
}

const reducirMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const dos = n => String(n).padStart(2, '0')

/* Texto con marcas: <i>…</i> pasa a Fraunces cursiva y <br/> a salto de línea. */
function Texto({ k }) {
  return <Trans i18nKey={k} components={{ i: <span className="hn-it" />, br: <br /> }} />
}

/* Etiqueta de sección con su filete de 40 px */
function Etiqueta({ children, clara, className = '' }) {
  return <p className={`hn-lbl${clara ? ' hn-lbl--clara' : ''} ${className}`.trim()}>{children}</p>
}

/* Foto de un hueco. El contenedor se pinta siempre: sin foto es el bloque
   gris de la maqueta. */
function Foto({ clave, sizes, className = '', prioritaria, children }) {
  const { t } = useTranslation()
  return (
    <div className={`hn-foto ${className}`.trim()}>
      <ImagenHueco
        seccion="home" clave={clave} defecto={IMG[clave]} alt={t(`home.huecos.${clave}`)}
        sizes={sizes} prioritaria={prioritaria}
      />
      {children}
    </div>
  )
}

/* ── 1. Hero con vídeo ───────────────────────────────────────────────── */
/* El vídeo es decorativo (aria-hidden): lo que cuenta la imagen lo dice el
   texto alternativo del hueco "hero-poster", que está debajo y es lo que se
   ve si el vídeo no carga o si se pide reducir el movimiento.
   No lleva el atributo autoplay en el HTML: se arranca desde aquí para
   poder respetar prefers-reduced-motion (con él, no se reproduce solo).
   El botón solo aparece cuando hay vídeo que pausar; aria-pressed="true"
   significa "en pausa". */
function Hero() {
  const { t } = useTranslation()
  const poster = useSiteImage('home', 'hero-poster', null, '')
  const video = useRef(null)
  const [hayVideo, setHayVideo] = useState(false)
  const [enMarcha, setEnMarcha] = useState(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true // React no pone el atributo muted en el HTML
    // Escuchas nativas: en la página prerenderizada el vídeo puede haber
    // cargado (o empezado) antes de que React se enganche al HTML.
    const listo = () => setHayVideo(true)
    const estado = () => { setEnMarcha(!v.paused); if (!v.paused) setHayVideo(true) }
    v.addEventListener('loadedmetadata', listo)
    v.addEventListener('play', estado)
    v.addEventListener('playing', estado)
    v.addEventListener('pause', estado)
    if (v.readyState >= 1) listo()
    estado()
    if (!reducirMovimiento()) v.play()?.catch(() => {})
    return () => {
      v.removeEventListener('loadedmetadata', listo)
      v.removeEventListener('play', estado)
      v.removeEventListener('playing', estado)
      v.removeEventListener('pause', estado)
    }
  }, [])

  function alternar() {
    const v = video.current
    if (!v) return
    if (v.paused) v.play()?.catch(() => {})
    else v.pause()
  }

  return (
    <section className="hn-hero" aria-labelledby="hn-hero-titulo">
      <Foto clave="hero-poster" sizes="100vw" prioritaria className="hn-hero__media" />
      <video
        ref={video}
        className={`hn-hero__video${hayVideo ? ' hn-hero__video--lista' : ''}`}
        poster={poster.src || undefined}
        muted loop playsInline preload="metadata"
        aria-hidden="true" tabIndex={-1}
      >
        <source src="/media/hero.webm" type="video/webm" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <div className="hn-hero__velo" aria-hidden="true" />

      <div className="hn-hero__contenido">
        <Etiqueta clara>{t('home.hero.etiqueta')}</Etiqueta>
        <h1 id="hn-hero-titulo" className="hn-h1"><Texto k="home.hero.titulo" /></h1>
        <p className="hn-hero__sub">{t('home.hero.sub')}</p>
        <div className="hn-botones">
          <a href="#itinerario" className="hn-btn">{t('home.hero.cta1')}</a>
          <a href="#colecciones" className="hn-btn hn-btn--fantasma">{t('home.hero.cta2')}</a>
        </div>
      </div>

      <div className="hn-hero__pie">
        <span>{t('home.hero.pieVideo')}</span>
        {hayVideo && (
          <>
            <span aria-hidden="true">·</span>
            <button type="button" className="hn-hero__pausa" aria-pressed={!enMarcha} onClick={alternar}>
              <span className={`hn-hero__signo${enMarcha ? '' : ' hn-hero__signo--play'}`} aria-hidden="true" />
              {enMarcha ? t('home.hero.pausar') : t('home.hero.reproducir')}
            </button>
          </>
        )}
      </div>
    </section>
  )
}

/* ── 2. El país: foto vertical + texto, y panorámica a sangre ────────── */
function ElPais() {
  const { t } = useTranslation()
  return (
    <>
      <section id="el-pais" className="hn-sec hn-par" aria-labelledby="hn-pais-titulo">
        <Foto clave="pais-vertical" sizes="(min-width: 901px) 40vw, 100vw" className="hn-par__foto hn-par__foto--vertical" />
        <div className="hn-par__texto">
          <Etiqueta>{t('home.pais.etiqueta')}</Etiqueta>
          <h2 id="hn-pais-titulo" className="hn-h2"><Texto k="home.pais.titulo" /></h2>
          <p className="hn-body hn-body--primero">{t('home.pais.p1')}</p>
          <p className="hn-body">{t('home.pais.p2')}</p>
          <p className="hn-frase">{t('home.pais.cierre')}</p>
        </div>
      </section>
      <figure className="hn-panoramica">
        <Foto clave="pais-panoramica" sizes="100vw" className="hn-panoramica__foto" />
        <figcaption className="hn-cap">{t('home.pais.pie')}</figcaption>
      </figure>
    </>
  )
}

/* ── 3. Cita de las fundadoras ───────────────────────────────────────── */
function Cita() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-cita" aria-label={t('home.cita.firma')}>
      <figure>
        <blockquote><p><Texto k="home.cita.texto" /></p></blockquote>
        <figcaption className="hn-firma">{t('home.cita.firma')}</figcaption>
      </figure>
    </section>
  )
}

/* ── 4. Colecciones: tres paneles a pantalla completa ────────────────── */
const PANELES = [
  { id: 'privado', clave: 'panel-privado', to: '/productos', modos: true },
  { id: 'sesenta', clave: 'panel-sesenta', to: '/sin-prisa' },
  { id: 'ciegos', clave: 'panel-ciegos', to: '/mas-alla-de-la-vista' },
]

function Colecciones() {
  const { t } = useTranslation()
  return (
    <section id="colecciones" className="hn-colecciones" aria-labelledby="hn-colecciones-titulo">
      <div className="hn-colecciones__cabecera">
        <Etiqueta>{t('home.colecciones.etiqueta')}</Etiqueta>
        <h2 id="hn-colecciones-titulo" className="hn-h2"><Texto k="home.colecciones.titulo" /></h2>
      </div>
      {PANELES.map(({ id, clave, to, modos }, i) => {
        const ns = `home.colecciones.${id}`
        return (
          <article key={id} className="hn-panel" aria-labelledby={`hn-panel-${id}`}>
            <Foto clave={clave} sizes="100vw" className="hn-panel__foto">
              <div className="hn-velo" aria-hidden="true" />
            </Foto>
            <div className="hn-panel__texto">
              <Etiqueta clara>{dos(i + 1)} · {t(`${ns}.etiqueta`)}</Etiqueta>
              <h3 id={`hn-panel-${id}`} className="hn-h2"><Texto k={`${ns}.titulo`} /></h3>
              <p className="hn-panel__parrafo">{t(`${ns}.texto`)}</p>
              {modos && (
                <div className="hn-modos">
                  {[1, 2].map(n => (
                    <div key={n} className="hn-modo">
                      <h4 className="hn-modo__titulo">{t(`${ns}.modo${n}`)}</h4>
                      <p>{t(`${ns}.modo${n}Texto`)}</p>
                    </div>
                  ))}
                </div>
              )}
              <L to={to} className="hn-lnk">{t(`${ns}.enlace`)}</L>
            </div>
          </article>
        )
      })}
    </section>
  )
}

/* ── 5. Próxima salida ───────────────────────────────────────────────── */
function ProximaSalida({ setViaje }) {
  const { t } = useTranslation()
  return (
    <section id="salida" className="hn-sec hn-par hn-blanca" aria-labelledby="hn-salida-titulo">
      <div className="hn-par__texto">
        <Etiqueta>{t('home.salida.etiqueta')}</Etiqueta>
        <h2 id="hn-salida-titulo" className="hn-h2"><Texto k="home.salida.titulo" /></h2>
        <p className="hn-body hn-body--primero">{t('home.salida.texto')}</p>
        <div className="hn-botones">
          <a href="#itinerario" className="hn-btn" onClick={() => setViaje('viajes-60')}>{t('home.salida.itinerario')}</a>
          <BotonVideollamada className="hn-btn hn-btn--tinta">{t('home.salida.hablar')}</BotonVideollamada>
        </div>
      </div>
      <Foto clave="salida-foto" sizes="(min-width: 901px) 42vw, 100vw" className="hn-par__foto hn-par__foto--salida" />
    </section>
  )
}

/* ── 6. Pilares: cuatro columnas numeradas ───────────────────────────── */
function Pilares() {
  const { t } = useTranslation()
  const items = t('home.pilares.items', { returnObjects: true })
  return (
    <section className="hn-sec" aria-labelledby="hn-pilares-titulo">
      <Etiqueta>{t('home.pilares.etiqueta')}</Etiqueta>
      <h2 id="hn-pilares-titulo" className="hn-h2"><Texto k="home.pilares.titulo" /></h2>
      {/* role="list": sin viñetas, Safari quitaría la semántica de lista */}
      <ol className="hn-columnas hn-pilares" role="list">
        {items.map((p, i) => (
          <li key={p.titulo}>
            <span className="hn-num" aria-hidden="true">{dos(i + 1)}</span>
            <h3 className="hn-columnas__titulo">{p.titulo}</h3>
            <p>{p.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 7. Tiaki: foto a sangre + banda oscura con los tres compromisos ─── */
function Tiaki() {
  const { t } = useTranslation()
  const items = t('home.tiaki.items', { returnObjects: true })
  return (
    <section id="tiaki" className="hn-tiaki" aria-labelledby="hn-tiaki-titulo">
      <Foto clave="tiaki-fondo" sizes="100vw" className="hn-tiaki__foto">
        <div className="hn-tiaki__velo" aria-hidden="true" />
        <div className="hn-tiaki__cabecera">
          <Etiqueta clara>{t('home.tiaki.etiqueta')}</Etiqueta>
          <h2 id="hn-tiaki-titulo" className="hn-h1 hn-h1--menor"><Texto k="home.tiaki.titulo" /></h2>
        </div>
      </Foto>
      <div className="hn-tiaki__banda">
        <p className="hn-tiaki__texto">{t('home.tiaki.texto')}</p>
        <ol className="hn-columnas hn-compromisos" role="list">
          {items.map((c, i) => (
            <li key={c.titulo}>
              <span className="hn-compromisos__num" aria-hidden="true">{dos(i + 1)}</span>
              <h3 className="hn-columnas__titulo">{c.titulo}</h3>
              <p>{c.texto}</p>
            </li>
          ))}
        </ol>
        <div className="hn-tiaki__cierre">
          <p className="hn-tiaki__frase">{t('home.tiaki.cierre')}</p>
          <a href={TIAKI} className="hn-lnk hn-lnk--clara" target="_blank" rel="noopener noreferrer">
            {t('home.tiaki.enlace')}<span className="sr-only"> {t('common.newTab')}</span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── 8. Destinos: seis bloques alternos foto / texto ─────────────────── */
function Destinos() {
  const { t } = useTranslation()
  const items = t('home.destinos.items', { returnObjects: true })
  return (
    <section id="destinos" className="hn-destinos" aria-labelledby="hn-destinos-titulo">
      <Etiqueta>{t('home.destinos.etiqueta')}</Etiqueta>
      <h2 id="hn-destinos-titulo" className="hn-h2"><Texto k="home.destinos.titulo" /></h2>
      <ol className="hn-destinos__lista" role="list">
        {items.map((d, i) => (
          <li key={d.id} className={`hn-destino${i % 2 ? ' hn-destino--inverso' : ''}`}>
            <Foto clave={`destino-${d.id}`} sizes="(min-width: 901px) 50vw, 100vw" className="hn-destino__foto" />
            <div className="hn-destino__texto">
              <span className="hn-num" aria-hidden="true">{dos(i + 1)}</span>
              {/* El nombre del lugar forma parte del encabezado */}
              <h3 className="hn-destino__titulo">
                <span className="hn-lbl">{d.nombre}</span>
                <span className="hn-h3">{d.titulo}</span>
              </h3>
              <p className="hn-body hn-body--menor">{d.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 9. Galería: mosaico de 12 huecos con visor accesible ────────────── */
const GALERIA = Array.from({ length: 12 }, (_, i) => `galeria-${dos(i + 1)}`)

function Galeria() {
  const { t } = useTranslation()
  // Número fijo de huecos: los hooks se llaman siempre en el mismo orden.
  const todas = GALERIA.map(clave => ({
    clave, ...useSiteImage('home', clave, IMG[clave]?.src ?? null, t(`home.huecos.${clave}`)),
  }))
  const fotos = todas.filter(f => f.src)
  const [abierta, setAbierta] = useState(null)
  const disparador = useRef(null)

  function abrir(n, e) {
    disparador.current = e.currentTarget
    setAbierta(n)
  }
  function cerrar() {
    setAbierta(null)
    // El foco vuelve al control desde el que se abrió el visor
    requestAnimationFrame(() => disparador.current?.focus())
  }

  return (
    <section id="galeria" className="hn-galeria" aria-labelledby="hn-galeria-titulo">
      <div className="hn-galeria__cabecera">
        <div>
          <Etiqueta>{t('home.galeria.etiqueta')}</Etiqueta>
          <h2 id="hn-galeria-titulo" className="hn-h2"><Texto k="home.galeria.titulo" /></h2>
        </div>
        {fotos.length > 0 && (
          <button type="button" className="hn-lnk hn-lnk--verde" onClick={e => abrir(0, e)}>
            {t('home.galeria.enlace')}
          </button>
        )}
      </div>
      {/* Los 12 huecos ocupan siempre su sitio en el mosaico; el que aún no
          tiene foto es un bloque gris sin contenido. */}
      <ul className="hn-mosaico" role="list">
        {todas.map((f, i) => {
          const n = fotos.indexOf(f)
          return (
            <li key={f.clave} className={`hn-mosaico__item hn-mosaico__item--${i + 1}`} aria-hidden={f.src ? undefined : 'true'}>
              {f.src && (
                <button type="button" className="hn-mosaico__boton" onClick={e => abrir(n, e)}>
                  <ImagenHueco
                    seccion="home" clave={f.clave} defecto={IMG[f.clave]} alt=""
                    sizes="(min-width: 901px) 44vw, 90vw"
                  />
                  <span className="sr-only" lang={f.lang}>{t('home.galeria.ampliar')} {f.alt}</span>
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {abierta !== null && (
        <Visor fotos={fotos} indice={abierta} setIndice={setAbierta} onCerrar={cerrar} />
      )}
    </section>
  )
}

/* Visor a pantalla completa: <dialog> modal (el resto de la página queda
   inerte), Escape cierra, ← y → cambian de foto, Tab no sale del visor y
   el texto alternativo se ve como pie de foto. */
function Visor({ fotos, indice, setIndice, onCerrar }) {
  const { t } = useTranslation()
  const ref = useRef(null)
  const total = fotos.length
  const foto = fotos[indice]
  const ir = paso => setIndice((indice + paso + total) % total)

  useEffect(() => {
    const d = ref.current
    if (d && !d.open) d.showModal?.()
    document.body.classList.add('visor-abierto')
    return () => document.body.classList.remove('visor-abierto')
  }, [])

  function teclas(e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1) }
    else if (e.key === 'Tab') {
      const foco = [...ref.current.querySelectorAll('button')]
      const primero = foco[0], ultimo = foco[foco.length - 1]
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
  }

  return (
    <dialog
      ref={ref} className="hn-visor" aria-label={t('home.galeria.visor')}
      onKeyDown={teclas}
      onCancel={e => { e.preventDefault(); onCerrar() }}
      onClick={e => { if (e.target === ref.current) onCerrar() }}
    >
      <button type="button" className="hn-visor__cerrar" onClick={onCerrar} autoFocus>
        {t('home.galeria.cerrar')}<span aria-hidden="true"> ✕</span>
      </button>
      <figure className="hn-visor__figura">
        <img src={foto.src} alt="" />
        <figcaption className="hn-visor__pie" lang={foto.lang}>{foto.alt}</figcaption>
      </figure>
      <p className="hn-visor__contador" aria-live="polite">
        {t('home.galeria.contador', { n: indice + 1, total })}
      </p>
      {total > 1 && (
        <>
          <button type="button" className="hn-visor__flecha hn-visor__flecha--ant" onClick={() => ir(-1)}>
            <span aria-hidden="true">←</span><span className="sr-only">{t('home.galeria.anterior')}</span>
          </button>
          <button type="button" className="hn-visor__flecha hn-visor__flecha--sig" onClick={() => ir(1)}>
            <span aria-hidden="true">→</span><span className="sr-only">{t('home.galeria.siguiente')}</span>
          </button>
        </>
      )}
    </dialog>
  )
}

/* ── 10. Fundadoras: retrato a sangre y texto ────────────────────────── */
function Fundadoras() {
  const { t } = useTranslation()
  return (
    <section id="fundadoras" className="hn-fundadoras hn-blanca" aria-labelledby="hn-fundadoras-titulo">
      <Foto clave="nosotras" sizes="(min-width: 901px) 50vw, 100vw" className="hn-fundadoras__foto" />
      <div className="hn-fundadoras__texto">
        <Etiqueta>{t('home.fundadoras.etiqueta')}</Etiqueta>
        <h2 id="hn-fundadoras-titulo" className="hn-h2"><Texto k="home.fundadoras.titulo" /></h2>
        <p className="hn-body hn-body--primero">{t('home.fundadoras.p1')}</p>
        <p className="hn-body">{t('home.fundadoras.p2')}</p>
        <p className="hn-body">{t('home.fundadoras.p3')}</p>
        <p className="hn-frase hn-frase--firma">{t('home.fundadoras.firma')}</p>
        <div><L to="/sobre-nosotras" className="hn-lnk hn-lnk--verde">{t('home.fundadoras.enlace')}</L></div>
      </div>
    </section>
  )
}

/* ── 12. Cierre a pantalla completa ──────────────────────────────────── */
function Cierre() {
  const { t } = useTranslation()
  return (
    <section className="hn-cierre" aria-labelledby="hn-cierre-titulo">
      <Foto clave="cierre" sizes="100vw" className="hn-cierre__foto" />
      <div className="hn-cierre__velo" aria-hidden="true" />
      <div className="hn-cierre__contenido">
        <h2 id="hn-cierre-titulo" className="hn-h1 hn-h1--menor"><Texto k="home.cierre.titulo" /></h2>
        <p>{t('home.cierre.texto')}</p>
        <a href="#itinerario" className="hn-btn hn-btn--fantasma">{t('home.cierre.boton')}</a>
      </div>
    </section>
  )
}

/* ── 13. Pedir itinerario (Formspree) ────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEL_RE = /^\+?[\d\s().-]{7,20}$/
const SPAM_DELAY_MS = 60_000

function PedirItinerario({ viaje, setViaje }) {
  const { t } = useTranslation()
  const lang = useLang()
  const [state, enviarFormspree] = useForm('xykqrkjq')
  const [errores, setErrores] = useState({})
  const [contacto, setContacto] = useState('')
  const exitoRef = useRef(null)
  const opciones = t('home.itinerario.opciones', { returnObjects: true })

  useEffect(() => {
    if (state.succeeded) exitoRef.current?.focus()
  }, [state.succeeded])

  function enviar(e) {
    e.preventDefault()
    let ultimo = 0
    try { ultimo = Number(localStorage.getItem('wot_last_submit') || 0) } catch { /* sin almacenamiento */ }
    if (Date.now() - ultimo < SPAM_DELAY_MS) { setErrores({ _spam: t('contacto.err.spam') }); return }
    const datos = new FormData(e.target)
    const err = {}
    if ((datos.get('nombre') ?? '').trim().length < 2) err.nombre = t('home.itinerario.errNombre')
    const c = (datos.get('contacto') ?? '').trim()
    if (!EMAIL_RE.test(c) && !TEL_RE.test(c)) err.contacto = t('home.itinerario.errContacto')
    if (!datos.get('viaje')) err.viaje = t('home.itinerario.errViaje')
    if (!datos.get('privacidad')) err.privacidad = t('contacto.err.privacidad')
    if (Object.keys(err).length) {
      setErrores(err)
      requestAnimationFrame(() => e.target.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setErrores({})
    try { localStorage.setItem('wot_last_submit', String(Date.now())) } catch { /* sin almacenamiento */ }
    enviarFormspree(e)
  }

  const clase = campo => `form-control${errores[campo] ? ' form-control--error' : ''}`
  const describe = (...ids) => ids.filter(Boolean).join(' ') || undefined
  const esEmail = EMAIL_RE.test(contacto.trim())

  return (
    <section id="itinerario" className="hn-sec hn-itinerario-sec" aria-labelledby="hn-itinerario-titulo">
      <div className="hn-itinerario">
        <div className="hn-itinerario__texto">
          <h2 id="hn-itinerario-titulo" className="hn-h2">{t('home.itinerario.titulo')}</h2>
          <p className="hn-body hn-body--primero">{t('home.itinerario.texto')}</p>
          <p className="hn-body hn-itinerario__llamada">{t('home.itinerario.videollamadaLinea')}</p>
          <div className="hn-botones hn-itinerario__botones">
            <BotonVideollamada className="hn-btn hn-btn--tinta" />
          </div>
          <a href={WHATSAPP} className="hn-lnk hn-lnk--verde" target="_blank" rel="noopener noreferrer">
            {t('home.itinerario.whatsapp')}
            <span className="sr-only"> {t('common.newTab')}</span>
          </a>
        </div>

        <div className="hn-itinerario__form">
          <p
            ref={exitoRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true"
            className={state.succeeded ? 'form-status--success' : 'sr-only'}
          >
            {state.succeeded ? t('home.itinerario.exito') : ''}
          </p>

          {!state.succeeded && (
            <form onSubmit={enviar} noValidate aria-label={t('home.itinerario.formAria')}>
              <input type="hidden" name="_subject" value="Solicitud de itinerario" />
              <input type="hidden" name="idioma" value={lang === 'en' ? 'Inglés' : 'Español'} />
              {/* Si el contacto es un correo, Formspree lo usa para "Responder a" */}
              {esEmail && <input type="hidden" name="_replyto" value={contacto.trim()} />}
              <div aria-hidden="true" style={{ display: 'none' }}>
                <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {errores._spam && <p role="alert" className="form-error form-error--group"><span aria-hidden="true">⚠ </span>{errores._spam}</p>}

              <div className="form-field">
                <label htmlFor="itinerario-nombre" className="form-label">
                  {t('home.itinerario.nombre')}
                  <span aria-hidden="true" className="required-marker"> *</span>
                  <span className="sr-only">{t('contacto.requiredSr')}</span>
                </label>
                <input
                  id="itinerario-nombre" name="nombre" type="text" autoComplete="name"
                  aria-required="true" aria-invalid={!!errores.nombre}
                  aria-describedby={describe(errores.nombre && 'itinerario-nombre-err')}
                  className={clase('nombre')}
                />
                {errores.nombre && <p id="itinerario-nombre-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.nombre}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="itinerario-contacto" className="form-label">
                  {t('home.itinerario.contacto')}
                  <span aria-hidden="true" className="required-marker"> *</span>
                  <span className="sr-only">{t('contacto.requiredSr')}</span>
                </label>
                <p id="itinerario-contacto-ayuda" className="hn-ayuda">{t('home.itinerario.contactoAyuda')}</p>
                <input
                  id="itinerario-contacto" name="contacto" type="text" autoComplete="on"
                  value={contacto} onChange={e => setContacto(e.target.value)}
                  aria-required="true" aria-invalid={!!errores.contacto}
                  aria-describedby={describe('itinerario-contacto-ayuda', errores.contacto && 'itinerario-contacto-err')}
                  className={clase('contacto')}
                />
                {errores.contacto && <p id="itinerario-contacto-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.contacto}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="itinerario-viaje" className="form-label">
                  {t('home.itinerario.viaje')}
                  <span aria-hidden="true" className="required-marker"> *</span>
                  <span className="sr-only">{t('contacto.requiredSr')}</span>
                </label>
                <select
                  id="itinerario-viaje" name="viaje" value={viaje} onChange={e => setViaje(e.target.value)}
                  aria-required="true" aria-invalid={!!errores.viaje}
                  aria-describedby={describe(errores.viaje && 'itinerario-viaje-err')}
                  className={`${clase('viaje')} hn-select`}
                >
                  <option value="">{t('home.itinerario.viajeElige')}</option>
                  {Object.keys(VIAJES_EQUIPO).map(clave => (
                    <option key={clave} value={clave}>{opciones[clave]}</option>
                  ))}
                </select>
                {/* El equipo recibe el nombre del viaje en español */}
                <input type="hidden" name="viaje_elegido" value={VIAJES_EQUIPO[viaje] ?? ''} />
                {errores.viaje && <p id="itinerario-viaje-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.viaje}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="itinerario-fechas" className="form-label">
                  {t('home.itinerario.fechas')} <span className="form-optional">{t('home.itinerario.opcional')}</span>
                </label>
                <p id="itinerario-fechas-ayuda" className="hn-ayuda">{t('home.itinerario.fechasEjemplo')}</p>
                <input
                  id="itinerario-fechas" name="fechas" type="text" autoComplete="off"
                  aria-describedby="itinerario-fechas-ayuda" className="form-control"
                />
              </div>

              <div className="form-field form-consent">
                <label className="form-consent-label">
                  <input
                    type="checkbox" name="privacidad" value="aceptada"
                    aria-describedby="itinerario-privacidad-info"
                    aria-invalid={errores.privacidad ? 'true' : undefined}
                  />
                  <span>{t('contacto.consentPre')} <L to="/privacidad">{t('contacto.consentLink')}</L>.</span>
                </label>
                {errores.privacidad && <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.privacidad}</p>}
                <p id="itinerario-privacidad-info" className="form-consent-info">{t('contacto.consentInfo')}</p>
              </div>

              <button type="submit" disabled={state.submitting} className="hn-btn hn-btn--ancho">
                {state.submitting ? t('home.itinerario.enviando') : t('home.itinerario.enviar')}
              </button>
              <p className="hn-ayuda hn-itinerario__respuesta">{t('home.itinerario.respuesta')}</p>
              <div role="alert">
                <ValidationError errors={state.errors} className="form-status--error" />
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── 13b. Preguntas frecuentes ───────────────────────────────────────── */
function Preguntas() {
  const { t } = useTranslation()
  const faq = t('home.faq.items', { returnObjects: true })
  return (
    <section id="preguntas" className="hn-sec hn-faq-sec" aria-labelledby="hn-faq-titulo">
      <div className="hn-faq">
        <h2 id="hn-faq-titulo" className="hn-h3 hn-faq__titulo">{t('home.faq.titulo')}</h2>
        {faq.map(({ q, a }, i) => (
          <Desplegable key={q} id={`hn-faq-${i + 1}`} boton={q} Titulo="h3" className="hn-faq__item">
            <p>{a}</p>
          </Desplegable>
        ))}
      </div>
    </section>
  )
}

/* ── Home ────────────────────────────────────────────────────────────────
 * Reproduce la maqueta aprobada: hero con vídeo → el país (foto vertical y
 * panorámica) → cita de las fundadoras → colecciones (tres paneles a
 * pantalla completa) → próxima salida → pilares → Tiaki → destinos →
 * galería → fundadoras → reseña destacada → cierre → formulario del
 * itinerario y preguntas frecuentes.
 * Estilos en HomeNueva.css (todo bajo .hn y .hn-*).
 * ──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('')

  // Si se llega desde otra página con un ancla (/#itinerario, /#tiaki), la
  // sección aún no existía cuando el enrutador intentó ir a ella.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])

  return (
    <div className="hn">
      <Seo pageType="home" title={t('home.seo.title')} description={t('home.seo.description')} />
      <Hero />
      <ElPais />
      <Cita />
      <Colecciones />
      <ProximaSalida setViaje={setViaje} />
      <Pilares />
      <Tiaki />
      <Destinos />
      <Galeria />
      <Fundadoras />
      <ResenasDestacadas variante="home" id="resenas" antetitulo={t('home.resenas.etiqueta')} />
      <Cierre />
      <PedirItinerario viaje={viaje} setViaje={setViaje} />
      <Preguntas />
    </div>
  )
}
