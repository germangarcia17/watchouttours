import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import { L, useLang } from '../i18n/routing'
import '../styles/pagestyle/Contacto.css'

/* ── Solicitud de la ruta en PDF ─────────────────────────────────────────
 * Sustituye al mapa de la ruta: en vez de enseñar el itinerario en la web,
 * quien lo quiera deja su nombre y su correo y el equipo le envía el PDF.
 *
 * Usa el mismo formulario de Formspree que /contacto, con el asunto
 * "Solicitud de la ruta en PDF" para distinguirlo en el correo. La ruta
 * pedida y el idioma van siempre en español, para el equipo.
 *
 * `viaje`: 'viajes-60' o 'personas-ciegas' si la página ya lo deja claro;
 * sin él, se pregunta qué ruta quiere recibir.
 * ──────────────────────────────────────────────────────────────────────── */
const FORMSPREE_ID = 'xykqrkjq'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SPAM_DELAY_MS = 60_000
const RUTA_PARA_EL_EQUIPO = {
  'viajes-60': 'Viajes +60',
  'personas-ciegas': 'Viajes para personas ciegas y con baja visión',
}

export function SolicitudRuta({ viaje, className = 'band-cream' }) {
  const { t } = useTranslation()
  const lang = useLang()
  const [state, enviarFormspree] = useForm(FORMSPREE_ID)
  const [errores, setErrores] = useState({})
  const exitoRef = useRef(null)
  const id = viaje ? `ruta-${viaje}` : 'ruta'
  const opciones = t('rutaPdf.opciones', { returnObjects: true })

  useEffect(() => {
    if (state.succeeded) exitoRef.current?.focus()
  }, [state.succeeded])

  function validar(datos) {
    const e = {}
    if (!datos.get('nombre')?.trim() || datos.get('nombre').trim().length < 2) e.nombre = t('contacto.err.nombre')
    if (!EMAIL_RE.test(datos.get('email')?.trim() ?? '')) e.email = t('rutaPdf.errEmail')
    if (!datos.get('ruta')) e.ruta = t('rutaPdf.errViaje')
    if (!datos.get('privacidad')) e.privacidad = t('contacto.err.privacidad')
    return e
  }

  function enviar(e) {
    e.preventDefault()
    let ultimo = 0
    try { ultimo = Number(localStorage.getItem('wot_last_submit') || 0) } catch { /* sin almacenamiento */ }
    if (Date.now() - ultimo < SPAM_DELAY_MS) {
      setErrores({ _spam: t('contacto.err.spam') })
      return
    }
    const datos = new FormData(e.target)
    const errs = validar(datos)
    if (Object.keys(errs).length) {
      setErrores(errs)
      // Foco en el primer campo con error (tras pintar los mensajes)
      requestAnimationFrame(() => e.target.querySelector('[aria-invalid="true"]')?.focus())
      return
    }
    setErrores({})
    try { localStorage.setItem('wot_last_submit', String(Date.now())) } catch { /* sin almacenamiento */ }
    enviarFormspree(e)
  }

  const clase = campo => `form-control${errores[campo] ? ' form-control--error' : ''}`

  return (
    <section className={`ruta-pdf ${className}`.trim()} aria-labelledby={`${id}-titulo`}>
      <div className="wrap ruta-pdf__grid">
        <div className="ruta-pdf__texto">
          <p className="sec-eyebrow">{t('rutaPdf.eyebrow')}</p>
          <h2 id={`${id}-titulo`} className="sec-title">{t('rutaPdf.titulo')}</h2>
          <p className="sec-sub">{t('rutaPdf.texto')}</p>
        </div>

        <div className="ruta-pdf__tarjeta">
          {/* Región viva siempre presente para anunciar el éxito */}
          <p
            ref={exitoRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={state.succeeded ? 'form-status--success' : 'sr-only'}
          >
            {state.succeeded ? t('rutaPdf.exito') : ''}
          </p>

          {!state.succeeded && (
            <form onSubmit={enviar} noValidate aria-label={t('rutaPdf.formAria')}>
              <input type="hidden" name="_subject" value="Solicitud de la ruta en PDF" />
              <input type="hidden" name="idioma" value={lang === 'en' ? 'Inglés' : 'Español'} />
              <div aria-hidden="true" style={{ display: 'none' }}>
                <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              {errores._spam && (
                <p role="alert" className="form-error form-error--group"><span aria-hidden="true">⚠ </span>{errores._spam}</p>
              )}

              <div className="form-field">
                <label htmlFor={`${id}-nombre`} className="form-label">
                  {t('rutaPdf.nombre')}
                  <span aria-hidden="true" className="required-marker"> *</span>
                  <span className="sr-only">{t('contacto.requiredSr')}</span>
                </label>
                <input
                  id={`${id}-nombre`} name="nombre" type="text" autoComplete="given-name"
                  aria-required="true" aria-invalid={!!errores.nombre}
                  aria-describedby={errores.nombre ? `${id}-nombre-err` : undefined}
                  className={clase('nombre')}
                />
                {errores.nombre && <p id={`${id}-nombre-err`} role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.nombre}</p>}
              </div>

              <div className="form-field">
                <label htmlFor={`${id}-email`} className="form-label">
                  {t('rutaPdf.email')}
                  <span aria-hidden="true" className="required-marker"> *</span>
                  <span className="sr-only">{t('contacto.requiredSr')}</span>
                </label>
                <input
                  id={`${id}-email`} name="email" type="email" autoComplete="email"
                  aria-required="true" aria-invalid={!!errores.email}
                  aria-describedby={errores.email ? `${id}-email-err` : undefined}
                  className={clase('email')}
                />
                {errores.email && <p id={`${id}-email-err`} role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.email}</p>}
                <ValidationError field="email" errors={state.errors} className="form-error" />
              </div>

              {viaje ? (
                <input type="hidden" name="ruta" value={RUTA_PARA_EL_EQUIPO[viaje]} />
              ) : (
                <fieldset className="form-field" aria-describedby={errores.ruta ? `${id}-ruta-err` : undefined}>
                  <legend className="form-label">
                    {t('rutaPdf.viajeLegend')}
                    <span aria-hidden="true" className="required-marker"> *</span>
                    <span className="sr-only">{t('contacto.requiredSr')}</span>
                  </legend>
                  <div className="form-radio-group">
                    {Object.entries(RUTA_PARA_EL_EQUIPO).map(([clave, valor]) => (
                      <label key={clave} className="form-radio-label">
                        <input type="radio" name="ruta" value={valor} aria-invalid={!!errores.ruta} />
                        {opciones[clave]}
                      </label>
                    ))}
                  </div>
                  {errores.ruta && <p id={`${id}-ruta-err`} role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.ruta}</p>}
                </fieldset>
              )}

              <div className="form-field form-consent">
                <label className="form-consent-label">
                  <input
                    type="checkbox" name="privacidad" value="aceptada"
                    aria-describedby={`${id}-privacidad-info`}
                    aria-invalid={errores.privacidad ? 'true' : undefined}
                  />
                  <span>{t('contacto.consentPre')} <L to="/privacidad">{t('contacto.consentLink')}</L>.</span>
                </label>
                {errores.privacidad && <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errores.privacidad}</p>}
                <p id={`${id}-privacidad-info`} className="form-consent-info">{t('contacto.consentInfo')}</p>
              </div>

              <button type="submit" disabled={state.submitting} className="btn btn-solid btn--wide">
                {state.submitting ? t('rutaPdf.enviando') : t('rutaPdf.enviar')}
              </button>

              <div role="alert">
                <ValidationError errors={state.errors} className="form-status--error" />
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
