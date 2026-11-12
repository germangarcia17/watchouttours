import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
// Imágenes por defecto de los huecos (versiones a varios anchos en src/images/home)
import hero900 from '../images/home/hero-900.webp'
import hero1400 from '../images/home/hero-1400.webp'
import hero1800 from '../images/home/hero-1800.webp'
import maori480 from '../images/home/maori-480.webp'
import maori900 from '../images/home/maori-900.webp'
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
const HERO = variantes([{ src: hero900, w: 900, h: 675 }, { src: hero1400, w: 1400, h: 1050 }, { src: hero1800, w: 1800, h: 1350 }])

/* Imagen por defecto de cada hueco (sección "home" en /admin/imagenes).
   null = todavía no hay foto adecuada en el proyecto: el hueco no se pinta
   (o deja ver el fondo oscuro de su bloque) hasta que se suba desde el
   admin. Las claves y los textos alternativos por defecto están listados en
   supabase/migrations/013_home_editorial_huecos.sql. */
const IMG = {
  'hero-poster': HERO,
  'pais-vertical': variantes([{ src: maori480, w: 480, h: 850 }, { src: maori900, w: 900, h: 1594 }]),
  'pais-panoramica': null,
  'porque-grupo': variantes([{ src: sesenta500, w: 500, h: 666 }, { src: sesenta1000, w: 1000, h: 1333 }]),
  'panel-ciegos': variantes([{ src: ciegos600, w: 600, h: 800 }, { src: ciegos1200, w: 1200, h: 1600 }]),
  'panel-sesenta': una(secuoyas, 844, 1125),
  'panel-privado': una(parapente, 1600, 1400),
  'salida-foto': una(talla, 1000, 1333),
  'ruta-auckland': null,
  'ruta-hobbiton-rotorua': HERO,
  'ruta-queenstown': variantes([{ src: qt600, w: 600, h: 525 }, { src: qt1200, w: 1200, h: 1050 }]),
  'ruta-milford': null,
  'ruta-aoraki': null,
  'ruta-tekapo': null,
  'ruta-kaikoura': variantes([{ src: kai480, w: 480, h: 642 }, { src: kai900, w: 900, h: 1204 }]),
  'galeria-01': HERO,
  'galeria-02': una(talla, 1000, 1333),
  'galeria-03': una(secuoyas, 844, 1125),
  'galeria-04': una(parapente, 1600, 1400),
  'galeria-05': una(kayak, 1312, 1755),
  'galeria-06': una(haka, 1129, 2000),
  'galeria-07': null, 'galeria-08': null, 'galeria-09': null,
  'galeria-10': null, 'galeria-11': null, 'galeria-12': null,
  'tiaki-infografia': null,
  nosotras: variantes([{ src: nos600, w: 600, h: 800 }, { src: nos1100, w: 1100, h: 1467 }]),
  cierre: null,
}

const WHATSAPP = 'https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20Watchout%20Tours'
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

/* Lleva el foco a un campo del formulario del itinerario (y lo enseña). */
function irAlCampo(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth', block: 'center' })
  el.focus({ preventScroll: true })
}

/* ¿Tiene foto el hueco? (subida en el admin o por defecto en el proyecto) */
function useTieneFoto(clave, alt) {
  return !!useSiteImage('home', clave, IMG[clave]?.src ?? null, alt).src
}

/* Foto de un hueco dentro de un <figure>, con pie opcional. Si el hueco no
   tiene foto todavía, no se pinta nada (ni el figure). */
function FotoHueco({ clave, alt, sizes, className = '', pie, prioritaria }) {
  const tiene = useTieneFoto(clave, alt)
  if (!tiene) return null
  return (
    <figure className={`hn-foto ${className}`.trim()}>
      <ImagenHueco seccion="home" clave={clave} defecto={IMG[clave]} alt={alt} sizes={sizes} prioritaria={prioritaria} />
      {pie && <figcaption className="hn-pie">{pie}</figcaption>}
    </figure>
  )
}

/* Etiqueta de sección con su filete de 40 px */
function Etiqueta({ children, clara }) {
  return <p className={`hn-etiqueta${clara ? ' hn-etiqueta--clara' : ''}`}>{children}</p>
}

/* ── 1. Hero con vídeo ───────────────────────────────────────────────── */
/* El vídeo es decorativo (aria-hidden): la información la da la foto del
   hueco "hero-poster", que está debajo con su texto alternativo y es lo que
   se ve si el vídeo no carga o si se pide reducir el movimiento.
   El botón de pausa solo aparece cuando hay vídeo que pausar. Su texto
   cambia ("Pausar vídeo" / "Reproducir vídeo"), así que no lleva
   aria-pressed: un botón de alternancia debe mantener el mismo nombre. */
function Hero() {
  const { t } = useTranslation()
  const poster = useSiteImage('home', 'hero-poster', IMG['hero-poster'].src, t('home.heroImgAlt'))
  const video = useRef(null)
  const [hayVideo, setHayVideo] = useState(false)
  const [enMarcha, setEnMarcha] = useState(false)

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true // React no pone el atributo muted en el HTML
    if (reducirMovimiento()) return
    v.play()?.then(() => setEnMarcha(true)).catch(() => setEnMarcha(false))
  }, [])

  function alternar() {
    const v = video.current
    if (!v) return
    if (v.paused) v.play()?.then(() => setEnMarcha(true)).catch(() => {})
    else { v.pause(); setEnMarcha(false) }
  }

  return (
    <section className="hn-hero" aria-labelledby="hn-hero-titulo">
      <ImagenHueco
        seccion="home" clave="hero-poster" defecto={IMG['hero-poster']} alt={t('home.heroImgAlt')}
        sizes="100vw" prioritaria className="hn-hero__media"
      />
      <video
        ref={video}
        className={`hn-hero__media hn-hero__video${hayVideo ? ' hn-hero__video--lista' : ''}`}
        poster={poster.src || undefined}
        muted loop playsInline preload="metadata"
        aria-hidden="true" tabIndex={-1}
        onLoadedMetadata={() => setHayVideo(true)}
        onPlay={() => setEnMarcha(true)}
        onPause={() => setEnMarcha(false)}
      >
        <source src="/media/hero.webm" type="video/webm" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      <div className="hn-hero__velo" aria-hidden="true" />

      <div className="hn-wrap hn-hero__contenido">
        <Etiqueta clara>{t('home.hero.etiqueta')}</Etiqueta>
        <h1 id="hn-hero-titulo" className="hn-h1">{t('home.hero.h1')}</h1>
        <p className="hn-hero__sub">{t('home.hero.sub')}</p>
        <div className="hn-botones">
          <a href="#tres-maneras" className="hn-btn hn-btn--coral">{t('home.hero.cta1')}</a>
          <a href="#itinerario" className="hn-btn hn-btn--borde-blanco">{t('home.hero.cta2')}</a>
        </div>
      </div>

      {hayVideo && (
        <button type="button" className="hn-hero__pausa" onClick={alternar}>
          <span className={`hn-hero__pausa-signo${enMarcha ? '' : ' hn-hero__pausa-signo--play'}`} aria-hidden="true" />
          {enMarcha ? t('home.hero.pausar') : t('home.hero.reproducir')}
        </button>
      )}
      <span className="hn-hero__scroll" aria-hidden="true" />
    </section>
  )
}

/* ── 2. Franja ───────────────────────────────────────────────────────── */
function Franja() {
  const { t } = useTranslation()
  return (
    <section className="hn-franja" aria-label={t('home.franja.frase')}>
      <p className="hn-franja__frase hn-revela">{t('home.franja.frase')}</p>
    </section>
  )
}

/* ── 3. El país: doble página + panorámica ───────────────────────────── */
function ElPais() {
  const { t } = useTranslation()
  return (
    <section id="el-pais" className="hn-seccion hn-pais" aria-labelledby="hn-pais-titulo">
      <div className="hn-doble">
        <FotoHueco
          clave="pais-vertical" alt={t('home.pais.imgAlt')}
          sizes="(min-width: 900px) 60vw, 100vw" className="hn-doble__foto"
        />
        <div className="hn-doble__texto hn-revela">
          <Etiqueta>{t('home.pais.etiqueta')}</Etiqueta>
          <h2 id="hn-pais-titulo" className="hn-h2">{t('home.pais.titulo')}</h2>
          <p className="hn-parrafo">{t('home.pais.texto')}</p>
        </div>
      </div>
      <FotoHueco
        clave="pais-panoramica" alt={t('home.pais.panoAlt')} sizes="100vw"
        className="hn-panoramica hn-revela" pie={t('home.pais.pie')}
      />
    </section>
  )
}

/* ── 4. Por qué con nosotras ─────────────────────────────────────────── */
function PorQue() {
  const { t } = useTranslation()
  return (
    <section className="hn-seccion hn-porque" aria-labelledby="hn-porque-titulo">
      <div className="hn-estrecho hn-revela">
        <Etiqueta>{t('home.porque.etiqueta')}</Etiqueta>
        <h2 id="hn-porque-titulo" className="hn-h2">{t('home.porque.titulo')}</h2>
        <p className="hn-parrafo">{t('home.porque.texto')}</p>
        <blockquote className="hn-cita">
          <p>{t('home.porque.cita')}</p>
        </blockquote>
      </div>
      <FotoHueco clave="porque-grupo" alt={t('home.porque.imgAlt')} sizes="100vw" className="hn-sangre hn-revela" />
    </section>
  )
}

/* ── 5. Tres maneras de vivirlo: paneles a pantalla completa ─────────── */
const PANELES = [
  { id: 'ciegos', clave: 'panel-ciegos', to: '/mas-alla-de-la-vista' },
  { id: 'sesenta', clave: 'panel-sesenta', to: '/sin-prisa' },
  { id: 'privado', clave: 'panel-privado', to: '/productos' },
]

function TresManeras() {
  const { t } = useTranslation()
  return (
    <section id="tres-maneras" className="hn-maneras" aria-labelledby="hn-maneras-titulo">
      <div className="hn-wrap hn-maneras__cabecera hn-revela">
        <h2 id="hn-maneras-titulo" className="hn-h2">{t('home.viajes.titulo')}</h2>
      </div>
      {PANELES.map(({ id, clave, to }) => {
        const ns = `home.viajes.${id}`
        return (
          <article key={id} className="hn-panel" aria-labelledby={`hn-panel-${id}`}>
            <div className="hn-panel__foto">
              <ImagenHueco seccion="home" clave={clave} defecto={IMG[clave]} alt={t(`${ns}.imgAlt`)} sizes="100vw" />
            </div>
            <div className="hn-panel__texto">
              <div className="hn-wrap hn-revela">
                <Etiqueta clara>{t(`${ns}.etiqueta`)}</Etiqueta>
                <h3 id={`hn-panel-${id}`} className="hn-h2">{t(`${ns}.titulo`)}</h3>
                <p className="hn-lema">{t(`${ns}.lema`)}</p>
                <p className="hn-parrafo">{t(`${ns}.texto`)}</p>
                <L to={to} className="hn-enlace hn-enlace--flecha">
                  {t(`${ns}.enlace`)}<span aria-hidden="true" className="hn-flecha">→</span>
                </L>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

/* ── 6. Próxima salida ───────────────────────────────────────────────── */
function ProximaSalida() {
  const { t } = useTranslation()
  function proponerFechas(e) {
    e.preventDefault()
    irAlCampo('itinerario-fechas')
  }
  return (
    <section id="salida" className="hn-seccion hn-blanca hn-salida" aria-labelledby="hn-salida-titulo">
      <div className="hn-wrap hn-dos">
        <FotoHueco clave="salida-foto" alt={t('home.salida.imgAlt')} sizes="(min-width: 900px) 45vw, 100vw" className="hn-dos__foto hn-revela" />
        <div className="hn-dos__texto hn-revela">
          <Etiqueta>{t('home.salida.etiqueta')}</Etiqueta>
          <h2 id="hn-salida-titulo" className="hn-h2">{t('home.salida.titulo')}</h2>
          <p className="hn-parrafo">{t('home.salida.texto')}</p>
          <div className="hn-botones">
            <a href="#itinerario" className="hn-btn hn-btn--coral">{t('home.salida.itinerario')}</a>
            <a href="#itinerario-fechas" className="hn-btn hn-btn--borde-petroleo" onClick={proponerFechas}>{t('home.salida.fechas')}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 7. De norte a sur ───────────────────────────────────────────────── */
function Ruta() {
  const { t } = useTranslation()
  const paradas = t('home.ruta.paradas', { returnObjects: true })
  return (
    <section className="hn-seccion hn-ruta" aria-labelledby="hn-ruta-titulo">
      <div className="hn-wrap hn-revela">
        <h2 id="hn-ruta-titulo" className="hn-h2 hn-ruta__titulo">{t('home.ruta.titulo')}</h2>
      </div>
      {/* role="list": sin viñetas, Safari quitaría la semántica de lista */}
      <ol className="hn-paradas" role="list">
        {paradas.map((p, i) => (
          <li key={p.id} className={`hn-parada${i % 2 ? ' hn-parada--derecha' : ''}`}>
            <FotoHueco clave={`ruta-${p.id}`} alt={p.alt} sizes="(min-width: 900px) 58vw, 100vw" className="hn-parada__foto hn-revela" />
            <div className="hn-parada__texto hn-revela">
              <span className="hn-parada__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="hn-h3">{p.nombre}</h3>
              <p className="hn-parrafo">{p.frase}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 8. Galería con visor accesible ──────────────────────────────────── */
const GALERIA = Array.from({ length: 12 }, (_, i) => `galeria-${String(i + 1).padStart(2, '0')}`)

function Galeria() {
  const { t } = useTranslation()
  const alts = t('home.galeria.alts', { returnObjects: true })
  // Número fijo de huecos: los hooks se llaman siempre en el mismo orden.
  const todas = GALERIA.map((clave, i) => ({ clave, i, ...useSiteImage('home', clave, IMG[clave]?.src ?? null, alts[i]) }))
  const fotos = todas.filter(f => f.src)
  const [abierta, setAbierta] = useState(null)
  const disparador = useRef(null)

  if (fotos.length === 0) return null

  function abrir(i, e) {
    disparador.current = e.currentTarget
    setAbierta(i)
  }
  function cerrar() {
    setAbierta(null)
    // El foco vuelve a la foto desde la que se abrió el visor
    requestAnimationFrame(() => disparador.current?.focus())
  }

  return (
    <section className="hn-seccion hn-galeria" aria-labelledby="hn-galeria-titulo">
      <h2 id="hn-galeria-titulo" className="sr-only">{t('home.galeria.titulo')}</h2>
      <ul className="hn-mosaico" role="list">
        {fotos.map((f, n) => (
          <li key={f.clave} className={`hn-mosaico__item hn-mosaico__item--${(f.i % 6) + 1} hn-revela`}>
            <button type="button" className="hn-mosaico__boton" onClick={e => abrir(n, e)}>
              <ImagenHueco
                seccion="home" clave={f.clave} defecto={IMG[f.clave]} alt=""
                sizes="(min-width: 900px) 50vw, 100vw"
              />
              <span className="sr-only">{t('home.galeria.ampliar')} {f.alt}</span>
            </button>
          </li>
        ))}
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

/* ── 9. Tiaki ────────────────────────────────────────────────────────── */
function Tiaki() {
  const { t } = useTranslation()
  return (
    <section className="hn-seccion hn-blanca hn-tiaki" aria-labelledby="hn-tiaki-titulo">
      <div className="hn-estrecho hn-revela">
        <Etiqueta>{t('home.tiaki.etiqueta')}</Etiqueta>
        <h2 id="hn-tiaki-titulo" className="hn-h2">{t('home.tiaki.titulo')}</h2>
        <p className="hn-parrafo">{t('home.tiaki.texto')}</p>
        <FotoHueco clave="tiaki-infografia" alt={t('home.tiaki.imgAlt')} sizes="(min-width: 900px) 720px, 100vw" className="hn-tiaki__infografia" />
        <a href={TIAKI} className="hn-enlace hn-enlace--flecha" target="_blank" rel="noopener noreferrer">
          {t('home.tiaki.enlace')}<span aria-hidden="true" className="hn-flecha">→</span>
          <span className="sr-only"> {t('common.newTab')}</span>
        </a>
      </div>
    </section>
  )
}

/* ── 10. Quiénes somos ───────────────────────────────────────────────── */
function QuienesSomos() {
  const { t } = useTranslation()
  return (
    <section id="nosotras" className="hn-seccion hn-nosotras" aria-labelledby="hn-nosotras-titulo">
      <FotoHueco clave="nosotras" alt={t('home.nosotras.imgAlt')} sizes="(min-width: 900px) 55vw, 100vw" className="hn-nosotras__foto hn-revela" />
      <div className="hn-nosotras__texto hn-revela">
        <Etiqueta>{t('home.nosotras.etiqueta')}</Etiqueta>
        <h2 id="hn-nosotras-titulo" className="hn-h2">{t('home.nosotras.titulo')}</h2>
        <p className="hn-parrafo">{t('home.nosotras.texto')}</p>
        <L to="/sobre-nosotras" className="hn-enlace hn-enlace--flecha">
          {t('home.nosotras.enlace')}<span aria-hidden="true" className="hn-flecha">→</span>
        </L>
      </div>
    </section>
  )
}

/* ── 12. Cómo reservar + preguntas frecuentes ────────────────────────── */
function ComoReservar() {
  const { t } = useTranslation()
  const pasos = t('home.reservar.pasos', { returnObjects: true })
  const faq = t('home.reservar.faq', { returnObjects: true })
  return (
    <section id="como-reservar" className="hn-seccion" aria-labelledby="hn-reservar-titulo">
      <div className="hn-wrap">
        <div className="hn-cabecera hn-revela">
          <Etiqueta>{t('home.reservar.etiqueta')}</Etiqueta>
          <h2 id="hn-reservar-titulo" className="hn-h2">{t('home.reservar.titulo')}</h2>
        </div>
        {/* role="list": sin viñetas, Safari quitaría la semántica de lista */}
        <ol className="hn-pasos" role="list">
          {pasos.map((p, i) => (
            <li key={p} className="hn-paso hn-revela">
              <span className="hn-paso__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <p className="hn-parrafo">{p}</p>
            </li>
          ))}
        </ol>

        <div className="hn-faq">
          <h2 id="hn-faq-titulo" className="hn-h3 hn-faq__titulo">{t('home.reservar.faqTitulo')}</h2>
          {faq.map(({ q, a }, i) => (
            <Desplegable key={q} id={`hn-faq-${i + 1}`} boton={q} Titulo="h3" className="hn-faq__item">
              <p>{a}</p>
            </Desplegable>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 12b. Pedir itinerario (Formspree) ─────────────────────────────────────────────── */
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
    <section id="itinerario" className="hn-seccion hn-seccion--pegada" aria-labelledby="hn-itinerario-titulo">
      <div className="hn-wrap hn-itinerario">
        <div className="hn-itinerario__texto">
          <h2 id="hn-itinerario-titulo" className="hn-h2">{t('home.itinerario.titulo')}</h2>
          <p className="hn-entradilla">{t('home.itinerario.texto')}</p>
          <p className="hn-parrafo hn-itinerario__llamada">{t('home.itinerario.videollamadaLinea')}</p>
          <div className="hn-botones hn-itinerario__botones">
            <BotonVideollamada className="hn-btn hn-btn--borde-petroleo" />
          </div>
          <a href={WHATSAPP} className="hn-enlace" target="_blank" rel="noopener noreferrer">
            {t('home.itinerario.whatsapp')}<span aria-hidden="true"> →</span>
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

              <button type="submit" disabled={state.submitting} className="hn-btn hn-btn--coral hn-btn--ancho">
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

/* ── 13. Cierre ──────────────────────────────────────────────────────── */
function Cierre() {
  const { t } = useTranslation()
  return (
    <section className="hn-cierre" aria-labelledby="hn-cierre-titulo">
      <ImagenHueco seccion="home" clave="cierre" defecto={IMG.cierre} alt="" sizes="100vw" className="hn-cierre__img" />
      <div className="hn-wrap hn-cierre__contenido hn-revela">
        <h2 id="hn-cierre-titulo" className="hn-h2">{t('home.cierre.frase')}</h2>
        <div className="hn-botones">
          <a href="#itinerario" className="hn-btn hn-btn--borde-blanco">{t('home.cierre.boton')}</a>
        </div>
      </div>
    </section>
  )
}

/* Fundido con desplazamiento al entrar en pantalla (600 ms). Sin JS, sin
   IntersectionObserver o con prefers-reduced-motion todo se ve desde el
   principio: la clase .hn-anima, que oculta, solo se pone aquí. */
function useRevelar() {
  useEffect(() => {
    if (reducirMovimiento() || typeof IntersectionObserver === 'undefined') return
    const raiz = document.documentElement
    raiz.classList.add('hn-anima')
    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('hn-visible'); io.unobserve(e.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.hn-revela').forEach(el => io.observe(el))
    return () => { io.disconnect(); raiz.classList.remove('hn-anima') }
  }, [])
}

/* ── Home ────────────────────────────────────────────────────────────────
 * Revista de viajes: hero con vídeo → franja → el país → por qué con
 * nosotras → tres maneras de vivirlo → próxima salida → de norte a sur →
 * galería → Tiaki → quiénes somos → reseñas → cómo reservar (pasos,
 * preguntas frecuentes y formulario) → cierre.
 * Estilos en HomeNueva.css (todo bajo .hn-*), con los tokens de theme.css.
 * ──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('')
  useRevelar()

  // Cabecera transparente sobre el hero solo en la home (ver HomeNueva.css)
  useEffect(() => {
    document.body.classList.add('pagina-home')
    return () => document.body.classList.remove('pagina-home')
  }, [])

  return (
    <>
      <Seo pageType="home" title={t('home.seo.title')} description={t('home.seo.description')} />
      <Hero />
      <Franja />
      <ElPais />
      <PorQue />
      <TresManeras />
      <ProximaSalida />
      <Ruta />
      <Galeria />
      <Tiaki />
      <QuienesSomos />
      <ResenasDestacadas
        tono="arena"
        variante="home"
        id="resenas"
        antetitulo={t('home.resenas.etiqueta')}
        titulo={t('home.resenas.titulo')}
        textoEnlace={t('home.resenas.todas')}
      />
      <ComoReservar />
      <PedirItinerario viaje={viaje} setViaje={setViaje} />
      <Cierre />
    </>
  )
}
