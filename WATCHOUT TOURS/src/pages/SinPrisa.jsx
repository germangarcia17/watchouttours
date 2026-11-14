import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { variantes } from '../components/ImagenHueco'
import { CreditoFoto } from '../components/CreditoFoto'
import { useSiteImage } from '../lib/siteImages'
import { CREDITOS_SESENTA } from '../lib/creditos'
import { Texto, Etiqueta, FotoHueco, dos } from '../components/editorial/Editorial'
import { Portada, Columnas, ProximaSalidaGrupo, Preguntas, CierreFormulario } from '../components/editorial/Colecciones'
import nos600 from '../images/home/nosotras-600.webp'
import nos1100 from '../images/home/nosotras-1100.webp'
import imgRotorua from '../images/blind-travel-group-geyser.webp'
import imgKaikoura from '../images/kayak-kaikoura.jpg'
// Foto de Tourism New Zealand (sin recortar en edición, sin retocar y sin
// nada encima; el encuadre con object-fit: cover está permitido)
import wanaka from '../images/home/tnz-233385-lake-wanaka.jpg'
import rotoruaTnz from '../images/home/tnz-234567-rotorua.jpg'
import kaikouraTnz from '../images/home/tnz-516648-kaikoura.jpg'

/* Huecos de imagen (sección "sin-prisa" en /admin/imagenes) y su foto por
   defecto. null = la foto se sube desde el admin: hasta entonces el hueco
   es un bloque gris. Texto alternativo por defecto en
   sinPrisa.huecos.<clave> y crédito en CREDITOS_SESENTA. */
const IMG = {
  'sesenta-portada': null,
  'sesenta-hobbiton': null,
  'sesenta-rotorua': variantes([{ src: rotoruaTnz, w: 1125, h: 750 }]),
  'sesenta-kaikoura': variantes([{ src: kaikouraTnz, w: 1500, h: 1000 }]),
  'sesenta-anfitrionas': variantes([{ src: nos600, w: 600, h: 800 }, { src: nos1100, w: 1100, h: 1467 }]),
  'sesenta-cierre': variantes([{ src: wanaka, w: 1500, h: 1000 }]),
}

/* Props de FotoHueco para un hueco de la página */
function useFoto(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'sin-prisa', clave, defecto: IMG[clave],
    alt: t(`sinPrisa.huecos.${clave}`), credito: CREDITOS_SESENTA[clave] ?? '',
  }
}

/* ── 2. Para quién es: cita grande y dos párrafos, centrado ─────────── */
function ParaQuien() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-col-centro">
      <blockquote className="hn-col-cita"><p><Texto k="sinPrisa.paraQuien.cita" /></p></blockquote>
      <p className="hn-body hn-body--primero">{t('sinPrisa.paraQuien.p1')}</p>
      <p className="hn-body">{t('sinPrisa.paraQuien.p2')}</p>
    </section>
  )
}

/* ── 4. Experiencias privadas: bloques alternos foto / texto ────────── */
function Experiencias() {
  const { t } = useTranslation()
  const items = t('sinPrisa.experiencias.items', { returnObjects: true })
  return (
    <section className="hn-destinos" aria-labelledby="sp-experiencias-titulo">
      <Etiqueta>{t('sinPrisa.experiencias.etiqueta')}</Etiqueta>
      <h2 id="sp-experiencias-titulo" className="hn-h2"><Texto k="sinPrisa.experiencias.titulo" /></h2>
      <ol className="hn-destinos__lista" role="list">
        {items.map((d, i) => <Experiencia key={d.id} {...d} n={i} />)}
      </ol>
    </section>
  )
}

function Experiencia({ id, titulo, texto, n }) {
  const foto = useFoto(`sesenta-${id}`)
  return (
    <li className={`hn-destino${n % 2 ? ' hn-destino--inverso' : ''}`}>
      <FotoHueco {...foto} sizes="(min-width: 901px) 50vw, 100vw" className="hn-destino__foto" />
      <div className="hn-destino__texto">
        <span className="hn-num" aria-hidden="true">{dos(n + 1)}</span>
        <h3 className="hn-h3">{titulo}</h3>
        <p className="hn-body hn-body--menor">{texto}</p>
      </div>
    </li>
  )
}

/* ── 5. ¿Viajas por tu cuenta?: título y texto en dos columnas ──────── */
function PorTuCuenta() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-blanca hn-col-dos" aria-labelledby="sp-solo-titulo">
      <h2 id="sp-solo-titulo" className="hn-h2">{t('sinPrisa.solo.titulo')}</h2>
      <p className="hn-body">{t('sinPrisa.solo.texto')}</p>
    </section>
  )
}

/* ── 6. Tus anfitrionas: retrato a sangre y texto (como Fundadoras) ──── */
function Anfitrionas() {
  const { t } = useTranslation()
  const foto = useFoto('sesenta-anfitrionas')
  return (
    <section className="hn-fundadoras" aria-labelledby="sp-anfitrionas-titulo">
      <FotoHueco {...foto} sizes="(min-width: 901px) 50vw, 100vw" className="hn-fundadoras__foto" />
      <div className="hn-fundadoras__texto">
        <Etiqueta>{t('sinPrisa.anfitrionas.etiqueta')}</Etiqueta>
        <h2 id="sp-anfitrionas-titulo" className="hn-h2">{t('sinPrisa.anfitrionas.titulo')}</h2>
        <p className="hn-body hn-body--primero">{t('sinPrisa.anfitrionas.texto')}</p>
      </div>
    </section>
  )
}

/* ── 7. Lo que te llevarás: texto y fotos del viaje ──────────────────
   Hobbiton, Milford Sound y Tekapo aún no tienen foto: no se muestran
   hasta que se suban desde /admin/imagenes (sección "sin-prisa", clave
   "galeria-<lugar>"). */
const GALERIA_POR_DEFECTO = {
  rotorua: imgRotorua,
  kaikoura: imgKaikoura,
}

function FotoGaleria({ id, lugar, alt }) {
  const img = useSiteImage('sin-prisa', `galeria-${id}`, GALERIA_POR_DEFECTO[id] ?? null, alt)
  if (!img.src) return null
  return (
    <li>
      <figure className="hn-col-galeria__figura">
        <div className="hn-foto hn-col-galeria__foto">
          <img src={img.src} alt={img.alt} lang={img.lang} loading="lazy" />
        </div>
        <figcaption className="hn-col-galeria__pie">
          <span>{lugar}</span>
          <CreditoFoto credito={img.credito} className="hn-col-galeria__credito" />
        </figcaption>
      </figure>
    </li>
  )
}

function LoQueTeLlevaras() {
  const { t } = useTranslation()
  const galeria = t('sinPrisa.galeria.items', { returnObjects: true })
  return (
    <section className="hn-sec hn-blanca" aria-labelledby="sp-llevaras-titulo">
      <div className="hn-col-dos">
        <h2 id="sp-llevaras-titulo" className="hn-h2">{t('sinPrisa.llevaras.title')}</h2>
        <p className="hn-body">{t('sinPrisa.llevaras.p')}</p>
      </div>
      <ul className="hn-col-galeria" role="list" aria-label={t('sinPrisa.galeria.aria')}>
        {galeria.map(item => <FotoGaleria key={item.id} {...item} />)}
      </ul>
    </section>
  )
}

/* ── Viajes +60 (/sin-prisa ↔ /en/unhurried) ─────────────────────────────
 * Portada → para quién es → todo incluido (#descubre) → experiencias
 * privadas → si viajas por tu cuenta → tus anfitrionas → lo que te
 * llevarás → preguntas → próxima salida → cierre con el formulario del
 * itinerario («Viajes +60» preseleccionado).
 * ──────────────────────────────────────────────────────────────────────── */
export default function SinPrisa() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('viajes-60')
  const portada = useFoto('sesenta-portada')
  const cierre = useFoto('sesenta-cierre')

  return (
    <div className="hn hn-col">
      {/* pageType editable desde /admin/seo (fila 'sin-prisa'); estos son
          los valores de respaldo mientras no haya fila guardada. */}
      <Seo pageType="sin-prisa" title={t('sinPrisa.seo.title')} description={t('sinPrisa.seo.description')} />
      <Portada ns="sinPrisa" foto={portada} />
      <ParaQuien />
      <Columnas id="descubre" ns="sinPrisa.incluye" rejilla className="hn-blanca" />
      <Experiencias />
      <PorTuCuenta />
      <Anfitrionas />
      <LoQueTeLlevaras />
      <Preguntas ns="sinPrisa.faq" />
      <ProximaSalidaGrupo className="hn-blanca" />
      <CierreFormulario
        ns="sinPrisa" foto={cierre} viaje={viaje} setViaje={setViaje}
        extra={(
          <p className="hn-col-cierre__privado">
            <Texto k="sinPrisa.cierre.privado" components={{ l: <L to="/productos" /> }} />
          </p>
        )}
      />
    </div>
  )
}
