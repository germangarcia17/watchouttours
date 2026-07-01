import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Resenas() {
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Reseñas | WatchOut! Sensory Tours'

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

  return (
    <div className="container container--narrow" style={{ paddingBlock: '3rem' }}>
      <div className="page-intro">
        <h1>Reseñas de viajeras</h1>
        <p>Sin filtros. Sin actores. Solo las palabras de quienes han viajado con nosotras.</p>
      </div>

      {loading && <p>Cargando reseñas…</p>}
      {!loading && resenas.length === 0 && <p>Las reseñas se publicarán próximamente.</p>}

      <ul role="list" className="resenas-list">
        {resenas.map(r => (
          <li key={r.id}>
            <article className={`resena-card${r.featured ? ' resena-card--featured' : ''}`}>
              {r.featured && <p className="resena-card__featured-label">Reseña destacada</p>}
              <blockquote>
                <p>&ldquo;{r.content}&rdquo;</p>
              </blockquote>
              <footer>
                <strong>{r.author_name}</strong>
                {r.author_context && <span> — {r.author_context}</span>}
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
