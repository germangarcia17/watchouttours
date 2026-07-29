import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import RutaMapa from '../components/RutaMapa'
import '../styles/pagestyle/Productos.css'

export default function Productos() {
  const { t } = useTranslation()
  const formatos = t('productos.formatos', { returnObjects: true })

  return (
    <>
      <Seo
        pageType="productos"
        title={t('productos.seo.title')}
        description={t('productos.seo.description')}
      />

      {/* ── Formatos ─────────────────────────────────── */}
      <section className="prod-formatos">
        <div className="wrap">
          <h1 className="sec-eyebrow">{t('productos.eyebrow')}</h1>
          <p className="sec-title">{t('productos.title')}</p>
          <p className="sec-sub">{t('productos.sub')}</p>

          <div className="prod-list">
            {formatos.map(({ id, etiqueta, titulo, cuerpo, precioTitulo, precioNota, incluye, cta }) => (
              <article key={id} id={id} aria-labelledby={`${id}-heading`} className="prod-card">
                <div className="prod-card__head">
                  <span className="prod-card__etiqueta">{etiqueta}</span>
                  <h3 id={`${id}-heading`} className="prod-card__titulo">{titulo}</h3>
                  <p className="prod-card__desc">{cuerpo}</p>
                </div>

                <div className="prod-card__footer">
                  <p className="prod-card__precio">{precioTitulo}</p>
                  <p className="prod-card__precio-nota">{precioNota}</p>
                  <p className="prod-card__incluye-nota"><strong>{t('productos.incluye')}</strong> {incluye}</p>
                  <div className="cta-row">
                    <L to="/contacto" className="btn btn-solid">{cta}</L>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RutaMapa />

      {/* ── CTA final ────────────────────────────────── */}
      <section className="prod-cta-section">
        <div className="wrap">
          <div className="ink-block prod-cta">
            <div className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>{t('productos.ctaEyebrow')}</div>
            <h2 className="prod-cta__titulo">{t('productos.ctaTitle')}</h2>
            <p>{t('productos.ctaText')}</p>
            <L to="/contacto" className="btn btn-solid">{t('productos.ctaBtn')}</L>
          </div>
        </div>
      </section>
    </>
  )
}
