import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { Seo } from '../components/Seo'
import { L, useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import { getPreload } from '../lib/preload'
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

      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="rs-hero">
        <div className="wrap rs-hero-inner">
          <span className="sec-eyebrow">{t('resenas.eyebrow')}</span>
          <h1 className="rs-titulo">{t('resenas.title')}</h1>
          <p className="rs-intro">
            {t('resenas.intro')}
          </p>
        </div>
      </section>

      <section className="rs-listado">
        <div className="wrap">
          {loading && <p className="rs-estado" role="status">{t('resenas.loading')}</p>}
          {!loading && resenas.length === 0 && (
            <p className="rs-estado">{t('resenas.empty')}</p>
          )}

          {/* ── Destacadas ─────────────────────────────── */}
          {destacadas.length > 0 && (
            <ul role="list" className="rs-destacadas">
              {destacadas.map(r => (
                <li key={r.id}>
                  <article className="rs-destacada">
                    <span className="rs-destacada__label">{t('resenas.featuredLabel')}</span>
                    <blockquote className="rs-destacada__quote">
                      <p lang={fieldLangAttr(r, 'content', lang)}>&ldquo;{pickLocalized(r, 'content', lang)}&rdquo;</p>
                    </blockquote>
                    <footer className="rs-destacada__who">
                      <strong>{r.author_name}</strong>
                      {pickLocalized(r, 'author_context', lang) && <span> — {pickLocalized(r, 'author_context', lang)}</span>}
                    </footer>
                    {r.video_url && (
                      <details className="testi-video testi-video--claro">
                        <summary>{t('resenas.listen')}</summary>
                        <video src={r.video_url} controls playsInline preload="metadata" aria-label={t('resenas.videoAria', { name: r.author_name })} />
                      </details>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}

          {/* ── Resto ──────────────────────────────────── */}
          {resto.length > 0 && (
            <ul role="list" className="rs-grid">
              {resto.map(r => (
                <li key={r.id}>
                  <article className="rs-card">
                    <blockquote className="rs-card__quote">
                      <p lang={fieldLangAttr(r, 'content', lang)}>&ldquo;{pickLocalized(r, 'content', lang)}&rdquo;</p>
                    </blockquote>
                    <footer className="rs-card__who">
                      <strong>{r.author_name}</strong>
                      {pickLocalized(r, 'author_context', lang) && <span> — {pickLocalized(r, 'author_context', lang)}</span>}
                    </footer>
                    {r.video_url && (
                      <details className="testi-video">
                        <summary>{t('resenas.listen')}</summary>
                        <video src={r.video_url} controls playsInline preload="metadata" aria-label={t('resenas.videoAria', { name: r.author_name })} />
                      </details>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="rs-cta">
        <div className="wrap rs-cta-inner">
          <h2 className="sec-title">{t('resenas.ctaTitle')}</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <L to="/contacto" className="btn btn-solid">{t('resenas.ctaPrimary')}</L>
            <L to="/productos" className="btn btn-outline">{t('resenas.ctaSecondary')}</L>
          </div>
        </div>
      </section>
    </>
  )
}
