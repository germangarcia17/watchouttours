/* Créditos de las fotos de Tourism New Zealand.
   Cada hueco de /admin/imagenes tiene un campo "crédito" (columna credito
   de site_images). Se guarda sin prefijo, p. ej. "Miles Holden / Tourism
   New Zealand", y la web lo muestra como "Foto: …" o "Photo: …" según el
   idioma. Si el texto ya lleva su propia etiqueta con dos puntos (p. ej.
   "Tiaki: Tourism New Zealand"), se muestra tal cual. Vacío: sin crédito
   (fotos propias).
   Estos son los valores por defecto mientras la fila del admin no tenga
   crédito guardado (columna a null). */
const TNZ = fotografo => `${fotografo} / Tourism New Zealand`

export const CREDITOS_HOME = {
  'pais-panoramica': TNZ('Miles Holden'),
  'pais-vertical': TNZ('Miles Holden'),
  'panel-privado': TNZ('Miles Holden'),
  'panel-sesenta': TNZ('Miles Holden'),
  'salida-foto': TNZ('Miles Holden'),
  'tiaki-tohu': 'Tiaki: Tourism New Zealand',
  'destino-aoraki': TNZ('Miles Holden'),
  'destino-kaikoura': TNZ('Miles Holden'),
  'destino-waitomo': TNZ('Shaun Jeffers'),
  'galeria-01': TNZ('Miles Holden'),
  'galeria-04': TNZ('Eric Hanson'),
  'galeria-06': TNZ('Miles Holden'),
  'galeria-07': TNZ('Miles Holden'),
  'galeria-08': TNZ('Miles Holden'),
  'galeria-09': TNZ('Miles Holden'),
  'galeria-10': TNZ('Miles Holden'),
  'galeria-11': TNZ('Miles Holden'),
  'cierre': TNZ('Miles Holden'),
}

/* Viajes +60 (/sin-prisa, sección "sin-prisa" del admin). La foto de las
   anfitrionas es propia: sin crédito. */
export const CREDITOS_SESENTA = {
  'sesenta-portada': TNZ('Miles Holden'),
  'sesenta-hobbiton': TNZ('Miles Holden'),
  'sesenta-rotorua': TNZ('Miles Holden'),
  'sesenta-kaikoura': TNZ('Miles Holden'),
  'sesenta-anfitrionas': '',
  'sesenta-cierre': TNZ('Miles Holden'),
}

/* Más allá de la vista. La de la granja es propia, sin crédito; la de la
   portada aún no se conoce: su crédito se escribe en el admin al subirla. */
export const CREDITOS_VISTA = {
  'vista-portada': '',
  'vista-unico': TNZ('Graeme Murray'),
  'vista-vivir': '',
}

/* Texto que se muestra, o null si no hay crédito. */
export function textoCredito(credito, lang) {
  const c = (credito ?? '').trim()
  if (!c) return null
  if (/^[^/]{1,40}:\s/.test(c)) return c
  return `${lang === 'en' ? 'Photo' : 'Foto'}: ${c}`
}
