import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImage } from '../../lib/storage'

import es from '../../i18n/locales/es.json'
import en from '../../i18n/locales/en.json'
import { CREDITOS_HOME } from '../../lib/creditos'

/* Huecos de imagen de la home: una fila por clave de home.huecos (es.json /
   en.json), con su texto alternativo por defecto en los dos idiomas. Así la
   lista del admin y la home no se pueden desincronizar. */
const HUECOS_HOME = Object.keys(es.home.huecos).map(key => ({
  section: 'home', key,
  image_alt: es.home.huecos[key],
  image_alt_en: en.home.huecos[key],
  credito: CREDITOS_HOME[key] ?? '',
}))

const NUEVAS_IMAGENES_SUGERIDAS = [
  ...HUECOS_HOME,
  // ── Renovación visual: huecos de imagen nuevos ──────────────────────
  // Cada uno se puede sustituir sin tocar código. Mientras no se suba una
  // foto, la web usa la imagen actual del proyecto (en la galería de
  // Viajes +60, Hobbiton, Milford Sound y Tekapo no se muestran hasta que
  // tengan foto).
  // Personas ciegas: hero
  {
    section: 'mas-alla-de-la-vista', key: 'hero',
    image_alt: 'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
    image_alt_en: 'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush',
  },
  // Personas ciegas: “¿Cómo son nuestros viajes?”
  {
    section: 'mas-alla-de-la-vista', key: 'como-viajamos',
    image_alt: 'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, con chalecos de Seal Kayak Kaikoura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
    image_alt_en: 'Two travellers sitting in a yellow kayak on the waters of Kaikōura, wearing Seal Kayak Kaikoura life jackets, looking towards another kayak with more travellers under a clear sky',
  },
  // Personas ciegas: “Lo que van a vivir”
  {
    section: 'mas-alla-de-la-vista', key: 'cultura',
    image_alt: 'Joven maorí realizando un haka en una presentación cultural, con collar tradicional de hueso y falda piupiu, sacando la lengua en un gesto de desafío ceremonial',
    image_alt_en: 'Young Māori man performing a haka at a cultural show, wearing a traditional bone necklace and piupiu skirt, pulling out his tongue in a ceremonial gesture of challenge',
  },
  // Viajes +60: “Para quién es”
  {
    section: 'sin-prisa', key: 'para-quien',
    image_alt: 'Tres personas bajo secuoyas altísimas levantan los brazos para tocar una rama baja mientras la luz se filtra entre las copas',
    image_alt_en: 'Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy',
  },
  // Viajes +60: “Casi todo, solo para vosotros”
  {
    section: 'sin-prisa', key: 'privado',
    image_alt: 'Joven maorí realizando un haka en una presentación cultural, con collar tradicional de hueso y falda piupiu, sacando la lengua en un gesto de desafío ceremonial',
    image_alt_en: 'Young Māori man performing a haka at a cultural show, wearing a traditional bone necklace and piupiu skirt, pulling out his tongue in a ceremonial gesture of challenge',
  },
  // Viajes +60: “Si viajas por tu cuenta”
  {
    section: 'sin-prisa', key: 'solo',
    image_alt: 'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
    image_alt_en: 'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it',
  },
  // Viajes +60: “Para tu familia”
  {
    section: 'sin-prisa', key: 'familia',
    image_alt: 'Sylvie y Mónica, fundadoras de WatchOut Tours, sonriendo frente a un géiser humeante en Rotorua',
    image_alt_en: 'Sylvie and Mónica, founders of WatchOut Tours, smiling in front of a steaming geyser in Rotorua',
  },
  // Viajes +60: galería, Hobbiton
  {
    section: 'sin-prisa', key: 'galeria-hobbiton',
    image_alt: 'Hobbiton, en Matamata: casas hobbit entre colinas verdes',
    image_alt_en: 'Hobbiton, Matamata: hobbit holes set among green hills',
  },
  // Viajes +60: galería, Rotorua
  {
    section: 'sin-prisa', key: 'galeria-rotorua',
    image_alt: 'Siete viajeros y guías reunidos en una pasarela de madera, con el vapor del géiser Pōhutu elevándose detrás',
    image_alt_en: 'Seven travellers and guides gather on a boardwalk with steam from the Pōhutu Geyser rising behind them',
  },
  // Viajes +60: galería, Milford Sound
  {
    section: 'sin-prisa', key: 'galeria-milford-sound',
    image_alt: 'Milford Sound: paredes de roca verticales que se levantan sobre el agua del fiordo',
    image_alt_en: 'Milford Sound: sheer rock walls rising straight out of the fiord',
  },
  // Viajes +60: galería, Tekapo
  {
    section: 'sin-prisa', key: 'galeria-tekapo',
    image_alt: 'El lago Tekapo, de agua turquesa, con montañas al fondo',
    image_alt_en: 'Lake Tekapo’s turquoise water with mountains behind',
  },
  // Viajes +60: galería, Kaikōura
  {
    section: 'sin-prisa', key: 'galeria-kaikoura',
    image_alt: 'Dos viajeras sentadas en un kayak amarillo en las aguas de Kaikōura, con chalecos de Seal Kayak Kaikoura, mirando hacia otro kayak con más viajeros bajo un cielo despejado',
    image_alt_en: 'Two travellers sitting in a yellow kayak on the waters of Kaikōura, wearing Seal Kayak Kaikoura life jackets, looking towards another kayak with more travellers under a clear sky',
  },
  // Todas las experiencias: tarjeta “Viajes +60”
  {
    section: 'productos', key: 'tarjeta-viajes-60',
    image_alt: 'Siete viajeros y guías reunidos en una pasarela de madera, con el vapor del géiser Pōhutu elevándose detrás',
    image_alt_en: 'Seven travellers and guides gather on a boardwalk with steam from the Pōhutu Geyser rising behind them',
  },
  // Todas las experiencias: tarjeta de personas ciegas y con baja visión
  {
    section: 'productos', key: 'tarjeta-personas-ciegas',
    image_alt: 'Una mujer apoya la mano sobre una figura maorí tallada mientras su acompañante, a su lado, se la describe con gestos',
    image_alt_en: 'A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it',
  },
  // Todas las experiencias: tarjeta del viaje privado
  {
    section: 'productos', key: 'tarjeta-privado',
    image_alt: 'Sylvie y Mónica, fundadoras de WatchOut Tours, sonriendo frente a un géiser humeante en Rotorua',
    image_alt_en: 'Sylvie and Mónica, founders of WatchOut Tours, smiling in front of a steaming geyser in Rotorua',
  },
  // Hero de /sin-prisa: de momento usa el paisaje del géiser de la home;
  // falta una foto propia (puerto, barco u Hobbiton).
  {
    section: 'sin-prisa', key: 'hero',
    image_alt: 'El géiser Pōhutu de Te Puia, en Rotorua, lanzando una columna de vapor caliente hacia un cielo azul con nubes, junto a una piscina termal turquesa entre vegetación nativa',
    image_alt_en: 'The Pōhutu geyser at Te Puia, Rotorua, sending a column of hot steam into a blue, cloud-streaked sky, beside a turquoise thermal pool surrounded by native bush',
  },
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
  const [editingCred, setEditingCred] = useState({})
  const [saveError, setSaveError] = useState({})
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

  function handleCredChange(id, value) {
    setEditingCred(prev => ({ ...prev, [id]: value }))
  }

  async function saveAlt(image) {
    const newAlt   = editing[image.id]
    const newAltEn = editingEn[image.id]
    const newCred  = editingCred[image.id]
    const altChanged   = newAlt   !== undefined && newAlt   !== (image.image_alt ?? '')
    const altEnChanged = newAltEn !== undefined && newAltEn !== (image.image_alt_en ?? '')
    const credChanged  = newCred  !== undefined && newCred  !== (image.credito ?? '')
    if (!altChanged && !altEnChanged && !credChanged) return

    setSaving(prev => ({ ...prev, [image.id]: true }))
    setSaveError(prev => { const next = { ...prev }; delete next[image.id]; return next })
    const payload = {}
    if (altChanged)   payload.image_alt    = newAlt
    if (altEnChanged) payload.image_alt_en = newAltEn
    // Vacío se guarda como '' (no null): así la web sabe que esta foto no
    // lleva crédito y no usa el de por defecto.
    if (credChanged)  payload.credito      = newCred.trim()
    const { error } = await supabase.from('site_images').update(payload).eq('id', image.id)
    if (error) {
      setSaveError(prev => ({ ...prev, [image.id]: payload.credito !== undefined
        ? 'No se pudo guardar. Si es el crédito, falta ejecutar en Supabase la migración 014 (columna credito).'
        : (error.message ?? 'No se pudo guardar.') }))
      setSaving(prev => { const next = { ...prev }; delete next[image.id]; return next })
      return
    }
    setImages(prev => prev.map(img => img.id === image.id ? { ...img, ...payload } : img))
    setEditing(prev => { const next = { ...prev }; delete next[image.id]; return next })
    setEditingEn(prev => { const next = { ...prev }; delete next[image.id]; return next })
    setEditingCred(prev => { const next = { ...prev }; delete next[image.id]; return next })
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
        .insert({ section: nueva.section, key: nueva.key, image_alt: nueva.image_alt, image_alt_en: nueva.image_alt_en, ...(nueva.credito ? { credito: nueva.credito } : {}) })
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

                <label htmlFor={`cred-${img.id}`} className="form-label" style={{ marginTop: '10px' }}>Crédito de la foto</label>
                <p id={`cred-ayuda-${img.id}`} style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0 0 6px' }}>
                  Se muestra debajo de la foto como «Foto: …» (en inglés, «Photo: …»). Ejemplo: Miles Holden / Tourism New Zealand. Si el texto lleva su propia etiqueta, como «Tiaki: Tourism New Zealand», se muestra tal cual. Déjalo vacío en las fotos propias.
                </p>
                <div className="image-item__alt-row">
                  <input
                    id={`cred-${img.id}`}
                    type="text"
                    aria-describedby={`cred-ayuda-${img.id}`}
                    value={editingCred[img.id] !== undefined ? editingCred[img.id] : (img.credito ?? '')}
                    onChange={e => handleCredChange(img.id, e.target.value)}
                    className="form-control"
                  />
                  <button
                    onClick={() => saveAlt(img)}
                    disabled={saving[img.id] || editingCred[img.id] === undefined}
                    className="btn btn--primary btn--sm"
                  >
                    {saving[img.id] ? '…' : 'Guardar'}
                  </button>
                </div>
                {saveError[img.id] && <p role="alert" className="form-error" style={{ marginTop: '6px' }}>{saveError[img.id]}</p>}
              </div>

            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
