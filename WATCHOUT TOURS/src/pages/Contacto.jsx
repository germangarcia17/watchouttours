import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import { L } from '../i18n/routing'
import '../styles/pagestyle/Contacto.css'

const PHONE_RE = /^[+\d][\d\s\-().]{4,19}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SPAM_DELAY_MS = 60_000 // 1 minuto entre envíos

export default function Contacto() {
  const { t } = useTranslation()
  const [state, handleFormspreeSubmit] = useForm('xykqrkjq')
  const [errors, setErrors] = useState({})
  const successRef = useRef(null)

  useEffect(() => { document.title = t('contacto.docTitle') }, [t])

  // Al enviarse con éxito, movemos el foco al mensaje de confirmación para
  // que el lector de pantalla lo lea (además de la región aria-live).
  useEffect(() => {
    if (state.succeeded) successRef.current?.focus()
  }, [state.succeeded])

  const canales = t('contacto.canalesOpciones', { returnObjects: true })
  const tiposViaje = t('contacto.tiposViaje', { returnObjects: true })

  function validate(data) {
    const e = {}
    if (!data.get('nombre')?.trim() || data.get('nombre').trim().length < 2)
      e.nombre = t('contacto.err.nombre')

    const tel   = data.get('telefono')?.trim()
    const email = data.get('email')?.trim()
    if (!tel && !email)
      e.contacto = t('contacto.err.contacto')
    if (tel && !PHONE_RE.test(tel))
      e.telefono = t('contacto.err.telefono')
    if (email && !EMAIL_RE.test(email))
      e.email = t('contacto.err.email')

    if (!data.get('canal'))
      e.canal = t('contacto.err.canal')

    if (!data.get('privacidad'))
      e.privacidad = t('contacto.err.privacidad')

    return e
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Rate limit antispam
    const last = Number(localStorage.getItem('wot_last_submit') || 0)
    if (Date.now() - last < SPAM_DELAY_MS) {
      setErrors({ _spam: t('contacto.err.spam') })
      return
    }

    const data = new FormData(e.target)
    const errs = validate(data)
    if (Object.keys(errs).length) {
      setErrors(errs)
      // Foco en el primer campo con error
      const first = e.target.querySelector('[aria-invalid="true"], .form-control--error')
      first?.focus()
      return
    }

    setErrors({})
    localStorage.setItem('wot_last_submit', String(Date.now()))
    handleFormspreeSubmit(e)
  }

  function fieldClass(name) {
    return `form-control${errors[name] ? ' form-control--error' : ''}`
  }

  return (
    <>
      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="contacto-hero">
        <div className="dots-texture"></div>
        <div className="wrap contacto-hero-inner">
          <span className="sec-eyebrow" aria-hidden="true">{t('contacto.eyebrow')}</span>
          <h1 className="contacto-titulo">{t('contacto.title')}</h1>
          <p className="contacto-intro">
            {t('contacto.intro1')} <strong>{t('contacto.introStrong')}</strong> {t('contacto.intro2')}&nbsp;😊
          </p>
        </div>
      </section>

      {/* ── Canales ──────────────────────────────────── */}
      <section className="contacto-canales-section">
        <div className="wrap contacto-canales">
          <a
            href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20información%20sobre%20los%20viajes%20de%20WatchOut!"
            className="canal-card canal-card--whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="canal-card__icono" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z"/>
              </svg>
            </span>
            <div>
              <span className="canal-card__titulo">WhatsApp</span>
              <span className="canal-card__desc">{t('contacto.canalWhatsappDesc')}</span>
            </div>
          </a>

          <a href="mailto:info@watchouttours.nz" className="canal-card canal-card--email">
            <span className="canal-card__icono" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </span>
            <div>
              <span className="canal-card__titulo">{t('contacto.canalEmail')}</span>
              <span className="canal-card__desc">{t('contacto.canalEmailDesc')}</span>
            </div>
          </a>
        </div>
      </section>

      {/* ── Formulario ───────────────────────────────── */}
      <section className="contacto-form-section">
        <div className="wrap contacto-form-wrap">
          <div className="contacto-form-card">
            <h2 className="contacto-form-titulo">{t('contacto.formTitle')}</h2>

            {/* Región viva SIEMPRE presente en el DOM: así, cuando su contenido
                pasa de vacío al mensaje de éxito, el lector de pantalla lo
                anuncia. (Si se montara solo al enviar, no se anunciaría.) */}
            <p
              ref={successRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={state.succeeded ? 'form-status--success' : 'sr-only'}
            >
              {state.succeeded ? t('contacto.success') : ''}
            </p>

            {!state.succeeded && (
              <form onSubmit={handleSubmit} aria-label={t('contacto.formAria')}>
                <span className="sr-only">{t('contacto.formStartSr')}</span>


                {/* Honeypot antibot */}
                <div aria-hidden="true" style={{ display: 'none' }}>
                  <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {errors._spam && (
                  <p role="alert" aria-live="assertive" className="form-error form-error--group">
                    <span aria-hidden="true">⚠ </span>{errors._spam}
                  </p>
                )}

                {/* Nombre */}
                <div className="form-field">
                  <label htmlFor="nombre" className="form-label">
                    {t('contacto.nombreLabel')}
                    <span aria-hidden="true" className="required-marker"> *</span>
                    <span className="sr-only">{t('contacto.requiredSr')}</span>
                  </label>
                  <input
                    id="nombre" name="nombre" type="text" autoComplete="given-name"
                    aria-required="true"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? 'nombre-err' : undefined}
                    className={fieldClass('nombre')}
                  />
                  {errors.nombre && <p id="nombre-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errors.nombre}</p>}
                  <ValidationError field="nombre" errors={state.errors} className="form-error" />
                </div>

                {/* Teléfono + Email (al menos uno obligatorio) */}
                <div className="form-field-group">
                  <div className="form-field">
                    <label htmlFor="telefono" className="form-label">
                      {t('contacto.telefonoLabel')}
                      <span className="form-optional"> {t('contacto.atLeastOne')}</span>
                    </label>
                    <input
                      id="telefono" name="telefono" type="tel"
                      placeholder={t('contacto.telefonoPlaceholder')}
                      autoComplete="tel"
                      aria-invalid={!!errors.telefono}
                      aria-describedby={errors.telefono ? 'tel-err' : undefined}
                      className={fieldClass('telefono')}
                    />
                    {errors.telefono && <p id="tel-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errors.telefono}</p>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      {t('contacto.emailLabel')}
                      <span className="form-optional"> {t('contacto.atLeastOne')}</span>
                    </label>
                    <input
                      id="email" name="email" type="text"
                      placeholder="tu@email.com"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-err' : undefined}
                      className={fieldClass('email')}
                    />
                    {errors.email && <p id="email-err" role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errors.email}</p>}
                  </div>

                  {errors.contacto && (
                    <p role="alert" aria-live="assertive" className="form-error form-error--group">
                      <span aria-hidden="true">⚠ </span>{errors.contacto}
                    </p>
                  )}
                </div>

                {/* Canal preferido */}
                <fieldset className="form-field">
                  <legend className="form-label">
                    {t('contacto.canalLegend')}
                    <span aria-hidden="true" className="required-marker"> *</span>
                    <span className="sr-only">{t('contacto.requiredSr')}</span>
                  </legend>
                  <div className="form-radio-group">
                    {canales.map(op => (
                      <label key={op} className="form-radio-label">
                        <input type="radio" name="canal" value={op} />
                        {op}
                      </label>
                    ))}
                  </div>
                  {errors.canal && <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errors.canal}</p>}
                </fieldset>

                {/* Tipo de viaje */}
                <fieldset className="form-field">
                  <legend className="form-label">
                    {t('contacto.tipoLegend')} <span className="form-optional">{t('contacto.optional')}</span>
                  </legend>
                  <div className="form-radio-group">
                    {tiposViaje.map(op => (
                      <label key={op} className="form-radio-label">
                        <input type="radio" name="tipo_viaje" value={op} />
                        {op}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Texto libre */}
                <div className="form-field form-field--textarea">
                  <label htmlFor="mensaje" className="form-label">
                    {t('contacto.mensajeLabel')} <span className="form-optional">{t('contacto.mensajeOptional')}</span>
                  </label>
                  <textarea id="mensaje" name="mensaje" rows={4} placeholder={t('contacto.mensajePlaceholder')} className="form-control" />
                </div>

                {/* Consentimiento de privacidad (RGPD) */}
                <div className="form-field form-consent">
                  <label className="form-consent-label">
                    <input
                      type="checkbox"
                      name="privacidad"
                      value="aceptada"
                      aria-describedby="privacidad-info"
                      aria-invalid={errors.privacidad ? 'true' : undefined}
                    />
                    <span>{t('contacto.consentPre')} <L to="/privacidad">{t('contacto.consentLink')}</L>.</span>
                  </label>
                  {errors.privacidad && (
                    <p role="alert" className="form-error"><span aria-hidden="true">⚠ </span>{errors.privacidad}</p>
                  )}
                  <p id="privacidad-info" className="form-consent-info">
                    {t('contacto.consentInfo')}
                  </p>
                </div>

                <button type="submit" disabled={state.submitting} className="btn btn-solid btn--wide">
                  {state.submitting ? t('contacto.submitting') : t('contacto.submit')}
                </button>

                <ValidationError errors={state.errors} className="form-status--error" />
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
