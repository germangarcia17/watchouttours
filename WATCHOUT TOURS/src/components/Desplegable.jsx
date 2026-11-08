import { useState } from 'react'
import '../styles/components/Desplegable.css'

/* Desplegable accesible: un botón con aria-expanded y aria-controls que
   muestra u oculta el panel. El contenido va en el HTML desde el principio
   (prerender), solo oculto con `hidden`.
   `Titulo`: etiqueta del encabezado que envuelve al botón ('h3', …) o
   null si el botón no debe ir dentro de un encabezado. */
export function Desplegable({ id, boton, Titulo = null, className = '', children }) {
  const [abierto, setAbierto] = useState(false)
  const botonEl = (
    <button
      type="button"
      className="desplegable__boton"
      aria-expanded={abierto}
      aria-controls={id}
      onClick={() => setAbierto(a => !a)}
    >
      <span>{boton}</span>
      <span className="desplegable__signo" aria-hidden="true" />
    </button>
  )
  return (
    <div className={`desplegable${abierto ? ' desplegable--abierto' : ''} ${className}`.trim()}>
      {Titulo ? <Titulo className="desplegable__titulo">{botonEl}</Titulo> : botonEl}
      <div id={id} className="desplegable__panel" hidden={!abierto}>
        {children}
      </div>
    </div>
  )
}
