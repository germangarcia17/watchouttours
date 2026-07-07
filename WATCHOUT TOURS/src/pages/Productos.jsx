import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/Productos.css'

const experiencias = [
  {
    id: 'immersion-total',
    titulo: 'Inmersión Total',
    duracion: '14 días · 13 noches',
    precio: 'Desde 8.500 €',
    descripcion: 'El recorrido completo por Aotearoa. Desde las playas de arena negra de la Isla Norte hasta los fiordos del sur. Grupos de máximo 6 personas.',
    incluye: ['Vuelos internos', 'Alojamiento boutique 5 estrellas', 'Todas las comidas', 'Guía especializada', 'Experiencias con comunidades maorí', 'Materiales táctiles'],
    destinos: ['Auckland', 'Rotorua', 'Waitomo', 'Wellington', 'Kaikōura', 'Queenstown', 'Milford Sound'],
    destacada: true,
  },
  {
    id: 'escapada-norte',
    titulo: 'Escapada al Norte',
    duracion: '7 días · 6 noches',
    precio: 'Desde 4.200 €',
    descripcion: 'La Isla Norte en su máxima expresión sensorial: geotermia de Rotorua, sabores maoríes y las cuevas de luciérnagas de Waitomo.',
    incluye: ['Alojamiento boutique', 'Todas las comidas', 'Guía especializada', 'Baños termales privados', 'Tour nocturno cuevas de Waitomo', 'Festín hāngi tradicional'],
    destinos: ['Auckland', 'Rotorua', 'Waitomo', 'Raglan'],
  },
  {
    id: 'sur-profundo',
    titulo: 'Sur Profundo',
    duracion: '7 días · 6 noches',
    precio: 'Desde 4.800 €',
    descripcion: 'Los Alpes del Sur, el Fiordland y Queenstown. Paisajes sonoros épicos y silencio glaciar.',
    incluye: ['Alojamiento boutique', 'Todas las comidas', 'Guía especializada', 'Crucero por Milford Sound', 'Caminata en glaciar Fox'],
    destinos: ['Christchurch', 'Kaikōura', 'Franz Josef', 'Queenstown', 'Milford Sound'],
  },
]

export default function Productos() {
  useEffect(() => { document.title = 'Experiencias | WatchOut! Sensory Tours' }, [])

  return (
    <>
      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="prod-hero">
        <div className="dots-texture"></div>
        <div className="wrap prod-hero-inner">
          <span className="sec-eyebrow">Las experiencias</span>
          <h1 className="prod-titulo">Tu viaje, a tu manera</h1>
          <p className="prod-intro">
            Cada itinerario ha sido diseñado desde cero pensando en quienes viajan sin vista.
            Elige el formato y nosotras nos encargamos del resto.
          </p>
        </div>
      </section>

      {/* ── Experiencias ─────────────────────────────── */}
      <section className="prod-listado">
        <div className="wrap">
          <ul role="list" className="prod-list">
            {experiencias.map(({ id, titulo, duracion, precio, descripcion, incluye, destinos, destacada }) => (
              <li key={id}>
                <article
                  id={id}
                  aria-labelledby={`${id}-heading`}
                  className={`prod-card${destacada ? ' prod-card--destacada' : ''}`}
                >
                  {destacada && <span className="prod-card__ribbon">La experiencia completa</span>}

                  <div className="prod-card__head">
                    <span className="prod-card__etiqueta">{duracion}</span>
                    <h2 id={`${id}-heading`} className="prod-card__titulo">{titulo}</h2>
                    <p className="prod-card__desc">{descripcion}</p>
                  </div>

                  <div className="prod-card__body">
                    <p className="prod-card__seccion">Destinos</p>
                    <ul role="list" className="hl">
                      {destinos.map(d => (
                        <li key={d} className="hl-pill"><span lang="en">{d}</span></li>
                      ))}
                    </ul>

                    <p className="prod-card__seccion">Incluye</p>
                    <ul role="list" className="prod-card__incluye">
                      {incluye.map(item => (
                        <li key={item}>
                          <span className="prod-card__check" aria-hidden="true">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="prod-card__footer">
                    <p className="prod-card__precio">{precio} <span>por persona · todo incluido</span></p>
                    <div className="cta-row">
                      <Link to="/contacto" className="btn btn-solid">
                        Reservar<span className="sr-only"> {titulo}</span>
                      </Link>
                      <Link to="/contacto" className="btn btn-outline">
                        Preguntar<span className="sr-only"> sobre {titulo}</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA a medida ─────────────────────────────── */}
      <section className="prod-cta-section">
        <div className="wrap">
          <div className="ink-block prod-cta">
            <div className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>¿Ninguna te encaja?</div>
            <h2 className="prod-cta__titulo">Te lo hacemos a medida, como un traje.</h2>
            <p>
              Tus días, tu energía, tu ritmo. Si quieres más calma, más calma.
              Si quieres más adrenalina, más adrenalina. Cuéntanos qué tienes en la
              cabeza y te preparamos una propuesta sin compromiso.
            </p>
            <Link to="/contacto" className="btn btn-solid">Diseñemos el tuyo</Link>
          </div>
        </div>
      </section>
    </>
  )
}
