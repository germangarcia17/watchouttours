import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { sanitizeHtml } from '../lib/sanitizeHtml'
import { supabase } from '../lib/supabase'
import { L, useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import '../styles/pagestyle/BlogPost.css'

export default function BlogPost() {
  const { t } = useTranslation()
  const lang = useLang()
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
      <div className="wrap"><p className="post-estado" role="status">{t('post.loading')}</p></div>
    </section>
  )

  if (notFound) return (
    <section className="post-estado-section">
      <div className="wrap post-notfound">
        <span className="sec-eyebrow">{t('post.oops')}</span>
        <h1 className="post-notfound__titulo">{t('post.notFoundTitle')}</h1>
        <p className="post-estado">{t('post.notFoundText')}</p>
        <L to="/blog" className="btn btn-outline"><span aria-hidden="true">← </span>{t('post.backToBlog')}</L>
      </div>
    </section>
  )

  const title       = pickLocalized(post, 'title', lang)
  const excerpt     = pickLocalized(post, 'excerpt', lang)
  const content     = pickLocalized(post, 'content', lang)
  const metaTitle   = pickLocalized(post, 'meta_title', lang) ?? title
  const metaDesc    = pickLocalized(post, 'meta_description', lang)
  const keywords    = pickLocalized(post, 'keywords', lang)
  const coverAlt    = pickLocalized(post, 'cover_image_alt', lang) ?? ''
  const titleLang   = fieldLangAttr(post, 'title', lang)
  const excerptLang = fieldLangAttr(post, 'excerpt', lang)
  const contentLang = fieldLangAttr(post, 'content', lang)

  const origin      = typeof window !== 'undefined' ? window.location.origin : ''
  const esUrl       = `${origin}/blog/${post.slug}`
  const enUrl       = `${origin}/en/blog/${post.slug}`

  return (
    <article aria-labelledby="post-heading">
      <Helmet>
        <title>{metaTitle} | Watchout Tours</title>
        {metaDesc && <meta name="description" content={metaDesc} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={lang === 'en' ? enUrl : esUrl} />

        {/* Open Graph */}
        <meta property="og:type"        content="article" />
        <meta property="og:locale"      content={lang === 'en' ? 'en_NZ' : 'es_ES'} />
        <meta property="og:title"       content={metaTitle} />
        {metaDesc && <meta property="og:description" content={metaDesc} />}
        {(post.og_image_url ?? post.cover_image_url) && (
          <meta property="og:image" content={post.og_image_url ?? post.cover_image_url} />
        )}
        {post.published_at && <meta property="article:published_time" content={post.published_at} />}

        {/* Twitter */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={metaTitle} />
        {metaDesc && <meta name="twitter:description" content={metaDesc} />}
        {(post.og_image_url ?? post.cover_image_url) && (
          <meta name="twitter:image" content={post.og_image_url ?? post.cover_image_url} />
        )}
      </Helmet>

      {/* ── Cabecera del artículo ────────────────────── */}
      <header className="post-hero">
        <div className="dots-texture"></div>
        <div className="wrap post-hero-inner">
          <p className="post-meta">
            <L to="/blog" className="post-meta__volver"><span aria-hidden="true">← </span>{t('post.backToBlog')}</L>
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Intl.DateTimeFormat(lang === 'en' ? 'en-NZ' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.published_at))}
              </time>
            )}
            {post.reading_time && <span>· {t('post.readTime', { count: post.reading_time })}</span>}
          </p>
          <h1 id="post-heading" className="post-titulo" lang={titleLang}>{title}</h1>
          {excerpt && <p className="post-excerpt" lang={excerptLang}>{excerpt}</p>}
        </div>
      </header>

      {/* ── Portada ──────────────────────────────────── */}
      {post.cover_image_url && (
        <div className="wrap">
          <figure className="post-cover">
            <img src={post.cover_image_url} alt={coverAlt} />
          </figure>
        </div>
      )}

      {/* ── Contenido ────────────────────────────────── */}
      <div className="wrap">
        {/* Sanitizado con DOMPurify: el HTML viene de la base de datos y
            sin limpieza permitiría XSS almacenado en cada visitante */}
        <div
          className="post-contenido"
          lang={contentLang}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />

        <footer className="post-footer">
          <L to="/blog" className="btn btn-outline"><span aria-hidden="true">← </span>{t('post.backToBlog')}</L>
          <L to="/contacto" className="btn btn-solid">{t('post.cta')}</L>
        </footer>
      </div>
    </article>
  )
}
