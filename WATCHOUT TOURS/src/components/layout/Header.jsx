import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.css'
import { L, LNav, useLang, useLocalize, stripLang, localizePath } from '../../i18n/routing'
import { availableLangs } from '../../i18n/pageLanguages'

/* Menú principal. Las rutas son siempre las españolas: LNav las traduce al
   slug inglés cuando toca (ver src/i18n/pageLanguages.js). */
const navLinks = [
  { to: '/productos',            key: 'privados' },
  { to: '/sin-prisa',            key: 'grandesViajes' },
  { to: '/mas-alla-de-la-vista', key: 'masAlla' },
  { to: '/sobre-nosotras',       key: 'fundadoras' },
]

/* Selector de idioma: enlaza a la misma página en el otro idioma,
   conservando la ruta, la query y el ancla. Si la página actual es
   solo-idioma (ver availableLangs en ../../i18n/pageLanguages) y no tiene
   versión en el otro idioma, no se renderiza: no hay a dónde enlazar sin
   generar un 404. */
function LanguageSwitcher() {
  const { t } = useTranslation()
  const { pathname, search, hash } = useLocation()
  const lang = useLang()
  const base = stripLang(pathname)
  const otherLang = lang === 'es' ? 'en' : 'es'

  if (!availableLangs(base).includes(otherLang)) return null

  const target = lang === 'es' ? localizePath(base, 'en') : base

  return (
    <Link
      to={`${target}${search}${hash}`}
      className="lang-switch"
      hrefLang={lang === 'es' ? 'en' : 'es'}
      lang={lang === 'es' ? 'en' : 'es'}
      aria-label={t('nav.switchLang')}
    >
      {lang === 'es' ? 'EN' : 'ES'}
    </Link>
  )
}

export function Header() {
  const { t } = useTranslation()
  const localize = useLocalize()
  const { pathname } = useLocation()
  // La cabecera es la misma en toda la web: barra opaca #15171A fija arriba.
  // En la home no flota sobre el vídeo (licencia de Tourism New Zealand: el
  // vídeo no puede llevar nada encima); el vídeo empieza debajo de ella.
  const esHome = stripLang(pathname) === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)

  // Al cambiar de página, el menú móvil se cierra.
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Con el menú móvil abierto, el botón flotante de WhatsApp se oculta
  // (ver .menu-abierto en global.css) para no tapar las opciones.
  useEffect(() => {
    document.body.classList.toggle('menu-abierto', menuOpen)
    return () => document.body.classList.remove('menu-abierto')
  }, [menuOpen])

  /* Escape cierra el menú móvil, esté donde esté el foco, y lo devuelve al
     botón que lo abrió */
  useEffect(() => {
    if (!menuOpen) return
    function alPulsar(e) {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', alPulsar)
    return () => document.removeEventListener('keydown', alPulsar)
  }, [menuOpen])

  const cerrar = () => setMenuOpen(false)

  return (
    <header
      className="site-header"
      role="banner"
    >
      <div className="nav-inner">
        {/* El nombre accesible del enlace es el alt del logo */}
        <Link to={localize('/')} className="brand-logo">
          <img src="/brand/logo-blanco.svg" alt="WatchOut Tours" width="702" height="174" className="brand-logo__img" />
        </Link>

        {/* El botón va antes que el menú en el HTML para que, al abrirlo, el
            siguiente Tab entre en sus enlaces (el CSS lo coloca a la derecha). */}
        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav
          id="site-nav"
          aria-label={t('nav.main')}
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
        >
          {navLinks.map(({ to, key }) => (
            <LNav
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
              onClick={cerrar}
            >
              {t(`nav.${key}`)}
            </LNav>
          ))}
          {/* En la home, ancla al formulario; en el resto, a la home + ancla */}
          {esHome
            ? <a href="#itinerario" className="header-cta" onClick={cerrar}>{t('nav.disena')}</a>
            : <L to="/#itinerario" className="header-cta" onClick={cerrar}>{t('nav.disena')}</L>}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
