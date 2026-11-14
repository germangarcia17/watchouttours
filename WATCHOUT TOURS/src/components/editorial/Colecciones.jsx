import { useTranslation } from 'react-i18next'
import '../../styles/pagestyle/Colecciones.css'
import { BotonVideollamada } from '../Videollamada'
import { Desplegable } from '../Desplegable'
import { L } from '../../i18n/routing'
import { Texto, Etiqueta, FotoHueco, FormularioItinerario, dos } from './Editorial'

/* ── Bloques de las páginas de colección ─────────────────────────────────
 * Viajes +60 (/sin-prisa) y Más allá de la vista (/mas-alla-de-la-vista).
 * Mismo sistema editorial que la home (HomeNueva.css) más lo propio de
 * estas páginas (Colecciones.css, prefijo .hn-col-).
 * Ninguna foto lleva nada encima (licencia de Tourism New Zealand; las
 * propias, por coherencia): el texto va siempre fuera de la imagen y el
 * crédito, debajo del borde.
 * ──────────────────────────────────────────────────────────────────────── */

/* Portada: la foto a sangre, sola, y debajo la banda #15171A con la
   etiqueta, el h1, el subtítulo y los botones (como la home). `foto`:
   props de FotoHueco. `botones`: false para una portada sin botones.
   `ancla`: id de la sección a la que lleva el botón principal. */
export function Portada({ ns, foto, botones = true, ancla = 'descubre' }) {
  const { t } = useTranslation()
  return (
    <header className="hn-col-portada">
      <FotoHueco {...foto} sizes="100vw" className="hn-col-portada__foto" prioritaria sangre tono="oscuro" />
      <div className="hn-col-portada__texto">
        <Etiqueta className="hn-lbl--verde">{t(`${ns}.portada.etiqueta`)}</Etiqueta>
        <h1 className="hn-h1"><Texto k={`${ns}.portada.titulo`} /></h1>
        <p className="hn-intro__sub">{t(`${ns}.portada.sub`)}</p>
        {botones && (
          <div className="hn-botones">
            <a href={`#${ancla}`} className="hn-btn">{t(`${ns}.portada.boton`)}</a>
            <BotonVideollamada className="hn-btn hn-btn--fantasma">{t('home.salida.hablar')}</BotonVideollamada>
          </div>
        )}
      </div>
    </header>
  )
}

/* Columnas numeradas (como los pilares de la home). `rejilla`: tres por
   fila (para seis puntos) en lugar de todas en una. `foto`: props de
   FotoHueco para una foto 4:3 junto a las columnas (que pasan a dos por
   fila). */
export function Columnas({ id, ns, rejilla = false, foto, className = '' }) {
  const { t } = useTranslation()
  const items = t(`${ns}.items`, { returnObjects: true })
  const tituloId = `${id ?? ns.replace(/\W/g, '-')}-titulo`
  // role="list": sin viñetas, Safari quitaría la semántica de lista
  const lista = (
    <ol className={`hn-columnas hn-pilares${rejilla || foto ? ' hn-col-rejilla' : ''}${foto ? ' hn-col-rejilla--dos' : ''}`} role="list">
      {items.map((p, i) => (
        <li key={p.titulo}>
          <span className="hn-num" aria-hidden="true">{dos(i + 1)}</span>
          <h3 className="hn-columnas__titulo">{p.titulo}</h3>
          <p>{p.texto}</p>
        </li>
      ))}
    </ol>
  )
  return (
    <section id={id} className={`hn-sec ${className}`.trim()} aria-labelledby={tituloId}>
      <Etiqueta>{t(`${ns}.etiqueta`)}</Etiqueta>
      <h2 id={tituloId} className="hn-h2"><Texto k={`${ns}.titulo`} /></h2>
      {foto ? (
        <div className="hn-col-con-foto">
          <FotoHueco {...foto} sizes="(min-width: 901px) 42vw, 100vw" className="hn-col-con-foto__foto" />
          {lista}
        </div>
      ) : lista}
    </section>
  )
}

/* Próxima salida en grupo: es El Gran Viaje (no un viaje propio de la
   colección), así que se menciona y se enlaza a su sección de la home. */
export function ProximaSalidaGrupo({ className = '' }) {
  const { t } = useTranslation()
  return (
    <section className={`hn-sec hn-col-salida ${className}`.trim()} aria-labelledby="hn-col-salida-titulo">
      <h2 id="hn-col-salida-titulo" className="hn-lbl hn-lbl--centro">{t('home.salida.etiqueta')}</h2>
      <p className="hn-col-salida__texto">{t('home.salida.aviso')}</p>
      <L to="/#proxima-salida" className="hn-btn">{t('home.salida.avisoEnlace')}</L>
    </section>
  )
}

/* Preguntas frecuentes en acordeón (como en la home). */
export function Preguntas({ ns }) {
  const { t } = useTranslation()
  const faq = t(`${ns}.items`, { returnObjects: true })
  return (
    <section id="preguntas" className="hn-sec hn-col-faq" aria-labelledby="hn-col-faq-titulo">
      <div className="hn-faq">
        <h2 id="hn-col-faq-titulo" className="hn-h2 hn-faq__titulo">{t(`${ns}.titulo`)}</h2>
        {faq.map(({ q, a }, i) => (
          <Desplegable key={q} id={`hn-col-faq-${i + 1}`} boton={q} Titulo="h3" className="hn-faq__item">
            <p>{a}</p>
          </Desplegable>
        ))}
      </div>
    </section>
  )
}

/* Cierre: (opcional) la foto a sangre, sola, y debajo la banda #15171A con
   el título, el texto y el formulario del itinerario con el viaje de la
   página preseleccionado. `id` (por defecto "itinerario"): los botones
   de la página llevan aquí. `extra`: contenido bajo el texto (p. ej. la línea de los
   viajes privados). */
export function CierreFormulario({ ns, foto, viaje, setViaje, extra, id = 'itinerario', className = '' }) {
  const { t } = useTranslation()
  return (
    <section id={id} className={`hn-col-cierre ${className}`.trim()} aria-labelledby="hn-col-cierre-titulo">
      {foto && <FotoHueco {...foto} sizes="100vw" className="hn-cierre__foto" sangre tono="oscuro" />}
      <div className="hn-col-cierre__banda">
        <div className="hn-col-cierre__texto">
          <h2 id="hn-col-cierre-titulo" className="hn-h2"><Texto k={`${ns}.cierre.titulo`} /></h2>
          <p className="hn-col-cierre__parrafo">{t(`${ns}.cierre.texto`)}</p>
          {extra}
        </div>
        <div className="hn-col-cierre__form hn-itinerario">
          <FormularioItinerario viaje={viaje} setViaje={setViaje} />
        </div>
      </div>
    </section>
  )
}
