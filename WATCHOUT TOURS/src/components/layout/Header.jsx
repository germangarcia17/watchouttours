import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Header.css'
import logoImg from '../../images/logo-header-watchout.png'

const navLinks = [
  { to: '/',               label: 'Inicio' },
  { to: '/sobre-nosotras', label: 'Nosotras' },
  { to: '/productos',      label: 'Viajes' },
  { to: '/blog',           label: 'Blog' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`} role="banner">
      <div className="site-header__inner">
        <Link to="/" aria-label="WatchOut! Sensory Tours — Inicio" className="site-logo">
          <img src={logoImg} alt="Logo de WatchOut! Sensory Tours" className="site-logo-image" />
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
              <li>
                <NavLink
                  to="/contacto"
                  className={({ isActive }) =>
                    `site-nav__link nav__link_contact${isActive ? ' site-nav__link--active' : ''}`
                  }
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  Contacto
                </NavLink>
              </li>
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
