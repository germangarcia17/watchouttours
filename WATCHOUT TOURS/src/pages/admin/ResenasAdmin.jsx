import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = { author_name: '', author_context: '', content: '', video_url: '', content_en: '', author_context_en: '' }

export default function ResenasAdmin() {
  const [resenas, setResenas]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    document.title = 'Reseñas | Watchout Tours Admin'
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
    const { error } = await supabase.from('resenas').insert({
      ...form,
      video_url: form.video_url.trim() || null,
      content_en: form.content_en.trim() || null,
      author_context_en: form.author_context_en.trim() || null,
      published: false,
      featured: false,
    })
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
          <div className="form-field">
            <label htmlFor="video_url" className="form-label">URL del vídeo del testimonio (opcional)</label>
            <input id="video_url" name="video_url" type="url" value={form.video_url} onChange={handleChange} className="form-control" placeholder="https://…supabase.co/…/testimonio.mp4" />
          </div>

          <fieldset className="form-field" style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '1rem', marginTop: '1rem' }}>
            <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Versión en inglés (opcional)</legend>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 0.75rem' }}>Si lo dejas vacío, en la web en inglés se mostrará el texto en español.</p>
            <div className="form-field">
              <label htmlFor="content_en" className="form-label">Texto de la reseña (inglés)</label>
              <textarea id="content_en" name="content_en" rows={4} value={form.content_en} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-field">
              <label htmlFor="author_context_en" className="form-label">Contexto (inglés)</label>
              <input id="author_context_en" name="author_context_en" type="text" value={form.author_context_en} onChange={handleChange} className="form-control" />
            </div>
          </fieldset>
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
            {r.video_url && <p className="resena-item__video">Con vídeo: <a href={r.video_url} target="_blank" rel="noopener noreferrer">{r.video_url.split('/').pop()}</a></p>}
            <div className="resena-item__actions">
              <button
                onClick={() => toggle(r.id, 'published', r.published)}
                className={`toggle-btn${r.published ? ' toggle-btn--published' : ''}`}
                aria-pressed={r.published}
              >
                {r.published ? <><span aria-hidden="true">✓ </span>Publicada</> : 'Publicar'}
                <span className="sr-only"> reseña de {r.author_name}</span>
              </button>
              <button
                onClick={() => toggle(r.id, 'featured', r.featured)}
                className={`toggle-btn${r.featured ? ' toggle-btn--featured' : ''}`}
                aria-pressed={r.featured}
              >
                {r.featured ? <><span aria-hidden="true">★ </span>Destacada</> : 'Destacar'}
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
