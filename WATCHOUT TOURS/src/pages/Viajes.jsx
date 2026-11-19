import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { Texto, Etiqueta, FotoHueco } from '../components/editorial/Editorial'
import { Portada, Columnas, CierreFormulario } from '../components/editorial/Colecciones'
import { TresManeras, Ampliaciones, useFotoViajes } from '../components/viajes/ViajesUI'

/* Tarjetas de «Viajes que diseñamos a medida». `viaje`: opción del
   formulario que se preselecciona al pulsar el enlace (lleva a #diseña);
   `to`: las dos especialidades enlazan a su página. El id (viaje-<id>) es
   el ancla a la que lleva cada palabra de la franja de la home. */
const TARJETAS = [
  { id: 'pareja', viaje: 'luna-de-miel' },
  { id: 'familia', viaje: 'familia' },
  { id: 'lujo', viaje: 'lujo' },
  { id: 'esqui', viaje: 'esqui' },
  { id: 'naturaleza', viaje: 'naturaleza' },
  { id: 'maori', viaje: 'cultura-maori' },
  { id: 'sesenta', to: '/sin-prisa' },
  { id: 'ciegos', to: '/viajes-personas-ciegas-baja-vision' },
  { id: 'amigos', viaje: 'amigos' },
]

function Tarjetas({ setViaje }) {
  const { t } = useTranslation()
  return (
    <section id="tipos" className="hn-sec hn-blanca" aria-labelledby="vj-tarjetas-titulo">
      <Etiqueta>{t('viajes.tarjetas.etiqueta')}</Etiqueta>
      <h2 id="vj-tarjetas-titulo" className="hn-h2"><Texto k="viajes.tarjetas.titulo" /></h2>
      <ul className="vj-rejilla" role="list">
        {TARJETAS.map(c => <li key={c.id} id={`viaje-${c.id}`} className="vj-ancla"><Tarjeta {...c} setViaje={setViaje} /></li>)}
      </ul>
    </section>
  )
}

function Tarjeta({ id, viaje, to, setViaje }) {
  const { t } = useTranslation()
  const foto = useFotoViajes(`viajes-${id}`)
  const titulo = t(`viajes.tarjetas.lista.${id}.titulo`)
  const contexto = <span className="sr-only">{`: ${titulo}`}</span>
  return (
    <article className="vj-tarjeta" aria-labelledby={`vj-tarjeta-${id}`}>
      <FotoHueco {...foto} sizes="(min-width: 901px) 30vw, 100vw" className="vj-tarjeta__foto" />
      <h3 id={`vj-tarjeta-${id}`} className="hn-h3 vj-tarjeta__nombre">{titulo}</h3>
      <p className="vj-tarjeta__frase">{t(`viajes.tarjetas.lista.${id}.texto`)}</p>
      {to
        ? <L to={to} className="hn-lnk hn-lnk--verde">{t('viajes.tarjetas.descubre')}{contexto}</L>
        : <a href="#diseña" className="hn-lnk hn-lnk--verde" onClick={() => setViaje(viaje)}>{t('viajes.tarjetas.disena')}{contexto}</a>}
    </article>
  )
}

/* ── Viajes de autor (/viajes ↔ /en/journeys) ────────────────────────────
 * Portada → tres maneras de viajar → viajes que diseñamos a medida
 * (tarjetas) → paso a paso → ampliaciones → cierre con el formulario
 * (id="diseña"; cada tarjeta preselecciona su tipo de viaje).
 * ──────────────────────────────────────────────────────────────────────── */
export default function Viajes() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('')
  const portada = useFotoViajes('viajes-portada')

  // Si se llega con un ancla (/viajes#viaje-familia desde la home), la
  // sección aún no existía cuando el enrutador intentó ir a ella.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
  }, [])

  return (
    <div className="hn hn-col">
      {/* pageType editable desde /admin/seo (fila 'viajes'); estos son los
          valores de respaldo mientras no haya fila guardada. */}
      <Seo pageType="viajes" title={t('viajes.seo.title')} description={t('viajes.seo.description')} />
      <Portada ns="viajes" foto={portada} ancla="diseña" />
      <TresManeras />
      <Tarjetas setViaje={setViaje} />
      <Columnas ns="viajes.pasos" />
      <Ampliaciones className="hn-blanca" />
      <CierreFormulario ns="viajes" viaje={viaje} setViaje={setViaje} id="diseña" />
    </div>
  )
}
