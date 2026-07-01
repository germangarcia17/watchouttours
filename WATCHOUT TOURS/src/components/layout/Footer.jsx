import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner">
        <nav aria-label="Navegación del pie de página">
          <ul role="list" className="footer-nav__list">
            <li><Link to="/sobre-nosotras">Sobre nosotras</Link></li>
            <li><Link to="/filosofia">Filosofía</Link></li>
            <li><Link to="/productos">Experiencias</Link></li>
            <li><Link to="/resenas">Reseñas</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/accesibilidad">Accesibilidad</Link></li>
            <li><Link to="/privacidad">Privacidad</Link></li>
          </ul>
        </nav>
        <p className="footer-copy">
          &copy; {year} WatchOut! Sensory Tours. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
