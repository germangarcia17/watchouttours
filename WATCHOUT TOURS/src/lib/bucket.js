/* Construye la URL pública de un archivo del bucket "imagenes" de Supabase.
   Uso: bucketUrl('foto-grupo.jpg') */
const BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/imagenes`

export function bucketUrl(path) {
  return `${BASE}/${path}`
}
