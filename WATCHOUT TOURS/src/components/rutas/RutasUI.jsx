import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import { supabase } from '../../lib/supabase'
import { L, useLang } from '../../i18n/routing'
import { Texto, Etiqueta, FotoHueco } from '../editorial/Editorial'
import { CREDITOS_RUTAS } from '../../lib/creditos'
import '../../styles/pagestyle/Rutas.css'

/* ── Piezas de las rutas de autor (/rutas y /rutas/<slug>) ───────────────
 * Datos de cada ruta en src/data/rutas.js; textos en rutas.* (es.json /
 * en.json). Huecos de imagen en la sección "rutas" de /admin/imagenes.
 * ──────────────────────────────────────────────────────────────────────── */

/* Props de FotoHueco para un hueco de la sección "rutas". Sin foto todavía:
   sin alt por defecto (se escribe en el admin al subirla). */
export function useFotoRuta(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'rutas', clave, defecto: null,
    alt: t(`rutas.huecos.${clave}`, { defaultValue: '' }) || null,
    credito: CREDITOS_RUTAS[clave] ?? '',
  }
}

/* ── Mapa SVG de Nueva Zelanda con el recorrido ──────────────────────────
   Silueta simplificada (#E8E4DA), línea de la ruta (#1F6B56) y paradas
   numeradas. Es una imagen (role="img") con una descripción del recorrido;
   la lista numerada de al lado es la versión textual. */
const ESCALA = 40
const LAT0 = -34.1
const LON0 = 166.2
const COS = 0.755 // coseno de la latitud media, para no deformar el país

const xy = ([lat, lon]) => [((lon - LON0) * COS * ESCALA).toFixed(1), ((LAT0 - lat) * ESCALA).toFixed(1)]
const trazo = pts => pts.map(p => xy(p).join(',')).join(' ')

const ISLA_NORTE = [[-34.43, 172.68], [-34.95, 173.4], [-35.2, 174.1], [-35.85, 174.55], [-36.4, 174.8], [-36.85, 174.85], [-36.5, 175.35], [-36.8, 175.85], [-37.4, 175.95], [-37.7, 176.2], [-37.95, 177.0], [-37.6, 178.3], [-38.0, 178.55], [-38.7, 178.0], [-39.1, 177.9], [-39.4, 176.9], [-40.0, 176.9], [-40.6, 176.3], [-41.3, 175.7], [-41.6, 175.2], [-41.3, 174.7], [-40.9, 175.0], [-40.3, 175.2], [-39.9, 174.9], [-39.55, 174.0], [-39.25, 173.75], [-38.9, 174.4], [-38.3, 174.65], [-37.3, 174.6], [-36.6, 174.25], [-36.1, 173.8], [-35.5, 173.4], [-35.0, 173.0], [-34.6, 172.65]]
const ISLA_SUR = [[-40.5, 172.7], [-40.85, 173.2], [-41.0, 174.0], [-41.3, 174.3], [-41.75, 174.2], [-42.4, 173.7], [-43.0, 172.9], [-43.6, 172.9], [-43.85, 172.5], [-44.1, 171.6], [-44.9, 171.15], [-45.5, 170.8], [-45.85, 170.7], [-46.3, 169.9], [-46.65, 169.1], [-46.6, 168.4], [-46.4, 167.7], [-46.1, 166.6], [-45.5, 166.8], [-45.0, 167.2], [-44.6, 167.9], [-44.0, 168.4], [-43.5, 169.6], [-43.0, 170.6], [-42.5, 171.2], [-41.8, 171.5], [-41.5, 172.0], [-40.9, 172.1]]
const STEWART = [[-46.7, 167.9], [-46.75, 168.2], [-47.0, 168.2], [-47.25, 167.8], [-46.95, 167.6]]

export function MapaRuta({ ruta, nombres }) {
  const { t } = useTranslation()
  const puntos = ruta.paradas.map(p => [p.lat, p.lon])
  return (
    <svg className="rt-mapa" viewBox="0 0 390 560" role="img" aria-label={t('rutas.pagina.mapaAria', { paradas: nombres.join(', ') })}>
      {[ISLA_NORTE, ISLA_SUR, STEWART].map((isla, i) => (
        <polygon key={i} points={trazo(isla)} fill="#E8E4DA" stroke="#D6D0C2" strokeWidth="1" strokeLinejoin="round" />
      ))}
      <polyline points={trazo(puntos)} fill="none" stroke="#1F6B56" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {puntos.map((p, i) => {
        const [x, y] = xy(p)
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="10" fill="#1F6B56" stroke="#FFFFFF" strokeWidth="2" />
            <text x={x} y={y} dy="3.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" fontFamily="var(--font-family)">{i + 1}</text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Tarjeta de una ruta ─────────────────────────────────────────────── */
export function TarjetaRuta({ ruta, Titulo = 'h3' }) {
  const { t } = useTranslation()
  const ns = `rutas.lista.${ruta.slug}`
  const foto = useFotoRuta(`ruta-${ruta.slug}-portada`)
  const ideal = ruta.filtros.map(f => t(`rutas.filtros.${f}`)).join(' · ')
  return (
    <article className="rt-tarjeta" aria-labelledby={`rt-tarjeta-${ruta.slug}`}>
      <FotoHueco {...foto} sizes="(min-width: 901px) 45vw, 100vw" className="rt-tarjeta__foto" />
      <div className="rt-tarjeta__cuerpo">
        <Titulo id={`rt-tarjeta-${ruta.slug}`} className="hn-h3 rt-tarjeta__nombre">{t(`${ns}.nombrePlano`)}</Titulo>
        <p className="rt-tarjeta__sub">{t(`${ns}.subtitulo`)}</p>
        <dl className="rt-datos">
          <div><dt>{t('rutas.tarjeta.duracion')}</dt><dd>{t(`${ns}.duracion`)}</dd></div>
          <div><dt>{t('rutas.tarjeta.epoca')}</dt><dd>{t(`${ns}.epoca`)}</dd></div>
          <div><dt>{t('rutas.tarjeta.idealPara')}</dt><dd>{ideal}</dd></div>
        </dl>
        <p className="rt-tarjeta__frase">{t(`${ns}.frase`)}</p>
        <L to={`/rutas/${ruta.slug}`} className="hn-lnk hn-lnk--verde">
          {t('rutas.tarjeta.enlace')}<span className="sr-only">: {t(`${ns}.nombrePlano`)}</span>
        </L>
      </div>
      <p className="rt-tarjeta__modos">{t('rutas.tarjeta.modalidades')}</p>
    </article>
  )
}

/* ── Ampliaciones: Islas Cook y Australia ────────────────────────────── */
export function Ampliaciones({ className = 'hn-blanca' }) {
  const { t } = useTranslation()
  const items = t('rutas.ampliaciones.items', { returnObjects: true })
  return (
    <section className={`hn-sec ${className}`.trim()} aria-labelledby="rt-ampliaciones-titulo">
      <Etiqueta>{t('rutas.ampliaciones.etiqueta')}</Etiqueta>
      <h2 id="rt-ampliaciones-titulo" className="hn-h2"><Texto k="rutas.ampliaciones.titulo" /></h2>
      <ul className="rt-ampliaciones" role="list">
        {items.map(a => <Ampliacion key={a.id} {...a} />)}
      </ul>
    </section>
  )
}

function Ampliacion({ id, titulo, texto }) {
  const foto = useFotoRuta(`ampliacion-${id}`)
  return (
    <li className="rt-ampliacion">
      <FotoHueco {...foto} sizes="(min-width: 901px) 45vw, 100vw" className="rt-ampliacion__foto" />
      <h3 className="hn-h3">{titulo}</h3>
      <p className="hn-body hn-body--menor">{texto}</p>
    </li>
  )
}

/* ── Formulario: recibe el itinerario completo de una ruta ──────────────
   Llega al correo del equipo (Formspree, con el nombre de la ruta) y se
   guarda en Supabase (tabla solicitudes_rutas). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function FormularioRuta({ ruta }) {
  const { t } = useTranslation()
  const lang = useLang()
  const [state, enviarFormspree] = useForm('xykqrkjq')
  const [errores, setErrores] = useState({})
  const exitoRef = useRef(null)
  const nombreRuta = t(`rutas.lista.${ruta.slug}.nombrePlano`, { lng: 'es' })

  useEffect(() => {
    if (state.succeeded) exitoRef.current?.focus()
  }, [state.succeeded])

  function enviar(e) {
    e.preventDefault()
    const datos = new FormData(e.target)
    const err = {}
    if ((datos.get('nombre') ?? '').trim().length < 2) err.nombre = t('rutas.form.errNombre')
    if (!EMAIL_RE.test((datos.get('email') ?? '').trim())) err.email = t('rutas.form.errEmail')
    if (!datos.get('privacidad')) err.privacidad = t('contacto.err.privacidad')
    if (Object.keys(err).length) {
      setErrores(err)
      requestAnimationFrame(() => e.target.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setErrores({})
    // Copia en Supabase; si falla, la solicitud llega igualmente por correo
    supabase.from('solicitudes_rutas').insert({
      ruta: ruta.slug,
      nombre: datos.get('nombre').trim(),
      email: datos.get('email').trim(),
      fechas: datos.get('fechas') || null,
      viajeros: datos.get('viajeros') || null,
      modalidad: datos.get('modalidad') || null,
      ampliacion: datos.get('ampliacion') === 'si',
      comentarios: datos.get('comentarios') || null,
      idioma: lang,
    }).then(() => {}, () => {})
    enviarFormspree(e)
  }

  const campo = (id, etiqueta, props = {}, ayuda) => (
    <div className="form-field">
      <label htmlFor={`rt-${id}`} className="form-label">
        {etiqueta}
        {props.required && <><span aria-hidden="true" className="required-marker"> *</span><span className="sr-only">{t('contacto.requiredSr')}</span></>}
      </label>
      {ayuda && <p id={`rt-${id}-ayuda`} className="hn-ayuda">{ayuda}</p>}
      <input
        id={`rt-${id}`} name={id} className={`form-control${errores[id] ? ' form-control--error' : ''}`}
        aria-invalid={errores[id] ? 'true' : undefined}
        aria-describedby={[ayuda && `rt-${id}-ayuda`, errores[id] && `rt-${id}-err`].filter(Boolean).join(' ') || undefined}
        {...props} required={undefined} aria-required={props.required ? 'true' : undefined}
      />
      {errores[id] && <p id={`rt-${id}-err`} role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores[id]}</p>}
    </div>
  )

  return (
    <section id="itinerario" className="hn-col-cierre" aria-labelledby="rt-form-titulo">
      <div className="hn-col-cierre__banda">
        <div className="hn-col-cierre__texto">
          <Etiqueta className="hn-lbl--verde">{t('rutas.form.etiqueta')}</Etiqueta>
          <h2 id="rt-form-titulo" className="hn-h2"><Texto k="rutas.form.titulo" /></h2>
          <p className="hn-col-cierre__parrafo">{t('rutas.form.texto')}</p>
        </div>
        <div className="hn-col-cierre__form hn-itinerario">
          <p ref={exitoRef} tabIndex={-1} role="status" aria-live="polite" className={state.succeeded ? 'form-status--success' : 'sr-only'}>
            {state.succeeded ? t('rutas.form.exito') : ''}
          </p>
          {!state.succeeded && (
            <form onSubmit={enviar} noValidate aria-label={t('rutas.form.formAria')}>
              <input type="hidden" name="_subject" value={`Itinerario de ruta: ${nombreRuta}`} />
              <input type="hidden" name="ruta" value={nombreRuta} />
              <input type="hidden" name="idioma" value={lang === 'en' ? 'Inglés' : 'Español'} />
              <div aria-hidden="true" style={{ display: 'none' }}><input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" /></div>
              {campo('nombre', t('rutas.form.nombre'), { type: 'text', autoComplete: 'name', required: true })}
              {campo('email', t('rutas.form.email'), { type: 'email', autoComplete: 'email', required: true })}
              {campo('fechas', t('rutas.form.fechas'), { type: 'text', autoComplete: 'off' }, t('rutas.form.fechasAyuda'))}
              {campo('viajeros', t('rutas.form.viajeros'), { type: 'number', min: 1, max: 20, inputMode: 'numeric' })}
              <fieldset className="form-field rt-opciones">
                <legend className="form-label">{t('rutas.form.modalidad')}</legend>
                {['anfitrionas', 'selfdrive', 'nose'].map(m => (
                  <label key={m} className="rt-opcion">
                    <input type="radio" name="modalidad" value={t(`rutas.form.modalidad${m === 'nose' ? 'Nose' : m === 'selfdrive' ? 'Selfdrive' : 'Anfitrionas'}`, { lng: 'es' })} />
                    <span>{t(`rutas.form.modalidad${m === 'nose' ? 'Nose' : m === 'selfdrive' ? 'Selfdrive' : 'Anfitrionas'}`)}</span>
                  </label>
                ))}
              </fieldset>
              <fieldset className="form-field rt-opciones">
                <legend className="form-label">{t('rutas.form.ampliacion')}</legend>
                <label className="rt-opcion"><input type="radio" name="ampliacion" value="si" /><span>{t('rutas.form.si')}</span></label>
                <label className="rt-opcion"><input type="radio" name="ampliacion" value="no" /><span>{t('rutas.form.no')}</span></label>
              </fieldset>
              <div className="form-field">
                <label htmlFor="rt-comentarios" className="form-label">{t('rutas.form.comentarios')}</label>
                <textarea id="rt-comentarios" name="comentarios" rows="4" className="form-control" />
              </div>
              <div className="form-field form-consent">
                <label className="form-consent-label">
                  <input
                    type="checkbox" name="privacidad" value="aceptada"
                    aria-describedby="rt-privacidad-info"
                    aria-invalid={errores.privacidad ? 'true' : undefined}
                  />
                  <span>{t('contacto.consentPre')} <L to="/privacidad">{t('contacto.consentLink')}</L>.</span>
                </label>
                {errores.privacidad && <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.privacidad}</p>}
                <p id="rt-privacidad-info" className="form-consent-info">{t('contacto.consentInfo')}</p>
              </div>
              <button type="submit" disabled={state.submitting} className="hn-btn hn-btn--ancho">
                {state.submitting ? t('rutas.form.enviando') : t('rutas.form.enviar')}
              </button>
              <div role="alert"><ValidationError errors={state.errors} className="form-status--error" /></div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
