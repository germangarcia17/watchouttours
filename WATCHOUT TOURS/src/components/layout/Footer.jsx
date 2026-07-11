import { Link } from 'react-router-dom'
import logoImg from '../../images/logo-header-watchout.png'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__inner container">

        {/* Columna marca */}
        <div className="footer-brand">
          <Link to="/" className="footer-brand__logo" aria-label="WatchOut! Sensory Tours — Inicio">
            <img src={logoImg} alt="" aria-hidden="true" className="footer-brand__img" />
            <span className="footer-brand__name">WatchOut! <em>Sensory Tours</em></span>
          </Link>
          <p className="footer-brand__tagline">
            Viajes de lujo sensorial por Nueva Zelanda para personas ciegas y con baja visión.
          </p>
          <a
            href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20información%20sobre%20los%20viajes%20de%20WatchOut!"
            className="footer-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escríbenos por WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z"/>
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>

        {/* Columna Nosotras */}
        <nav aria-label="Sección nosotras" className="footer-col">
          <h3 className="footer-col__heading">Nosotras</h3>
          <ul role="list" className="footer-col__list">
            <li><Link to="/sobre-nosotras">Sobre nosotras</Link></li>
            <li><Link to="/filosofia">Filosofía</Link></li>
            <li><Link to="/resenas">Reseñas</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </nav>

        {/* Columna Viajes */}
        <nav aria-label="Sección viajes" className="footer-col">
          <h3 className="footer-col__heading">Viajes</h3>
          <ul role="list" className="footer-col__list">
            <li><Link to="/productos">Todas las experiencias</Link></li>
            <li><Link to="/contacto">Diseña tu viaje</Link></li>
          </ul>
        </nav>

        {/* Columna Legal */}
        <nav aria-label="Sección legal" className="footer-col">
          <h3 className="footer-col__heading">Legal</h3>
          <ul role="list" className="footer-col__list">
            <li><Link to="/accesibilidad">Accesibilidad</Link></li>
            <li><Link to="/privacidad">Privacidad</Link></li>
          </ul>
        </nav>

      </div>

      <div className="site-footer__bottom">
        <p className="footer-copy">
          &copy; {year} WatchOut! Sensory Tours. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
