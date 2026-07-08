import { useState, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'
import logoImg from '../../images/logo-header-watchout.png'

const navLinks = [
  { to: '/productos',      label: 'Rutas' },
  { to: '/sobre-nosotras', label: 'Nosotras' },
  { to: '/blog',           label: 'Blog' },
  { to: '/contacto',       label: 'Contacto' },
]

export function Header() {
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
        <Link to="/" className="brand-badge" aria-label="WatchOutTours — Ir al inicio">
          <img src={logoImg} alt="" aria-hidden="true" className="brand-badge__img" />
          <span className="brand-word">WatchOutTours</span>
        </Link>

        <nav
          id="site-nav"
          aria-label="Navegación principal"
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
          onKeyDown={handleNavKeyDown}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `nav-link${isActive ? ' nav-link--active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>
    </header>
  )
}
