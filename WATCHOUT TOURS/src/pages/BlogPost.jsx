import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'

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

  if (loading)   return <p style={{ padding: '3rem 1.5rem' }}>Cargando…</p>
  if (notFound)  return (
    <div className="container" style={{ paddingBlock: '3rem' }}>
      <h1>Artículo no encontrado</h1>
      <Link to="/blog">← Volver al blog</Link>
    </div>
  )

  return (
    <article aria-labelledby="post-heading" className="blog-post">
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
      <div className="blog-post__meta">
        {post.published_at && (
          <time dateTime={post.published_at}>
            {new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.published_at))}
            {post.reading_time && ` · ${post.reading_time} min de lectura`}
          </time>
        )}
      </div>
      <h1 id="post-heading" className="blog-post__title">{post.title}</h1>
      <p className="blog-post__excerpt">{post.excerpt}</p>
      <hr />
      <div
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <p style={{ marginTop: '3rem' }}>
        <Link to="/blog">← Volver al blog</Link>
      </p>
    </article>
  )
}
