import { useTranslation } from 'react-i18next'
import { L } from '../../i18n/routing'
import { useSiteImage } from '../../lib/siteImages'
import { defectoHueco } from '../ImagenHueco'
import { CREDITOS_VIAJES } from '../../lib/creditos'
import { Texto, Etiqueta, FotoHueco, dos } from '../editorial/Editorial'
import '../../styles/pagestyle/Viajes.css'

/* ── Piezas de Viajes de autor (/viajes) que también usa la home ─────────
 * Textos en viajes.* (es.json / en.json). Huecos de imagen en la sección
 * "viajes" de /admin/imagenes. Ninguna foto lleva nada encima: el texto va
 * debajo y el crédito, bajo el borde de la foto.
 * ──────────────────────────────────────────────────────────────────────── */

/* Foto por defecto de cada hueco de la sección "viajes" (nombre de una
   imagen del repositorio, src/data/imagenes.json). null = aún sin foto. */
export const IMG_VIAJES = {
  'viajes-portada': 'tnz-233933-aoraki-mt-cook',
  'viajes-pareja': 'tnz-233385-lake-wanaka',
  'viajes-familia': 'sin-prisa--sesenta-hobbiton',
  'viajes-lujo': 'privados--privados-portada',
  'viajes-esqui': 'esqui-tekapo',
  'viajes-naturaleza': 'fundadoras--fundadoras-montanas',
  'viajes-maori': 'tnz-234567-rotorua',
  'viajes-sesenta': 'home--panel-sesenta',
  'viajes-ciegos': 'pareja-tongariro',
  'viajes-amigos': 'home--galeria-10',
  'ampliacion-cook': null,
  'ampliacion-australia': null,
}

/* Props de FotoHueco para un hueco de la sección "viajes" */
export function useFotoViajes(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'viajes', clave, defecto: IMG_VIAJES[clave],
    alt: t(`viajes.huecos.${clave}`, { defaultValue: '' }) || null,
    credito: CREDITOS_VIAJES[clave] ?? '',
  }
}

/* ── Tres maneras de viajar: en grupo, en privado, self drive ──────────
   Columnas numeradas con su enlace. La usan /viajes y la home. */
const MANERAS = [
  { id: 'grupo', to: '/#proxima-salida' },
  { id: 'privado', to: '/productos' },
  { id: 'selfdrive', to: '/productos' },
]

export function TresManeras({ id = 'maneras', className = '', children }) {
  const { t } = useTranslation()
  return (
    <section id={id} className={`hn-sec ${className}`.trim()} aria-labelledby={`${id}-titulo`}>
      <Etiqueta>{t('viajes.maneras.etiqueta')}</Etiqueta>
      <h2 id={`${id}-titulo`} className="hn-h2"><Texto k="viajes.maneras.titulo" /></h2>
      <ol className="hn-columnas hn-pilares vj-maneras" role="list">
        {MANERAS.map(({ id: m, to }, i) => (
          <li key={m}>
            <span className="hn-num" aria-hidden="true">{dos(i + 1)}</span>
            <h3 className="hn-columnas__titulo">{t(`viajes.maneras.${m}.titulo`)}</h3>
            <p>{t(`viajes.maneras.${m}.texto`)}</p>
            <L to={to} className="hn-lnk hn-lnk--verde">
              {t(`viajes.maneras.${m}.enlace`)}
              <span className="sr-only">{` (${t(`viajes.maneras.${m}.titulo`)})`}</span>
            </L>
          </li>
        ))}
      </ol>
      {children}
    </section>
  )
}

/* ── Nuestras especialidades: dos tarjetas compactas (home) ──────────── */
const ESPECIALIDADES = [
  { id: 'sesenta', clave: 'viajes-sesenta', to: '/sin-prisa' },
  { id: 'ciegos', clave: 'viajes-ciegos', to: '/viajes-personas-ciegas-baja-vision' },
]

export function Especialidades() {
  const { t } = useTranslation()
  return (
    <div className="vj-especialidades">
      <h3 className="vj-especialidades__titulo">{t('viajes.especialidades.titulo')}</h3>
      <ul className="vj-especialidades__lista" role="list">
        {ESPECIALIDADES.map(e => <Especialidad key={e.id} {...e} />)}
      </ul>
    </div>
  )
}

function Especialidad({ id, clave, to }) {
  const { t } = useTranslation()
  const foto = useFotoViajes(clave)
  return (
    <li className="vj-especialidad">
      <FotoHueco {...foto} sizes="(min-width: 901px) 20vw, 100vw" className="vj-especialidad__foto" />
      <div className="vj-especialidad__texto">
        <h4 className="hn-h3 vj-especialidad__nombre">{t(`viajes.tarjetas.lista.${id}.titulo`)}</h4>
        <p>{t(`viajes.tarjetas.lista.${id}.texto`)}</p>
        <L to={to} className="hn-lnk hn-lnk--verde">
          {t('viajes.tarjetas.descubre')}<span className="sr-only">{`: ${t(`viajes.tarjetas.lista.${id}.titulo`)}`}</span>
        </L>
      </div>
    </li>
  )
}

/* ── Ampliaciones: Islas Cook y Australia ────────────────────────────
   Tarjetas sin foto hasta que se añada una al hueco (sin bloque gris). */
export function Ampliaciones({ className = '' }) {
  const { t } = useTranslation()
  const items = t('viajes.ampliaciones.items', { returnObjects: true })
  return (
    <section className={`hn-sec ${className}`.trim()} aria-labelledby="vj-ampliaciones-titulo">
      <Etiqueta>{t('viajes.ampliaciones.etiqueta')}</Etiqueta>
      <h2 id="vj-ampliaciones-titulo" className="hn-h2"><Texto k="viajes.ampliaciones.titulo" /></h2>
      <p className="hn-body hn-body--primero vj-ampliaciones__intro">{t('viajes.ampliaciones.texto')}</p>
      <ul className="vj-ampliaciones" role="list">
        {items.map(a => <Ampliacion key={a.id} {...a} />)}
      </ul>
    </section>
  )
}

function Ampliacion({ id, titulo, texto }) {
  const foto = useFotoViajes(`ampliacion-${id}`)
  const img = useSiteImage('viajes', foto.clave, defectoHueco('viajes', foto.clave, foto.defecto), '')
  return (
    <li className="vj-ampliacion">
      {img.src && <FotoHueco {...foto} sizes="(min-width: 901px) 45vw, 100vw" className="vj-ampliacion__foto" />}
      <h3 className="hn-h3">{titulo}</h3>
      <p className="hn-body hn-body--menor">{texto}</p>
    </li>
  )
}
