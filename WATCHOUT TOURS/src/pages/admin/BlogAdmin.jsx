import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function BlogAdmin() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Blog | Watchout Tours Admin'
    loadPosts()
  }, [])

  async function loadPosts() {
    const { data } = await supabase.from('blog_posts').select('id, title, slug, status, category, featured, published_at').order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  async function deletePost(id) {
    if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Artículos de blog</h1>
        <Link to="/admin/blog/nuevo" className="btn btn--primary btn--sm">Nuevo artículo</Link>
      </div>

      {loading && <p role="status">Cargando…</p>}
      {!loading && posts.length === 0 && <p>No hay artículos todavía.</p>}

      {posts.length > 0 && (
        <table className="admin-table" aria-label="Lista de artículos">
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Categoría</th>
              <th scope="col">Estado</th>
              <th scope="col">Destacado</th>
              <th scope="col">Publicado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.category ?? '—'}</td>
                <td>
                  <span className={`status-badge status-badge--${post.status}`}>{post.status}</span>
                </td>
                <td>{post.featured ? <><span aria-hidden="true">★</span><span className="sr-only">Sí</span></> : <><span aria-hidden="true">—</span><span className="sr-only">No</span></>}</td>
                <td>
                  {post.published_at
                    ? new Intl.DateTimeFormat('es-ES').format(new Date(post.published_at))
                    : '—'}
                </td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/blog/${post.id}`}>Editar<span className="sr-only">: {post.title}</span></Link>
                    <button onClick={() => deletePost(post.id)} className="delete-btn">
                      Eliminar<span className="sr-only">: {post.title}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
