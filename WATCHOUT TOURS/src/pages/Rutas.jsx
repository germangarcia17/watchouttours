import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { BotonVideollamada } from '../components/Videollamada'
import { Texto, useImagenSocial } from '../components/editorial/Editorial'
import { Portada } from '../components/editorial/Colecciones'
import { TarjetaRuta, Ampliaciones, useFotoRuta } from '../components/rutas/RutasUI'
import { RUTAS, FILTROS } from '../data/rutas'

/* ── Filtro + tarjetas ───────────────────────────────────────────────────
   Botones con aria-pressed; filtra sin recargar y anuncia cuántas rutas
   quedan. */
function Catalogo() {
  const { t } = useTranslation()
  const [filtro, setFiltro] = useState('todas')
  const visibles = filtro === 'todas' ? RUTAS : RUTAS.filter(r => r.filtros.includes(filtro))
  return (
    <section id="rutas-lista" className="hn-sec rt-catalogo" aria-label={t('rutas.portada.etiqueta')}>
      <div className="rt-filtro" role="group" aria-label={t('rutas.filtrosLabel')}>
        {['todas', ...FILTROS].map(f => (
          <button
            key={f} type="button" className="rt-filtro__boton"
            aria-pressed={filtro === f} onClick={() => setFiltro(f)}
          >
            {t(`rutas.filtros.${f}`)}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{t('rutas.filtrosResultado', { count: visibles.length })}</p>
      <ul className="rt-rejilla" role="list">
        {visibles.map(r => <li key={r.slug}><TarjetaRuta ruta={r} Titulo="h2" /></li>)}
      </ul>
    </section>
  )
}

/* ── Cierre: banda oscura con dos botones ────────────────────────────── */
function Cierre() {
  const { t } = useTranslation()
  return (
    <section className="hn-cierre" aria-labelledby="rt-cierre-titulo">
      <div className="hn-cierre__contenido">
        <h2 id="rt-cierre-titulo" className="hn-h1 hn-h1--menor"><Texto k="rutas.cierre.titulo" /></h2>
        <p>{t('rutas.cierre.texto')}</p>
        <div className="hn-botones hn-col-botones-centro">
          <L to="/productos#diseña" className="hn-btn">{t('rutas.cierre.boton1')}</L>
          <BotonVideollamada className="hn-btn hn-btn--fantasma">{t('rutas.cierre.boton2')}</BotonVideollamada>
        </div>
      </div>
    </section>
  )
}

/* ── Rutas de autor (/rutas ↔ /en/routes) ────────────────────────────────
 * Portada → filtro y tarjetas de las rutas (src/data/rutas.js) →
 * ampliaciones (Islas Cook y Australia) → cierre.
 * ──────────────────────────────────────────────────────────────────────── */
export default function Rutas() {
  const { t } = useTranslation()
  const portada = useFotoRuta('rutas-portada')
  const social = useImagenSocial(portada)
  return (
    <div className="hn hn-col">
      <Seo pageType="rutas" title={t('rutas.seo.title')} description={t('rutas.seo.description')} image={social.src} imageAlt={social.alt} />
      <Portada ns="rutas" foto={portada} botones={false} />
      <Catalogo />
      <Ampliaciones />
      <Cierre />
    </div>
  )
}
