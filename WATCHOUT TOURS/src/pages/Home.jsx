import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import '../styles/pagestyle/Contacto.css'
import '../styles/pagestyle/HomeNueva.css'
import { Seo } from '../components/Seo'
import { ImagenHueco, defectoHueco } from '../components/ImagenHueco'
import { urlImagen } from '../components/Imagen'
import { ResenasDestacadas } from '../components/home/BloquesHome'
import { BotonVideollamada } from '../components/Videollamada'
import { Desplegable } from '../components/Desplegable'
import { useSiteImage } from '../lib/siteImages'
import { L, useLang } from '../i18n/routing'
import { SITE_URL } from '../lib/site'
import { TresManeras, Especialidades } from '../components/viajes/ViajesUI'
import { Texto, Etiqueta, FotoHueco, PedirItinerario, dos } from '../components/editorial/Editorial'
import { CreditoFoto } from '../components/CreditoFoto'
import { CREDITOS_HOME } from '../lib/creditos'

/* Huecos de imagen de la home (sección "home" en /admin/imagenes) y su foto
   por defecto: el nombre de una imagen del repositorio (src/data/imagenes.json).
   Si no se indica, se usa la imagen "home--<clave>" (las fotos que estaban en
   el admin, ya en el repositorio). null = bloque gris.
   Las fotos de Tourism New Zealand se sirven sin recortar en edición, sin
   retocar y sin nada encima (el encuadre con object-fit: cover está
   permitido). El texto alternativo por defecto de cada hueco está en
   home.huecos.<clave> (es.json / en.json) y se edita desde el admin. */
const IMG = {
  'pais-panoramica': 'tnz-233933-aoraki-mt-cook',
  'tiaki-tohu': 'tiaki-tohu',
  'destino-rotorua': 'geiser-pohutu',
  'destino-aoraki': 'tnz-233937-aoraki-iceberg',
  'destino-queenstown': 'queenstown-parapente',
  'destino-waitomo': 'tnz-232230-waitomo',
  'galeria-02': 'talla-maori',
  'galeria-03': 'secuoyas',
  'galeria-05': 'kayak-kaikoura',
  nosotras: 'nosotras',
}

const TIAKI = 'https://www.tiakinewzealand.com'

const reducirMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* Foto de un hueco. El contenedor se pinta siempre: sin foto es el bloque
   gris de la maqueta.
   Crédito (fotos de Tourism New Zealand): justo debajo del borde inferior,
   fuera del área de la imagen y alineado a la derecha. "sangre": foto a
   todo el ancho, el crédito se alinea con el margen de la página. "tono":
   "oscuro" si lo que sigue a la foto es una banda oscura. */
function Foto({ clave, ...props }) {
  const { t } = useTranslation()
  return (
    <FotoHueco
      seccion="home" clave={clave} defecto={IMG[clave]} alt={t(`home.huecos.${clave}`)}
      credito={CREDITOS_HOME[clave] ?? ''} {...props}
    />
  )
}

/* ── 1. Hero: el vídeo solo, y debajo nuestra presentación ────────────
   Vídeo: Milford Sound, RealNZ / Tourism New Zealand. Licencia WorldWide de
   Tourism New Zealand: solo web y medios no pagados, y SIN MODIFICAR. Poner
   texto, velos, botones o cualquier elemento encima cuenta como
   modificación, así que el vídeo ocupa el ancho y el alto de la pantalla
   (menos la cabecera) sin absolutamente nada encima: ni la cabecera (el
   vídeo empieza debajo de ella) ni el crédito (home.hero.credito), que va
   debajo, en la zona oscura.
   El titular, los botones y el botón de pausa van en la sección de debajo
   (HeroIntro), sobre fondo #15171A.
   El vídeo es decorativo (aria-hidden): lo que muestra lo dice el texto
   alternativo del hueco "hero-poster" (su primer fotograma), que se lee en
   el pie. Ese fotograma es el póster del vídeo: lo que se ve mientras
   carga, si no carga o si se pide reducir el movimiento.
   No lleva el atributo autoplay en el HTML: se arranca desde aquí para
   poder respetar prefers-reduced-motion (con él, no se reproduce solo).
   El botón solo aparece cuando hay vídeo que pausar; aria-pressed="true"
   significa "en pausa". Versiones web sin audio en public/media. */
/* El <video> va como HTML fijo (dangerouslySetInnerHTML) para que lleve
   siempre muted, autoplay, loop y playsinline, tanto en la página
   prerenderizada como después de hidratar: React no escribe el atributo
   muted y lo quita al hidratar, y Safari de iPhone lo exige para
   reproducir solo. El MP4 (H.264) va primero porque lo reproducen todos los
   navegadores; Safari puede elegir el WebM (VP9) y no decodificarlo, y
   entonces no enseña ni el vídeo ni el póster. El póster por defecto es el
   primer fotograma (public/media/hero-poster.jpg). */
const POSTER_DEFECTO = '/media/hero-poster.jpg'
const VIDEO_HERO = `<video class="hn-hero__video" poster="${POSTER_DEFECTO}" muted autoplay loop playsinline preload="metadata" aria-hidden="true" tabindex="-1">`
  + '<source src="/media/hero.mp4" type="video/mp4">'
  + '<source src="/media/hero.webm" type="video/webm">'
  + '</video>'

function useVideoHero() {
  const area = useRef(null)
  const [hayVideo, setHayVideo] = useState(false)
  const [enMarcha, setEnMarcha] = useState(false)
  const video = () => area.current?.querySelector('video')

  useEffect(() => {
    const v = video()
    if (!v) return
    v.muted = true
    // Con "reducir movimiento" no se reproduce solo: se queda en el primer
    // fotograma, que es el mismo que el póster.
    if (reducirMovimiento()) {
      v.autoplay = false
      v.pause()
      if (v.currentTime > 0) v.currentTime = 0
    }
    // Escuchas nativas: en la página prerenderizada el vídeo puede haber
    // cargado (o empezado) antes de que React se enganche al HTML.
    // Solo hay vídeo cuando llegan sus datos ('play' se dispara antes de
    // cargar nada); si fallan todas las fuentes, el botón no se muestra.
    const listo = () => setHayVideo(true)
    const estado = () => setEnMarcha(!v.paused)
    const fallo = () => { setHayVideo(false); setEnMarcha(false) }
    const ultima = v.querySelector('source:last-of-type')
    v.addEventListener('loadedmetadata', listo)
    v.addEventListener('playing', listo)
    v.addEventListener('play', estado)
    v.addEventListener('pause', estado)
    ultima?.addEventListener('error', fallo)
    if (v.readyState >= 1) listo()
    if (v.networkState === 3) fallo() // NETWORK_NO_SOURCE: ya falló antes de hidratar
    estado()
    // Por si el navegador no respetó autoplay (p. ej. tras volver atrás)
    if (!reducirMovimiento() && v.paused) v.play()?.catch(() => {})
    return () => {
      v.removeEventListener('loadedmetadata', listo)
      v.removeEventListener('playing', listo)
      v.removeEventListener('play', estado)
      v.removeEventListener('pause', estado)
      ultima?.removeEventListener('error', fallo)
    }
  }, [])

  function alternar() {
    const v = video()
    if (!v) return
    if (v.paused) v.play()?.catch(() => {})
    else v.pause()
  }

  return { area, hayVideo, enMarcha, alternar }
}

function Hero({ area }) {
  const { t } = useTranslation()
  // Póster del vídeo: hueco "hero-poster" (editable en /admin/imagenes).
  // Si el admin no responde o el hueco no tiene foto, queda el primer
  // fotograma del vídeo.
  const poster = useSiteImage('home', 'hero-poster', POSTER_DEFECTO, t('home.huecos.hero-poster'))

  // Si el admin tiene otra imagen, se usa solo cuando carga de verdad; si
  // falla, se mantiene la de respaldo.
  useEffect(() => {
    const v = area.current?.querySelector('video')
    // La imagen del admin se sirve desde el repositorio (versión de 1920 px)
    const url = urlImagen(poster.src, 1920)
    if (!v || !url || url === POSTER_DEFECTO) return
    let vivo = true
    const prueba = new Image()
    prueba.onload = () => { if (vivo) v.setAttribute('poster', url) }
    prueba.onerror = () => { if (vivo) v.setAttribute('poster', POSTER_DEFECTO) }
    prueba.src = url
    return () => { vivo = false }
  }, [poster.src])

  return (
    <figure className="hn-hero">
      <Helmet>
        <link rel="preload" as="image" href={POSTER_DEFECTO} fetchpriority="high" />
      </Helmet>
      {/* En el área del vídeo solo está el <video>: ni póster aparte, ni
          crédito, ni velo, ni botones. El póster va en su atributo. */}
      <div ref={area} className="hn-hero__area" dangerouslySetInnerHTML={{ __html: VIDEO_HERO }} />
      {/* Debajo del vídeo, en la zona oscura: crédito visible y, para los
          lectores de pantalla, lo que muestra el vídeo (texto alternativo
          del hueco "hero-poster") */}
      <figcaption className="hn-hero__credito">
        <span className="sr-only" lang={poster.lang}>{poster.alt}. </span>
        {t('home.hero.credito')}
      </figcaption>
    </figure>
  )
}

function HeroIntro({ hayVideo, enMarcha, alternar }) {
  const { t } = useTranslation()
  return (
    <section className="hn-intro" aria-labelledby="hn-hero-titulo">
      <img src="/brand/logo-blanco.svg" alt="WatchOut Tours" width="702" height="174" className="hn-intro__logo" />
      <Etiqueta className="hn-lbl--verde">{t('home.hero.etiqueta')}</Etiqueta>
      <h1 id="hn-hero-titulo" className="hn-h1"><Texto k="home.hero.titulo" /></h1>
      <p className="hn-intro__sub">{t('home.hero.sub')}</p>
      <div className="hn-botones">
        <L to="/viajes" className="hn-btn">{t('home.hero.cta1')}</L>
        <a href="#itinerario" className="hn-btn hn-btn--fantasma">{t('home.hero.cta2')}</a>
      </div>
      {hayVideo && (
        <div className="hn-intro__video">
          <button type="button" className="hn-hero__pausa" aria-pressed={!enMarcha} onClick={alternar}>
            <span className={`hn-hero__signo${enMarcha ? '' : ' hn-hero__signo--play'}`} aria-hidden="true" />
            {enMarcha ? t('home.hero.pausar') : t('home.hero.reproducir')}
          </button>
        </div>
      )}
    </section>
  )
}

/* ── 1b. Franja «Cada viaje, una historia distinta»: una línea de
   palabras, cada una enlazada a su tarjeta de /viajes (o a la página de
   la especialidad) ─────────────────────────────────────────────────── */
const FRANJA = [
  '/viajes#viaje-pareja', '/viajes#viaje-pareja', '/viajes#viaje-familia', '/viajes#viaje-amigos',
  '/viajes#viaje-naturaleza', '/viajes#viaje-naturaleza', '/viajes#viaje-lujo', '/viajes#viaje-esqui',
  '/sin-prisa', '/viajes-personas-ciegas-baja-vision',
]

function Franja() {
  const { t } = useTranslation()
  const palabras = t('home.franja.palabras', { returnObjects: true })
  return (
    <section className="hn-sec hn-blanca vj-franja" aria-labelledby="hn-franja-titulo">
      <Etiqueta>{t('home.franja.etiqueta')}</Etiqueta>
      <h2 id="hn-franja-titulo" className="hn-h2"><Texto k="home.franja.titulo" /></h2>
      <ul className="vj-franja__lista" role="list">
        {palabras.map((p, i) => <li key={p}><L to={FRANJA[i]}>{p}</L></li>)}
      </ul>
      <L to="/viajes" className="hn-lnk hn-lnk--verde">{t('home.franja.enlace')}</L>
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
        <Foto clave="pais-panoramica" sizes="100vw" className="hn-panoramica__foto" sinCredito />
        {/* Pie a la izquierda y crédito a la derecha, en la misma línea */}
        <figcaption className="hn-cap hn-cap--con-credito">
          <span>{t('home.pais.pie')}</span>
          <CreditoPanoramica />
        </figcaption>
      </figure>
    </>
  )
}

function CreditoPanoramica() {
  const img = useSiteImage('home', 'pais-panoramica', defectoHueco('home', 'pais-panoramica', IMG['pais-panoramica']), '', CREDITOS_HOME['pais-panoramica'])
  if (!img.src) return null
  return <CreditoFoto credito={img.credito} className="hn-cap__credito" />
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

/* ── 5. Próximas salidas en grupo ─────────────────────────────────────
   Una lista: cada salida publicada es un elemento (textos en
   home.salidas.lista.<id>, foto en el hueco <clave>). Para añadir otra,
   basta con una entrada aquí y sus textos. */
const SALIDAS = [
  { id: 'gran-viaje', clave: 'salida-foto' },
]

function ProximasSalidas({ setViaje }) {
  const { t } = useTranslation()
  return (
    <section id="proxima-salida" className="hn-sec hn-blanca" aria-labelledby="hn-salidas-titulo">
      <h2 id="hn-salidas-titulo" className="hn-lbl">{t('home.salida.etiqueta')}</h2>
      <ul className="vj-salidas" role="list">
        {SALIDAS.map(({ id, clave }) => (
          <li key={id} className="hn-par">
            <div className="hn-par__texto">
              <h3 className="hn-h2"><Texto k={`home.salidas.${id}.titulo`} /></h3>
              <p className="hn-body hn-body--primero">{t(`home.salidas.${id}.texto`)}</p>
              <div className="hn-botones">
                <a href="#itinerario" className="hn-btn" onClick={() => setViaje(id)}>{t('home.salida.itinerario')}</a>
                <BotonVideollamada className="hn-btn hn-btn--tinta">{t('home.salida.hablar')}</BotonVideollamada>
              </div>
            </div>
            <Foto clave={clave} sizes="(min-width: 901px) 42vw, 100vw" className="hn-par__foto hn-par__foto--salida" />
          </li>
        ))}
      </ul>
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

/* ── 7. Tiaki: imagen oficial a todo el ancho (16:9, sin texto ni velo
   encima) y, debajo, banda oscura con el texto y los tres compromisos ── */
function Tiaki() {
  const { t } = useTranslation()
  const items = t('home.tiaki.items', { returnObjects: true })
  return (
    <section id="tiaki" className="hn-tiaki" aria-labelledby="hn-tiaki-titulo">
      <Foto clave="tiaki-tohu" sizes="100vw" className="hn-tiaki__foto" sangre tono="oscuro" />
      <div className="hn-tiaki__banda">
        <Etiqueta clara>{t('home.tiaki.etiqueta')}</Etiqueta>
        <h2 id="hn-tiaki-titulo" className="hn-h1 hn-h1--menor"><Texto k="home.tiaki.titulo" /></h2>
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
    clave, ...useSiteImage('home', clave, defectoHueco('home', clave, IMG[clave]), t(`home.huecos.${clave}`), CREDITOS_HOME[clave] ?? ''),
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
        <img src={urlImagen(foto.src, 1920)} alt="" />
        <figcaption className="hn-visor__pie">
          <span lang={foto.lang}>{foto.alt}</span>
          <CreditoFoto credito={foto.credito} tono="oscuro" className="hn-visor__credito" />
        </figcaption>
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
      {/* Foto a todo el ancho sin nada encima; el texto, debajo */}
      <Foto clave="cierre" sizes="100vw" className="hn-cierre__foto" sangre tono="oscuro" />
      <div className="hn-cierre__contenido">
        <h2 id="hn-cierre-titulo" className="hn-h1 hn-h1--menor"><Texto k="home.cierre.titulo" /></h2>
        <p>{t('home.cierre.texto')}</p>
        <a href="#itinerario" className="hn-btn hn-btn--fantasma">{t('home.cierre.boton')}</a>
      </div>
    </section>
  )
}

/* ── Datos estructurados de El Gran Viaje (TouristTrip, sin precio) ── */
function GranViajeJsonLd() {
  const { t } = useTranslation()
  const lang = useLang()
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: lang === 'en' ? 'The Grand Journey' : 'El Gran Viaje',
    description: t('home.salida.texto'),
    inLanguage: lang,
    url: `${SITE_URL}${lang === 'en' ? '/en' : ''}/#proxima-salida`,
    startDate: '2027-02-27',
    endDate: '2027-03-16',
    touristType: lang === 'en'
      ? 'Travellers seeking an exclusive small-group experience'
      : 'Viajeros que buscan una experiencia exclusiva en grupo reducido',
    provider: { '@type': 'TravelAgency', name: 'WatchOut Tours', url: SITE_URL },
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(datos)}</script>
    </Helmet>
  )
}

/* ── 13. Pedir itinerario: PedirItinerario (components/editorial) ──── */

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
 * Reproduce la maqueta aprobada: vídeo a pantalla completa → presentación
 * (titular y botones) → el país (foto vertical y
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

  const hero = useVideoHero()
  // og:image: el póster del vídeo de la hero (hueco hero-poster)
  const poster = useSiteImage('home', 'hero-poster', POSTER_DEFECTO, t('home.huecos.hero-poster'))

  return (
    <div className="hn">
      <Seo pageType="home" title={t('home.seo.title')} description={t('home.seo.description')} image={poster.src} imageAlt={poster.alt} />
      <GranViajeJsonLd />
      <Hero area={hero.area} />
      <HeroIntro hayVideo={hero.hayVideo} enMarcha={hero.enMarcha} alternar={hero.alternar} />
      <Franja />
      <ElPais />
      <TresManeras id="maneras" className="hn-blanca"><Especialidades /></TresManeras>
      <Cita />
      <ProximasSalidas setViaje={setViaje} />
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
