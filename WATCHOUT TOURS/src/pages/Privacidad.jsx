import { useEffect } from 'react'
import '../styles/pagestyle/Estaticas.css'

export default function Privacidad() {
  useEffect(() => { document.title = 'Privacidad | Watchout Tours' }, [])

  return (
    <>
      <section className="static-hero">
        <div className="dots-texture"></div>
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">Legal</span>
          <h1 className="static-titulo">Política de privacidad</h1>
          <p className="static-intro">
            Solo recogemos los datos que nos das voluntariamente, y nunca los
            compartimos con terceros para publicidad.
          </p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="responsable-heading">
            <h2 id="responsable-heading">Responsable del tratamiento</h2>
            <p>Watchout Tours Ltd., <span lang="en">Picton, Nueva Zelanda</span>. Contacto: <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a></p>
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
              <a href="mailto:info@watchouttours.nz">
                info@watchouttours.nz
              </a>.
            </p>
          </section>

          <p className="static-fecha">
            Última actualización: <time dateTime="2026-06-25">25 de junio de 2026</time>
          </p>
        </div>
      </div>
    </>
  )
}
