import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { L } from '../i18n/routing'
import '../styles/pagestyle/Estaticas.css'

export default function Privacidad() {
  const { t } = useTranslation()
  useEffect(() => { document.title = t('privacidad.docTitle') }, [t])

  return (
    <>
      <section className="static-hero">
        <div className="dots-texture"></div>
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">{t('legalCommon.eyebrow')}</span>
          <h1 className="static-titulo">{t('privacidad.title')}</h1>
          <p className="static-intro">{t('privacidad.intro')}</p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="responsable-heading">
            <h2 id="responsable-heading">{t('privacidad.responsableTitle')}</h2>
            <p>
              <strong>Watchout Tours Ltd.</strong>{t('privacidad.responsableP1')}{' '}
              <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a>.
            </p>
            <p>{t('privacidad.responsableP2')}</p>
          </section>

          <section aria-labelledby="datos-heading">
            <h2 id="datos-heading">{t('privacidad.datosTitle')}</h2>
            <p>{t('privacidad.datosIntro')}</p>
            <ul>
              <li>{t('privacidad.datos1')}</li>
              <li>{t('privacidad.datos2')}</li>
              <li>{t('privacidad.datos3')}</li>
              <li>{t('privacidad.datos4')}</li>
              <li>{t('privacidad.datos5')}</li>
            </ul>
          </section>

          <section aria-labelledby="finalidad-heading">
            <h2 id="finalidad-heading">{t('privacidad.finalidadTitle')}</h2>
            <p><strong>{t('privacidad.finalidadLabel1')}</strong> {t('privacidad.finalidadText1')}</p>
            <p><strong>{t('privacidad.finalidadLabel2')}</strong> {t('privacidad.finalidadText2')}</p>
          </section>

          <section aria-labelledby="conservacion-heading">
            <h2 id="conservacion-heading">{t('privacidad.conservacionTitle')}</h2>
            <p>{t('privacidad.conservacionP')}</p>
          </section>

          <section aria-labelledby="destinatarios-heading">
            <h2 id="destinatarios-heading">{t('privacidad.destinatariosTitle')}</h2>
            <p>
              {t('privacidad.destP1a')} <strong>Formspree, Inc.</strong> {t('privacidad.destP1b')}{' '}
              <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                {t('privacidad.destLink')}<span className="sr-only"> {t('common.newTab')}</span>
              </a>{t('privacidad.destP1c')}
            </p>
            <p>
              {t('privacidad.destP2a')} <strong>{t('privacidad.destP2strong')}</strong>{t('privacidad.destP2b')}
            </p>
          </section>

          <section aria-labelledby="cookies-heading">
            <h2 id="cookies-heading">{t('privacidad.cookiesTitle')}</h2>
            <p>
              {t('privacidad.cookiesA')} <strong>{t('privacidad.cookiesStrong')}</strong>{t('privacidad.cookiesB')}
            </p>
          </section>

          <section aria-labelledby="derechos-heading">
            <h2 id="derechos-heading">{t('privacidad.derechosTitle')}</h2>
            <p>
              {t('privacidad.derP1a')}{' '}
              <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a> {t('privacidad.derP1b')}
            </p>
            <p>
              {t('privacidad.derP2a')} <strong>{t('privacidad.derP2strong')}</strong>{' '}
              (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                www.aepd.es<span className="sr-only"> {t('common.newTab')}</span>
              </a>).
            </p>
          </section>

          <p>
            {t('privacidad.verAvisoA')} <L to="/aviso-legal">{t('privacidad.verAvisoLink')}</L>.
          </p>

          <p className="static-fecha">
            {t('privacidad.fecha')} <time dateTime="2026-07-16">{t('privacidad.fechaValor')}</time>
          </p>
        </div>
      </div>
    </>
  )
}
