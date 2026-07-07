import { supabase } from './supabase'

const BUCKET = 'imagenes'

/* Sube un archivo de imagen al bucket y devuelve su URL pública.
   folder: carpeta dentro del bucket ('site' | 'blog' | …) */
export async function uploadImage(file, folder = 'blog') {
  const ext  = file.name.split('.').pop().toLowerCase()
  const name = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
  const path = `${folder}/${Date.now()}-${name}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}
