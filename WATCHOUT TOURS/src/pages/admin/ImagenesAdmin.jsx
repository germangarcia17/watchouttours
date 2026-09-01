import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'

const NUEVAS_IMAGENES_SUGERIDAS = [
  {
    section: 'sobre-nosotras', key: 'equipo-moni',
    image_alt: 'Moni, cofundadora y guía de Watchout Tours, en Nueva Zelanda',
    image_alt_en: 'Moni, co-founder and guide at Watchout Tours, in New Zealand',
  },
  {
    section: 'sobre-nosotras', key: 'equipo-sylvie',
    image_alt: 'Sylvie, cofundadora y guía de Watchout Tours, en Nueva Zelanda',
    image_alt_en: 'Sylvie, co-founder and guide at Watchout Tours, in New Zealand',
  },
  {
    section: 'sobre-nosotras', key: 'equipo-nuria',
    image_alt: 'Nuria sonriendo durante su viaje piloto por Nueva Zelanda con Watchout Tours',
    image_alt_en: 'Nuria smiling during her pilot trip across New Zealand with Watchout Tours',
  },
]

export default function ImagenesAdmin() {
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState({})
  const [editingEn, setEditingEn] = useState({})
  const [saving, setSaving]     = useState({})
  const [uploading, setUploading] = useState({})
  const [uploadError, setUploadError] = useState({})
  const [creating, setCreating] = useState({})
  const [createError, setCreateError] = useState({})

  useEffect(() => {
    document.title = 'Imágenes | Watchout Tours Admin'

    supabase.from('site_images').select('*').order('section').then(({ data }) => {
      setImages(data ?? [])
      setLoading(false)
    })
  }, [])

  function handleAltChange(id, value) {
    setEditing(prev => ({ ...prev, [id]: value }))
  }

  function handleAltEnChange(id, value) {
    setEditingEn(prev => ({ ...prev, [id]: value }))
  }

  async function saveAlt(image) {
    const newAlt   = editing[image.id]
    const newAltEn = editingEn[image.id]
    const altChanged   = newAlt   !== undefined && newAlt   !== (image.image_alt ?? '')
    const altEnChanged = newAltEn !== undefined && newAltEn !== (image.image_alt_en ?? '')
    if (!altChanged && !altEnChanged) return

    setSaving(prev => ({ ...prev, [image.id]: true }))
    const payload = {}
    if (altChanged)   payload.image_alt    = newAlt
    if (altEnChanged) payload.image_alt_en = newAltEn
    await supabase.from('site_images').update(payload).eq('id', image.id)
    setImages(prev => prev.map(img => img.id === image.id ? { ...img, ...payload } : img))
    setEditing(prev => { const next = { ...prev }; delete next[image.id]; return next })
    setEditingEn(prev => { const next = { ...prev }; delete next[image.id]; return next })
    setSaving(prev => { const next = { ...prev }; delete next[image.id]; return next })
  }

  async function handleFileUpload(image, file) {
    if (!file) return
    setUploading(prev => ({ ...prev, [image.id]: true }))
    setUploadError(prev => { const next = { ...prev }; delete next[image.id]; return next })
    try {
      const { url } = await uploadImage(file, 'site')
      const { error } = await supabase.from('site_images').update({ src: url }).eq('id', image.id)
      if (error) throw error
      setImages(prev => prev.map(img => img.id === image.id ? { ...img, src: url } : img))
    } catch (err) {
      console.error('[imagenes] error al subir:', err)
      setUploadError(prev => ({ ...prev, [image.id]: err.message ?? 'Error al subir la imagen.' }))
    } finally {
      setUploading(prev => { const next = { ...prev }; delete next[image.id]; return next })
    }
  }

  async function crearImagen(nueva) {
    const key = `${nueva.section}:${nueva.key}`
    setCreating(prev => ({ ...prev, [key]: true }))
    setCreateError(prev => { const next = { ...prev }; delete next[key]; return next })
    try {
      const { data, error } = await supabase
        .from('site_images')
        .insert({ section: nueva.section, key: nueva.key, image_alt: nueva.image_alt, image_alt_en: nueva.image_alt_en })
        .select()
        .single()
      if (error) throw error
      setImages(prev => [...prev, data].sort((a, b) => a.section.localeCompare(b.section)))
    } catch (err) {
      console.error('[imagenes] error al crear:', err)
      setCreateError(prev => ({ ...prev, [key]: err.message ?? 'Error al crear la imagen.' }))
    } finally {
      setCreating(prev => { const next = { ...prev }; delete next[key]; return next })
    }
  }

  if (loading) return <div className="admin-page"><p role="status">Cargando…</p></div>

  const existentes = new Set(images.map(img => `${img.section}:${img.key}`))
  const pendientes = NUEVAS_IMAGENES_SUGERIDAS.filter(n => !existentes.has(`${n.section}:${n.key}`))

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Imágenes del sitio</h1>
      </div>
      <p>Sube una imagen nueva para reemplazarla en la web y edita su texto alternativo. Los archivos se guardan en el bucket <code>imagenes</code> de Supabase.</p>

      {pendientes.length > 0 && (
        <div className="admin-page-header" style={{ marginTop: '1.5rem' }}>
          <h2>Espacios de imagen nuevos por crear</h2>
          <p>Estos espacios ya están referenciados en el código de la web pero aún no tienen fila en la base de datos. Créalos aquí para poder subirles foto.</p>
          <ul role="list" style={{ listStyle: 'none', padding: 0 }}>
            {pendientes.map(n => {
              const key = `${n.section}:${n.key}`
              return (
                <li key={key} style={{ marginBottom: '10px' }}>
                  <strong>{n.section} — {n.key}</strong>
                  {' '}
                  <button
                    onClick={() => crearImagen(n)}
                    disabled={creating[key]}
                    className="btn btn--primary btn--sm"
                  >
                    {creating[key] ? 'Creando…' : 'Crear'}
                  </button>
                  {createError[key] && (
                    <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{createError[key]}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {images.length === 0 && <p>No hay imágenes registradas.</p>}

      <ul role="list" style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem' }}>
        {images.map(img => (
          <li key={img.id} className="image-item">
            <div className="image-item__grid">

              <div className="image-item__preview">
                {img.src ? (
                  <img src={img.src} alt={img.image_alt ?? ''} />
                ) : (
                  <span className="image-item__placeholder" aria-hidden="true">Sin imagen</span>
                )}
              </div>

              <div className="image-item__fields">
                <p className="image-item__key">{img.section} — {img.key}</p>
                {img.src && <p className="image-item__src">{img.src}</p>}

                <label htmlFor={`file-${img.id}`} className="form-label">Reemplazar imagen</label>
                <div className="image-item__upload-row">
                  <input
                    id={`file-${img.id}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    onChange={e => handleFileUpload(img, e.target.files?.[0])}
                    disabled={uploading[img.id]}
                    className="form-control form-control--file"
                  />
                  {uploading[img.id] && <span className="image-item__status" role="status">Subiendo…</span>}
                </div>
                {uploadError[img.id] && (
                  <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{uploadError[img.id]}</p>
                )}

                <label htmlFor={`alt-${img.id}`} className="form-label" style={{ marginTop: '14px' }}>Texto alternativo (español)</label>
                <textarea
                  id={`alt-${img.id}`}
                  rows={2}
                  value={editing[img.id] !== undefined ? editing[img.id] : (img.image_alt ?? '')}
                  onChange={e => handleAltChange(img.id, e.target.value)}
                  className="form-control"
                />

                <label htmlFor={`alt-en-${img.id}`} className="form-label" style={{ marginTop: '10px' }}>Texto alternativo (inglés)</label>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 6px' }}>Si lo dejas vacío, en la web en inglés se usa el texto en español.</p>
                <div className="image-item__alt-row">
                  <textarea
                    id={`alt-en-${img.id}`}
                    rows={2}
                    value={editingEn[img.id] !== undefined ? editingEn[img.id] : (img.image_alt_en ?? '')}
                    onChange={e => handleAltEnChange(img.id, e.target.value)}
                    className="form-control"
                  />
                  <button
                    onClick={() => saveAlt(img)}
                    disabled={saving[img.id] || (editing[img.id] === undefined && editingEn[img.id] === undefined)}
                    className="btn btn--primary btn--sm"
                  >
                    {saving[img.id] ? '…' : 'Guardar'}
                  </button>
                </div>
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
