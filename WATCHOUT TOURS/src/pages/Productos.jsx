import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { variantes } from '../components/ImagenHueco'
import { ResenasDestacadas } from '../components/home/BloquesHome'
import { CREDITOS_PRIVADOS } from '../lib/creditos'
import { Texto, Etiqueta, FotoHueco, dos } from '../components/editorial/Editorial'
import { Portada, Columnas, Preguntas, CierreFormulario } from '../components/editorial/Colecciones'
import talla from '../images/blind-travel-maori-carving.webp'

/* Huecos de imagen (sección "privados" en /admin/imagenes) y su foto por
   defecto. null = la foto se sube desde el admin (hasta entonces, bloque
   gris). Texto alternativo por defecto en privados.huecos.<clave> y crédito
   en CREDITOS_PRIVADOS. La de las anfitrionas es propia (la de galeria-02
   de la home), sin crédito. */
const IMG = {
  'privados-portada': null,
  'privados-anfitrionas': variantes([{ src: talla, w: 1000, h: 1333 }]),
  'privados-selfdrive': null,
  'privados-cierre': null,
}

function useFoto(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'privados', clave, defecto: IMG[clave],
    alt: t(`privados.huecos.${clave}`), credito: CREDITOS_PRIVADOS[clave] ?? '',
  }
}

/* ── 2. Manifiesto: cita grande y texto, centrado ───────────────────── */
function Manifiesto() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-col-centro">
      <blockquote className="hn-col-cita"><p><Texto k="privados.manifiesto.cita" /></p></blockquote>
      <p className="hn-body hn-body--primero">{t('privados.manifiesto.texto')}</p>
    </section>
  )
}

/* ── 3. Dos maneras de vivirlo: bloques alternos foto / texto ───────── */
function Maneras() {
  const { t } = useTranslation()
  const items = t('privados.maneras.items', { returnObjects: true })
  return (
    <section className="hn-destinos hn-blanca" aria-labelledby="pv-maneras-titulo">
      <Etiqueta>{t('privados.maneras.etiqueta')}</Etiqueta>
      <h2 id="pv-maneras-titulo" className="hn-h2">{t('privados.maneras.titulo')}</h2>
      <ol className="hn-destinos__lista" role="list">
        {items.map((m, i) => <Manera key={m.id} {...m} n={i} />)}
      </ol>
    </section>
  )
}

function Manera({ id, titulo, texto, incluye, n }) {
  const { t } = useTranslation()
  const foto = useFoto(`privados-${id}`)
  return (
    <li className={`hn-destino${n % 2 ? ' hn-destino--inverso' : ''}`}>
      <FotoHueco {...foto} sizes="(min-width: 901px) 50vw, 100vw" className="hn-destino__foto" />
      <div className="hn-destino__texto">
        <span className="hn-num" aria-hidden="true">{dos(n + 1)}</span>
        <h3 className="hn-h3">{titulo}</h3>
        <p className="hn-body hn-body--menor">{texto}</p>
        <h4 className="hn-col-incluye__titulo">{t('privados.maneras.incluyeLabel')}</h4>
        <ul className="hn-col-incluye" role="list">
          {incluye.map(x => <li key={x}>{x}</li>)}
        </ul>
      </div>
    </li>
  )
}

/* ── Viajes privados (/productos ↔ /en/products) ─────────────────────────
 * Portada → manifiesto → dos maneras de vivirlo (con anfitrionas / self
 * drive) → paso a paso → reseñas → preguntas → cierre con el formulario del
 * itinerario («Viaje en privado» preseleccionado), id="diseña".
 * ──────────────────────────────────────────────────────────────────────── */
export default function Productos() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('privado')
  const portada = useFoto('privados-portada')
  const cierre = useFoto('privados-cierre')

  return (
    <div className="hn hn-col">
      {/* pageType editable desde /admin/seo (fila 'productos'); estos son
          los valores de respaldo mientras no haya fila guardada. */}
      <Seo pageType="productos" title={t('privados.seo.title')} description={t('privados.seo.description')} />
      <Portada ns="privados" foto={portada} ancla="diseña" />
      <Manifiesto />
      <Maneras />
      <Columnas ns="privados.pasos" />
      <ResenasDestacadas variante="home" id="resenas" className="hn-blanca" />
      <Preguntas ns="privados.faq" />
      <CierreFormulario ns="privados" foto={cierre} viaje={viaje} setViaje={setViaje} id="diseña" className="hn-col-cierre--70" />
    </div>
  )
}
