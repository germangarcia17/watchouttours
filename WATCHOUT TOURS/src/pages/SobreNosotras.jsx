import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/SobreNosotras.css'
import '../styles/pagestyle/Filosofia.css'
import imgNosotras from '../images/sobre-nosotras-hero.webp'
import { useSiteImage } from '../lib/siteImages'
import { L } from '../i18n/routing'
import { bucketUrl } from '../lib/bucket'
import { Seo } from '../components/Seo'

export default function SobreNosotras() {
  const { t } = useTranslation()

  const PRINCIPIOS = t('sobre.principios', { returnObjects: true })

  const heroImg = useSiteImage('sobre-nosotras', 'hero', imgNosotras, t('sobre.heroImgAlt'))
  const moniImg = useSiteImage('sobre-nosotras', 'equipo-moni', imgNosotras, t('sobre.equipoMoniFotoAlt'))
  const sylvieImg = useSiteImage('sobre-nosotras', 'equipo-sylvie', imgNosotras, t('sobre.equipoSylvieFotoAlt'))
  const nuriaImg = useSiteImage('sobre-nosotras', 'equipo-nuria', imgNosotras, t('sobre.equipoNuriaFotoAlt'))

  return (
    <>
      <Seo
        pageType="sobre-nosotras"
        title={t('sobre.seo.title')}
        description={t('sobre.seo.description')}
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="sn-hero">
        <div className="wrap sn-hero-grid">
          <div className="sn-hero-inner">
            <span className="sec-eyebrow">{t('sobre.heroEyebrow')}</span>
            <h1 className="sn-titulo">{t('sobre.heroTitle1')}<br />{t('sobre.heroTitle2')}</h1>
            <p className="sn-intro">{t('sobre.heroIntro1')}</p>
            <p className="sn-intro">{t('sobre.heroIntro2')}</p>
          </div>
          <div className="sn-hero-photo">
            <img src={heroImg.src} alt={heroImg.alt} lang={heroImg.lang} />
          </div>
        </div>
      </section>

      {/* ── Lo que hemos aprendido — bloque oscuro ───── */}
      <section>
        <div className="wrap">
          <div className="ink-block sn-aprendizaje">
            <span className="sec-eyebrow">{t('sobre.aprendidoEyebrow')}</span>
            <h2 className="sn-aprendizaje-titulo">{t('sobre.aprendidoTitulo')}</h2>
            <div className="sn-aprendizaje-cols">
              <p>{t('sobre.aprendidoCol1')}</p>
              <p>{t('sobre.aprendidoCol2')}</p>
            </div>
            <p className="sn-aprendizaje-final">{t('sobre.aprendidoFinal')}</p>
            <p className="sn-aprendizaje-negrita">
              <strong>{t('sobre.aprendidoNegrita')}</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Hola, somos Mónica y Sylvie ─────────────── */}
      <section>
        <div className="wrap sn-hola">
          <span className="sec-eyebrow"><span aria-hidden="true">👋 </span>{t('sobre.holaEyebrow')}</span>
          <h2 className="sec-title">{t('sobre.holaTitle')}</h2>
          <p className="sn-text">{t('sobre.holaP1')}</p>
          <p className="sn-text">{t('sobre.holaP2')}</p>
          <blockquote className="sn-quote">
            <p>{t('sobre.holaQuote')}</p>
            <cite>{t('sobre.holaQuoteCite')}</cite>
          </blockquote>
          <p className="sn-text">{t('sobre.holaP3')}</p>
        </div>
      </section>

      {/* ── Equipo ─────────────────────────────────────── */}
      <section aria-labelledby="equipo-heading">
        <div className="wrap">
          <span className="sec-eyebrow">{t('sobre.equipoEyebrow')}</span>
          <h2 id="equipo-heading" className="sec-title">{t('sobre.equipoTitle')}</h2>
          <div className="sn-equipo-grid">
            <article className="sn-equipo-card">
              <div className="sn-equipo-foto">
                <img src={moniImg.src} alt={moniImg.alt} lang={moniImg.lang} loading="lazy" />
              </div>
              <h3 className="sn-equipo-nombre">{t('sobre.equipoMoniNombre')}</h3>
              <p className="sn-equipo-rol">{t('sobre.equipoMoniRol')}</p>
              <p className="sn-equipo-bio">{t('sobre.equipoMoniBio')}</p>
            </article>

            <article className="sn-equipo-card">
              <div className="sn-equipo-foto">
                <img src={sylvieImg.src} alt={sylvieImg.alt} lang={sylvieImg.lang} loading="lazy" />
              </div>
              <h3 className="sn-equipo-nombre">{t('sobre.equipoSylvieNombre')}</h3>
              <p className="sn-equipo-rol">{t('sobre.equipoSylvieRol')}</p>
              <p className="sn-equipo-bio">{t('sobre.equipoSylvieBio')}</p>
            </article>

            <article className="sn-equipo-card">
              <div className="sn-equipo-foto">
                <img src={nuriaImg.src} alt={nuriaImg.alt} lang={nuriaImg.lang} loading="lazy" />
              </div>
              <h3 className="sn-equipo-nombre">{t('sobre.equipoNuriaNombre')}</h3>
              <p className="sn-equipo-rol">{t('sobre.equipoNuriaRol')}</p>
              <p className="sn-equipo-bio">{t('sobre.equipoNuriaBio')}</p>
              <div className="sn-equipo-chips">
                <a href="mailto:nuria@watchouttours.nz" className="sn-equipo-chip">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  nuria@watchouttours.nz
                </a>
                <a href="https://blog.sixsense.travel" target="_blank" rel="noopener noreferrer" className="sn-equipo-chip">
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <path d="M15 3h6v6"/>
                    <path d="M10 14 21 3"/>
                  </svg>
                  {t('sobre.equipoBlogLabel')}
                  <span className="sr-only"> {t('common.newTab')}</span>
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Nuestra filosofía (integrada) ────────────── */}
      <section aria-labelledby="filosofia-heading">
        <div className="wrap sn-filo-grid">
          <div className="sn-filo-main">
            <span className="sec-eyebrow">{t('sobre.filoEyebrow')}</span>
            <h2 id="filosofia-heading" className="sec-title">{t('sobre.filoTitle')}</h2>
            <ol role="list" className="filo-lista">
              {PRINCIPIOS.map(({ num, titulo, texto }) => (
                <li key={num} className="filo-principio">
                  <span aria-hidden="true" className="filo-principio__num">{num}</span>
                  <div className="filo-principio__contenido">
                    <h3 className="filo-principio__titulo">{titulo}</h3>
                    <p className="filo-principio__texto">{texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="sn-filo-foto">
            <img
              src={bucketUrl('foto-en-la-montana.webp')}
              alt={t('sobre.filoFotoAlt')}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────── */}
      <section className="sn-cierre">
        <div className="wrap">
          <p className="sn-cierre-texto">{t('sobre.cierre1')}</p>
          <p className="sn-cierre-deseo">{t('sobre.cierreDeseo')}</p>
          <p className="sn-cierre-texto">{t('sobre.cierre2')}</p>

          <div className="cta-row sn-cierre-ctas">
            <L to="/contacto" className="btn btn-solid">{t('sobre.cierreCta')}</L>
          </div>
        </div>
      </section>
    </>
  )
}
