import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Seo } from '../components/Seo'
import '../styles/pagestyle/Resenas.css'

export default function Resenas() {
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)

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
        title="Reseñas | Watchout Tours"
        description="Lo que cuentan quienes han viajado con nosotras por Nueva Zelanda. Sin filtros, sin actores."
      />

      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="rs-hero">
        <div className="dots-texture"></div>
        <div className="wrap rs-hero-inner">
          <span className="sec-eyebrow">Lo que cuentan</span>
          <h1 className="rs-titulo">Reseñas de viajeros</h1>
          <p className="rs-intro">
            Sin filtros. Sin actores. Solo las palabras de quienes han viajado con nosotras.
          </p>
        </div>
      </section>

      <section className="rs-listado">
        <div className="wrap">
          {loading && <p className="rs-estado" role="status">Cargando reseñas…</p>}
          {!loading && resenas.length === 0 && (
            <p className="rs-estado">Las reseñas se publicarán próximamente.</p>
          )}

          {/* ── Destacadas ─────────────────────────────── */}
          {destacadas.length > 0 && (
            <ul role="list" className="rs-destacadas">
              {destacadas.map(r => (
                <li key={r.id}>
                  <article className="rs-destacada">
                    <span className="rs-destacada__label">Reseña destacada</span>
                    <blockquote className="rs-destacada__quote">
                      <p>&ldquo;{r.content}&rdquo;</p>
                    </blockquote>
                    <footer className="rs-destacada__who">
                      <strong>{r.author_name}</strong>
                      {r.author_context && <span> — {r.author_context}</span>}
                    </footer>
                    {r.video_url && (
                      <details className="testi-video testi-video--claro">
                        <summary>Escuchar testimonio</summary>
                        <video src={r.video_url} controls playsInline preload="metadata" aria-label={`Testimonio en vídeo de ${r.author_name}`} />
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
                      <p>&ldquo;{r.content}&rdquo;</p>
                    </blockquote>
                    <footer className="rs-card__who">
                      <strong>{r.author_name}</strong>
                      {r.author_context && <span> — {r.author_context}</span>}
                    </footer>
                    {r.video_url && (
                      <details className="testi-video">
                        <summary>Escuchar testimonio</summary>
                        <video src={r.video_url} controls playsInline preload="metadata" aria-label={`Testimonio en vídeo de ${r.author_name}`} />
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
          <h2 className="sec-title">¿La próxima reseña será la tuya?</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
            <Link to="/productos" className="btn btn-outline">Ver las rutas</Link>
          </div>
        </div>
      </section>
    </>
  )
}
