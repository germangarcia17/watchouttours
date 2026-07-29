import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { L } from '../i18n/routing'
import '../styles/pagestyle/Estaticas.css'

export default function AvisoLegal() {
  const { t } = useTranslation()
  useEffect(() => { document.title = t('avisoLegal.docTitle') }, [t])

  return (
    <>
      <section className="static-hero">
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">{t('legalCommon.eyebrow')}</span>
          <h1 className="static-titulo">{t('avisoLegal.title')}</h1>
          <p className="static-intro">{t('avisoLegal.intro')}</p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="titular-heading">
            <h2 id="titular-heading">{t('avisoLegal.titularTitle')}</h2>
            <p>
              <strong>Watchout Tours Ltd.</strong>{t('avisoLegal.titularP')}
            </p>
            <ul>
              <li>{t('avisoLegal.domicilio')}</li>
              <li>{t('avisoLegal.emailLabel')} <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a></li>
              <li>{t('avisoLegal.whatsapp')}</li>
            </ul>
          </section>

          <section aria-labelledby="objeto-heading">
            <h2 id="objeto-heading">{t('avisoLegal.objetoTitle')}</h2>
            <p>{t('avisoLegal.objetoP1')}</p>
            <p>
              <strong>{t('avisoLegal.objetoP2strong')}</strong> {t('avisoLegal.objetoP2rest')}
            </p>
          </section>

          <section aria-labelledby="propiedad-heading">
            <h2 id="propiedad-heading">{t('avisoLegal.propiedadTitle')}</h2>
            <p>{t('avisoLegal.propiedadP')}</p>
          </section>

          <section aria-labelledby="responsabilidad-heading">
            <h2 id="responsabilidad-heading">{t('avisoLegal.responsabilidadTitle')}</h2>
            <p>{t('avisoLegal.responsabilidadP')}</p>
          </section>

          <section aria-labelledby="ley-heading">
            <h2 id="ley-heading">{t('avisoLegal.leyTitle')}</h2>
            <p>
              {t('avisoLegal.leyPa')} <L to="/privacidad">{t('avisoLegal.leyLink')}</L>{t('avisoLegal.leyPb')}
            </p>
          </section>

          <p className="static-fecha">
            {t('avisoLegal.fecha')} <time dateTime="2026-07-16">{t('avisoLegal.fechaValor')}</time>
          </p>
        </div>
      </div>
    </>
  )
}
