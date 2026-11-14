import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { BotonVideollamada } from '../components/Videollamada'
import { CREDITOS_FUNDADORAS } from '../lib/creditos'
import { Texto, Etiqueta, FotoHueco, dos } from '../components/editorial/Editorial'
import { Portada, Columnas } from '../components/editorial/Colecciones'

/* Huecos de imagen (sección "fundadoras" en /admin/imagenes). Todos se suben
   desde el admin: hasta entonces, bloque gris. Texto alternativo por
   defecto en fundadoras.huecos.<clave> y crédito en CREDITOS_FUNDADORAS
   (las fotos de las fundadoras son propias, sin crédito; las de Nueva
   Zelanda, de Tourism New Zealand). */
function useFoto(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'fundadoras', clave, defecto: null,
    alt: t(`fundadoras.huecos.${clave}`), credito: CREDITOS_FUNDADORAS[clave] ?? '',
  }
}

/* ── 2. Nuestra historia: texto a una columna con capitular ─────────── */
function Historia() {
  const { t } = useTranslation()
  const parrafos = t('fundadoras.historia.parrafos', { returnObjects: true })
  return (
    <section className="hn-sec hn-col-historia" aria-labelledby="fu-historia-titulo">
      <Etiqueta>{t('fundadoras.historia.etiqueta')}</Etiqueta>
      <h2 id="fu-historia-titulo" className="hn-h2"><Texto k="fundadoras.historia.titulo" /></h2>
      <div className="hn-col-historia__texto">
        {parrafos.map((p, i) => (
          <p key={i} className={`hn-body${i === 0 ? ' hn-body--primero hn-col-capitular' : ''}`}>{p}</p>
        ))}
      </div>
    </section>
  )
}

/* ── 3 y 4. Sylvie y Mónica: retrato y texto, alternando ───────────── */
function Fundadora({ id, n }) {
  const { t } = useTranslation()
  const foto = useFoto(`fundadoras-${id}`)
  return (
    <section className={`hn-destino hn-col-fundadora${n % 2 ? ' hn-destino--inverso' : ''}`} aria-labelledby={`fu-${id}-titulo`}>
      <FotoHueco {...foto} sizes="(min-width: 901px) 50vw, 100vw" className="hn-destino__foto hn-col-fundadora__foto" />
      <div className="hn-destino__texto">
        <Etiqueta>{t(`fundadoras.${id}.etiqueta`)}</Etiqueta>
        <h2 id={`fu-${id}-titulo`} className="hn-h2"><Texto k={`fundadoras.${id}.titulo`} /></h2>
        <p className="hn-body hn-body--primero">{t(`fundadoras.${id}.texto`)}</p>
      </div>
    </section>
  )
}

/* ── 5. Cita centrada (como en la home) ─────────────────────────────── */
function Cita() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-cita" aria-label={t('fundadoras.cita.firma')}>
      <figure>
        <blockquote><p><Texto k="fundadoras.cita.texto" /></p></blockquote>
        <figcaption className="hn-firma">{t('fundadoras.cita.firma')}</figcaption>
      </figure>
    </section>
  )
}

/* ── 6. Lo que nos sigue emocionando: foto arriba y texto debajo ────── */
function Emociona() {
  const { t } = useTranslation()
  const items = t('fundadoras.emociona.items', { returnObjects: true })
  return (
    <section className="hn-sec hn-blanca" aria-labelledby="fu-emociona-titulo">
      <Etiqueta>{t('fundadoras.emociona.etiqueta')}</Etiqueta>
      <h2 id="fu-emociona-titulo" className="hn-h2"><Texto k="fundadoras.emociona.titulo" /></h2>
      <ol className="hn-col-tres" role="list">
        {items.map((it, i) => <Emocion key={it.id} {...it} n={i} />)}
      </ol>
    </section>
  )
}

function Emocion({ id, titulo, texto, n }) {
  const foto = useFoto(`fundadoras-${id}`)
  return (
    <li className="hn-col-tres__item">
      <FotoHueco {...foto} sizes="(min-width: 901px) 30vw, 100vw" className="hn-col-tres__foto" />
      <span className="hn-col-vivir__num" aria-hidden="true">{dos(n + 1)}</span>
      <h3 className="hn-columnas__titulo">{titulo}</h3>
      <p>{texto}</p>
    </li>
  )
}

/* ── 8. Cierre: banda oscura con título, texto y dos botones ────────── */
function Cierre() {
  const { t } = useTranslation()
  return (
    <section className="hn-cierre" aria-labelledby="fu-cierre-titulo">
      <div className="hn-cierre__contenido">
        <h2 id="fu-cierre-titulo" className="hn-h1 hn-h1--menor"><Texto k="fundadoras.cierre.titulo" /></h2>
        <p>{t('fundadoras.cierre.texto')}</p>
        <div className="hn-botones hn-col-botones-centro">
          <BotonVideollamada className="hn-btn">{t('fundadoras.cierre.boton1')}</BotonVideollamada>
          <L to="/#itinerario" className="hn-btn hn-btn--fantasma">{t('fundadoras.cierre.boton2')}</L>
        </div>
      </div>
    </section>
  )
}

/* ── Fundadoras (/sobre-nosotras ↔ /en/about-us) ─────────────────────────
 * Portada → nuestra historia → Sylvie → Mónica → cita → lo que nos sigue
 * emocionando → nuestra forma de viajar (los pilares de la home) → cierre.
 * ──────────────────────────────────────────────────────────────────────── */
export default function SobreNosotras() {
  const { t } = useTranslation()
  const portada = useFoto('fundadoras-portada')
  return (
    <div className="hn hn-col">
      {/* pageType editable desde /admin/seo (fila 'sobre-nosotras'); estos son
          los valores de respaldo mientras no haya fila guardada. */}
      <Seo pageType="sobre-nosotras" title={t('fundadoras.seo.title')} description={t('fundadoras.seo.description')} />
      <Portada ns="fundadoras" foto={portada} botones={false} />
      <Historia />
      <div className="hn-col-fundadoras hn-blanca">
        <Fundadora id="sylvie" n={0} />
        <Fundadora id="monica" n={1} />
      </div>
      <Cita />
      <Emociona />
      <Columnas ns="home.pilares" />
      <Cierre />
    </div>
  )
}
