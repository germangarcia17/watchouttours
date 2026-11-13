import { useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import '../../styles/pagestyle/Contacto.css'
import '../../styles/pagestyle/HomeNueva.css'
import { ImagenHueco } from '../ImagenHueco'
import { CreditoFoto } from '../CreditoFoto'
import { BotonVideollamada } from '../Videollamada'
import { useSiteImage } from '../../lib/siteImages'
import { L, useLang } from '../../i18n/routing'

/* ── Piezas del sistema editorial ────────────────────────────────────────
 * Las comparten la home (/), Viajes +60 (/sin-prisa) y Más allá de la vista
 * (/mas-alla-de-la-vista). Estilos en HomeNueva.css (prefijo .hn-) y, lo
 * propio de las páginas de colección, en Colecciones.css.
 * ──────────────────────────────────────────────────────────────────────── */

export const WHATSAPP = 'https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20WatchOut%20Tours'

/* Valores que recibe el equipo en el correo (siempre en español). */
export const VIAJES_EQUIPO = {
  'gran-viaje': 'El Gran Viaje (1 – 15 de marzo de 2027)',
  'viajes-60': 'Viajes +60',
  'personas-ciegas': 'Viajes para personas ciegas y con baja visión',
  'privado': 'Viaje en privado',
  'no-se': 'Aún no lo sé',
}

export const dos = n => String(n).padStart(2, '0')

/* Texto con marcas: <i>…</i> pasa a Fraunces cursiva, <br/> a salto de
   línea y, si se pasan, otros componentes (p. ej. un enlace en <l>). */
export function Texto({ k, components }) {
  return <Trans i18nKey={k} components={{ i: <span className="hn-it" />, br: <br />, ...components }} />
}

/* Etiqueta de sección con su filete de 40 px */
export function Etiqueta({ children, clara, className = '' }) {
  return <p className={`hn-lbl${clara ? ' hn-lbl--clara' : ''} ${className}`.trim()}>{children}</p>
}

/* Foto de un hueco de /admin/imagenes. El contenedor se pinta siempre: sin
   foto es el bloque gris de la maqueta.
   Crédito (fotos de Tourism New Zealand): justo debajo del borde inferior,
   fuera del área de la imagen y alineado a la derecha. "sangre": foto a
   todo el ancho, el crédito se alinea con el margen de la página. "tono":
   "oscuro" si lo que sigue a la foto es una banda oscura.
   `defecto`: { src, srcSet, width, height } o null (la foto se sube desde
   el admin). `credito`: el de por defecto mientras la fila del admin no
   tenga uno guardado. */
export function FotoHueco({
  seccion, clave, defecto, alt, credito = '', sizes, className = '', prioritaria,
  children, tono = 'claro', sangre = false, sinCredito = false,
}) {
  const img = useSiteImage(seccion, clave, defecto?.src ?? null, '', credito)
  return (
    <div className={`hn-foto ${className}`.trim()}>
      <ImagenHueco
        seccion={seccion} clave={clave} defecto={defecto} alt={alt}
        sizes={sizes} prioritaria={prioritaria}
      />
      {children}
      {img.src && !sinCredito && (
        <CreditoFoto credito={img.credito} tono={tono} className={`hn-foto__credito${sangre ? ' hn-foto__credito--sangre' : ''}`} />
      )}
    </div>
  )
}

/* ── Formulario para pedir el itinerario (Formspree) ──────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEL_RE = /^\+?[\d\s().-]{7,20}$/
const SPAM_DELAY_MS = 60_000

/* Solo el formulario (con su mensaje de enviado). `viaje` es la opción
   elegida en el desplegable; cada página puede dejar una preseleccionada. */
export function FormularioItinerario({ viaje, setViaje }) {
  const { t } = useTranslation()
  const lang = useLang()
  const [state, enviarFormspree] = useForm('xykqrkjq')
  const [errores, setErrores] = useState({})
  const [contacto, setContacto] = useState('')
  const exitoRef = useRef(null)
  const opciones = t('home.itinerario.opciones', { returnObjects: true })

  useEffect(() => {
    if (state.succeeded) exitoRef.current?.focus()
  }, [state.succeeded])

  function enviar(e) {
    e.preventDefault()
    let ultimo = 0
    try { ultimo = Number(localStorage.getItem('wot_last_submit') || 0) } catch { /* sin almacenamiento */ }
    if (Date.now() - ultimo < SPAM_DELAY_MS) { setErrores({ _spam: t('contacto.err.spam') }); return }
    const datos = new FormData(e.target)
    const err = {}
    if ((datos.get('nombre') ?? '').trim().length < 2) err.nombre = t('home.itinerario.errNombre')
    const c = (datos.get('contacto') ?? '').trim()
    if (!EMAIL_RE.test(c) && !TEL_RE.test(c)) err.contacto = t('home.itinerario.errContacto')
    if (!datos.get('viaje')) err.viaje = t('home.itinerario.errViaje')
    if (!datos.get('privacidad')) err.privacidad = t('contacto.err.privacidad')
    if (Object.keys(err).length) {
      setErrores(err)
      requestAnimationFrame(() => e.target.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setErrores({})
    try { localStorage.setItem('wot_last_submit', String(Date.now())) } catch { /* sin almacenamiento */ }
    enviarFormspree(e)
  }

  const clase = campo => `form-control${errores[campo] ? ' form-control--error' : ''}`
  const describe = (...ids) => ids.filter(Boolean).join(' ') || undefined
  const esEmail = EMAIL_RE.test(contacto.trim())

  return (
    <div className="hn-itinerario__form">
      <p
        ref={exitoRef} tabIndex={-1} role="status" aria-live="polite" aria-atomic="true"
        className={state.succeeded ? 'form-status--success' : 'sr-only'}
      >
        {state.succeeded ? t('home.itinerario.exito') : ''}
      </p>

      {!state.succeeded && (
        <form onSubmit={enviar} noValidate aria-label={t('home.itinerario.formAria')}>
          <input type="hidden" name="_subject" value="Solicitud de itinerario" />
          <input type="hidden" name="idioma" value={lang === 'en' ? 'Inglés' : 'Español'} />
          {/* Si el contacto es un correo, Formspree lo usa para "Responder a" */}
          {esEmail && <input type="hidden" name="_replyto" value={contacto.trim()} />}
          <div aria-hidden="true" style={{ display: 'none' }}>
            <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {errores._spam && <p role="alert" className="form-error form-error--group"><span aria-hidden="true">⚠ </span>{errores._spam}</p>}

          <div className="form-field">
            <label htmlFor="itinerario-nombre" className="form-label">
              {t('home.itinerario.nombre')}
              <span aria-hidden="true" className="required-marker"> *</span>
              <span className="sr-only">{t('contacto.requiredSr')}</span>
            </label>
            <input
              id="itinerario-nombre" name="nombre" type="text" autoComplete="name"
              aria-required="true" aria-invalid={!!errores.nombre}
              aria-describedby={describe(errores.nombre && 'itinerario-nombre-err')}
              className={clase('nombre')}
            />
            {errores.nombre && <p id="itinerario-nombre-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.nombre}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="itinerario-contacto" className="form-label">
              {t('home.itinerario.contacto')}
              <span aria-hidden="true" className="required-marker"> *</span>
              <span className="sr-only">{t('contacto.requiredSr')}</span>
            </label>
            <p id="itinerario-contacto-ayuda" className="hn-ayuda">{t('home.itinerario.contactoAyuda')}</p>
            <input
              id="itinerario-contacto" name="contacto" type="text" autoComplete="on"
              value={contacto} onChange={e => setContacto(e.target.value)}
              aria-required="true" aria-invalid={!!errores.contacto}
              aria-describedby={describe('itinerario-contacto-ayuda', errores.contacto && 'itinerario-contacto-err')}
              className={clase('contacto')}
            />
            {errores.contacto && <p id="itinerario-contacto-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.contacto}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="itinerario-viaje" className="form-label">
              {t('home.itinerario.viaje')}
              <span aria-hidden="true" className="required-marker"> *</span>
              <span className="sr-only">{t('contacto.requiredSr')}</span>
            </label>
            <select
              id="itinerario-viaje" name="viaje" value={viaje} onChange={e => setViaje(e.target.value)}
              aria-required="true" aria-invalid={!!errores.viaje}
              aria-describedby={describe(errores.viaje && 'itinerario-viaje-err')}
              className={`${clase('viaje')} hn-select`}
            >
              <option value="">{t('home.itinerario.viajeElige')}</option>
              {Object.keys(VIAJES_EQUIPO).map(clave => (
                <option key={clave} value={clave}>{opciones[clave]}</option>
              ))}
            </select>
            {/* El equipo recibe el nombre del viaje en español */}
            <input type="hidden" name="viaje_elegido" value={VIAJES_EQUIPO[viaje] ?? ''} />
            {errores.viaje && <p id="itinerario-viaje-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.viaje}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="itinerario-fechas" className="form-label">
              {t('home.itinerario.fechas')} <span className="form-optional">{t('home.itinerario.opcional')}</span>
            </label>
            <p id="itinerario-fechas-ayuda" className="hn-ayuda">{t('home.itinerario.fechasEjemplo')}</p>
            <input
              id="itinerario-fechas" name="fechas" type="text" autoComplete="off"
              aria-describedby="itinerario-fechas-ayuda" className="form-control"
            />
          </div>

          <div className="form-field form-consent">
            <label className="form-consent-label">
              <input
                type="checkbox" name="privacidad" value="aceptada"
                aria-describedby="itinerario-privacidad-info"
                aria-invalid={errores.privacidad ? 'true' : undefined}
              />
              <span>{t('contacto.consentPre')} <L to="/privacidad">{t('contacto.consentLink')}</L>.</span>
            </label>
            {errores.privacidad && <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.privacidad}</p>}
            <p id="itinerario-privacidad-info" className="form-consent-info">{t('contacto.consentInfo')}</p>
          </div>

          <button type="submit" disabled={state.submitting} className="hn-btn hn-btn--ancho">
            {state.submitting ? t('home.itinerario.enviando') : t('home.itinerario.enviar')}
          </button>
          <p className="hn-ayuda hn-itinerario__respuesta">{t('home.itinerario.respuesta')}</p>
          <div role="alert">
            <ValidationError errors={state.errors} className="form-status--error" />
          </div>
        </form>
      )}
    </div>
  )
}

/* Bloque de la home: texto, videollamada y WhatsApp a la izquierda y el
   formulario a la derecha. */
export function PedirItinerario({ viaje, setViaje }) {
  const { t } = useTranslation()
  return (
    <section id="itinerario" className="hn-sec hn-itinerario-sec" aria-labelledby="hn-itinerario-titulo">
      <div className="hn-itinerario">
        <div className="hn-itinerario__texto">
          <h2 id="hn-itinerario-titulo" className="hn-h2">{t('home.itinerario.titulo')}</h2>
          <p className="hn-body hn-body--primero">{t('home.itinerario.texto')}</p>
          <p className="hn-body hn-itinerario__llamada">{t('home.itinerario.videollamadaLinea')}</p>
          <div className="hn-botones hn-itinerario__botones">
            <BotonVideollamada className="hn-btn hn-btn--tinta" />
          </div>
          <a href={WHATSAPP} className="hn-lnk hn-lnk--verde" target="_blank" rel="noopener noreferrer">
            {t('home.itinerario.whatsapp')}
            <span className="sr-only"> {t('common.newTab')}</span>
          </a>
        </div>
        <FormularioItinerario viaje={viaje} setViaje={setViaje} />
      </div>
    </section>
  )
}
