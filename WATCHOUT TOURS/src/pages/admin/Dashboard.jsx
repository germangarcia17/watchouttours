import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: null, resenas: null })

  useEffect(() => {
    document.title = 'Dashboard | WatchOut! Admin'

    Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('resenas').select('id', { count: 'exact', head: true }),
    ]).then(([posts, resenas]) => {
      setStats({
        posts:   posts.count ?? '—',
        resenas: resenas.count ?? '—',
      })
    })
  }, [])

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <ul role="list" className="stat-grid">
        <StatCard label="Artículos de blog" value={stats.posts} />
        <StatCard label="Reseñas" value={stats.resenas} />
      </ul>

      <nav aria-label="Acciones rápidas">
        <h2>Acciones rápidas</h2>
        <ul role="list" className="quick-actions" style={{ marginTop: '1rem' }}>
          <li><Link to="/admin/blog/nuevo" className="btn btn--ghost btn--sm">Nuevo artículo</Link></li>
          <li><Link to="/admin/blog" className="btn btn--ghost btn--sm">Ver blog</Link></li>
          <li><Link to="/admin/resenas" className="btn btn--ghost btn--sm">Gestionar reseñas</Link></li>
          <li><Link to="/admin/imagenes" className="btn btn--ghost btn--sm">Imágenes</Link></li>
          <li><Link to="/admin/seo" className="btn btn--ghost btn--sm">SEO</Link></li>
        </ul>
      </nav>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <li className="stat-card">
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value ?? '…'}</p>
    </li>
  )
}
