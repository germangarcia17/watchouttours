import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const experiencias = [
  {
    id: 'immersion-total',
    titulo: 'Inmersión Total',
    duracion: '14 días · 13 noches',
    precio: 'Desde 8.500 €',
    descripcion: 'El recorrido completo por Aotearoa. Desde las playas de arena negra de la Isla Norte hasta los fiordos del sur. Grupos de máximo 6 personas.',
    incluye: ['Vuelos internos', 'Alojamiento boutique 5 estrellas', 'Todas las comidas', 'Guía especializada', 'Experiencias con comunidades maorí', 'Materiales táctiles'],
    destinos: ['Auckland', 'Rotorua', 'Waitomo', 'Wellington', 'Kaikōura', 'Queenstown', 'Milford Sound'],
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
    <div className="container" style={{ paddingBlock: '3rem' }}>
      <div className="page-intro">
        <h1>Experiencias de viaje</h1>
        <p>Cada itinerario ha sido diseñado desde cero pensando en quienes viajan sin vista.</p>
      </div>

      <ul role="list" className="products-list">
        {experiencias.map(({ id, titulo, duracion, precio, descripcion, incluye, destinos }) => (
          <li key={id}>
            <article id={id} aria-labelledby={`${id}-heading`} className="product-card">
              <div className="product-badges">
                <span className="product-badge">{duracion}</span>
                <span className="product-badge product-badge--price">{precio}</span>
              </div>
              <h2 id={`${id}-heading`} className="product-card__title">{titulo}</h2>
              <p className="product-card__desc">{descripcion}</p>

              <p className="product-card__section-title">Destinos</p>
              <ul role="list" className="tag-list">
                {destinos.map(d => (
                  <li key={d} className="tag"><span lang="en">{d}</span></li>
                ))}
              </ul>

              <p className="product-card__section-title">Incluye</p>
              <ul className="product-card__includes">
                {incluye.map(item => <li key={item}>{item}</li>)}
              </ul>

              <div className="product-card__actions">
                <Link to="/contacto" className="btn btn--primary">
                  Reservar <span className="sr-only">{titulo}</span>
                </Link>
                <Link to="/contacto" className="btn btn--outline">
                  Preguntar <span className="sr-only">sobre {titulo}</span>
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
