import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { getPreload } from '../../lib/preload'
import { useSiteImage } from '../../lib/siteImages'
import { L, useLang } from '../../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../../i18n/content'
import { AudioPlayer } from '../AudioPlayer'
import imgNosotras from '../../images/sobre-nosotras.webp'
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

/* ── Reseñas destacadas ─────────────────────────────── */
/* En el prerender llegan precargadas (homeResenas, ver
   scripts/prerender.mjs); en el navegador se piden a Supabase. */
export function ResenasDestacadas() {
  const { t } = useTranslation()
  const lang = useLang()
  const [resenas, setResenas] = useState(getPreload().homeResenas ?? null)

  useEffect(() => {
    supabase
      .from('resenas')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .limit(3)
      .then(({ data }) => setResenas(data))
  }, [])

  if (!resenas || resenas.length === 0) return null

  return (
    <section>
      <div className="wrap">
        <h2 className="sec-eyebrow">{t('home.testi.eyebrow')}</h2>
        <p className="sec-title">{t('home.testi.title')}</p>
        <div className="testi-grid">
          {resenas.map(resena => (
            <div key={resena.id} className="testi">
              <span className="sr-only">{t('home.testi.srContent')}</span>
              <q lang={fieldLangAttr(resena, 'content', lang)}>{pickLocalized(resena, 'content', lang)}</q>
              <span className="sr-only">{t('home.testi.srWho')}</span>
              <div className="who">{resena.author_name}</div>
              {resena.video_url && (
                <details className="testi-video">
                  <summary>{t('home.testi.listen')}</summary>
                  <video src={resena.video_url} controls playsInline preload="metadata" aria-label={t('home.testi.videoAria', { name: resena.author_name })} />
                </details>
              )}
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <L to="/resenas">{t('home.testi.more')}<span aria-hidden="true"> →</span></L>
        </p>
      </div>
    </section>
  )
}

/* ── Audios ──────────────────────────────────────────── */
const AUDIOS = [
  { n: 1, id: 'parapente', src: audioParapente },
  { n: 2, id: 'alpaca',    src: audioAlpaca },
  { n: 3, id: 'barro',     src: audioBarro },
  { n: 4, id: 'kauri',     src: audioKauri },
]

export function AudioClips() {
  const { t } = useTranslation()
  const [playingAudio, setPlayingAudio] = useState(null)

  return (
    <section aria-labelledby="audio-clips-heading">
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

/* ── Nuestra historia ───────────────────────────────── */
export function NuestraHistoria() {
  const { t } = useTranslation()
  const nosotrasImg = useSiteImage('home', 'nosotras', imgNosotras, t('home.nosotras.imgAlt'))

  return (
    <section id="nosotras">
      <div className="wrap">
        <div className="origin">
          <div className="origin-grid">
            <div className="origin-photo">
              <img src={nosotrasImg.src} alt={nosotrasImg.alt} lang={nosotrasImg.lang} loading="lazy" />
            </div>
            <div className="origin-inner">
              <h2 className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>{t('home.nosotras.eyebrow')}</h2>
              <p>{t('home.nosotras.p')}</p>
              <L to="/sobre-nosotras" className="btn btn-outline">{t('home.nosotras.cta')}</L>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Vista previa del blog ──────────────────────────── */
export function BlogPreview() {
  const { t } = useTranslation()
  const lang = useLang()
  const [post, setPost] = useState(getPreload().homeBlogPreview ?? [])

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .eq('resena', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => setPost(data ?? []))
  }, [])

  if (!post || !post.title) return null

  return (
    <section>
      <div className="wrap">
        <h2 className="sec-eyebrow">{t('home.blog.eyebrow')}</h2>
        <p className="sec-title">{t('home.blog.title')}</p>
        <div className="blog-preview-card">
          <h3 lang={fieldLangAttr(post, 'title', lang)}>{pickLocalized(post, 'title', lang)}</h3>
          <p lang={fieldLangAttr(post, 'excerpt', lang)}>{pickLocalized(post, 'excerpt', lang)}</p>
          <p className="reading-time">{t('home.blog.readingTime', { count: post.reading_time })}</p>
          <L to={`/blog/${post.slug}`} className="btn btn-outline">{t('home.blog.readArticle')}</L>
        </div>
        <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <L to="/blog">{t('home.blog.seeAll')}<span aria-hidden="true"> →</span></L>
        </p>
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
            href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20Watchout%20Tours"
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
