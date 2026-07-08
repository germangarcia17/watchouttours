import { useEffect } from 'react'
import '../styles/pagestyle/Estaticas.css'

export default function Accesibilidad() {
  useEffect(() => { document.title = 'Accesibilidad | WatchOut! Sensory Tours' }, [])

  return (
    <>
      <section className="static-hero">
        <div className="dots-texture"></div>
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">Legal</span>
          <h1 className="static-titulo">Declaración de accesibilidad</h1>
          <p className="static-intro">
            WatchOut! Sensory Tours se compromete a garantizar la accesibilidad
            digital para todas las personas.
          </p>
        </div>
      </section>

      <div className="static-body">
        <div className="wrap">
          <section aria-labelledby="conformidad-heading">
            <h2 id="conformidad-heading">Nivel de conformidad</h2>
            <p>
              Este sitio aspira a cumplir las <abbr title="Web Content Accessibility Guidelines">WCAG</abbr> 2.2
              en <strong>nivel AA</strong> como mínimo y <strong>nivel AAA</strong> en textos de cuerpo.
            </p>
          </section>

          <section aria-labelledby="tecnologias-heading">
            <h2 id="tecnologias-heading">Tecnologías de apoyo compatibles</h2>
            <ul>
              <li><span lang="en">NVDA</span> + <span lang="en">Chrome</span> en <span lang="en">Windows</span></li>
              <li><span lang="en">VoiceOver</span> + <span lang="en">Safari</span> en <span lang="en">macOS</span> e <span lang="en">iOS</span></li>
              <li><span lang="en">TalkBack</span> en <span lang="en">Android</span></li>
              <li>Navegación completa por teclado</li>
            </ul>
          </section>

          <section aria-labelledby="contacto-a11y-heading">
            <h2 id="contacto-a11y-heading">Reportar un problema</h2>
            <p>
              Si encuentras alguna barrera, escríbenos a{' '}
              <a href="mailto:accesibilidad@watchouttours.com">
                accesibilidad@watchouttours.com
              </a>.
              Respondemos en un máximo de 5 días laborables.
            </p>
          </section>

          <p className="static-fecha">
            Declaración redactada el <time dateTime="2026-06-25">25 de junio de 2026</time>.
          </p>
        </div>
      </div>
    </>
  )
}
