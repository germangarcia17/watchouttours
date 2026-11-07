import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { useSiteImage } from '../lib/siteImages'
import { CabeceraPagina } from '../components/CabeceraPagina'
import { SolicitudRuta } from '../components/SolicitudRuta'
import { CtaFinal } from '../components/home/BloquesHome'
import imgViajes60 from '../images/blind-travel-group-geyser.webp'
import imgCiegas from '../images/blind-travel-maori-carving.webp'
import imgPrivado from '../images/sobre-nosotras.webp'
import '../styles/pagestyle/Home.css'
import '../styles/pagestyle/Productos.css'

/* Imagen de cada tarjeta, editable desde /admin/imagenes (sección
   "productos"). */
const IMAGENES = {
  'viajes-60':       { clave: 'tarjeta-viajes-60', src: imgViajes60 },
  'personas-ciegas': { clave: 'tarjeta-personas-ciegas', src: imgCiegas },
  'privado':         { clave: 'tarjeta-privado', src: imgPrivado },
}

function Tarjeta({ id, to, titulo, texto, cta, imgAlt }) {
  const img = useSiteImage('productos', IMAGENES[id].clave, IMAGENES[id].src, imgAlt)
  return (
    <article className="tarjeta tarjeta--enlace" aria-labelledby={`${id}-heading`}>
      <figure className="tarjeta__media">
        <img src={img.src} alt={img.alt} lang={img.lang} loading="lazy" />
      </figure>
      <div className="tarjeta__cuerpo">
        <h2 id={`${id}-heading`} className="tarjeta__titulo">{titulo}</h2>
        <p className="tarjeta__texto">{texto}</p>
        <div className="tarjeta__pie">
          {/* El nombre del viaje completa el enlace para el lector de
              pantalla ("Ver el viaje" se repite en dos tarjetas). */}
          <L to={to} className="btn btn-solid tarjeta__enlace">{cta}<span className="sr-only">: {titulo}</span><span aria-hidden="true"> →</span></L>
        </div>
      </div>
    </article>
  )
}

/* ── Todas las experiencias ──────────────────────────────────────────────
 * Reparte entre las dos líneas (Viajes +60 y Viajes para personas ciegas y
 * con baja visión) y el viaje privado. La ruta no se enseña en la web: se
 * pide en PDF (SolicitudRuta).
 * ──────────────────────────────────────────────────────────────────────── */
export default function Productos() {
  const { t } = useTranslation()
  const tarjetas = t('productos.tarjetas', { returnObjects: true })

  return (
    <>
      <Seo
        pageType="productos"
        title={t('productos.seo.title')}
        description={t('productos.seo.description')}
      />

      <CabeceraPagina antetitulo={t('productos.eyebrow')} titulo={t('productos.title')}>
        <p>{t('productos.sub')}</p>
      </CabeceraPagina>

      <section aria-label={t('productos.eyebrow')}>
        <div className="wrap experiencias">
          {tarjetas.map(tarjeta => <Tarjeta key={tarjeta.id} {...tarjeta} />)}
        </div>
      </section>

      <SolicitudRuta />

      <CtaFinal
        titulo={t('productos.cta.title')}
        parrafos={[t('productos.cta.text')]}
        cta={t('productos.cta.btn')}
      />
    </>
  )
}
