import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { getPreload } from '../../lib/preload'
import { L, useLang } from '../../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../../i18n/content'
import { AudioPlayer } from '../AudioPlayer'
import { VideoTestimonio } from '../VideoTestimonio'
import audioParapente from '../../images/Saltando en parapente.mp3'
import audioAlpaca from '../../images/Cuando la alpaca le mordió.mp3'
import audioBarro from '../../images/barro-burbujeante-rotorua.mp3'
import audioKauri from '../../images/bienvenida-al-kauri.mp3'
import '../../styles/pagestyle/Home.css'

/* Bloques que antes vivían en la home y ahora comparten la home de marca
   (/), Más allá de la vista (/mas-alla-de-la-vista) y Sin Prisa
   (/sin-prisa). El marcado y los estilos (Home.css) son los mismos que
   tenía la home. */

/* Separador de secciones: icono decorativo de una persona caminando con
   bastón. Es puramente decorativo (aria-hidden).
   Icono: Font Awesome Free 6 "person-walking-with-cane" — CC BY 4.0
   (https://fontawesome.com/license/free). */
export function SeparadorBaston() {
  return (
    <div className="separador-baston" aria-hidden="true">
      <svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M176 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8.4 32c-36.4 0-69.6 20.5-85.9 53.1L35.4 273.7c-7.9 15.8-1.5 35 14.3 42.9s35 1.5 42.9-14.3L128 231.6l0 43.2c0 17 6.7 33.3 18.7 45.3L224 397.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-89.4c0-12.7-5.1-24.9-14.1-33.9L224 306.7l0-93.4 70.4 93.9c10.6 14.1 30.7 17 44.8 6.4s17-30.7 6.4-44.8L268.8 166.4C250.7 142.2 222.2 128 192 128l-24.4 0zM128.3 346.8L97 472.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l22-88.2-52.8-52.8zM450.8 505.1c5 7.3 15 9.1 22.3 4s9.1-15 4-22.3L358.9 316.1c-2.8 3.8-6.1 7.3-10.1 10.3c-5 3.8-10.5 6.4-16.2 7.9L450.8 505.1z" />
      </svg>
    </div>
  )
}

/* ── Hero a pantalla completa ───────────────────────── */
/* Foto de fondo con el h1, el subtítulo y los botones encima. Una capa
   degradada oscura garantiza contraste AA en todo el texto (más densa
   donde está el texto, abajo). La foto es decorativa respecto al texto,
   pero lleva su alt porque transmite el destino. */
export function HeroFoto({ imagen, antetitulo, titulo, subtitulo, children }) {
  return (
    <section className="hero-full">
      {/* La foto va sola, sin velo ni texto encima (las fotos de Tourism New
          Zealand no pueden llevar nada encima); el texto, debajo. */}
      <div className="hero-full__foto">
        <img className="hero-full__img" src={imagen.src} alt={imagen.alt} lang={imagen.lang} fetchpriority="high" />
      </div>
      <div className="wrap hero-full__contenido">
        <p className="hero-full__antetitulo">{antetitulo}</p>
        <h1 className="hero-full__titulo">{titulo}</h1>
        <p className="hero-full__sub">{subtitulo}</p>
        <div className="cta-row hero-full__botones">{children}</div>
      </div>
    </section>
  )
}

/* ── Reseñas destacadas ─────────────────────────────── */
/* En el prerender llegan precargadas (homeResenas, ver
   scripts/prerender.mjs); en el navegador se piden a Supabase. */
/* Palabras que indican que una reseña habla sobre todo de la ceguera. En
   Viajes +60 se muestran primero las que no las contienen. */
const TEMA_CEGUERA = /cieg|ceguera|baja visi|bast[oó]n|braille|discapacidad visual|blind|low[- ]vision|visually impaired|white cane/i

function hablaDeCeguera(r) {
  return TEMA_CEGUERA.test(`${r.content ?? ''} ${r.content_en ?? ''}`)
}

/* Elige hasta 3 reseñas. Por defecto, las destacadas. Con
   modo="sinCeguera", entre todas las publicadas, primero las que no se
   centran en la ceguera y, dentro de cada grupo, las destacadas. */
function elegirResenas(lista, modo) {
  if (!lista) return null
  if (modo !== 'sinCeguera') return lista.slice(0, 3)
  return [...lista]
    .sort((a, b) => (hablaDeCeguera(a) - hablaDeCeguera(b)) || (b.featured - a.featured))
    .slice(0, 3)
}

/* tono: 'night' (banda azul) o 'cream' (banda crema). */
export function ResenasDestacadas({ tono = 'night', modo = 'destacadas', variante, id, antetitulo, titulo, textoEnlace }) {
  const { t } = useTranslation()
  const lang = useLang()
  const preload = getPreload()
  const [resenas, setResenas] = useState(
    elegirResenas(modo === 'sinCeguera' ? preload.resenas : preload.homeResenas, modo) ?? null
  )

  useEffect(() => {
    let q = supabase.from('resenas').select('*').eq('published', true)
    q = modo === 'sinCeguera'
      ? q.order('featured', { ascending: false }).order('created_at', { ascending: false }).limit(30)
      : q.eq('featured', true).limit(3)
    q.then(({ data }) => setResenas(elegirResenas(data, modo)))
  }, [modo])

  if (!resenas || resenas.length === 0) return null

  // Home: una sola reseña, centrada, como una cita de revista.
  if (variante === 'home') {
    const resena = resenas[0]
    const texto = (pickLocalized(resena, 'content', lang) ?? '').trim()
    const contexto = pickLocalized(resena, 'author_context', lang)
    const yaEntrecomillado = /^[«“"]/.test(texto)
    const [abre, cierra] = lang === 'en' ? ['“', '”'] : ['«', '»']
    return (
      <section id={id} className="hn-sec hn-resena" aria-labelledby="hn-resena-titulo">
        <h2 id="hn-resena-titulo" className="hn-lbl hn-lbl--centro">{antetitulo ?? t('home.testi.eyebrow')}</h2>
        <figure>
          <span className="sr-only">{t('home.testi.srContent')}</span>
          <blockquote className="hn-resena__cita" lang={fieldLangAttr(resena, 'content', lang)}>
            <p>{yaEntrecomillado ? texto : `${abre}${texto}${cierra}`}</p>
          </blockquote>
          <figcaption className="hn-firma">
            <span className="sr-only">{t('home.testi.srWho')} </span>
            {resena.author_name}
            {contexto && <span lang={fieldLangAttr(resena, 'author_context', lang)}> · {contexto}</span>}
          </figcaption>
          {resena.video_url && <VideoTestimonio resena={resena} />}
        </figure>
      </section>
    )
  }

  return (
    <section id={id} className={`resenas band-${tono}`} aria-labelledby={`resenas-titulo-${modo}`}>
      <div className="wrap">
        <div className="sec-head">
          <p className="sec-eyebrow">{antetitulo ?? t('home.testi.eyebrow')}</p>
          <h2 id={`resenas-titulo-${modo}`} className="sec-title">{titulo ?? t('home.testi.title')}</h2>
        </div>
        <div className={`resenas__grid resenas__grid--${resenas.length}`}>
          {resenas.map((resena, i) => {
            const contexto = pickLocalized(resena, 'author_context', lang)
            return (
              <figure key={resena.id} className={`resena${i === 0 ? ' resena--destacada' : ''}`}>
                <span className="sr-only">{t('home.testi.srContent')}</span>
                <span className="resena__comillas" aria-hidden="true">“</span>
                <blockquote className="resena__cita" lang={fieldLangAttr(resena, 'content', lang)}>
                  <p>{pickLocalized(resena, 'content', lang)}</p>
                </blockquote>
                <figcaption className="resena__autor">
                  <span className="sr-only">{t('home.testi.srWho')}</span>
                  <span className="resena__nombre">{resena.author_name}</span>
                  {contexto && (
                    <span className="resena__contexto" lang={fieldLangAttr(resena, 'author_context', lang)}>{contexto}</span>
                  )}
                </figcaption>
                {resena.video_url && <VideoTestimonio resena={resena} />}
              </figure>
            )
          })}
        </div>
        <p className="resenas__mas">
          <L to="/resenas">{textoEnlace ?? t('home.testi.more')}<span aria-hidden="true"> →</span></L>
        </p>
      </div>
    </section>
  )
}


/* ── Aviso de la próxima salida en grupo ───────────────
   Lo usan Más allá de la vista y Viajes +60: la salida del 1 al 15 de
   marzo de 2027 es El Gran Viaje, no un viaje propio de esas colecciones,
   así que aquí solo se menciona y se enlaza a su sección de la home. */
export function AvisoProximaSalida() {
  const { t } = useTranslation()
  return (
    <div className="anuncio-grupo">
      <p className="anuncio-grupo__texto">{t('home.salida.aviso')}</p>
      <div className="cta-row" style={{ justifyContent: 'center' }}>
        <L to="/#proxima-salida" className="btn btn-solid anuncio-grupo__cta">{t('home.salida.avisoEnlace')}<span aria-hidden="true"> →</span></L>
      </div>
    </div>
  )
}

/* ── Audios ──────────────────────────────────────────── */
const AUDIOS = [
  { n: 1, id: 'parapente', src: audioParapente },
  { n: 2, id: 'alpaca',    src: audioAlpaca },
  { n: 3, id: 'barro',     src: audioBarro },
  { n: 4, id: 'kauri',     src: audioKauri },
]

export function AudioClips({ id }) {
  const { t } = useTranslation()
  const [playingAudio, setPlayingAudio] = useState(null)

  return (
    <section id={id} aria-labelledby="audio-clips-heading">
      <div className="wrap">
        <h2 id="audio-clips-heading" className="sec-title">{t('home.audio.eyebrow')}</h2>
        <div className="audio-cards">
          {AUDIOS.map(({ n, id, src }) => (
            <div key={id} className="audio-card">
              <span className="sr-only">{t(`home.audio.sr${n}`)}</span>
              <div className="audio-card__header">
                <span className="audio-card__icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </span>
                <div>
                  <h3 className="audio-card__titulo">{t(`home.audio.card${n}Title`)}</h3>
                  <span className="audio-card__etiqueta">{t(`home.audio.card${n}Tag`)}</span>
                </div>
              </div>
              <p className="audio-card__descripcion">{t(`home.audio.card${n}Desc`)}</p>
              <AudioPlayer src={src} playerId={id} playingId={playingAudio} setPlayingId={setPlayingAudio} label={t(`home.audio.card${n}Label`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA final con contacto y WhatsApp ──────────────── */
/* `parrafos` es la lista de párrafos ya traducidos; `cta` el texto del
   botón de contacto. */
export function CtaFinal({ titulo, parrafos, cta }) {
  const { t } = useTranslation()
  return (
    <section className="final-cta">
      <div className="wrap">
        <h2>{titulo}</h2>
        {parrafos.map((p, i) => <p key={i}>{p}</p>)}
        <div className="cta-row" style={{ justifyContent: 'center' }}>
          <L to="/contacto" className="btn btn-solid">{cta}</L>
          <a
            href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20WatchOut%20Tours"
            className="btn btn-outline btn-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('common.whatsappFab')} ${t('common.newTab')}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="18" height="18">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z" fill="currentColor"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
