import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => { document.title = 'Página no encontrada | WatchOut! Sensory Tours' }, [])

  return (
    <div className="not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
      <Link to="/" className="btn btn--primary">
        Ir a la página de inicio
      </Link>
    </div>
  )
}
