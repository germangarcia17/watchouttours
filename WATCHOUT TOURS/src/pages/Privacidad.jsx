import { useEffect } from 'react'
import { Link } from 'react-router-dom'
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
            Solo recogemos los datos que nos das voluntariamente para poder
            responderte. Nunca los usamos para publicidad ni los cedemos a
            terceros.
          </p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="responsable-heading">
            <h2 id="responsable-heading">Responsable del tratamiento</h2>
            <p>
              <strong>Watchout Tours Ltd.</strong>, sociedad limitada constituida en Nueva
              Zelanda, con domicilio en <span lang="en">Picton</span>, Nueva Zelanda.
              Contacto: <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a>.
            </p>
            <p>
              Aunque somos una empresa neozelandesa, nuestros servicios se dirigen a
              personas residentes en España y en la Unión Europea, por lo que tratamos
              tus datos conforme al <strong>Reglamento General de Protección de Datos
              (RGPD)</strong> y a la normativa de privacidad de Nueva Zelanda
              (<span lang="en">Privacy Act 2020</span>).
            </p>
          </section>

          <section aria-labelledby="datos-heading">
            <h2 id="datos-heading">Datos que recogemos</h2>
            <p>Únicamente los que nos proporcionas voluntariamente a través del formulario de contacto:</p>
            <ul>
              <li>Nombre</li>
              <li>Correo electrónico y/o teléfono (al menos uno, para poder responderte)</li>
              <li>Canal por el que prefieres que te contactemos</li>
              <li>Tipo de viaje que te interesa (opcional)</li>
              <li>El contenido del mensaje que quieras escribirnos (opcional)</li>
            </ul>
          </section>

          <section aria-labelledby="finalidad-heading">
            <h2 id="finalidad-heading">Para qué usamos tus datos y con qué base</h2>
            <p>
              <strong>Finalidad:</strong> responder a tu consulta y hablar contigo sobre el
              viaje que te interesa. Nada más. No guardamos tus datos en bases de datos de
              marketing, no enviamos publicidad ni <em>newsletters</em> y no elaboramos
              perfiles.
            </p>
            <p>
              <strong>Base jurídica:</strong> la aplicación de medidas precontractuales a
              petición tuya (art. 6.1.b RGPD) y tu consentimiento, que nos das al marcar la
              casilla de aceptación antes de enviar el formulario (art. 6.1.a RGPD).
            </p>
          </section>

          <section aria-labelledby="conservacion-heading">
            <h2 id="conservacion-heading">Cuánto tiempo los conservamos</h2>
            <p>
              Solo durante el tiempo necesario para gestionar tu consulta y la conversación
              que surja de ella. Si finalmente no viajas con nosotras, eliminamos tus datos
              en un plazo máximo de 12 meses desde el último contacto.
            </p>
          </section>

          <section aria-labelledby="destinatarios-heading">
            <h2 id="destinatarios-heading">Quién más trata tus datos</h2>
            <p>
              No cedemos tus datos a terceros. Para recibir los mensajes del formulario
              utilizamos <strong>Formspree, Inc.</strong> (EE.&nbsp;UU.) como proveedor
              tecnológico, que actúa como encargado del tratamiento conforme a sus{' '}
              <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                garantías de privacidad<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>. Esta transferencia internacional se ampara en las cláusulas y marcos de
              protección de datos UE–EE.&nbsp;UU. vigentes.
            </p>
            <p>
              El resto del tratamiento se realiza en Nueva Zelanda, país que cuenta con una{' '}
              <strong>decisión de adecuación de la Comisión Europea</strong>: la UE reconoce
              que su nivel de protección de datos es equivalente al europeo.
            </p>
          </section>

          <section aria-labelledby="cookies-heading">
            <h2 id="cookies-heading">Cookies</h2>
            <p>
              Esta web <strong>no utiliza cookies de análisis, seguimiento ni
              publicidad</strong>. Solo empleamos almacenamiento técnico local
              imprescindible para el funcionamiento del sitio (por ejemplo, un límite
              antispam en el formulario), exento del deber de consentimiento. Por eso no
              verás ningún banner de cookies.
            </p>
          </section>

          <section aria-labelledby="derechos-heading">
            <h2 id="derechos-heading">Tus derechos</h2>
            <p>
              Tienes derecho de acceso, rectificación, supresión, oposición, limitación y
              portabilidad de tus datos. Puedes ejercerlos escribiendo a{' '}
              <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a> y te
              responderemos lo antes posible.
            </p>
            <p>
              Si consideras que no hemos tratado tus datos correctamente, también puedes
              reclamar ante la <strong>Agencia Española de Protección de Datos</strong>{' '}
              (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
                www.aepd.es<span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>).
            </p>
          </section>

          <p>
            Puedes consultar también nuestro <Link to="/aviso-legal">Aviso legal</Link>.
          </p>

          <p className="static-fecha">
            Última actualización: <time dateTime="2026-07-16">16 de julio de 2026</time>
          </p>
        </div>
      </div>
    </>
  )
}
