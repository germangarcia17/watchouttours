import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/Filosofia.css'

const principios = [
  {
    num: '01',
    titulo: 'Diseñado para, no adaptado desde',
    texto: 'La diferencia entre un tour "adaptado" y uno "diseñado para" es la misma que entre un parche y una obra. Construimos desde el primer paso pensando en quién viaja con nosotras.',
  },
  {
    num: '02',
    titulo: 'El lujo es sensorial, no visual',
    texto: 'Un lino de 800 hilos se siente lujoso aunque no lo veas. El silencio de un fiordo a las 5 de la mañana es opulento para cualquier sentido.',
  },
  {
    num: '03',
    titulo: 'Grupos de máximo seis',
    texto: 'Porque la experiencia sensorial requiere espacio. Porque cada persona tiene su ritmo. Sin excepciones.',
  },
  {
    num: '04',
    titulo: 'Respeto a la cultura maorí',
    texto: <><span lang="mi">Aotearoa</span> tiene una cultura transmitida oralmente desde tiempos inmemoriales. Trabajamos con comunidades locales, no sobre ellas.</>,
  },
  {
    num: '05',
    titulo: 'Cero condescendencia',
    texto: 'Nuestras viajeras son adultas que han decidido vivir una aventura extraordinaria. Necesitan espacio, información y una guía excelente.',
  },
]

export default function Filosofia() {
  useEffect(() => { document.title = 'Filosofía | Watchout Tours' }, [])

  return (
    <>
      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="filo-hero">
        <div className="wrap filo-hero-inner">
          <span className="sec-eyebrow">Filosofía Watchout</span>
          <h1 className="filo-titulo">Lo mejor de este viaje no se ve.</h1>
          <p className="filo-intro">
            Cinco principios que guían cada decisión, desde el diseño de un
            itinerario hasta la elección de un tejido de cama.
          </p>
        </div>
      </section>

      {/* ── Principios ───────────────────────────────── */}
      <section className="filo-principios">
        <div className="wrap">
          <ol role="list" className="filo-lista">
            {principios.map(({ num, titulo, texto }) => (
              <li key={num} className="filo-principio">
                <span aria-hidden="true" className="filo-principio__num">{num}</span>
                <div className="filo-principio__contenido">
                  <h2 className="filo-principio__titulo">{titulo}</h2>
                  <p className="filo-principio__texto">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────── */}
      <section className="filo-cierre">
        <div className="wrap">
          <div className="ink-block filo-cierre-block">
            <p className="filo-cierre-frase">
              "Lo mejor de este viaje no se ve — se escucha, se toca, se siente."
            </p>
            <div className="cta-row" style={{ justifyContent: 'center' }}>
              <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
              <Link to="/sobre-nosotras" className="btn btn-outline">Conócenos</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
