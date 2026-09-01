import { useTranslation } from 'react-i18next'
import logoImg from '../../images/logo-header-watchout.png'
import { L, useLocalize } from '../../i18n/routing'

export function Footer() {
  const { t } = useTranslation()
  const localize = useLocalize()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner container">

        {/* Columna marca */}
        <div className="footer-brand">
          <L to="/" className="footer-brand__logo" aria-label={t('footer.brandHome')}>
            <img src={logoImg} alt="" aria-hidden="true" className="footer-brand__img" loading="lazy" />
            <span className="footer-brand__name">Watchout Tours</span>
          </L>
          <a
            href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20información%20sobre%20los%20viajes%20de%20Watchout%20Tours"
            className="footer-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z"/>
            </svg>
            {t('footer.whatsapp')}
            <span className="sr-only"> {t('common.newTab')}</span>
          </a>
          <a
            href="https://www.instagram.com/watchouttours/"
            className="footer-instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="17.6" cy="6.4" r="1.4" fill="currentColor" />
            </svg>
            {t('footer.instagram')}
            <span className="sr-only"> {t('common.newTab')}</span>
          </a>
        </div>

        {/* Columna Nosotras */}
        <nav aria-label={t('footer.colNosotras')} className="footer-col">
          <h3 className="footer-col__heading">{t('footer.colNosotras')}</h3>
          <ul role="list" className="footer-col__list">
            <li><L to="/sobre-nosotras">{t('footer.sobreNosotras')}</L></li>
            <li><L to="/resenas">{t('footer.resenas')}</L></li>
            <li><L to="/blog">{t('footer.blog')}</L></li>
          </ul>
        </nav>

        {/* Columna Viajes */}
        <nav aria-label={t('footer.colViajes')} className="footer-col">
          <h3 className="footer-col__heading">{t('footer.colViajes')}</h3>
          <ul role="list" className="footer-col__list">
            <li><L to="/productos">{t('footer.todasExperiencias')}</L></li>
            <li><L to="/contacto">{t('footer.disenaViaje')}</L></li>
          </ul>
        </nav>

        {/* Columna Legal */}
        <nav aria-label={t('footer.colLegal')} className="footer-col">
          <h3 className="footer-col__heading">{t('footer.colLegal')}</h3>
          <ul role="list" className="footer-col__list">
            <li><L to="/accesibilidad">{t('footer.accesibilidad')}</L></li>
            <li><L to="/privacidad">{t('footer.privacidad')}</L></li>
            <li><L to="/aviso-legal">{t('footer.avisoLegal')}</L></li>
          </ul>
        </nav>

      </div>

      <div className="site-footer__bottom">
        <p className="footer-copy">
          &copy; {year} Watchout Tours. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
