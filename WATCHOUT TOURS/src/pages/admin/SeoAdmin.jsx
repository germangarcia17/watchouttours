import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const PAGE_TYPES = ['home', 'productos', 'reseñas', 'blog']

const EMPTY_META = {
  meta_title: '', meta_description: '', keywords: '', canonical_url: '',
  og_title: '', og_description: '', og_image_url: '',
  twitter_title: '', twitter_description: '', twitter_image_url: '',
  meta_title_en: '', meta_description_en: '', keywords_en: '',
  og_title_en: '', og_description_en: '',
  twitter_title_en: '', twitter_description_en: '',
}

const FIELDS_ES = [
  ['meta_title',            'Meta título'],
  ['meta_description',      'Meta descripción'],
  ['keywords',              'Palabras clave (separadas por coma)'],
  ['canonical_url',         'URL canónica'],
  ['og_title',              'OG título'],
  ['og_description',        'OG descripción'],
  ['og_image_url',          'OG imagen URL'],
  ['twitter_title',         'Twitter título'],
  ['twitter_description',   'Twitter descripción'],
  ['twitter_image_url',     'Twitter imagen URL'],
]

const FIELDS_EN = [
  ['meta_title_en',          'Meta título (inglés)'],
  ['meta_description_en',    'Meta descripción (inglés)'],
  ['keywords_en',            'Palabras clave (inglés)'],
  ['og_title_en',            'OG título (inglés)'],
  ['og_description_en',      'OG descripción (inglés)'],
  ['twitter_title_en',       'Twitter título (inglés)'],
  ['twitter_description_en', 'Twitter descripción (inglés)'],
]

export default function SeoAdmin() {
  const [rows, setRows]         = useState({}) // { page_type: row }
  const [forms, setForms]       = useState({}) // { page_type: { ...fields } }
  const [saving, setSaving]     = useState({}) // { page_type: bool }
  const [saved, setSaved]       = useState({}) // { page_type: bool }
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    document.title = 'SEO | Watchout Tours Admin'

    supabase
      .from('seo_metadata')
      .select('*')
      .in('page_type', PAGE_TYPES)
      .then(({ data }) => {
        const byType = {}
        const byForm = {}
        PAGE_TYPES.forEach(pt => {
          const row = data?.find(r => r.page_type === pt) ?? null
          byType[pt] = row
          byForm[pt] = row
            ? { ...EMPTY_META, ...Object.fromEntries(Object.keys(EMPTY_META).map(k => [k, row[k] ?? ''])) }
            : { ...EMPTY_META }
        })
        setRows(byType)
        setForms(byForm)
        setLoading(false)
      })
  }, [])

  function handleChange(pageType, e) {
    const { name, value } = e.target
    setForms(prev => ({ ...prev, [pageType]: { ...prev[pageType], [name]: value } }))
  }

  async function handleSave(pageType) {
    setSaving(prev => ({ ...prev, [pageType]: true }))
    const payload = {
      page_type: pageType,
      ...Object.fromEntries(Object.entries(forms[pageType]).map(([k, v]) => [k, v.trim() || null])),
    }

    let error
    if (rows[pageType]) {
      ;({ error } = await supabase.from('seo_metadata').update(payload).eq('id', rows[pageType].id))
    } else {
      const { data, error: err } = await supabase.from('seo_metadata').insert(payload).select().single()
      error = err
      if (data) setRows(prev => ({ ...prev, [pageType]: data }))
    }

    setSaving(prev => ({ ...prev, [pageType]: false }))
    if (!error) {
      setSaved(prev => ({ ...prev, [pageType]: true }))
      setTimeout(() => setSaved(prev => ({ ...prev, [pageType]: false })), 2500)
    } else {
      alert(`Error al guardar: ${error.message}`)
    }
  }

  if (loading) return <div className="admin-page"><p role="status">Cargando…</p></div>

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>SEO</h1>
      </div>
      <p style={{ marginBottom: '2rem' }}>
        Gestiona los metadatos SEO de las páginas principales. Los artículos de blog tienen sus propios campos SEO en el editor de artículos.
      </p>

      {PAGE_TYPES.map(pt => (
        <section key={pt} aria-labelledby={`seo-${pt}-heading`} style={{ marginBottom: '2.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
          <h2 id={`seo-${pt}-heading`} style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>{pt}</h2>

          <div className="blog-editor">
            {FIELDS_ES.map(([field, label]) => renderField(pt, field, label, forms, handleChange))}

            <fieldset style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '1rem 1.25rem', margin: '1rem 0' }}>
              <legend style={{ fontWeight: 700, padding: '0 0.5rem' }}>Versión en inglés (opcional)</legend>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '0 0 1rem' }}>
                Lo que dejes vacío usará el texto en español en la web en inglés (<code>/en</code>). La URL canónica y las imágenes son comunes a ambos idiomas.
              </p>
              {FIELDS_EN.map(([field, label]) => renderField(pt, field, label, forms, handleChange))}
            </fieldset>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => handleSave(pt)}
                disabled={saving[pt]}
                className="btn btn--primary btn--sm"
              >
                {saving[pt] ? 'Guardando…' : 'Guardar'}
              </button>
              {saved[pt] && <span style={{ color: 'var(--jade)', fontSize: '0.875rem', fontWeight: 600 }}>✓ Guardado</span>}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

function renderField(pt, field, label, forms, handleChange) {
  const isDesc = field.includes('description')
  const isUrl = field.includes('url')
  return (
    <div key={field} className="form-field">
      <label htmlFor={`${pt}-${field}`} className="form-label">{label}</label>
      {isDesc ? (
        <textarea
          id={`${pt}-${field}`}
          name={field}
          rows={2}
          value={forms[pt]?.[field] ?? ''}
          onChange={e => handleChange(pt, e)}
          className="form-control"
        />
      ) : (
        <input
          id={`${pt}-${field}`}
          name={field}
          type={isUrl ? 'url' : 'text'}
          value={forms[pt]?.[field] ?? ''}
          onChange={e => handleChange(pt, e)}
          className="form-control"
          placeholder={isUrl ? 'https://…' : ''}
        />
      )}
    </div>
  )
}
