import { NavLink, Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import { SkipLink } from '../layout/SkipLink'
import '../../styles/admin.css'

const adminLinks = [
  { to: '/admin',           label: 'Dashboard' },
  { to: '/admin/blog',      label: 'Blog' },
  { to: '/admin/resenas',   label: 'Reseñas' },
  { to: '/admin/imagenes',  label: 'Imágenes' },
  { to: '/admin/seo',       label: 'SEO' },
]

export function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <>
      <SkipLink />
      <nav className="admin-nav" aria-label="Navegación del panel de administración">
        <div className="admin-nav__inner">
          <Link to="/admin" className="admin-nav__brand">Watchout Tours Admin</Link>
          <ul role="list" className="admin-nav__list">
            {adminLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button onClick={signOut} className="admin-nav__logout">
            Cerrar sesión
          </button>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}
