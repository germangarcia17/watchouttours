import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = { author_name: '', author_context: '', content: '' }

export default function ResenasAdmin() {
  const [resenas, setResenas]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    document.title = 'Reseñas | WatchOut! Admin'
    loadResenas()
  }, [])

  async function loadResenas() {
    const { data } = await supabase.from('resenas').select('*').order('created_at', { ascending: false })
    setResenas(data ?? [])
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.author_name.trim() || !form.content.trim()) {
      setFormError('El nombre y el texto de la reseña son obligatorios.')
      return
    }
    setSaving(true)
    setFormError(null)
    const { error } = await supabase.from('resenas').insert({ ...form, published: false, featured: false })
    setSaving(false)
    if (!error) {
      setForm(EMPTY)
      loadResenas()
    }
  }

  async function toggle(id, field, current) {
    await supabase.from('resenas').update({ [field]: !current }).eq('id', id)
    setResenas(prev => prev.map(r => r.id === id ? { ...r, [field]: !current } : r))
  }

  async function deleteResena(id) {
    if (!window.confirm('¿Eliminar esta reseña?')) return
    await supabase.from('resenas').delete().eq('id', id)
    setResenas(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reseñas</h1>
      </div>

      <section aria-labelledby="nueva-resena-heading">
        <h2 id="nueva-resena-heading">Añadir reseña</h2>
        <form onSubmit={handleCreate} noValidate style={{ maxWidth: '600px', marginBottom: '2.5rem' }}>
          <div className="form-field">
            <label htmlFor="author_name" className="form-label">Nombre <span aria-hidden="true">*</span></label>
            <input id="author_name" name="author_name" type="text" value={form.author_name} onChange={handleChange} aria-required="true" className="form-control" />
          </div>
          <div className="form-field">
            <label htmlFor="author_context" className="form-label">Contexto (ej: &ldquo;Viajó sola, 2024&rdquo;)</label>
            <input id="author_context" name="author_context" type="text" value={form.author_context} onChange={handleChange} className="form-control" />
          </div>
          <div className="form-field">
            <label htmlFor="resena_content" className="form-label">Texto de la reseña <span aria-hidden="true">*</span></label>
            <textarea id="resena_content" name="content" rows={4} value={form.content} onChange={handleChange} aria-required="true" className="form-control" />
          </div>
          {formError && <p role="alert" aria-live="assertive" className="form-error" style={{ marginBottom: '0.75rem' }}>{formError}</p>}
          <button type="submit" disabled={saving} className="btn btn--primary btn--sm">
            {saving ? 'Guardando…' : 'Añadir reseña'}
          </button>
        </form>
      </section>

      <section aria-labelledby="lista-resenas-heading">
        <h2 id="lista-resenas-heading">Lista de reseñas</h2>
        {loading && <p role="status">Cargando…</p>}
        {!loading && resenas.length === 0 && <p>No hay reseñas todavía.</p>}
        {resenas.map(r => (
          <div key={r.id} className="resena-item">
            <div className="resena-item__meta">
              <strong>{r.author_name}</strong>
              {r.author_context && <span> — {r.author_context}</span>}
            </div>
            <p className="resena-item__quote">&ldquo;{r.content}&rdquo;</p>
            <div className="resena-item__actions">
              <button
                onClick={() => toggle(r.id, 'published', r.published)}
                className={`toggle-btn${r.published ? ' toggle-btn--published' : ''}`}
                aria-pressed={r.published}
              >
                {r.published ? '✓ Publicada' : 'Publicar'}
                <span className="sr-only"> reseña de {r.author_name}</span>
              </button>
              <button
                onClick={() => toggle(r.id, 'featured', r.featured)}
                className={`toggle-btn${r.featured ? ' toggle-btn--featured' : ''}`}
                aria-pressed={r.featured}
              >
                {r.featured ? '★ Destacada' : 'Destacar'}
                <span className="sr-only"> reseña de {r.author_name}</span>
              </button>
              <button onClick={() => deleteResena(r.id)} className="btn btn--danger btn--sm">
                Eliminar<span className="sr-only"> reseña de {r.author_name}</span>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
