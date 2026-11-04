import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import {
  ResenasDestacadas,
  AudioClips,
  NuestraHistoria,
  BlogPreview,
  CtaFinal,
} from '../components/home/BloquesHome'

/* ── Home de marca ───────────────────────────────────────────────────────
 * Presenta Watchout Tours como marca madre y reparte hacia sus dos líneas
 * de viaje: Sin Prisa (/sin-prisa) y Más allá de la vista
 * (/mas-alla-de-la-vista). Orden: Hero → Así viajamos → Dos viajes, un
 * mismo método → Reseñas → Audios → Nuestra historia → Blog → CTA final.
 * Reutiliza el marcado y los estilos de la home anterior (Home.css).
 * ──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const puntos = t('home.asiViajamos.puntos', { returnObjects: true })
  const tarjetas = t('home.dosViajes.tarjetas', { returnObjects: true })

  const heroImg = useSiteImage('home', 'hero', imgHero, t('home.heroImgAlt'))

  return (
    <>
      <Seo
        pageType="home"
        title={t('home.seo.title')}
        description={t('home.seo.description')}
      />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-photo-panel">
          <img src={heroImg.src} alt={heroImg.alt} lang={heroImg.lang} />
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow">{t('home.hero.eyebrow')}</span>
            <div className="hero-headline-row">
              <h1 className="hero-big-text">{t('home.hero.h1')}</h1>
              <div className="hero-headline-side">
                <p>{t('home.hero.sub')}</p>
                <div className="cta-row">
                  <L to="/sin-prisa" className="btn btn-solid">{t('home.hero.ctaSinPrisa')}</L>
                  <L to="/mas-alla-de-la-vista" className="btn btn-outline">{t('home.hero.ctaMasAlla')}</L>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Así viajamos ──────────────────────────────── */}
      <section id="asi-viajamos" aria-labelledby="asi-viajamos-heading">
        <div className="wrap">
          <h2 id="asi-viajamos-heading" className="sec-title">{t('home.asiViajamos.title')}</h2>
          <ul className="pillars" style={{ paddingLeft: 0, listStyle: 'none' }}>
            {puntos.map(({ titulo, texto }) => (
              <li key={titulo} className="pillar">
                <p><strong>{titulo}</strong> {texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Dos viajes, un mismo método — bloque oscuro ── */}
      <section id="dos-viajes">
        <div className="wrap">
          <div className="ink-block rutas-black">
            <h2 className="sec-title">{t('home.dosViajes.title')}</h2>
            <div className="prod-list">
              {tarjetas.map(({ id, to, titulo, texto, cta }) => (
                <article key={id} aria-labelledby={`${id}-heading`} className="prod-card">
                  <div className="prod-card__head">
                    <h3 id={`${id}-heading`} className="prod-card__titulo">{titulo}</h3>
                    <p className="prod-card__desc">{texto}</p>
                  </div>
                  <div className="prod-card__footer">
                    <div className="cta-row">
                      <L to={to} className="btn btn-solid">{cta}</L>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ResenasDestacadas />
      <AudioClips />
      <NuestraHistoria />
      <BlogPreview />

      <CtaFinal
        titulo={t('home.finalCta.title')}
        parrafos={[t('home.finalCta.p')]}
        cta={t('home.finalCta.ctaPrimary')}
      />
    </>
  )
}
