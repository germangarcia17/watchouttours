import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'

export default function ImagenesAdmin() {
  const [images, setImages]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState({})
  const [saving, setSaving]     = useState({})
  const [uploading, setUploading] = useState({})
  const [uploadError, setUploadError] = useState({})

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

  async function saveAlt(image) {
    const newAlt = editing[image.id]
    if (newAlt === undefined || newAlt === image.image_alt) return
    setSaving(prev => ({ ...prev, [image.id]: true }))
    await supabase.from('site_images').update({ image_alt: newAlt }).eq('id', image.id)
    setImages(prev => prev.map(img => img.id === image.id ? { ...img, image_alt: newAlt } : img))
    setEditing(prev => { const next = { ...prev }; delete next[image.id]; return next })
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

  if (loading) return <div className="admin-page"><p role="status">Cargando…</p></div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Imágenes del sitio</h1>
      </div>
      <p>Sube una imagen nueva para reemplazarla en la web y edita su texto alternativo. Los archivos se guardan en el bucket <code>imagenes</code> de Supabase.</p>

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

                <label htmlFor={`alt-${img.id}`} className="form-label" style={{ marginTop: '14px' }}>Texto alternativo</label>
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
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
