import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Blog() {
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Blog sensorial | WatchOut! Sensory Tours'

    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, reading_time, published_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="container" style={{ paddingBlock: '3rem' }}>
      <div className="page-intro">
        <h1>Blog sensorial</h1>
        <p>Reflexiones sobre viajar de forma diferente. Sobre escuchar mejor.</p>
      </div>

      {loading && <p>Cargando artículos…</p>}
      {!loading && posts.length === 0 && <p>Los artículos estarán disponibles próximamente.</p>}

      <ul role="list" className="blog-grid">
        {posts.map(post => (
          <li key={post.id}>
            <article className="card blog-card">
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.published_at))}
                </time>
              )}
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className="blog-card__footer">
                <Link to={`/blog/${post.slug}`}>
                  Leer artículo<span className="sr-only">: {post.title}</span>
                </Link>
                {post.reading_time && <small>{post.reading_time} min</small>}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
