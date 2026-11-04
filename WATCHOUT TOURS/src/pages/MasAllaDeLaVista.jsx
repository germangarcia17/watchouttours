import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import imgKayak from '../images/kayak-kaikoura.jpg'
import imgHaka from '../images/haka-cultura-maori.jpg'
import videoParapente from '../images/parapente-teaser.mp4'
import imgParapentePoster from '../images/parapente-poster.jpg'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { SeparadorBaston, ResenasDestacadas, CtaFinal } from '../components/home/BloquesHome'

/* ── Más allá de la vista ────────────────────────────────────────────────
 * Línea de viajes para personas ciegas y con baja visión
 * (/mas-alla-de-la-vista ↔ /en/beyond-sight). Es el contenido que tenía la
 * home antes de pasar a ser la home de marca: mismos textos (namespace
 * masAlla en los locales), mismas imágenes y mismos estilos (Home.css).
 * ──────────────────────────────────────────────────────────────────────── */
export default function MasAllaDeLaVista() {
  const { t } = useTranslation()
  const formatos = t('masAlla.rutas.formatos', { returnObjects: true })

  // Misma imagen del hero que la home (editable desde /admin/imagenes).
  const heroImg = useSiteImage('home', 'hero', imgHero, t('masAlla.heroImgAlt'))

  return (
    <>
      {/* pageType editable desde /admin/seo (fila 'mas-alla-de-la-vista');
          estos son los valores de respaldo mientras no haya fila guardada. */}
      <Seo
        pageType="mas-alla-de-la-vista"
        title={t('masAlla.seo.title')}
        description={t('masAlla.seo.description')}
      />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-photo-panel">
          <img src={heroImg.src} alt={heroImg.alt} lang={heroImg.lang} />
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow">{t('masAlla.hero.eyebrow')}</span>
            <div className="hero-headline-row">
              <h1 className="hero-big-text">{t('masAlla.hero.big1')}<br />{t('masAlla.hero.big2')}</h1>
              <div className="hero-headline-side">
                <p>{t('masAlla.hero.sub')}</p>
                <div className="cta-row">
                  <L to="/contacto" className="btn btn-solid">{t('masAlla.hero.ctaPrimary')}</L>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Cómo son nuestros viajes ──────────────────── */}
      <section id="viajes">
        <div className="wrap">
          <div className="intro-grid">
            <div className="intro-card">
              <img
                className="intro-card__foto"
                src={imgKayak}
                alt={t('masAlla.viajes.fotoAlt')}
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="sec-eyebrow">{t('masAlla.viajes.eyebrow')}</h2>
              <p className="sec-title">{t('masAlla.viajes.title')}</p>
              <p>{t('masAlla.viajes.p1')}</p>
              <p>{t('masAlla.viajes.p2')}</p>
              <p>{t('masAlla.viajes.p3')}</p>
              <p>{t('masAlla.viajes.p4')}</p>
              <p>{t('masAlla.viajes.p5')}</p>
            </div>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Lo que van a vivir (+ foto del haka) ──────── */}
      <section id="cultura">
        <div className="wrap">
          <div className="explorar-grid">
            <div>
              <h2 className="sec-eyebrow">{t('masAlla.explorar.eyebrow')}</h2>
              <p className="sec-title">{t('masAlla.explorar.title')}</p>
              <p className="sec-sub">{t('masAlla.explorar.sub')}</p>
              <span className="sr-only">{t('masAlla.explorar.srQ')}</span>
              <div className="pillars">
                <div className="pillar">
                  <div className="ico" aria-hidden="true">🪂</div>
                  <h3>{t('masAlla.explorar.p1Title')}</h3>
                  <p>{t('masAlla.explorar.p1Text')}</p>
                </div>
                <div className="pillar">
                  <div className="ico" aria-hidden="true">✋</div>
                  <h3>{t('masAlla.explorar.p2Title')}</h3>
                  <p>{t('masAlla.explorar.p2Text')}</p>
                </div>
                <div className="pillar">
                  <div className="ico" aria-hidden="true">🌊</div>
                  <h3>{t('masAlla.explorar.p3Title')}</h3>
                  <p>{t('masAlla.explorar.p3Text')}</p>
                </div>
              </div>
            </div>
            <figure className="cultura-foto">
              <img src={imgHaka} alt={t('masAlla.cultura.fotoAlt')} loading="lazy" />
              <figcaption>
                <span className="tag">{t('masAlla.cultura.tag')}</span>
                <p>{t('masAlla.cultura.caption')}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Así se vive la aventura (vídeo del parapente) ── */}
      <section id="en-accion">
        <div className="wrap">
          <div className="reel-grid">
            <div className="reel-frame">
              <video
                src={videoParapente}
                poster={imgParapentePoster}
                controls
                playsInline
                preload="metadata"
                aria-label={t('masAlla.reel.videoAria')}
              />
            </div>
            <div className="reel-copy">
              <h2 className="sec-eyebrow">{t('masAlla.reel.eyebrow')}</h2>
              <p className="callout">{t('masAlla.reel.callout')}</p>
              <p>{t('masAlla.reel.p1')}</p>
              <p>{t('masAlla.reel.p2')}</p>
            </div>
          </div>
          <div className="reel-instagram">
            <a className="btn btn-outline" href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">{t('masAlla.reel.instagram')}<span className="sr-only"> {t('masAlla.reel.newTab')}</span></a>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Dos maneras de vivirlo — bloque oscuro ────── */}
      <section id="rutas">
        <div className="wrap">
          <div className="ink-block rutas-black">
            <h2 className="sec-eyebrow">{t('masAlla.rutas.eyebrow')}</h2>
            <p className="sec-title">{t('masAlla.rutas.title')}</p>
            <p className="sec-sub">{t('masAlla.rutas.sub')}</p>

            <div className="prod-list">
              {formatos.map(({ id, etiqueta, titulo, cuerpo, incluye, cta }) => (
                <article key={id} id={id} aria-labelledby={`${id}-heading`} className="prod-card">
                  <div className="prod-card__head">
                    <h3 id={`${id}-heading`} className="prod-card__titulo">{titulo}</h3>
                    <span className="prod-card__etiqueta">{etiqueta}</span>
                    <p className="prod-card__desc">{cuerpo}</p>
                  </div>

                  <div className="prod-card__footer">
                    <p className="prod-card__incluye-nota"><strong>{t('masAlla.rutas.incluido')}</strong> {incluye}</p>
                    <div className="cta-row">
                      <L to="/contacto" className="btn btn-solid">{cta}</L>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="anuncio-grupo">
              <span className="anuncio-grupo__badge">
                <span className="anuncio-grupo__punto" aria-hidden="true"></span>
                {t('masAlla.rutas.anuncioBadge')}
              </span>
              <p className="anuncio-grupo__fecha">{t('masAlla.rutas.anuncioFecha')}</p>
              <p className="anuncio-grupo__texto">{t('masAlla.rutas.anuncioTexto')}</p>
              <div className="cta-row" style={{ justifyContent: 'center' }}>
                <L to="/contacto" className="btn btn-solid anuncio-grupo__cta">{t('masAlla.rutas.anuncioCta')}<span aria-hidden="true"> →</span></L>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Reseñas ───────────────────────────────────── */}
      <ResenasDestacadas />

      {/* ── CTA final ─────────────────────────────────── */}
      <CtaFinal
        titulo={t('masAlla.finalCta.title')}
        parrafos={[t('masAlla.finalCta.p1'), t('masAlla.finalCta.p2')]}
        cta={t('masAlla.finalCta.ctaPrimary')}
      />
    </>
  )
}
