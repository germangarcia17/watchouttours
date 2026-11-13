import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { L, useLang, stripLang, localizePath } from '../../i18n/routing'
import { availableLangs } from '../../i18n/pageLanguages'
import './Footer.css'

const WHATSAPP = 'https://wa.me/64272677006?text=¡Hola!%20Quiero%20información%20sobre%20los%20viajes%20de%20WatchOut%20Tours'

/* "Español · English": la misma página en cada idioma. El idioma que no
   existe para la página actual no se enlaza. */
function Idiomas() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const lang = useLang()
  const base = stripLang(pathname)
  const disponibles = availableLangs(base)
  const idiomas = [
    { codigo: 'es', nombre: 'Español', to: base },
    { codigo: 'en', nombre: 'English', to: localizePath(base, 'en') },
  ].filter(i => disponibles.includes(i.codigo))

  return (
    <ul role="list" className="footer-idiomas" aria-label={t('footer.idiomas')}>
      {idiomas.map(({ codigo, nombre, to }) => (
        <li key={codigo}>
          <Link to={to} lang={codigo} hrefLang={codigo} aria-current={codigo === lang ? 'true' : undefined}>
            {nombre}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">

        {/* Marca */}
        <div className="footer-brand">
          <L to="/" className="footer-brand__logo">
            <img src="/brand/logo-blanco.svg" alt="WatchOut Tours" width="702" height="174" loading="lazy" />
          </L>
          <p className="footer-brand__tagline">{t('home.pie.frase')}</p>
        </div>

        {/* Colecciones */}
        <nav aria-label={t('footer.colColecciones')} className="footer-col">
          <h2 className="footer-col__heading">{t('footer.colColecciones')}</h2>
          <ul role="list" className="footer-col__list">
            <li><L to="/productos">{t('nav.privados')}</L></li>
            <li><L to="/sin-prisa">{t('nav.grandesViajes')}</L></li>
            <li><L to="/mas-alla-de-la-vista">{t('nav.masAlla')}</L></li>
          </ul>
        </nav>

        {/* WatchOut Tours */}
        <nav aria-label={t('footer.colMarca')} className="footer-col">
          <h2 className="footer-col__heading">{t('footer.colMarca')}</h2>
          <ul role="list" className="footer-col__list">
            <li><L to="/sobre-nosotras">{t('footer.fundadoras')}</L></li>
            <li><L to="/#tiaki">{t('footer.tiaki')}</L></li>
            <li><L to="/resenas">{t('footer.resenas')}</L></li>
            <li><L to="/blog">{t('footer.diario')}</L></li>
            <li><L to="/contacto">{t('footer.contacto')}</L></li>
          </ul>
        </nav>

        {/* Hablemos */}
        <div className="footer-col">
          <h2 className="footer-col__heading">{t('footer.colHablemos')}</h2>
          <ul role="list" className="footer-col__list">
            <li>
              <a href="mailto:info@watchouttours.nz">
                <span className="sr-only">{t('footer.emailSr')} </span>info@watchouttours.nz
              </a>
            </li>
            <li>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                {t('footer.whatsapp')}<span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">{t('footer.instagramSr')} </span>{t('footer.instagram')}
                <span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Créditos de las fotos y el vídeo (licencia de Tourism New Zealand) */}
      <p className="footer-creditos">{t('footer.creditos')}</p>

      <div className="site-footer__bottom">
        <p className="footer-copy">&copy; {year} {t('footer.empresa')}</p>
        <nav aria-label={t('footer.colLegal')}>
          <ul role="list" className="footer-legal">
            <li><L to="/accesibilidad">{t('footer.accesibilidad')}</L></li>
            <li><L to="/privacidad">{t('footer.privacidad')}</L></li>
            <li><L to="/aviso-legal">{t('footer.avisoLegal')}</L></li>
          </ul>
        </nav>
        <Idiomas />
      </div>
    </footer>
  )
}
