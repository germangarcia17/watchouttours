import { useState } from 'react'
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

  return (
    <header className="site-header" role="banner">
      <div className="wrap nav-inner">
        <Link to="/" aria-label="WatchOut! Sensory Tours — Inicio" className="brand-badge">
          <img src={logoImg} alt="Logo de WatchOut! Sensory Tours" className="brand-badge__img" />
          <span className="brand-word">WatchOutTours</span>
        </Link>

        <nav
          id="site-nav"
          aria-label="Navegación principal"
          className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}
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
          className="menu-toggle"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  )
}
