import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { Seo } from '../components/Seo'
import { L, useLang } from '../i18n/routing'
import { SITE_URL } from '../lib/site'
import { useSiteImage } from '../lib/siteImages'
import {
  SESIONES, REGIONES, CONTACTO, RUTA_CHARLA, GRABACION_ACTIVADA, etiquetaSesion, finUtc,
} from '../config/charla'
import imgNosotras from '../images/sobre-nosotras.webp'
import ogImg from '../images/blind-travel-hero-farm-og.jpg'
import '../styles/pagestyle/Contacto.css'
import '../styles/pagestyle/Charla.css'

const OG_URL = `${SITE_URL}${ogImg}`
const ENDPOINT = '/.netlify/functions/charla-inscripcion'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ANCLA_FORM = 'inscripcion'

/* Datos estructurados: un Event online por sesión. */
function eventosJsonLd(lang, t) {
  const pageUrl = `${SITE_URL}${lang === 'en' ? `/en${RUTA_CHARLA}` : RUTA_CHARLA}`
  return {
    '@context': 'https://schema.org',
    '@graph': SESIONES.map(s => ({
      '@type': 'Event',
      '@id': `${pageUrl}#sesion-${s.id}`,
      name: t('charla.title'),
      description: t('charla.intro'),
      startDate: s.inicioUtc,
      endDate: finUtc(s),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: { '@type': 'VirtualLocation', url: pageUrl },
      inLanguage: 'es',
      isAccessibleForFree: true,
      image: OG_URL,
      organizer: { '@id': `${SITE_URL}/#organization` },
      offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${pageUrl}#${ANCLA_FORM}` },
    })),
  }
}

/* Botón «Inscribirme a la charla gratuita». Es un enlace al formulario que,
   además del salto, mueve el foco al encabezado del formulario para que el
   lector de pantalla y el teclado continúen desde allí. */
function BotonInscripcion({ t }) {
  function irAlFormulario(e) {
    const destino = document.getElementById(`${ANCLA_FORM}-titulo`)
    if (!destino) return
    e.preventDefault()
    destino.scrollIntoView({ block: 'start' })
    destino.focus({ preventScroll: true })
    history.replaceState(null, '', `#${ANCLA_FORM}`)
  }
  return (
    <a href={`#${ANCLA_FORM}`} className="btn btn-solid ch-cta" onClick={irAlFormulario}>
      {t('charla.cta')}
    </a>
  )
}

/* Hora de inicio en la zona horaria del dispositivo, calculada a partir del
   instante UTC. Solo en el cliente (en el HTML prerenderizado no se sabe la
   zona de quien visita), tras el montaje para no romper la hidratación. */
function HoraLocal({ lang, t }) {
  const [items, setItems] = useState(null)
  useEffect(() => {
    try {
      const locale = lang === 'en' ? 'en-GB' : 'es-ES'
      const fecha = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' })
      const hora = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' })
      setItems(SESIONES.map(s => {
        const d = new Date(s.inicioUtc)
        return { id: s.id, fecha: fecha.format(d), hora: hora.format(d) }
      }))
    } catch {
      setItems(null)
    }
  }, [lang])
  if (!items) return null
  return (
    <div className="ch-hora-local">
      <p>{t('charla.horario.local')}</p>
      <ul>
        {items.map(i => <li key={i.id}>{t('charla.horario.localItem', { fecha: i.fecha, hora: i.hora })}</li>)}
      </ul>
    </div>
  )
}

function validar(data, t) {
  const e = {}
  if (data.nombre.trim().length < 2) e.nombre = t('charla.form.err.nombre')
  if (!EMAIL_RE.test(data.email.trim())) e.email = t('charla.form.err.email')
  if (!data.sesion) e.sesion = t('charla.form.err.sesion')
  if (data.pregunta.length > 1000) e.pregunta = t('charla.form.err.pregunta')
  return e
}

const CAMPOS = ['nombre', 'email', 'sesion', 'pregunta']

function Formulario({ lang, t }) {
  const [abiertas, setAbiertas] = useState(SESIONES)
  const [errores, setErrores] = useState({})
  const [estado, setEstado] = useState('inicial') // inicial | enviando | ok | fallo
  const [fallo, setFallo] = useState(null)
  const resumenRef = useRef(null)
  const okRef = useRef(null)
  const falloRef = useRef(null)

  // Las sesiones que ya han empezado dejan de ofrecerse (el servidor también
  // las rechaza).
  useEffect(() => {
    setAbiertas(SESIONES.filter(s => Date.now() < Date.parse(s.inicioUtc)))
  }, [])

  useEffect(() => {
    if (estado === 'ok') okRef.current?.focus()
    if (estado === 'fallo') falloRef.current?.focus()
  }, [estado])

  async function onSubmit(e) {
    e.preventDefault()
    if (estado === 'enviando') return
    const fd = new FormData(e.currentTarget)
    const data = {
      nombre: String(fd.get('nombre') ?? ''),
      email: String(fd.get('email') ?? ''),
      sesion: String(fd.get('sesion') ?? ''),
      pregunta: String(fd.get('pregunta') ?? '').trim(),
      noticias: fd.get('noticias') === 'si',
      idioma: lang,
      web: String(fd.get('web') ?? ''),
    }

    const errs = validar(data, t)
    setErrores(errs)
    setFallo(null)
    if (Object.keys(errs).length) {
      setEstado('inicial')
      // El resumen de errores recibe el foco: el lector lo lee entero y
      // cada error enlaza a su campo.
      requestAnimationFrame(() => resumenRef.current?.focus())
      return
    }

    setEstado('enviando')
    let res = null
    let body = null
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      body = await res.json().catch(() => null)
    } catch {
      body = null
    }

    if (res?.ok && body?.ok) {
      setEstado('ok')
      return
    }

    if (body?.error === 'validacion' && body.campos?.length) {
      const errsServidor = {}
      for (const c of body.campos) if (CAMPOS.includes(c)) errsServidor[c] = t(`charla.form.err.${c}`)
      if (Object.keys(errsServidor).length) {
        setErrores(errsServidor)
        setEstado('inicial')
        requestAnimationFrame(() => resumenRef.current?.focus())
        return
      }
    }

    const motivo = {
      email: 'charla.form.fallo.email',
      sesion_cerrada: 'charla.form.fallo.cerrada',
      no_activa: 'charla.form.fallo.noActiva',
    }[body?.error] ?? 'charla.form.fallo.generico'
    setFallo(t(motivo))
    setEstado('fallo')
  }

  if (estado === 'ok') {
    return (
      <div ref={okRef} tabIndex={-1} role="status" className="form-status--success ch-ok">
        <p>{t('charla.form.success')}</p>
        <p className="ch-ok__nota">{t('charla.form.successNota')}</p>
      </div>
    )
  }

  if (!abiertas.length) {
    return <p className="ch-cerrada">{t('charla.form.sinSesiones')} <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a></p>
  }

  const listaErrores = CAMPOS.filter(c => errores[c])
  const descr = (campo, extra) => [extra, errores[campo] ? `ch-${campo}-err` : null].filter(Boolean).join(' ') || undefined
  const ctl = campo => `form-control${errores[campo] ? ' form-control--error' : ''}`

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${ANCLA_FORM}-titulo`} className="ch-form">
      {listaErrores.length > 0 && (
        <div ref={resumenRef} tabIndex={-1} role="alert" className="form-error--group ch-resumen">
          <p className="ch-resumen__titulo">{t('charla.form.errResumen')}</p>
          <ul>
            {listaErrores.map(c => (
              <li key={c}><a href={`#ch-${c === 'sesion' ? `sesion-${abiertas[0].id}` : c}`}>{errores[c]}</a></li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot antibot: oculto para personas y lectores de pantalla */}
      <div aria-hidden="true" className="ch-honeypot">
        <label htmlFor="ch-web">Web</label>
        <input id="ch-web" name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-field">
        <label htmlFor="ch-nombre" className="form-label">
          {t('charla.form.nombre')} <span className="ch-req">{t('charla.form.obligatorio')}</span>
        </label>
        <input
          id="ch-nombre" name="nombre" type="text" autoComplete="name" required maxLength={100}
          aria-invalid={errores.nombre ? 'true' : undefined}
          aria-describedby={descr('nombre')}
          className={ctl('nombre')}
        />
        {errores.nombre && <p id="ch-nombre-err" className="form-error"><span aria-hidden="true">⚠ </span>{errores.nombre}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="ch-email" className="form-label">
          {t('charla.form.email')} <span className="ch-req">{t('charla.form.obligatorio')}</span>
        </label>
        <p id="ch-email-hint" className="ch-hint">{t('charla.form.emailHint')}</p>
        <input
          id="ch-email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254}
          aria-invalid={errores.email ? 'true' : undefined}
          aria-describedby={descr('email', 'ch-email-hint')}
          className={ctl('email')}
        />
        {errores.email && <p id="ch-email-err" className="form-error"><span aria-hidden="true">⚠ </span>{errores.email}</p>}
      </div>

      <fieldset
        className="form-field ch-sesiones"
        aria-describedby={descr('sesion', 'ch-sesion-hint')}
      >
        <legend className="form-label">
          {t('charla.form.sesionLegend')} <span className="ch-req">{t('charla.form.obligatorio')}</span>
        </legend>
        <p id="ch-sesion-hint" className="ch-hint">{t('charla.form.sesionHint')}</p>
        <div className="ch-radios">
          {abiertas.map(s => (
            <label key={s.id} className="form-radio-label ch-radio" htmlFor={`ch-sesion-${s.id}`}>
              <input type="radio" id={`ch-sesion-${s.id}`} name="sesion" value={s.id} required />
              {etiquetaSesion(s, lang)}
            </label>
          ))}
        </div>
        {errores.sesion && <p id="ch-sesion-err" className="form-error"><span aria-hidden="true">⚠ </span>{errores.sesion}</p>}
      </fieldset>

      <div className="form-field form-field--textarea">
        <label htmlFor="ch-pregunta" className="form-label">
          {t('charla.form.pregunta')} <span className="form-optional">{t('charla.form.opcional')}</span>
        </label>
        <textarea
          id="ch-pregunta" name="pregunta" rows={4} maxLength={1000}
          aria-invalid={errores.pregunta ? 'true' : undefined}
          aria-describedby={descr('pregunta')}
          className={ctl('pregunta')}
        />
        {errores.pregunta && <p id="ch-pregunta-err" className="form-error"><span aria-hidden="true">⚠ </span>{errores.pregunta}</p>}
      </div>

      <div className="form-field form-consent">
        <label className="form-consent-label" htmlFor="ch-noticias">
          <input type="checkbox" id="ch-noticias" name="noticias" value="si" />
          <span>{t('charla.form.noticias')} <span className="form-optional">{t('charla.form.opcional')}</span></span>
        </label>
      </div>

      <p className="ch-privacidad">
        {t('charla.form.privacidadPre')} <L to="/privacidad">{t('charla.form.privacidadLink')}</L>.
      </p>

      <button type="submit" className="btn btn-solid btn--wide" aria-disabled={estado === 'enviando' ? 'true' : undefined}>
        {estado === 'enviando' ? t('charla.form.enviando') : t('charla.form.submit')}
      </button>

      {/* Región viva siempre presente: anuncia «Enviando…» */}
      <p role="status" className="sr-only">{estado === 'enviando' ? t('charla.form.enviando') : ''}</p>

      {estado === 'fallo' && (
        <div ref={falloRef} tabIndex={-1} role="alert" className="form-error--group ch-fallo">
          <p className="ch-fallo__titulo">{t('charla.form.fallo.titulo')} {fallo}</p>
          <p>{t('charla.form.fallo.contacto')}</p>
          <ul>
            <li><a href={`mailto:${CONTACTO.email}`}>{t('charla.entrar.ayudaEmail')}</a></li>
            <li>
              <a href={CONTACTO.whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t('charla.entrar.ayudaWhatsapp')}<span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </form>
  )
}

export default function CharlaNuevaZelanda() {
  const { t } = useTranslation()
  const lang = useLang()
  const nosotrasImg = useSiteImage('home', 'nosotras', imgNosotras, t('home.nosotras.imgAlt'))
  const descubriras = t('charla.descubriras.items', { returnObjects: true })
  const paraQuien = t('charla.paraQuien.items', { returnObjects: true })

  return (
    <>
      <Seo
        pageType="charla-nueva-zelanda"
        title={t('charla.seo.title')}
        description={t('charla.seo.description')}
        ogTitle={t('charla.seo.ogTitle')}
        ogDescription={t('charla.seo.ogDescription')}
        image={OG_URL}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(eventosJsonLd(lang, t))}</script>
      </Helmet>

      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="ch-hero">
        <div className="wrap ch-hero-inner">
          <p className="sec-eyebrow">{t('charla.eyebrow')}</p>
          <h1 className="ch-titulo">{t('charla.title')}</h1>
          <p className="ch-intro">{t('charla.intro')}</p>
          <p className="ch-idioma">{t('charla.idiomaAviso')}</p>
          <div className="ch-resumen-fechas">
            <p className="ch-resumen-fechas__titulo">{t('charla.resumenTitulo')}</p>
            <ul>
              {SESIONES.map(s => (
                <li key={s.id}>
                  <strong>{t('charla.resumenItem', { fecha: s.fecha[lang], hora: s.horas.es, horaCanarias: s.horas.ic })}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="cta-row">
            <BotonInscripcion t={t} />
          </div>
        </div>
      </section>

      {/* ── Información del encuentro ────────────────── */}
      <section aria-labelledby="ch-info-titulo" className="ch-seccion">
        <div className="wrap">
          <h2 id="ch-info-titulo" className="sec-title">{t('charla.info.title')}</h2>
          <p className="ch-texto">{t('charla.info.mismaCharla')}</p>
          <ul role="list" className="ch-sesiones-cards">
            {SESIONES.map(s => (
              <li key={s.id} className="ch-sesion-card">
                <h3 className="ch-sesion-card__fecha">{s.fecha[lang]}</h3>
                <p className="ch-sesion-card__hora"><strong>{s.horas.es}</strong> {t('charla.info.espana')}</p>
                <p className="ch-sesion-card__hora ch-sesion-card__hora--sec"><strong>{s.horas.ic}</strong> {t('charla.info.canarias')}</p>
              </li>
            ))}
          </ul>
          <dl className="ch-datos">
            <div><dt>{t('charla.info.duracionLabel')}</dt><dd>{t('charla.info.duracion')}</dd></div>
            <div><dt>{t('charla.info.plataformaLabel')}</dt><dd>{t('charla.info.plataforma')}</dd></div>
            <div><dt>{t('charla.info.idiomaLabel')}</dt><dd>{t('charla.info.idioma')}</dd></div>
            <div><dt>{t('charla.info.precioLabel')}</dt><dd>{t('charla.info.precio')}</dd></div>
          </dl>
        </div>
      </section>

      {/* ── Horarios por país ────────────────────────── */}
      <section aria-labelledby="ch-horario-titulo" className="ch-seccion">
        <div className="wrap">
          <h2 id="ch-horario-titulo" className="sec-title">{t('charla.horario.title')}</h2>
          <div className="ch-tabla-wrap">
            <table className="ch-tabla">
              <caption>{t('charla.horario.caption')}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('charla.horario.colRegion')}</th>
                  {SESIONES.map(s => <th key={s.id} scope="col">{s.fechaCorta[lang]}</th>)}
                </tr>
              </thead>
              <tbody>
                {REGIONES.map(r => (
                  <tr key={r.id} className={r.id === 'es' ? 'ch-tabla__destacada' : undefined}>
                    <th scope="row">{r[lang]}</th>
                    {SESIONES.map(s => <td key={s.id}>{s.horas[r.id]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ch-nota">{t('charla.horario.nota')}</p>
          <HoraLocal lang={lang} t={t} />
        </div>
      </section>

      {/* ── Qué descubrirás / Para quién es ──────────── */}
      <section className="ch-seccion">
        <div className="wrap ch-dos-col">
          <div>
            <h2 className="sec-title">{t('charla.descubriras.title')}</h2>
            <ul className="ch-lista">
              {descubriras.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="sec-title">{t('charla.paraQuien.title')}</h2>
            <p className="ch-texto">{t('charla.paraQuien.intro')}</p>
            <ul className="ch-lista">
              {paraQuien.map(item => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Quiénes somos ────────────────────────────── */}
      <section aria-labelledby="ch-nosotras-titulo" className="ch-seccion">
        <div className="wrap">
          <div className="ink-block ch-nosotras">
            <div className="ch-nosotras__foto">
              <img src={nosotrasImg.src} alt={nosotrasImg.alt} lang={nosotrasImg.lang} loading="lazy" />
            </div>
            <div>
              <h2 id="ch-nosotras-titulo">{t('charla.nosotras.title')}</h2>
              <p>{t('charla.nosotras.p1')}</p>
              <p>{t('charla.nosotras.p2')}</p>
              <p>{t('charla.nosotras.p3')}</p>
              <L to="/sobre-nosotras" className="ch-enlace-claro">{t('charla.nosotras.cta')}</L>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo entrar ──────────────────────────────── */}
      <section aria-labelledby="ch-entrar-titulo" className="ch-seccion">
        <div className="wrap ch-estrecho">
          <h2 id="ch-entrar-titulo" className="sec-title">{t('charla.entrar.title')}</h2>
          <p className="ch-texto">{t('charla.entrar.enlace')}</p>
          <ul className="ch-lista">
            <li><strong>{t('charla.entrar.ordenadorLabel')}</strong> {t('charla.entrar.ordenador')}</li>
            <li><strong>{t('charla.entrar.movilLabel')}</strong> {t('charla.entrar.movil')}</li>
          </ul>
          <p className="ch-texto">{t('charla.entrar.ayuda')}</p>
          <ul className="ch-lista">
            <li><a href={`mailto:${CONTACTO.email}`}>{t('charla.entrar.ayudaEmail')}</a></li>
            <li>
              <a href={CONTACTO.whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t('charla.entrar.ayudaWhatsapp')}<span className="sr-only"> {t('common.newTab')}</span>
              </a>
            </li>
          </ul>

          {GRABACION_ACTIVADA && (
            <>
              <h2 className="sec-title ch-grabacion-titulo">{t('charla.grabacion.title')}</h2>
              <p className="ch-texto">
                {t('charla.grabacion.p')} {t('charla.grabacion.privacidadPre')} <L to="/privacidad">{t('charla.grabacion.privacidadLink')}</L>.
              </p>
            </>
          )}
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────── */}
      <section className="final-cta ch-final">
        <div className="wrap">
          <h2>{t('charla.final.title')}</h2>
          <p>{t('charla.final.p')}</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <BotonInscripcion t={t} />
          </div>
        </div>
      </section>

      {/* ── Formulario ───────────────────────────────── */}
      <section id={ANCLA_FORM} aria-labelledby={`${ANCLA_FORM}-titulo`} className="contacto-form-section ch-form-section">
        <div className="wrap contacto-form-wrap">
          <h2 id={`${ANCLA_FORM}-titulo`} tabIndex={-1} className="contacto-form-titulo">{t('charla.form.title')}</h2>
          <p className="ch-texto">{t('charla.form.intro')}</p>
          <Formulario lang={lang} t={t} />
        </div>
      </section>
    </>
  )
}
