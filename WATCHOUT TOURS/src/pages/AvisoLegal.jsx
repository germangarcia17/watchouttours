import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/Estaticas.css'

export default function AvisoLegal() {
  useEffect(() => { document.title = 'Aviso legal | Watchout Tours' }, [])

  return (
    <>
      <section className="static-hero">
        <div className="dots-texture"></div>
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">Legal</span>
          <h1 className="static-titulo">Aviso legal</h1>
          <p className="static-intro">
            Quiénes somos y en qué condiciones puedes usar esta web.
          </p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="titular-heading">
            <h2 id="titular-heading">Titular del sitio web</h2>
            <p>
              <strong>Watchout Tours Ltd.</strong>, sociedad limitada
              (<span lang="en">limited company</span>) constituida conforme a la
              legislación de Nueva Zelanda e inscrita en el registro de sociedades
              neozelandés (<span lang="en">New Zealand Companies Office</span>).
            </p>
            <ul>
              <li>Domicilio: <span lang="en">Picton</span>, Nueva Zelanda</li>
              <li>Correo electrónico: <a href="mailto:info@watchouttours.nz">info@watchouttours.nz</a></li>
              <li>WhatsApp: +64 27 267 7006</li>
            </ul>
          </section>

          <section aria-labelledby="objeto-heading">
            <h2 id="objeto-heading">Objeto de la web</h2>
            <p>
              Esta web tiene una finalidad informativa: dar a conocer los viajes
              sensoriales por Nueva Zelanda que organizamos para personas ciegas o con
              baja visión y ofrecer un medio de contacto a las personas interesadas.
            </p>
            <p>
              <strong>A través de esta web no se contrata ningún servicio ni se realiza
              ningún pago.</strong> Cualquier contratación posterior se acuerda de forma
              personal y directa con nosotras.
            </p>
          </section>

          <section aria-labelledby="propiedad-heading">
            <h2 id="propiedad-heading">Propiedad intelectual</h2>
            <p>
              Los contenidos de esta web (textos, fotografías, audios, vídeos, logotipo y
              diseño) pertenecen a Watchout Tours Ltd. o se utilizan con autorización de
              sus titulares. No está permitida su reproducción o uso comercial sin nuestro
              consentimiento previo.
            </p>
          </section>

          <section aria-labelledby="responsabilidad-heading">
            <h2 id="responsabilidad-heading">Responsabilidad</h2>
            <p>
              Procuramos que la información publicada esté actualizada y sea correcta,
              pero tiene carácter orientativo: los detalles definitivos de cada viaje
              (fechas, precios y condiciones) se confirman siempre personalmente antes de
              cualquier acuerdo. Los enlaces a sitios de terceros (como Instagram o
              WhatsApp) se rigen por las condiciones de esos servicios.
            </p>
          </section>

          <section aria-labelledby="ley-heading">
            <h2 id="ley-heading">Legislación aplicable</h2>
            <p>
              Watchout Tours Ltd. es una sociedad neozelandesa y se rige por la
              legislación de Nueva Zelanda. No obstante, al dirigirse esta web a personas
              residentes en España, se respetan las normas europeas y españolas que
              resulten de aplicación, en particular en materia de protección de datos
              (puedes leer más en nuestra{' '}
              <Link to="/privacidad">política de privacidad</Link>) y de protección de las
              personas consumidoras.
            </p>
          </section>

          <p className="static-fecha">
            Última actualización: <time dateTime="2026-07-16">16 de julio de 2026</time>
          </p>
        </div>
      </div>
    </>
  )
}
