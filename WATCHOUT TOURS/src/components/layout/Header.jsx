import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Header.css'
import logoImg from '../../images/logo-header-watchout.png'
import { L, LNav, useLang, useLocalize, stripLang, localizePath } from '../../i18n/routing'
import { availableLangs } from '../../i18n/pageLanguages'

/* Submenú "Viajes" / "Journeys": las dos líneas de viaje y la página con
   todas las experiencias. Las rutas son siempre las españolas: LNav las
   traduce al slug inglés cuando toca (ver src/i18n/pageLanguages.js). */
const viajesLinks = [
  { to: '/sin-prisa',            key: 'sinPrisa' },
  { to: '/mas-alla-de-la-vista', key: 'masAlla' },
  { to: '/productos',            key: 'todas' },
]

const navLinks = [
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

/* Desplegable "Viajes" (patrón disclosure: botón con aria-expanded que
   muestra/oculta una lista de enlaces normales). Teclado: Intro/Espacio en
   el botón lo abre y cierra, Tab recorre los enlaces, Escape lo cierra y
   devuelve el foco al botón, y se cierra solo al salir el foco del bloque
   o al hacer clic fuera. En móvil la lista aparece dentro del menú
   hamburguesa, debajo del botón. */
function ViajesDropdown({ onNavigate }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)

  const base = stripLang(pathname)
  const active = viajesLinks.some(({ to }) => base === to)

  // Al cambiar de página, el submenú se cierra.
  useEffect(() => { setOpen(false) }, [pathname])

  // Clic fuera del bloque: se cierra (Safari no enfoca los botones al
  // hacer clic, así que no basta con onBlur).
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function handleKeyDown(e) {
    if (e.key === 'Escape' && open) {
      // No cerrar también el menú móvil: primero solo el submenú.
      e.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  function handleBlur(e) {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false)
  }

  return (
    <div className="nav-dropdown" ref={wrapRef} onKeyDown={handleKeyDown} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        className={`nav-link nav-dropdown__toggle${active ? ' nav-link--active' : ''}`}
        aria-expanded={open}
        aria-controls="nav-viajes-submenu"
        onClick={() => setOpen(v => !v)}
      >
        {t('nav.rutas')}
        <span className="nav-dropdown__caret" aria-hidden="true">▾</span>
      </button>
      <ul id="nav-viajes-submenu" className="nav-dropdown__menu" hidden={!open}>
        {viajesLinks.map(({ to, key }) => (
          <li key={to}>
            <LNav
              to={to}
              className={({ isActive }) =>
                `nav-link nav-dropdown__link${isActive ? ' nav-link--active' : ''}`
              }
              onClick={() => { setOpen(false); onNavigate() }}
            >
              {t(`nav.${key}`)}
            </LNav>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Header() {
  const { t } = useTranslation()
  const localize = useLocalize()
  const { pathname } = useLocation()
  // En la home la cabecera va transparente sobre la foto del hero y lleva
  // el botón "Pide el itinerario" (al formulario #itinerario de la home).
  const esHome = stripLang(pathname) === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)
  // En la home, al bajar de la parte alta del hero la cabecera pasa de
  // transparente (texto blanco sobre la foto) a fondo claro con texto tinta.
  const [solida, setSolida] = useState(false)

  useEffect(() => {
    if (!esHome) { setSolida(false); return }
    const comprobar = () => setSolida(window.scrollY > 24)
    comprobar()
    window.addEventListener('scroll', comprobar, { passive: true })
    return () => window.removeEventListener('scroll', comprobar)
  }, [esHome])

  // Con el menú móvil abierto, el botón flotante de WhatsApp se oculta
  // (ver .menu-abierto en global.css) para no tapar las opciones.
  useEffect(() => {
    document.body.classList.toggle('menu-abierto', menuOpen)
    return () => document.body.classList.remove('menu-abierto')
  }, [menuOpen])

  /* Escape cierra el menú móvil y devuelve el foco al botón que lo abrió */
  function handleNavKeyDown(e) {
    if (e.key === 'Escape' && menuOpen) {
      setMenuOpen(false)
      toggleRef.current?.focus()
    }
  }

  return (
    <header
      className={`site-header${esHome ? ' site-header--home' : ''}${esHome && (solida || menuOpen) ? ' site-header--solida' : ''}`}
      role="banner"
    >
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
          <ViajesDropdown onNavigate={() => setMenuOpen(false)} />
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
          {esHome && (
            <a href="#itinerario" className="hn-btn hn-btn--coral header-cta">{t('nav.itinerario')}</a>
          )}
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
