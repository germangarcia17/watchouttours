import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const INITIAL = { nombre: '', email: '', telefono: '', mensaje: '', privacidad: false }

export default function Contacto() {
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  useEffect(() => { document.title = 'Contacto | WatchOut! Sensory Tours' }, [])

  function validate() {
    const e = {}
    if (!form.nombre.trim() || form.nombre.trim().length < 2)
      e.nombre = 'El nombre debe tener al menos 2 caracteres.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Introduce un correo electrónico válido.'
    if (!form.mensaje.trim() || form.mensaje.trim().length < 20)
      e.mensaje = 'El mensaje debe tener al menos 20 caracteres.'
    if (!form.privacidad)
      e.privacidad = 'Debes aceptar la política de privacidad.'
    return e
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setStatus('loading')
    const { error } = await supabase.from('contact_submissions').insert({
      nombre:   form.nombre,
      email:    form.email,
      telefono: form.telefono || null,
      mensaje:  form.mensaje,
    })

    if (error) {
      setStatus('error')
    } else {
      setStatus('success')
      setForm(INITIAL)
    }
  }

  return (
    <div className="container" style={{ paddingBlock: '3rem' }}>
      <div className="contact-layout">
        <div className="contact-info">
          <h1>Contacto</h1>
          <p>Cuéntanos quién eres, qué tipo de experiencia te imaginas y cualquier necesidad específica.</p>
          <dl className="contact-dl">
            <dt>Correo electrónico</dt>
            <dd><a href="mailto:hola@watchouttours.com">hola@watchouttours.com</a></dd>
            <dt>Tiempo de respuesta</dt>
            <dd>Menos de 48 horas laborables.</dd>
            <dt>Idiomas</dt>
            <dd>Español, inglés y portugués.</dd>
          </dl>
        </div>

        <div>
          <form onSubmit={handleSubmit} noValidate aria-label="Formulario de contacto">
            <Field id="nombre" label="Nombre completo" required error={errors.nombre}>
              <input id="nombre" name="nombre" type="text" autoComplete="name" value={form.nombre} onChange={handleChange} aria-required="true" aria-describedby={errors.nombre ? 'nombre-error' : undefined} className={`form-control${errors.nombre ? ' form-control--error' : ''}`} />
            </Field>

            <Field id="email" label="Correo electrónico" required error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} aria-required="true" aria-describedby={errors.email ? 'email-error' : undefined} className={`form-control${errors.email ? ' form-control--error' : ''}`} />
            </Field>

            <Field id="telefono" label="Teléfono (opcional)" error={errors.telefono}>
              <input id="telefono" name="telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={handleChange} className="form-control" />
            </Field>

            <Field id="mensaje" label="Cuéntanos qué sueñas sentir" required error={errors.mensaje}>
              <textarea id="mensaje" name="mensaje" rows={4} value={form.mensaje} onChange={handleChange} aria-required="true" aria-describedby={errors.mensaje ? 'mensaje-error' : undefined} className={`form-control${errors.mensaje ? ' form-control--error' : ''}`} />
            </Field>

            <div className="form-field">
              <label className="form-checkbox-row">
                <input type="checkbox" name="privacidad" checked={form.privacidad} onChange={handleChange} aria-required="true" aria-describedby={errors.privacidad ? 'privacidad-error' : undefined} />
                <span>
                  He leído y acepto la{' '}
                  <a href="/privacidad">política de privacidad</a>
                  <span aria-hidden="true"> *</span>
                  <span className="sr-only">(obligatorio)</span>
                </span>
              </label>
              {errors.privacidad && <p id="privacidad-error" role="alert" aria-live="assertive" className="form-error"><span aria-hidden="true">⚠</span> {errors.privacidad}</p>}
            </div>

            <button type="submit" disabled={status === 'loading'} className="btn btn--primary btn--wide">
              {status === 'loading' ? 'Enviando…' : 'Enviar mi solicitud'}
            </button>

            {status === 'success' && (
              <p role="status" aria-live="polite" className="form-status form-status--success">
                ✓ Mensaje enviado. Nos pondremos en contacto en menos de 48 horas.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" aria-live="assertive" className="form-status form-status--error">
                <span aria-hidden="true">⚠</span> Ha ocurrido un error. Por favor, inténtalo de nuevo.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ id, label, required, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <><span aria-hidden="true" className="required-marker"> *</span><span className="sr-only">(obligatorio)</span></>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" aria-live="assertive" className="form-error">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  )
}
