import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', status: 'draft',
  reading_time: '', meta_title: '', meta_description: '', keywords: '', published_at: '',
  cover_image_url: '', cover_image_alt: '', og_image_url: '', category: '', tags: '',
  featured: false, archived: false,
}

export default function BlogEditor() {
  const { id }             = useParams()
  const navigate           = useNavigate()
  const isEdit             = Boolean(id)
  const [form, setForm]    = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [loadingPost, setLoadingPost] = useState(isEdit)
  const [uploading, setUploading] = useState({})
  const [uploadError, setUploadError] = useState({})

  useEffect(() => {
    document.title = isEdit ? 'Editar artículo | WatchOut! Admin' : 'Nuevo artículo | WatchOut! Admin'

    if (isEdit) {
      supabase.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => {
        if (data) setForm({
          title:            data.title ?? '',
          slug:             data.slug ?? '',
          excerpt:          data.excerpt ?? '',
          content:          data.content ?? '',
          status:           data.status ?? 'draft',
          reading_time:     data.reading_time ?? '',
          meta_title:       data.meta_title ?? '',
          meta_description: data.meta_description ?? '',
          keywords:         data.keywords ?? '',
          published_at:     data.published_at ? data.published_at.slice(0, 16) : '',
          cover_image_url:  data.cover_image_url ?? '',
          cover_image_alt:  data.cover_image_alt ?? '',
          og_image_url:     data.og_image_url ?? '',
          category:         data.category ?? '',
          tags:             (data.tags ?? []).join(', '),
          featured:         data.featured ?? false,
          archived:         data.archived ?? false,
        })
        setLoadingPost(false)
      })
    }
  }, [id, isEdit])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function generateSlug() {
    setForm(prev => ({ ...prev, slug: slugify(prev.title) }))
  }

  /* Sube un archivo al bucket y rellena el campo de URL correspondiente */
  async function handleImageUpload(field, file) {
    if (!file) return
    setUploading(prev => ({ ...prev, [field]: true }))
    setUploadError(prev => { const next = { ...prev }; delete next[field]; return next })
    try {
      const { url } = await uploadImage(file, 'blog')
      setForm(prev => ({ ...prev, [field]: url }))
    } catch (err) {
      console.error('[blog-editor] error al subir imagen:', err)
      setUploadError(prev => ({ ...prev, [field]: err.message ?? 'Error al subir la imagen.' }))
    } finally {
      setUploading(prev => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  function validate() {
    const e = {}
    if (!form.title.trim())   e.title   = 'El título es obligatorio.'
    if (!form.slug.trim())    e.slug    = 'El slug es obligatorio.'
    if (!form.excerpt.trim()) e.excerpt = 'El extracto es obligatorio.'
    if (!form.content.trim()) e.content = 'El contenido es obligatorio.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const ev = validate()
    if (Object.keys(ev).length) { setErrors(ev); return }

    setSaving(true)
    const payload = {
      title:            form.title.trim(),
      slug:             form.slug.trim(),
      excerpt:          form.excerpt.trim(),
      content:          form.content.trim(),
      status:           form.status,
      reading_time:     form.reading_time ? Number(form.reading_time) : null,
      meta_title:       form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      keywords:         form.keywords.trim() || null,
      published_at:     form.published_at || null,
      cover_image_url:  form.cover_image_url.trim() || null,
      cover_image_alt:  form.cover_image_alt.trim() || null,
      og_image_url:     form.og_image_url?.trim() || null,
      category:         form.category.trim() || null,
      tags:             form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      featured:         form.featured,
      archived:         form.archived,
    }

    const query = isEdit
      ? supabase.from('blog_posts').update(payload).eq('id', id)
      : supabase.from('blog_posts').insert(payload)

    const { error } = await query
    setSaving(false)
    if (!error) navigate('/admin/blog')
    else alert(`Error al guardar: ${error.message}`)
  }

  if (loadingPost) return <p role="status" style={{ padding: '2rem' }}>Cargando…</p>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{isEdit ? 'Editar artículo' : 'Nuevo artículo'}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate aria-label={isEdit ? 'Editar artículo de blog' : 'Crear artículo de blog'} className="blog-editor">
        <Field id="title" label="Título" required error={errors.title}>
          <input id="title" name="title" type="text" value={form.title} onChange={handleChange} aria-required="true" aria-describedby={errors.title ? 'title-error' : undefined} className={`form-control${errors.title ? ' form-control--error' : ''}`} />
        </Field>

        <Field id="slug" label="Slug (URL)" required error={errors.slug}>
          <div className="slug-row">
            <input id="slug" name="slug" type="text" value={form.slug} onChange={handleChange} aria-required="true" aria-describedby={errors.slug ? 'slug-error' : undefined} className={`form-control${errors.slug ? ' form-control--error' : ''}`} />
            <button type="button" onClick={generateSlug} className="btn btn--ghost btn--sm">Generar</button>
          </div>
        </Field>

        <Field id="excerpt" label="Extracto" required error={errors.excerpt}>
          <textarea id="excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} aria-required="true" aria-describedby={errors.excerpt ? 'excerpt-error' : undefined} className={`form-control${errors.excerpt ? ' form-control--error' : ''}`} />
        </Field>

        <Field id="content" label="Contenido (HTML)" required error={errors.content}>
          <textarea id="content" name="content" rows={14} value={form.content} onChange={handleChange} aria-required="true" aria-describedby={errors.content ? 'content-error' : undefined} className={`form-control form-control--mono${errors.content ? ' form-control--error' : ''}`} />
        </Field>

        <Field id="status" label="Estado">
          <select id="status" name="status" value={form.status} onChange={handleChange} className="form-control" style={{ width: 'auto' }}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
        </Field>

        <Field id="published_at" label="Fecha de publicación">
          <input id="published_at" name="published_at" type="datetime-local" value={form.published_at} onChange={handleChange} className="form-control" style={{ width: 'auto' }} />
        </Field>

        <Field id="reading_time" label="Tiempo de lectura (min)">
          <input id="reading_time" name="reading_time" type="number" min="1" value={form.reading_time} onChange={handleChange} className="form-control" style={{ width: '120px' }} />
        </Field>

        <Field id="meta_title" label="Meta título (SEO)">
          <input id="meta_title" name="meta_title" type="text" value={form.meta_title} onChange={handleChange} className="form-control" />
        </Field>

        <Field id="meta_description" label="Meta descripción (SEO)">
          <textarea id="meta_description" name="meta_description" rows={2} value={form.meta_description} onChange={handleChange} className="form-control" />
        </Field>

        <Field id="keywords" label="Palabras clave (separadas por coma)">
          <input id="keywords" name="keywords" type="text" value={form.keywords} onChange={handleChange} className="form-control" placeholder="nueva zelanda, viaje accesible, personas ciegas" />
        </Field>

        <Field id="cover_image_file" label="Imagen de portada (subir archivo)">
          <div className="editor-upload-row">
            <input
              id="cover_image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={e => handleImageUpload('cover_image_url', e.target.files?.[0])}
              disabled={uploading.cover_image_url}
              className="form-control form-control--file"
            />
            {uploading.cover_image_url && <span className="editor-upload-status" role="status">Subiendo…</span>}
          </div>
          {uploadError.cover_image_url && (
            <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{uploadError.cover_image_url}</p>
          )}
          {form.cover_image_url && (
            <img src={form.cover_image_url} alt={form.cover_image_alt || 'Vista previa de la imagen de portada subida'} className="editor-image-preview" />
          )}
        </Field>

        <Field id="cover_image_url" label="URL de imagen de portada">
          <input id="cover_image_url" name="cover_image_url" type="url" value={form.cover_image_url} onChange={handleChange} className="form-control" placeholder="https://… (se rellena sola al subir un archivo)" />
        </Field>

        <Field id="cover_image_alt" label="Texto alternativo de portada">
          <input id="cover_image_alt" name="cover_image_alt" type="text" value={form.cover_image_alt} onChange={handleChange} className="form-control" />
        </Field>

        <Field id="og_image_file" label="Imagen Open Graph (subir archivo)">
          <div className="editor-upload-row">
            <input
              id="og_image_file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={e => handleImageUpload('og_image_url', e.target.files?.[0])}
              disabled={uploading.og_image_url}
              className="form-control form-control--file"
            />
            {uploading.og_image_url && <span className="editor-upload-status" role="status">Subiendo…</span>}
          </div>
          {uploadError.og_image_url && (
            <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{uploadError.og_image_url}</p>
          )}
        </Field>

        <Field id="og_image_url" label="URL imagen Open Graph">
          <input id="og_image_url" name="og_image_url" type="url" value={form.og_image_url ?? ''} onChange={handleChange} className="form-control" placeholder="https://… (se rellena sola al subir un archivo)" />
        </Field>

        <Field id="category" label="Categoría">
          <input id="category" name="category" type="text" value={form.category} onChange={handleChange} className="form-control" />
        </Field>

        <Field id="tags" label="Etiquetas (separadas por coma)">
          <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} className="form-control" placeholder="viaje, accesibilidad, nueva zelanda" />
        </Field>

        <div className="form-field">
          <label className="form-checkbox-row">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            <span>Artículo destacado</span>
          </label>
        </div>

        <div className="form-field">
          <label className="form-checkbox-row">
            <input type="checkbox" name="archived" checked={form.archived} onChange={handleChange} />
            <span>Archivado</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn btn--primary">
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear artículo'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blog')} className="btn btn--ghost">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ id, label, required, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" aria-live="assertive" className="form-error">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  )
}

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
