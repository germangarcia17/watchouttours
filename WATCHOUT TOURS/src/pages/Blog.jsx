import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/Blog.css'

function formatearFecha(iso) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

export default function Blog() {
  const [posts, setPosts] = useState([])
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

  const [destacado, ...resto] = posts

  return (
    <>
      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="blog-hero">
        <div className="dots-texture"></div>
        <div className="wrap blog-hero-inner">
          <span className="sec-eyebrow">El país por los sentidos</span>
          <h1 className="blog-titulo">Blog sensorial</h1>
          <p className="blog-intro">
            Reflexiones sobre viajar de forma diferente. Sobre escuchar mejor.
          </p>
        </div>
      </section>

      <section className="blog-listado">
        <div className="wrap">
          {loading && <p className="blog-estado" role="status">Cargando artículos…</p>}
          {!loading && posts.length === 0 && (
            <p className="blog-estado">Los artículos estarán disponibles próximamente.</p>
          )}

          {/* ── Artículo destacado ─────────────────────── */}
          {destacado && (
            <article className="blog-destacado">
              <div className="blog-destacado__meta">
                {destacado.published_at && (
                  <time dateTime={destacado.published_at}>{formatearFecha(destacado.published_at)}</time>
                )}
                {destacado.reading_time && <span>· {destacado.reading_time} min de lectura</span>}
              </div>
              <h2 className="blog-destacado__titulo">{destacado.title}</h2>
              <p className="blog-destacado__excerpt">{destacado.excerpt}</p>
              <Link to={`/blog/${destacado.slug}`} className="btn btn-solid">
                Leer artículo<span className="sr-only">: {destacado.title}</span>
              </Link>
            </article>
          )}

          {/* ── Resto de artículos ─────────────────────── */}
          {resto.length > 0 && (
            <ul role="list" className="blog-grid">
              {resto.map(post => (
                <li key={post.id}>
                  <article className="blog-card">
                    <div className="blog-card__meta">
                      {post.published_at && (
                        <time dateTime={post.published_at}>{formatearFecha(post.published_at)}</time>
                      )}
                      {post.reading_time && <span>· {post.reading_time} min</span>}
                    </div>
                    <h2 className="blog-card__titulo">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-card__link">
                      Leer artículo<span className="sr-only">: {post.title}</span> →
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
