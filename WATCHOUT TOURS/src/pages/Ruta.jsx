import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Seo } from '../components/Seo'
import { L, useLang } from '../i18n/routing'
import { SITE_URL } from '../lib/site'
import { BotonVideollamada } from '../components/Videollamada'
import { Texto, Etiqueta, FotoHueco, dos, useImagenSocial } from '../components/editorial/Editorial'
import { MapaRuta, TarjetaRuta, Ampliaciones, FormularioRuta, useFotoRuta } from '../components/rutas/RutasUI'
import { RUTAS, rutaPorSlug } from '../data/rutas'
import NotFound from './NotFound'

/* ── 1. Portada: la foto sola y, debajo, la banda oscura con los datos ── */
function PortadaRuta({ ruta }) {
  const { t } = useTranslation()
  const ns = `rutas.lista.${ruta.slug}`
  const foto = useFotoRuta(`ruta-${ruta.slug}-portada`)
  const ideal = ruta.filtros.map(f => t(`rutas.filtros.${f}`)).join(' · ')
  return (
    <header className="hn-col-portada">
      <FotoHueco {...foto} sizes="100vw" className="hn-col-portada__foto" prioritaria sangre tono="oscuro" />
      <div className="hn-col-portada__texto">
        <Etiqueta className="hn-lbl--verde">{t('rutas.pagina.etiqueta')}</Etiqueta>
        <h1 className="hn-h1"><Texto k={`${ns}.nombre`} /></h1>
        <p className="hn-intro__sub">{t(`${ns}.subtitulo`)}</p>
        <dl className="rt-datos rt-datos--oscuro">
          <div><dt>{t('rutas.tarjeta.duracion')}</dt><dd>{t(`${ns}.duracion`)}</dd></div>
          <div><dt>{t('rutas.tarjeta.epoca')}</dt><dd>{t(`${ns}.epoca`)}</dd></div>
          <div><dt>{t('rutas.tarjeta.idealPara')}</dt><dd>{ideal}</dd></div>
        </dl>
        <div className="hn-botones">
          <a href="#itinerario" className="hn-btn">{t('rutas.pagina.botonItinerario')}</a>
          <BotonVideollamada className="hn-btn hn-btn--fantasma">{t('rutas.pagina.botonHablar')}</BotonVideollamada>
        </div>
      </div>
    </header>
  )
}

/* ── 3. El recorrido: mapa y lista numerada de paradas ───────────────── */
function Recorrido({ ruta }) {
  const { t } = useTranslation()
  const nombres = t(`rutas.lista.${ruta.slug}.paradas`, { returnObjects: true })
  return (
    <section className="hn-sec hn-blanca rt-recorrido" aria-labelledby="rt-recorrido-titulo">
      <div className="rt-recorrido__mapa"><MapaRuta ruta={ruta} nombres={nombres} /></div>
      <div>
        <Etiqueta>{t('rutas.pagina.recorridoEtiqueta')}</Etiqueta>
        <h2 id="rt-recorrido-titulo" className="hn-h2">{t('rutas.pagina.recorridoTitulo')}</h2>
        <ol className="rt-paradas" role="list">
          {nombres.map((n, i) => (
            <li key={n}><span className="rt-paradas__num" aria-hidden="true">{i + 1}</span>{n}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── 4. El momento firma: foto sola y, debajo, la banda oscura ───────── */
function Momento({ ruta }) {
  const { t } = useTranslation()
  const foto = useFotoRuta(`ruta-${ruta.slug}-momento`)
  return (
    <section className="hn-cierre" aria-labelledby="rt-momento-titulo">
      <FotoHueco {...foto} sizes="100vw" className="hn-cierre__foto rt-momento__foto" sangre tono="oscuro" />
      <div className="rt-momento__texto">
        <h2 id="rt-momento-titulo" className="hn-lbl hn-lbl--verde">{t('rutas.pagina.momentoEtiqueta')}</h2>
        <p className="rt-momento__frase">{t(`rutas.lista.${ruta.slug}.momento`)}</p>
      </div>
    </section>
  )
}

/* ── 5. Lo que vivirás: tres columnas numeradas ──────────────────────── */
function Vivir({ ruta }) {
  const { t } = useTranslation()
  const items = t(`rutas.lista.${ruta.slug}.vivir`, { returnObjects: true })
  return (
    <section className="hn-sec" aria-labelledby="rt-vivir-titulo">
      <Etiqueta>{t('rutas.pagina.vivirEtiqueta')}</Etiqueta>
      <h2 id="rt-vivir-titulo" className="hn-h2"><Texto k="rutas.pagina.vivirTitulo" /></h2>
      <ol className="hn-columnas hn-pilares hn-col-rejilla" role="list">
        {items.map((x, i) => (
          <li key={x}>
            <span className="hn-num" aria-hidden="true">{dos(i + 1)}</span>
            <h3 className="hn-columnas__titulo">{x}</h3>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ── 6. Dos maneras de hacerla (mismos textos que en Viajes privados) ── */
function Maneras() {
  const { t } = useTranslation()
  const items = t('privados.maneras.items', { returnObjects: true })
  return (
    <section className="hn-sec hn-blanca" aria-labelledby="rt-maneras-titulo">
      <Etiqueta>{t('rutas.pagina.manerasEtiqueta')}</Etiqueta>
      <h2 id="rt-maneras-titulo" className="hn-h2"><Texto k="rutas.pagina.manerasTitulo" /></h2>
      <div className="hn-col-maneras">
        {items.map(m => (
          <article key={m.id} className="hn-col-manera rt-manera" aria-labelledby={`rt-manera-${m.id}`}>
            <h3 id={`rt-manera-${m.id}`} className="hn-h3">{m.titulo}</h3>
            <p className="hn-col-manera__texto">{m.texto}</p>
            <h4 className="hn-col-incluye__titulo">{t('privados.maneras.incluyeLabel')}</h4>
            <ul className="hn-col-incluye" role="list">{m.incluye.map(x => <li key={x}>{x}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ── 9. Otras rutas: las tres siguientes ─────────────────────────────── */
function OtrasRutas({ ruta }) {
  const { t } = useTranslation()
  const i = RUTAS.indexOf(ruta)
  const otras = [1, 2, 3].map(n => RUTAS[(i + n) % RUTAS.length])
  return (
    <section className="hn-sec hn-blanca" aria-labelledby="rt-otras-titulo">
      <Etiqueta>{t('rutas.pagina.otrasEtiqueta')}</Etiqueta>
      <h2 id="rt-otras-titulo" className="hn-h2">{t('rutas.pagina.otrasTitulo')}</h2>
      <ul className="rt-rejilla rt-rejilla--tres" role="list">
        {otras.map(r => <li key={r.slug}><TarjetaRuta ruta={r} /></li>)}
      </ul>
      <L to="/rutas" className="hn-lnk hn-lnk--verde">{t('rutas.pagina.todas')}</L>
    </section>
  )
}

/* Datos estructurados: TouristTrip con las paradas (sin precio) */
function RutaJsonLd({ ruta }) {
  const { t } = useTranslation()
  const lang = useLang()
  const ns = `rutas.lista.${ruta.slug}`
  const nombres = t(`${ns}.paradas`, { returnObjects: true })
  const datos = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: t(`${ns}.nombrePlano`),
    description: t(`${ns}.intro`),
    inLanguage: lang,
    url: `${SITE_URL}${lang === 'en' ? '/en/routes' : '/rutas'}/${ruta.slug}`,
    touristType: ruta.filtros.map(f => t(`rutas.filtros.${f}`)),
    itinerary: {
      '@type': 'ItemList',
      itemListElement: nombres.map((n, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Place', name: n } })),
    },
    provider: { '@type': 'TravelAgency', name: 'WatchOut Tours', url: SITE_URL },
  }
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(datos)}</script>
    </Helmet>
  )
}

/* ── Página de una ruta (/rutas/<slug> ↔ /en/routes/<slug>) ──────────────
 * Portada → introducción → recorrido → momento firma → lo que vivirás →
 * dos maneras de hacerla → ampliaciones → formulario del itinerario →
 * otras rutas.
 * ──────────────────────────────────────────────────────────────────────── */
export default function Ruta() {
  const { slug } = useParams()
  const ruta = rutaPorSlug(slug)
  if (!ruta) return <NotFound />
  return <PaginaRuta key={ruta.slug} ruta={ruta} />
}

function PaginaRuta({ ruta }) {
  const { t } = useTranslation()
  const ns = `rutas.lista.${ruta.slug}`
  const portada = useFotoRuta(`ruta-${ruta.slug}-portada`)
  const social = useImagenSocial(portada)
  const aviso = t(`${ns}.aviso`, { defaultValue: '' })
  return (
    <div className="hn hn-col">
      <Seo
        pageType={`ruta-${ruta.slug}`}
        title={t('rutas.seoRuta.title', { nombre: t(`${ns}.nombrePlano`) })}
        description={t('rutas.seoRuta.description', { frase: t(`${ns}.frase`) })}
        image={social.src} imageAlt={social.alt}
      />
      <RutaJsonLd ruta={ruta} />
      <PortadaRuta ruta={ruta} />
      <section className="hn-sec rt-intro" aria-label={t(`${ns}.nombrePlano`)}>
        <p>{t(`${ns}.intro`)}</p>
      </section>
      <Recorrido ruta={ruta} />
      <Momento ruta={ruta} />
      <Vivir ruta={ruta} />
      <Maneras />
      <Ampliaciones className="" />
      <FormularioRuta ruta={ruta} />
      <OtrasRutas ruta={ruta} />
      {aviso && <p className="rt-aviso">{aviso}</p>}
    </div>
  )
}
