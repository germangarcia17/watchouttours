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
            <h1 className="sec-eyebrow">{t('sobre.heroEyebrow')}</h1>
            <p className="sn-titulo">{t('sobre.heroTitle1')}<br />{t('sobre.heroTitle2')}</p>
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
            <h2 className="sec-eyebrow">{t('sobre.aprendidoEyebrow')}</h2>
            <p className="sn-aprendizaje-titulo">{t('sobre.aprendidoTitulo')}</p>
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
          <h2 className="sec-eyebrow"><span aria-hidden="true">👋 </span>{t('sobre.holaEyebrow')}</h2>
          <p className="sec-title">{t('sobre.holaTitle')}</p>
          <p className="sn-text">{t('sobre.holaP1')}</p>
          <p className="sn-text">{t('sobre.holaP2')}</p>
          <blockquote className="sn-quote">
            <p>{t('sobre.holaQuote')}</p>
            <cite>{t('sobre.holaQuoteCite')}</cite>
          </blockquote>
          <p className="sn-text">{t('sobre.holaP3')}</p>
        </div>
      </section>

      {/* ── Nuestra filosofía (integrada) ────────────── */}
      <section aria-labelledby="filosofia-heading">
        <div className="wrap sn-filo-grid">
          <div className="sn-filo-main">
            <h2 id="filosofia-heading" className="sec-eyebrow">{t('sobre.filoEyebrow')}</h2>
            <p className="sec-title">{t('sobre.filoTitle')}</p>
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
