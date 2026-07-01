import { useEffect } from 'react'

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
  useEffect(() => { document.title = 'Filosofía | WatchOut! Sensory Tours' }, [])

  return (
    <div className="container container--narrow" style={{ paddingBlock: '3rem' }}>
      <div className="page-intro">
        <h1>Filosofía</h1>
        <p>Cinco principios que guían cada decisión, desde el diseño de un itinerario hasta la elección de un tejido de cama.</p>
      </div>

      <ol role="list" className="principles-list">
        {principios.map(({ num, titulo, texto }) => (
          <li key={num} className="principle">
            <span aria-hidden="true" className="principle__num">{num}</span>
            <div className="principle__content">
              <h2>{titulo}</h2>
              <p>{texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
