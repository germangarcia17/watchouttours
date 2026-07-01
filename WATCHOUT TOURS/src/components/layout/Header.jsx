import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'
const navLinks = [
  { to: '/',               label: 'Inicio' },
  { to: '/sobre-nosotras', label: 'Nosotras' },
  { to: '/productos',      label: 'Viajes' },
  { to: '/blog',           label: 'Blog' },
  { to: '/contacto',       label: 'Escríbenos' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <Link to="/" aria-label="WatchOut! Sensory Tours — Inicio" className="site-logo">
          <img src="src/images/logo-header-watchout.png" alt="Logo de WatchOut! Sensory Tours" className="site-logo-image" />
          WatchOut! <span>Sensory Tours</span>
        </Link>
      </div>
      <div>
        <nav
          id="site-nav"
          aria-label="Navegación principal"
          className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}
        >
          <ul role="list" className="site-nav-list">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `site-nav__link${isActive ? ' site-nav__link--active' : ''}`
                  }
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        </div>

        <button
          className="menu-toggle"
          aria-controls="site-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

    </header>
  )
}
