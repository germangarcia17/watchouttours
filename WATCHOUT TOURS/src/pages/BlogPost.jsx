import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/BlogPost.css'

export default function BlogPost() {
  const { slug }          = useParams()
  const [post, setPost]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true)
        } else {
          setPost(data)
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return (
    <section className="post-estado-section">
      <div className="wrap"><p className="post-estado" role="status">Cargando…</p></div>
    </section>
  )

  if (notFound) return (
    <section className="post-estado-section">
      <div className="wrap post-notfound">
        <span className="sec-eyebrow">Ups</span>
        <h1 className="post-notfound__titulo">Artículo no encontrado</h1>
        <p className="post-estado">Puede que el enlace haya cambiado o que el artículo ya no exista.</p>
        <Link to="/blog" className="btn btn-outline"><span aria-hidden="true">← </span>Volver al blog</Link>
      </div>
    </section>
  )

  return (
    <article aria-labelledby="post-heading">
      <Helmet>
        <title>{post.meta_title ?? post.title} | WatchOut! Sensory Tours</title>
        {post.meta_description && <meta name="description" content={post.meta_description} />}

        {/* Open Graph */}
        <meta property="og:type"        content="article" />
        <meta property="og:title"       content={post.og_title ?? post.meta_title ?? post.title} />
        {(post.og_description ?? post.meta_description) && (
          <meta property="og:description" content={post.og_description ?? post.meta_description} />
        )}
        {(post.og_image_url ?? post.cover_image_url) && (
          <meta property="og:image" content={post.og_image_url ?? post.cover_image_url} />
        )}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={post.og_title ?? post.meta_title ?? post.title} />
        {(post.og_description ?? post.meta_description) && (
          <meta name="twitter:description" content={post.og_description ?? post.meta_description} />
        )}
        {(post.og_image_url ?? post.cover_image_url) && (
          <meta name="twitter:image" content={post.og_image_url ?? post.cover_image_url} />
        )}
      </Helmet>

      {/* ── Cabecera del artículo ────────────────────── */}
      <header className="post-hero">
        <div className="dots-texture"></div>
        <div className="wrap post-hero-inner">
          <p className="post-meta">
            <Link to="/blog" className="post-meta__volver"><span aria-hidden="true">← </span>Volver al blog</Link>
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.published_at))}
              </time>
            )}
            {post.reading_time && <span>· {post.reading_time} min de lectura</span>}
          </p>
          <h1 id="post-heading" className="post-titulo">{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        </div>
      </header>

      {/* ── Portada ──────────────────────────────────── */}
      {post.cover_image_url && (
        <div className="wrap">
          <figure className="post-cover">
            <img src={post.cover_image_url} alt={post.cover_image_alt ?? ''} />
          </figure>
        </div>
      )}

      {/* ── Contenido ────────────────────────────────── */}
      <div className="wrap">
        <div
          className="post-contenido"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="post-footer">
          <Link to="/blog" className="btn btn-outline"><span aria-hidden="true">← </span>Volver al blog</Link>
          <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
        </footer>
      </div>
    </article>
  )
}
