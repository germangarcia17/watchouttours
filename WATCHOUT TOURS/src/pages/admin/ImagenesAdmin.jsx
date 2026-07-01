import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ImagenesAdmin() {
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState({})
  const [saving, setSaving]   = useState({})

  useEffect(() => {
    document.title = 'Imágenes | WatchOut! Admin'

    supabase.from('site_images').select('*').order('section').then(({ data }) => {
      setImages(data ?? [])
      setLoading(false)
    })
  }, [])

  function handleAltChange(id, value) {
    setEditing(prev => ({ ...prev, [id]: value }))
  }

  async function saveAlt(image) {
    const newAlt = editing[image.id]
    if (newAlt === undefined || newAlt === image.image_alt) return
    setSaving(prev => ({ ...prev, [image.id]: true }))
    await supabase.from('site_images').update({ image_alt: newAlt }).eq('id', image.id)
    setImages(prev => prev.map(img => img.id === image.id ? { ...img, image_alt: newAlt } : img))
    setEditing(prev => { const next = { ...prev }; delete next[image.id]; return next })
    setSaving(prev => { const next = { ...prev }; delete next[image.id]; return next })
  }

  if (loading) return <p style={{ padding: '2rem' }}>Cargando…</p>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Imágenes del sitio</h1>
      </div>
      <p>Edita los textos alternativos de las imágenes fijas del sitio web.</p>

      {images.length === 0 && <p>No hay imágenes registradas.</p>}

      <ul role="list" style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
        {images.map(img => (
          <li key={img.id} className="image-item">
            <p className="image-item__key">{img.section} — {img.key}</p>
            {img.storage_path && <p className="image-item__src">{img.storage_path}</p>}
            <label htmlFor={`alt-${img.id}`} className="form-label">Texto alternativo</label>
            <div className="image-item__alt-row">
              <textarea
                id={`alt-${img.id}`}
                rows={2}
                value={editing[img.id] !== undefined ? editing[img.id] : (img.image_alt ?? '')}
                onChange={e => handleAltChange(img.id, e.target.value)}
                className="form-control"
              />
              <button
                onClick={() => saveAlt(img)}
                disabled={saving[img.id] || editing[img.id] === undefined}
                className="btn btn--primary btn--sm"
              >
                {saving[img.id] ? '…' : 'Guardar'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
