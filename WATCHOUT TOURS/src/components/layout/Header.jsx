import { useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.css'
import logoImg from '../../images/logo-header-watchout.png'
import { L, LNav, useLang, useLocalize, stripLang, localizePath } from '../../i18n/routing'
import { availableLangs } from '../../i18n/pageLanguages'

const navLinks = [
  { to: '/productos',      key: 'rutas' },
  { to: '/sobre-nosotras', key: 'nosotras' },
  { to: '/resenas',        key: 'resenas' },
  { to: '/blog',           key: 'blog' },
  { to: '/contacto',       key: 'contacto' },
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
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)

  /* Escape cierra el menú móvil y devuelve el foco al botón que lo abrió */
  function handleNavKeyDown(e) {
    if (e.key === 'Escape' && menuOpen) {
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
  }

  return (
    <header className="site-header" role="banner">
      <div className="wrap nav-inner">
        {/* El enlace ya tiene texto visible; la imagen es decorativa */}
        <Link to={localize('/')} className="brand-badge" aria-label={t('nav.brandHome')}>
          <span className="brand-badge__circle">
            <img src={logoImg} alt="" aria-hidden="true" className="brand-badge__img" />
          </span>
          <span className="brand-word-col">
            <span className="brand-word">Watchout Tours</span>
            <span className="brand-word-braille" aria-hidden="true">⠺⠁⠞⠉⠓⠕⠥⠞⠀⠞⠕⠥⠗⠎</span>
          </span>
        </Link>

        <nav
          id="site-nav"
          aria-label={t('nav.main')}
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
          onKeyDown={handleNavKeyDown}
        >
          {navLinks.map(({ to, key }) => (
            <LNav
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${key}`)}
            </LNav>
          ))}
        </nav>

        <div className="nav-actions">
          <LanguageSwitcher />
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-controls="site-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
