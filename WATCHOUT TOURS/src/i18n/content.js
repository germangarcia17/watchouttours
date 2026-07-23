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

/* Devuelve el atributo `lang` que debe llevar un texto, o undefined si
   coincide con el idioma de la página (y por tanto no hace falta marcarlo).
   Cuando estamos en inglés pero el campo no tiene traducción y se muestra el
   español, devuelve "es" para que los lectores de pantalla lo pronuncien
   correctamente. */
export function fieldLangAttr(row, field, lang) {
  if (lang !== 'en' || !row) return undefined
  const en = row[`${field}_en`]
  if (en != null && String(en).trim() !== '') return undefined
  return 'es'
}
