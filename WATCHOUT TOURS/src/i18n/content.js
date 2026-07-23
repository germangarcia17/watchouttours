/* Selecciona la versión localizada de un campo de la base de datos.
   En inglés devuelve `campo_en` si tiene contenido; si está vacío, cae de
   vuelta al campo en español para que nunca se muestre un hueco.
   En español devuelve siempre el campo original. */
export function pickLocalized(row, field, lang) {
  if (!row) return undefined
  if (lang === 'en') {
    const en = row[`${field}_en`]
    if (en != null && String(en).trim() !== '') return en
  }
  return row[field]
}
