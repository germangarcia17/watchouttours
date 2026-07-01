import { useEffect } from 'react'

export default function Privacidad() {
  useEffect(() => { document.title = 'Privacidad | WatchOut! Sensory Tours' }, [])

  return (
    <div className="static-page">
      <h1>Política de privacidad</h1>
      <p className="static-page__date">Última actualización: <time dateTime="2026-06-25">25 de junio de 2026</time></p>

      <section aria-labelledby="responsable-heading">
        <h2 id="responsable-heading">Responsable del tratamiento</h2>
        <p>WatchOut! Sensory Tours Ltd., <span lang="en">Auckland, Nueva Zelanda</span>. Contacto: <a href="mailto:privacidad@watchouttours.com">privacidad@watchouttours.com</a></p>
      </section>

      <section aria-labelledby="datos-heading">
        <h2 id="datos-heading">Datos que recogemos</h2>
        <p>Solo los que nos proporciones voluntariamente a través del formulario de contacto:</p>
        <ul>
          <li>Nombre y apellidos</li>
          <li>Correo electrónico</li>
          <li>Teléfono (opcional)</li>
          <li>Contenido del mensaje</li>
        </ul>
        <p>No utilizamos cookies de seguimiento ni compartimos datos con terceros para publicidad.</p>
      </section>

      <section aria-labelledby="derechos-heading">
        <h2 id="derechos-heading">Tus derechos</h2>
        <p>
          Tienes derecho de acceso, rectificación, supresión, oposición y portabilidad. Escribe a{' '}
          <a href="mailto:privacidad@watchouttours.com">
            privacidad@watchouttours.com
          </a>.
        </p>
      </section>
    </div>
  )
}
