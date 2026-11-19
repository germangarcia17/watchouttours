import { supabase } from './supabase'

const BUCKET = 'imagenes'

/* Las fotos que llegan del móvil o de un banco de imágenes pesan decenas de
   megas. Subidas tal cual llenaban el plan gratuito de Supabase y hacían la
   web lenta, así que antes de subir se reducen a WebP con el mismo criterio
   que las imágenes ya migradas al repositorio (1800 px de lado mayor). */
const LADO_MAXIMO = 1800
const CALIDAD = 0.8

async function comprimir(file) {
  // Vídeos, subtítulos .vtt y SVG se suben intactos: no son rasterizables.
  if (!file.type?.startsWith('image/') || file.type === 'image/svg+xml') return file
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return file

  try {
    // imageOrientation respeta el EXIF, para que las fotos verticales del
    // móvil no se suban giradas.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const escala = Math.min(1, LADO_MAXIMO / Math.max(bitmap.width, bitmap.height))
    const ancho = Math.round(bitmap.width * escala)
    const alto = Math.round(bitmap.height * escala)

    const lienzo = document.createElement('canvas')
    lienzo.width = ancho
    lienzo.height = alto
    lienzo.getContext('2d').drawImage(bitmap, 0, 0, ancho, alto)
    bitmap.close?.()

    const blob = await new Promise(res => lienzo.toBlob(res, 'image/webp', CALIDAD))

    // Si no hay mejora (una imagen ya optimizada), se queda el original.
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    // Ante cualquier fallo se sube el original: comprimir nunca debe impedir
    // que la admin publique una imagen.
    return file
  }
}

/* Sube un archivo (imagen, vídeo o subtítulos .vtt) al bucket y devuelve su URL pública.
   folder: carpeta dentro del bucket ('site' | 'blog' | …) */
export async function uploadImage(archivoOriginal, folder = 'blog') {
  const file = await comprimir(archivoOriginal)

  const ext  = file.name.split('.').pop().toLowerCase()
  const name = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const path = `${folder}/${Date.now()}-${name}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      // Algunos sistemas no dan tipo a los .vtt: sin él no se servirían
      // como subtítulos.
      contentType: file.type || (ext === 'vtt' ? 'text/vtt' : undefined),
    })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}
