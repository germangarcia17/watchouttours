import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Estaticas.css'

export default function Accesibilidad() {
  const { t } = useTranslation()
  useEffect(() => { document.title = t('accesibilidad.docTitle') }, [t])

  return (
    <>
      <section className="static-hero">
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">{t('legalCommon.eyebrow')}</span>
          <h1 className="static-titulo">{t('accesibilidad.title')}</h1>
          <p className="static-intro">{t('accesibilidad.intro')}</p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="conformidad-heading">
            <h2 id="conformidad-heading">{t('accesibilidad.conformidadTitle')}</h2>
            <p>
              {t('accesibilidad.conformidadP1')} <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.2
              {' '}{t('accesibilidad.conformidadP2')} <strong>{t('accesibilidad.nivelAA')}</strong> {t('accesibilidad.conformidadP3')} <strong>{t('accesibilidad.nivelAAA')}</strong> {t('accesibilidad.conformidadP4')}
            </p>
          </section>

          <section aria-labelledby="tecnologias-heading">
            <h2 id="tecnologias-heading">{t('accesibilidad.tecnologiasTitle')}</h2>
            <ul>
              <li><span lang="en">NVDA</span> + <span lang="en">Chrome</span> {t('accesibilidad.on')} <span lang="en">Windows</span></li>
              <li><span lang="en">VoiceOver</span> + <span lang="en">Safari</span> {t('accesibilidad.on')} <span lang="en">macOS</span> {t('accesibilidad.and')} <span lang="en">iOS</span></li>
              <li><span lang="en">TalkBack</span> {t('accesibilidad.on')} <span lang="en">Android</span></li>
              <li>{t('accesibilidad.keyboard')}</li>
            </ul>
          </section>

          <section aria-labelledby="contacto-a11y-heading">
            <h2 id="contacto-a11y-heading">{t('accesibilidad.reportarTitle')}</h2>
            <p>
              {t('accesibilidad.reportarText')}{' '}
              <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a>.
              {' '}{t('accesibilidad.reportarPlazo')}
            </p>
          </section>

          <p className="static-fecha">
            {t('accesibilidad.fecha')} <time dateTime="2026-06-25">{t('accesibilidad.fechaValor')}</time>.
          </p>
        </div>
      </div>
    </>
  )
}
