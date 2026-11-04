import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import imgKayak from '../images/kayak-kaikoura.jpg'
import imgHaka from '../images/haka-cultura-maori.jpg'
import videoParapente from '../images/parapente-teaser.mp4'
import imgParapentePoster from '../images/parapente-poster.jpg'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { Icono } from '../components/Icono'
import { L } from '../i18n/routing'
import { HeroFoto, SeparadorBaston, ResenasDestacadas, CtaFinal } from '../components/home/BloquesHome'

/* Iconos de "Lo que van a vivir": adrenalina, sentidos y cultura. */
const ICONOS_PILARES = ['parapente', 'sentidos', 'ola']

/* ── Viajes para personas ciegas y con baja visión ───────────────────────
 * (/mas-alla-de-la-vista ↔ /en/beyond-sight). Mismos textos que antes;
 * maquetación renovada: hero a pantalla completa, un solo patrón de
 * encabezado (antetítulo + h2) y fondos alternos.
 * Imágenes editables desde /admin/imagenes, sección "mas-alla-de-la-vista".
 * ──────────────────────────────────────────────────────────────────────── */
export default function MasAllaDeLaVista() {
  const { t } = useTranslation()
  const formatos = t('masAlla.rutas.formatos', { returnObjects: true })

  const heroImg = useSiteImage('mas-alla-de-la-vista', 'hero', imgHero, t('masAlla.heroImgAlt'))
  const viajesImg = useSiteImage('mas-alla-de-la-vista', 'como-viajamos', imgKayak, t('masAlla.viajes.fotoAlt'))
  const culturaImg = useSiteImage('mas-alla-de-la-vista', 'cultura', imgHaka, t('masAlla.cultura.fotoAlt'))

  return (
    <>
      {/* pageType editable desde /admin/seo (fila 'mas-alla-de-la-vista');
          estos son los valores de respaldo mientras no haya fila guardada. */}
      <Seo
        pageType="mas-alla-de-la-vista"
        title={t('masAlla.seo.title')}
        description={t('masAlla.seo.description')}
      />

      <HeroFoto
        imagen={heroImg}
        antetitulo={t('masAlla.hero.eyebrow')}
        titulo={<>{t('masAlla.hero.big1')}<br />{t('masAlla.hero.big2')}</>}
        subtitulo={t('masAlla.hero.sub')}
      >
        <L to="/contacto" className="btn btn-solid">{t('masAlla.hero.ctaPrimary')}</L>
      </HeroFoto>

      {/* ── Cómo son nuestros viajes ──────────────────── */}
      <section id="viajes" aria-labelledby="viajes-heading">
        {/* Firma de esta línea: el bastón, una sola vez. */}
        <SeparadorBaston />
        <div className="wrap">
          <div className="intro-grid">
            <figure className="foto-marco">
              <img src={viajesImg.src} alt={viajesImg.alt} lang={viajesImg.lang} loading="lazy" />
            </figure>
            <div className="prosa">
              <p className="sec-eyebrow">{t('masAlla.viajes.eyebrow')}</p>
              <h2 id="viajes-heading" className="sec-title">{t('masAlla.viajes.title')}</h2>
              <p>{t('masAlla.viajes.p1')}</p>
              <p>{t('masAlla.viajes.p2')}</p>
              <p>{t('masAlla.viajes.p3')}</p>
              <p>{t('masAlla.viajes.p4')}</p>
              <p>{t('masAlla.viajes.p5')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lo que van a vivir (+ foto del haka) ──────── */}
      <section id="cultura" className="band-cream" aria-labelledby="cultura-heading">
        <div className="wrap">
          <div className="explorar-grid">
            <div>
              <div className="sec-head">
                <p className="sec-eyebrow">{t('masAlla.explorar.eyebrow')}</p>
                <h2 id="cultura-heading" className="sec-title">{t('masAlla.explorar.title')}</h2>
                <p className="sec-sub">{t('masAlla.explorar.sub')}</p>
              </div>
              <span className="sr-only">{t('masAlla.explorar.srQ')}</span>
              <ul className="pilares">
                {[1, 2, 3].map((n, i) => (
                  <li key={n} className="pilar">
                    <span className="icono-circulo"><Icono nombre={ICONOS_PILARES[i]} /></span>
                    <div>
                      <h3 className="pilar__titulo">{t(`masAlla.explorar.p${n}Title`)}</h3>
                      <p className="pilar__texto">{t(`masAlla.explorar.p${n}Text`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="cultura-foto">
              <img src={culturaImg.src} alt={culturaImg.alt} lang={culturaImg.lang} loading="lazy" />
              <figcaption>
                <span className="tag">{t('masAlla.cultura.tag')}</span>
                <p>{t('masAlla.cultura.caption')}</p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Así se vive la aventura (vídeo del parapente) ── */}
      <section id="en-accion" aria-labelledby="accion-heading">
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
            <div className="reel-copy prosa">
              <p className="sec-eyebrow">{t('masAlla.reel.eyebrow')}</p>
              <h2 id="accion-heading" className="sec-title">{t('masAlla.reel.callout')}</h2>
              <p>{t('masAlla.reel.p1')}</p>
              <p>{t('masAlla.reel.p2')}</p>
              <div className="cta-row">
                <a className="btn btn-outline" href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">{t('masAlla.reel.instagram')}<span className="sr-only"> {t('masAlla.reel.newTab')}</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dos maneras de vivirlo — banda azul ───────── */}
      <section id="rutas" className="band-night" aria-labelledby="rutas-heading">
        <div className="wrap">
          <div className="sec-head">
            <p className="sec-eyebrow">{t('masAlla.rutas.eyebrow')}</p>
            <h2 id="rutas-heading" className="sec-title">{t('masAlla.rutas.title')}</h2>
            <p className="sec-sub">{t('masAlla.rutas.sub')}</p>
          </div>

          <div className="formatos">
            {formatos.map(({ id, etiqueta, titulo, cuerpo, incluye, cta }) => (
              <article key={id} id={id} aria-labelledby={`${id}-heading`} className="formato">
                <h3 id={`${id}-heading`} className="formato__titulo">{titulo}</h3>
                <p className="formato__etiqueta">{etiqueta}</p>
                <p className="formato__texto">{cuerpo}</p>
                <div className="formato__pie">
                  <p className="formato__incluye"><strong>{t('masAlla.rutas.incluido')}</strong> {incluye}</p>
                  <L to="/contacto" className="btn btn-solid">{cta}</L>
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
      </section>

      {/* ── Reseñas (banda crema) ─────────────────────── */}
      <ResenasDestacadas tono="cream" />

      {/* ── CTA final ─────────────────────────────────── */}
      <CtaFinal
        titulo={t('masAlla.finalCta.title')}
        parrafos={[t('masAlla.finalCta.p1'), t('masAlla.finalCta.p2')]}
        cta={t('masAlla.finalCta.ctaPrimary')}
      />
    </>
  )
}
