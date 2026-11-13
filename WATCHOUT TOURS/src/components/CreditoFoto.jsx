import { useLang } from '../i18n/routing'
import { textoCredito } from '../lib/creditos'

/* Crédito de una foto, siempre fuera del área de la imagen: debajo de ella
   y alineado a la derecha, en 11 px. tono "claro" (#6B6F76, para fondo
   claro) u "oscuro" (#8F9399, para fondo oscuro); los dos cumplen AA.
   Sin crédito (fotos propias) no pinta nada. */
export function CreditoFoto({ credito, tono = 'claro', className = '' }) {
  const lang = useLang()
  const texto = textoCredito(credito, lang)
  if (!texto) return null
  return <p className={`credito-foto credito-foto--${tono} ${className}`.trim()}>{texto}</p>
}
