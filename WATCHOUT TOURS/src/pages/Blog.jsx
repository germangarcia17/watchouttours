import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { Seo } from '../components/Seo'
import { L, useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import '../styles/pagestyle/Blog.css'

function formatearFecha(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-NZ' : 'es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

export default function Blog() {
  const { t } = useTranslation()
  const lang = useLang()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
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
      <Seo
        pageType="blog"
        title={t('blog.seo.title')}
        description={t('blog.seo.description')}
      />

      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="blog-hero">
        <div className="wrap blog-hero-inner">
          <span className="sec-eyebrow">{t('blog.eyebrow')}</span>
          <h1 className="blog-titulo">{t('blog.title')}</h1>
          <p className="blog-intro">
            {t('blog.intro')}
          </p>
        </div>
      </section>

      <section className="blog-listado">
        <div className="wrap">
          {loading && <p className="blog-estado" role="status">{t('blog.loading')}</p>}
          {!loading && posts.length === 0 && (
            <p className="blog-estado">{t('blog.empty')}</p>
          )}

          {/* ── Artículo destacado ─────────────────────── */}
          {destacado && (
            <article className="blog-destacado">
              <div className="blog-destacado__meta">
                <span className="sr-only">{t('blog.featuredSr')}</span>
                {destacado.published_at && (
                  <time dateTime={destacado.published_at}>{formatearFecha(destacado.published_at, lang)}</time>
                )}
                {destacado.reading_time && <span>· {t('blog.readTimeLong', { count: destacado.reading_time })}</span>}
              </div>
              <h2 className="blog-destacado__titulo" lang={fieldLangAttr(destacado, 'title', lang)}>{pickLocalized(destacado, 'title', lang)}</h2>
              <p className="blog-destacado__excerpt" lang={fieldLangAttr(destacado, 'excerpt', lang)}>{pickLocalized(destacado, 'excerpt', lang)}</p>
              <L to={`/blog/${destacado.slug}`} className="btn btn-solid">
                {t('blog.readArticle')}<span className="sr-only">: {pickLocalized(destacado, 'title', lang)}</span>
              </L>
            </article>
          )}

          {/* ── Resto de artículos ─────────────────────── */}
          {resto.length > 0 && (
            <ul role="list" className="blog-grid">
              {resto.map(post => (
                <li key={post.id}>
                  <article className="blog-card">
                    <span className="sr-only">{t('blog.nextArticleSr')}</span>
                    <div className="blog-card__meta">
                      {post.published_at && (
                        <time dateTime={post.published_at}>{formatearFecha(post.published_at, lang)}</time>
                      )}
                      {post.reading_time && <span>· {t('blog.readTimeShort', { count: post.reading_time })}</span>}
                    </div>
                    <h2 className="blog-card__titulo" lang={fieldLangAttr(post, 'title', lang)}>{pickLocalized(post, 'title', lang)}</h2>
                    <p className="blog-card__excerpt" lang={fieldLangAttr(post, 'excerpt', lang)}>{pickLocalized(post, 'excerpt', lang)}</p>
                    <L to={`/blog/${post.slug}`} className="blog-card__link">
                      {t('blog.readArticle')}<span className="sr-only">: {pickLocalized(post, 'title', lang)}</span><span aria-hidden="true"> →</span>
                    </L>
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
