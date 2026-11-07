import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { Seo } from '../components/Seo'
import { CabeceraPagina } from '../components/CabeceraPagina'
import { L, useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import { getPreload } from '../lib/preload'
import '../styles/pagestyle/Blog.css'

function formatearFecha(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-NZ' : 'es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

export default function Blog() {
  const { t } = useTranslation()
  const lang = useLang()
  const preloaded = getPreload().blogList ?? null
  const [posts, setPosts] = useState(preloaded ?? [])
  const [loading, setLoading] = useState(!preloaded)

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

      <CabeceraPagina antetitulo={t('blog.eyebrow')} titulo={t('blog.title')}>
        <p>{t('blog.intro')}</p>
      </CabeceraPagina>

      <section className="blog-listado" aria-busy={loading}>
        <div className="wrap">
          {loading && <p className="blog-estado" role="status">{t('blog.loading')}</p>}
          {!loading && posts.length === 0 && (
            <p className="blog-estado">{t('blog.empty')}</p>
          )}

          {posts.length > 0 && (
            <ul role="list" className="blog-lista">
              {[destacado, ...resto].map((post, i) => (
                <li key={post.id} className={i === 0 ? 'blog-lista__destacado' : undefined}>
                  <article className="tarjeta tarjeta--enlace blog-tarjeta">
                    <div className="tarjeta__cuerpo">
                      <span className="sr-only">{i === 0 ? t('blog.featuredSr') : t('blog.nextArticleSr')}</span>
                      <p className="blog-tarjeta__meta">
                        {post.published_at && <time dateTime={post.published_at}>{formatearFecha(post.published_at, lang)}</time>}
                        {post.reading_time && <span> · {t(i === 0 ? 'blog.readTimeLong' : 'blog.readTimeShort', { count: post.reading_time })}</span>}
                      </p>
                      <h2 className="tarjeta__titulo" lang={fieldLangAttr(post, 'title', lang)}>{pickLocalized(post, 'title', lang)}</h2>
                      <p className="tarjeta__texto" lang={fieldLangAttr(post, 'excerpt', lang)}>{pickLocalized(post, 'excerpt', lang)}</p>
                      <div className="tarjeta__pie">
                        <L to={`/blog/${post.slug}`} className={`btn ${i === 0 ? 'btn-solid' : 'btn-outline'} tarjeta__enlace`}>
                          {t('blog.readArticle')}<span className="sr-only">: {pickLocalized(post, 'title', lang)}</span>
                        </L>
                      </div>
                    </div>
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
