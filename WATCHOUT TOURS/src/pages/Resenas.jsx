import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { VideoTestimonio } from '../components/VideoTestimonio'
import { Seo } from '../components/Seo'
import { CabeceraPagina } from '../components/CabeceraPagina'
import { L, useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import { getPreload } from '../lib/preload'
import '../styles/pagestyle/Home.css'
import '../styles/pagestyle/Resenas.css'

export default function Resenas() {
  const { t } = useTranslation()
  const lang = useLang()
  const preloaded = getPreload().resenas ?? null
  const [resenas, setResenas] = useState(preloaded ?? [])
  const [loading, setLoading] = useState(!preloaded)

  useEffect(() => {
    supabase
      .from('resenas')
      .select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setResenas(data ?? [])
        setLoading(false)
      })
  }, [])

  const destacadas = resenas.filter(r => r.featured)
  const resto      = resenas.filter(r => !r.featured)

  return (
    <>
      <Seo
        pageType="reseñas"
        title={t('resenas.seo.title')}
        description={t('resenas.seo.description')}
      />

      <CabeceraPagina antetitulo={t('resenas.eyebrow')} titulo={t('resenas.title')}>
        <p>{t('resenas.intro')}</p>
      </CabeceraPagina>

      <section className="rs-listado" aria-busy={loading}>
        <div className="wrap">
          {loading && <p className="rs-estado" role="status">{t('resenas.loading')}</p>}
          {!loading && resenas.length === 0 && (
            <p className="rs-estado">{t('resenas.empty')}</p>
          )}

          {/* Destacadas primero (la primera, a todo el ancho) y después el
              resto; todas con el mismo modelo de tarjeta de reseña. */}
          {resenas.length > 0 && (
            <ul role="list" className="rs-lista">
              {[...destacadas, ...resto].map((r, i) => {
                const contexto = pickLocalized(r, 'author_context', lang)
                return (
                  <li key={r.id} className={i === 0 && destacadas.length > 0 ? 'rs-lista__destacada' : undefined}>
                    <figure className={`resena${i === 0 && destacadas.length > 0 ? ' resena--destacada' : ''}`}>
                      {r.featured && <p className="resena__etiqueta">{t('resenas.featuredLabel')}</p>}
                      <span className="resena__comillas" aria-hidden="true">“</span>
                      <blockquote className="resena__cita" lang={fieldLangAttr(r, 'content', lang)}>
                        <p>{pickLocalized(r, 'content', lang)}</p>
                      </blockquote>
                      <figcaption className="resena__autor">
                        <span className="resena__nombre">{r.author_name}</span>
                        {contexto && <span className="resena__contexto" lang={fieldLangAttr(r, 'author_context', lang)}>{contexto}</span>}
                      </figcaption>
                      {r.video_url && <VideoTestimonio resena={r} />}
                    </figure>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="rs-cta band-night" aria-labelledby="rs-cta-titulo">
        <div className="wrap rs-cta-inner">
          <h2 id="rs-cta-titulo" className="sec-title">{t('resenas.ctaTitle')}</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <L to="/contacto" className="btn btn-solid">{t('resenas.ctaPrimary')}</L>
            <L to="/productos" className="btn btn-outline">{t('resenas.ctaSecondary')}</L>
          </div>
        </div>
      </section>
    </>
  )
}
