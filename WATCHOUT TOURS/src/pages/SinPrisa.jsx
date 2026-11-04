import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import '../styles/pagestyle/Productos.css'
import '../styles/pagestyle/SinPrisa.css'
// TODO(imagen): no hay en el proyecto una foto propia de Sin Prisa
// (puerto, barco u Hobbiton). De momento se usa el paisaje del géiser de
// Te Puia, el mismo de la home. Se puede sustituir sin tocar código desde
// /admin/imagenes (sección "sin-prisa", clave "hero").
import imgHeroProvisional from '../images/hero-home.webp'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import RutaMapa, { COORDS_SIN_PRISA } from '../components/RutaMapa'
import { CtaFinal } from '../components/home/BloquesHome'

/* ── Sin Prisa ───────────────────────────────────────────────────────────
 * Viajes +60: viajes tranquilos en grupos de máximo 6 personas
 * (/sin-prisa ↔ /en/unhurried).
 * Reutiliza el marcado y los estilos de la home (Home.css), de /productos
 * (Productos.css) y el mapa de ruta de /productos (RutaMapa). Sin precios
 * ni número de plazas.
 * ──────────────────────────────────────────────────────────────────────── */
export default function SinPrisa() {
  const { t } = useTranslation()
  const incluye = t('sinPrisa.incluye.items', { returnObjects: true })
  const faq = t('sinPrisa.faq.items', { returnObjects: true })

  const heroImg = useSiteImage('sin-prisa', 'hero', imgHeroProvisional, t('sinPrisa.heroImgAlt'))

  return (
    <>
      {/* pageType editable desde /admin/seo (fila 'sin-prisa'); estos son
          los valores de respaldo mientras no haya fila guardada. */}
      <Seo
        pageType="sin-prisa"
        title={t('sinPrisa.seo.title')}
        description={t('sinPrisa.seo.description')}
      />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-photo-panel">
          <img src={heroImg.src} alt={heroImg.alt} lang={heroImg.lang} />
        </div>
        <div className="wrap">
          <div className="hero-inner">
            <span className="eyebrow">{t('sinPrisa.hero.eyebrow')}</span>
            <div className="hero-headline-row">
              <h1 className="hero-big-text">{t('sinPrisa.hero.h1')}</h1>
              <div className="hero-headline-side">
                <p>{t('sinPrisa.hero.sub')}</p>
                <div className="cta-row">
                  <L to="/contacto" className="btn btn-solid">{t('sinPrisa.hero.cta')}</L>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Para quién es ─────────────────────────────── */}
      <section aria-labelledby="sp-para-quien">
        <div className="wrap">
          <h2 id="sp-para-quien" className="sec-title">{t('sinPrisa.paraQuien.title')}</h2>
          <p className="sec-sub">{t('sinPrisa.paraQuien.p1')}</p>
          <p className="sec-sub">{t('sinPrisa.paraQuien.p2')}</p>
        </div>
      </section>

      {/* ── Qué incluye ───────────────────────────────── */}
      <section aria-labelledby="sp-incluye">
        <div className="wrap">
          <h2 id="sp-incluye" className="sec-title">{t('sinPrisa.incluye.title')}</h2>
          <ul className="pillars" style={{ paddingLeft: 0, listStyle: 'none' }}>
            {incluye.map(item => (
              <li key={item} className="pillar"><p>{item}</p></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Casi todo, solo para vosotros — bloque oscuro ── */}
      <section aria-labelledby="sp-privado">
        <div className="wrap">
          <div className="ink-block">
            <h2 id="sp-privado" className="sec-title">{t('sinPrisa.privado.title')}</h2>
            <p className="sec-sub">{t('sinPrisa.privado.p')}</p>
          </div>
        </div>
      </section>

      {/* ── Si viajas por tu cuenta · Para tu familia ─── */}
      <section className="prod-formatos">
        <div className="wrap">
          <div className="prod-list">
            <article aria-labelledby="sp-solo" className="prod-card">
              <h2 id="sp-solo" className="prod-card__titulo">{t('sinPrisa.solo.title')}</h2>
              <p className="prod-card__desc">{t('sinPrisa.solo.p')}</p>
            </article>
            <article aria-labelledby="sp-familia" className="prod-card">
              <h2 id="sp-familia" className="prod-card__titulo">{t('sinPrisa.familia.title')}</h2>
              <p className="prod-card__desc">{t('sinPrisa.familia.p')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Así es un día de viaje ────────────────────── */}
      <section aria-labelledby="sp-dia">
        <div className="wrap">
          <h2 id="sp-dia" className="sec-title">{t('sinPrisa.dia.title')}</h2>
          <p className="sec-sub">{t('sinPrisa.dia.p')}</p>
        </div>
      </section>

      {/* ── La ruta (mismo mapa accesible que /productos) ── */}
      <RutaMapa ns="sinPrisa.ruta" coords={COORDS_SIN_PRISA} />

      {/* ── Lo que te llevarás — bloque oscuro ────────── */}
      <section aria-labelledby="sp-llevaras">
        <div className="wrap">
          <div className="ink-block">
            <h2 id="sp-llevaras" className="sec-title">{t('sinPrisa.llevaras.title')}</h2>
            <p className="sec-sub">{t('sinPrisa.llevaras.p')}</p>
          </div>
        </div>
      </section>

      {/* ── Preguntas frecuentes (desplegables nativos) ── */}
      <section aria-labelledby="sp-faq">
        <div className="wrap">
          <h2 id="sp-faq" className="sec-title">{t('sinPrisa.faq.title')}</h2>
          <div className="sp-faq">
            {faq.map(({ q, a }) => (
              <details key={q} className="sp-faq__item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────── */}
      <CtaFinal
        titulo={t('sinPrisa.finalCta.title')}
        parrafos={[t('sinPrisa.finalCta.p')]}
        cta={t('sinPrisa.finalCta.ctaPrimary')}
      />
    </>
  )
}
