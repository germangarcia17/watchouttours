import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function SobreNosotras() {
  useEffect(() => { document.title = 'Sobre nosotras | WatchOut! Sensory Tours' }, [])

  return (
    <div className="container container--narrow" style={{ paddingBlock: '3rem' }}>
      <div className="page-intro">
        <h1>Sobre nosotras</h1>
        <p>
          WatchOut! Sensory Tours nació de una pregunta: ¿por qué los mejores viajes del mundo
          están diseñados para quienes pueden verlos?
        </p>
      </div>

      <section aria-labelledby="historia-heading">
        <h2 id="historia-heading">Nuestra historia</h2>
        <p>
          Fundada en <span lang="en">Auckland</span> en 2019, WatchOut! nació de la frustración
          compartida de sus fundadoras. Nueva Zelanda —{' '}
          <span lang="mi">Aotearoa</span>, la tierra de la larga nube blanca — es un país
          extraordinariamente sensorial. Sus olores, texturas y sonidos estaban ignorados en los
          itinerarios convencionales.
        </p>
        <p>
          Decidimos construir algo distinto: viajes de lujo diseñados desde cero para personas
          ciegas, donde la ausencia de visión no es un obstáculo sino el punto de partida de una
          experiencia más intensa.
        </p>
      </section>

      <section aria-labelledby="equipo-heading">
        <h2 id="equipo-heading">El equipo</h2>
        <ul role="list" className="team-grid">
          {[
            {
              name: 'Valentina Ríos',
              role: 'Co-fundadora & Directora de Experiencias',
              bio: 'Guía de montaña con 15 años de experiencia. Especializada en movilidad sensorial.',
            },
            {
              name: 'Sofía Chen',
              role: 'Co-fundadora & Directora de Operaciones',
              bio: 'Gestora de turismo sostenible y experta en accesibilidad universal.',
            },
          ].map(({ name, role, bio }) => (
            <li key={name} className="team-card">
              <h3>{name}</h3>
              <p><em>{role}</em></p>
              <p>{bio}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="form-actions" style={{ marginTop: '2.5rem' }}>
        <Link to="/filosofia" className="btn btn--primary">Nuestra filosofía</Link>
        <Link to="/contacto" className="btn btn--outline">Escríbenos</Link>
      </div>
    </div>
  )
}
