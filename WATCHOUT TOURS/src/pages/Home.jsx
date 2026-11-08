import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm, ValidationError } from '@formspree/react'
import '../styles/pagestyle/Contacto.css'
import '../styles/pagestyle/HomeNueva.css'
import { Seo } from '../components/Seo'
import { Icono } from '../components/Icono'
import { ImagenHueco, variantes } from '../components/ImagenHueco'
import { ResenasDestacadas } from '../components/home/BloquesHome'
import { BotonVideollamada } from '../components/Videollamada'
import { Desplegable } from '../components/Desplegable'
import { L, useLang } from '../i18n/routing'
// Imágenes por defecto (versiones a varios anchos en src/images/home)
import hero900 from '../images/home/hero-900.webp'
import hero1400 from '../images/home/hero-1400.webp'
import hero1800 from '../images/home/hero-1800.webp'
import maori480 from '../images/home/maori-480.webp'
import maori900 from '../images/home/maori-900.webp'
import qt600 from '../images/home/queenstown-600.webp'
import qt1200 from '../images/home/queenstown-1200.webp'
import kai480 from '../images/home/kaikoura-480.webp'
import kai900 from '../images/home/kaikoura-900.webp'
import ciegos600 from '../images/home/viaje-ciegos-600.webp'
import ciegos1200 from '../images/home/viaje-ciegos-1200.webp'
import sesenta500 from '../images/home/viaje-60-500.webp'
import sesenta1000 from '../images/home/viaje-60-1000.webp'
import nos600 from '../images/home/nosotras-600.webp'
import nos1100 from '../images/home/nosotras-1100.webp'

/* Imagen por defecto de cada hueco (sección "home" en /admin/imagenes).
   null = no hay ninguna adecuada en el proyecto: fondo petróleo liso. */
const IMG = {
  hero: variantes([{ src: hero900, w: 900, h: 675 }, { src: hero1400, w: 1400, h: 1050 }, { src: hero1800, w: 1800, h: 1350 }]),
  'nz-tierra-media': null,
  'nz-maori': variantes([{ src: maori480, w: 480, h: 850 }, { src: maori900, w: 900, h: 1594 }]),
  'nz-queenstown': variantes([{ src: qt600, w: 600, h: 525 }, { src: qt1200, w: 1200, h: 1050 }]),
  'nz-milford': null,
  'nz-kaikoura': variantes([{ src: kai480, w: 480, h: 642 }, { src: kai900, w: 900, h: 1204 }]),
  'viaje-ciegos': variantes([{ src: ciegos600, w: 600, h: 800 }, { src: ciegos1200, w: 1200, h: 1600 }]),
  'viaje-60': variantes([{ src: sesenta500, w: 500, h: 666 }, { src: sesenta1000, w: 1000, h: 1333 }]),
  'viaje-privado': null,
  nosotras: variantes([{ src: nos600, w: 600, h: 800 }, { src: nos1100, w: 1100, h: 1467 }]),
}

const WHATSAPP = 'https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20Watchout%20Tours'

/* Valores que recibe el equipo en el correo (siempre en español). */
const VIAJES_EQUIPO = {
  'viajes-60': 'Viajes +60',
  'personas-ciegas': 'Viajes para personas ciegas y con baja visión',
  'privado': 'Viaje en privado',
  'no-se': 'Aún no lo sé',
}

const reducirMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* Lleva el foco a un campo del formulario del itinerario (y lo enseña). */
function irAlCampo(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth', block: 'center' })
  el.focus({ preventScroll: true })
}

/* ── 1. Hero ─────────────────────────────────────────────────────────── */
function Hero() {
  const { t } = useTranslation()
  return (
    <section className="hn-hero" aria-labelledby="hn-hero-titulo">
      <ImagenHueco
        seccion="home" clave="hero" defecto={IMG.hero} alt={t('home.heroImgAlt')}
        sizes="100vw" prioritaria className="hn-hero__img"
      />
      <div className="hn-hero__capa-superior" aria-hidden="true" />
      <div className="hn-wrap hn-hero__contenido">
        <p className="hn-etiqueta hn-etiqueta--oscuro">{t('home.hero.etiqueta')}</p>
        <h1 id="hn-hero-titulo" className="hn-hero__titulo">{t('home.hero.h1')}</h1>
        <p className="hn-hero__sub">{t('home.hero.sub')}</p>
        <div className="hn-botones">
          <a href="#viajes" className="hn-btn hn-btn--coral">{t('home.hero.ctaViajes')}</a>
          <a href="#itinerario" className="hn-btn hn-btn--borde-blanco">{t('home.hero.ctaItinerario')}</a>
          <BotonVideollamada className="hn-btn hn-btn--borde-blanco" />
        </div>
        {/* Franja: toda ella es un único enlace a la próxima salida */}
        <a href="#salida" className="hn-franja">
          <span className="hn-franja__etiqueta">{t('home.franja.etiqueta')}</span>
          <span className="hn-franja__fechas">{t('home.franja.fechas')}</span>
          <span className="hn-franja__plazas">{t('home.franja.plazas')}</span>
          <span className="hn-franja__cta">{t('home.franja.cta')}</span>
        </a>
      </div>
    </section>
  )
}

/* ── 2. Nueva Zelanda ────────────────────────────────────────────────── */
function NuevaZelanda() {
  const { t } = useTranslation()
  const fotos = t('home.nz.fotos', { returnObjects: true })
  return (
    <section id="nueva-zelanda" className="hn-seccion hn-arena" aria-labelledby="hn-nz-titulo">
      <div className="hn-wrap">
        <div className="hn-cabecera">
          <p className="hn-etiqueta">{t('home.nz.etiqueta')}</p>
          <h2 id="hn-nz-titulo" className="hn-h2">{t('home.nz.titulo')}</h2>
          <p className="hn-entradilla">{t('home.nz.texto')}</p>
        </div>
        <ul className="hn-mosaico" role="list">
          {fotos.map((f, i) => (
            <li key={f.id} className={`hn-mosaico__item${i === 0 ? ' hn-mosaico__item--grande' : ''}`}>
              <ImagenHueco
                seccion="home" clave={`nz-${f.id}`} defecto={IMG[`nz-${f.id}`]} alt={f.alt}
                sizes={i === 0 ? '(min-width: 900px) 50vw, 100vw' : '(min-width: 900px) 25vw, 100vw'}
                className="hn-mosaico__img"
              />
              <div className="hn-mosaico__texto">
                <h3 className="hn-mosaico__titulo">{f.titulo}</h3>
                <p className="hn-mosaico__frase">{f.frase}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── 4. Nuestros viajes ──────────────────────────────────────────────── */
function FilaViaje({ id, clave, ns, to, invertida, children }) {
  const { t } = useTranslation()
  return (
    <article className={`hn-viaje${invertida ? ' hn-viaje--invertida' : ''}`} aria-labelledby={`hn-${id}-titulo`}>
      <div className="hn-viaje__foto">
        <ImagenHueco
          seccion="home" clave={clave} defecto={IMG[clave]} alt={t(`${ns}.imgAlt`)}
          sizes="(min-width: 900px) 50vw, 100vw"
        />
      </div>
      <div className="hn-viaje__texto">
        <p className="hn-etiqueta hn-etiqueta--mostaza">{t(`${ns}.etiqueta`)}</p>
        <h3 id={`hn-${id}-titulo`} className="hn-h3">{t(`${ns}.titulo`)}</h3>
        <p className="hn-destacado">{t(`${ns}.destacado`)}</p>
        <p className="hn-parrafo">{t(`${ns}.texto`)}</p>
        <div className="hn-botones">
          <L to={to} className="hn-btn hn-btn--petroleo">{t(`${ns}.cta`)}</L>
        </div>
        {children}
      </div>
    </article>
  )
}

function NuestrosViajes({ elegirViaje }) {
  const { t } = useTranslation()
  return (
    <section id="viajes" className="hn-seccion" aria-labelledby="hn-viajes-titulo">
      <div className="hn-wrap">
        <div className="hn-cabecera">
          <p className="hn-etiqueta">{t('home.viajes.etiqueta')}</p>
          <h2 id="hn-viajes-titulo" className="hn-h2">{t('home.viajes.titulo')}</h2>
        </div>
        <div className="hn-viajes">
          <FilaViaje id="ciegos" clave="viaje-ciegos" ns="home.viajes.ciegos" to="/mas-alla-de-la-vista">
            <L to="/mas-alla-de-la-vista#audios" className="hn-enlace-icono">
              <Icono nombre="altavoz" />
              <span>{t('home.viajes.ciegos.audios')}</span>
            </L>
          </FilaViaje>
          <FilaViaje id="sesenta" clave="viaje-60" ns="home.viajes.sesenta" to="/sin-prisa" invertida />

          {/* 4.3 Viajes en privado: franja ancha con foto de fondo */}
          <article className="hn-privado" aria-labelledby="hn-privado-titulo">
            <ImagenHueco
              seccion="home" clave="viaje-privado" defecto={IMG['viaje-privado']} alt=""
              sizes="(min-width: 1240px) 1240px, 100vw" className="hn-privado__img"
            />
            <div className="hn-privado__texto">
              <p className="hn-etiqueta hn-etiqueta--oscuro">{t('home.viajes.privado.etiqueta')}</p>
              <h3 id="hn-privado-titulo" className="hn-h3">{t('home.viajes.privado.titulo')}</h3>
              <p className="hn-parrafo">{t('home.viajes.privado.texto')}</p>
              <div className="hn-botones">
                {/* No hay página de viaje privado: va al formulario con la
                    opción "Viaje en privado" ya elegida. */}
                <a href="#itinerario" className="hn-btn hn-btn--blanco" onClick={() => elegirViaje('privado')}>
                  {t('home.viajes.privado.cta')}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ── 5. Próxima salida ───────────────────────────────────────────────── */
function ProximaSalida() {
  const { t } = useTranslation()
  const paradas = t('home.salida.paradas', { returnObjects: true })
  function proponerFechas(e) {
    e.preventDefault()
    irAlCampo('itinerario-fechas')
  }
  return (
    <section id="salida" className="hn-seccion hn-oscuro" aria-labelledby="hn-salida-titulo">
      <div className="hn-wrap hn-salida">
        <div className="hn-salida__info">
          <p className="hn-etiqueta hn-etiqueta--oscuro">{t('home.salida.etiqueta')}</p>
          <h2 id="hn-salida-titulo" className="hn-h2">{t('home.salida.titulo')}</h2>
          <p className="hn-parrafo">{t('home.salida.texto1')}</p>
          <p className="hn-parrafo">{t('home.salida.texto2')}</p>
          <div className="hn-botones">
            <a href="#itinerario" className="hn-btn hn-btn--coral">{t('home.salida.reservar')}</a>
            <a href="#itinerario" className="hn-btn hn-btn--borde-blanco">{t('home.salida.itinerario')}</a>
          </div>
          <div className="hn-recuadro">
            <h3 className="hn-recuadro__titulo">{t('home.salida.otras.titulo')}</h3>
            <p className="hn-parrafo">{t('home.salida.otras.texto')}</p>
            <a href="#itinerario-fechas" className="hn-enlace-claro" onClick={proponerFechas}>
              {t('home.salida.otras.enlace')}<span aria-hidden="true"> →</span>
            </a>
          </div>
        </div>
        <div className="hn-salida__ruta">
          <h3 className="hn-salida__ruta-titulo">{t('home.salida.rutaTitulo')}</h3>
          {/* role="list": sin viñetas, Safari quitaría la semántica de lista */}
          <ol className="hn-paradas" role="list">
            {paradas.map((p, i) => (
              <li key={p.nombre} className="hn-parada">
                <span className="hn-parada__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="hn-parada__nombre">{p.nombre}</p>
                  <p className="hn-parada__gancho">{p.gancho}</p>
                  <p className="hn-parada__frase">{p.frase}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ── 6. Quiénes somos ────────────────────────────────────────────────── */
function QuienesSomos() {
  const { t } = useTranslation()
  const cifras = t('home.nosotras.cifras', { returnObjects: true })
  return (
    <section id="nosotras" className="hn-seccion" aria-labelledby="hn-nosotras-titulo">
      <div className="hn-wrap hn-nosotras">
        <div className="hn-nosotras__foto">
          <ImagenHueco
            seccion="home" clave="nosotras" defecto={IMG.nosotras} alt={t('home.nosotras.imgAlt')}
            sizes="(min-width: 900px) 40vw, 100vw"
          />
        </div>
        <div className="hn-nosotras__texto">
          <p className="hn-etiqueta">{t('home.nosotras.etiqueta')}</p>
          <h2 id="hn-nosotras-titulo" className="hn-h2">{t('home.nosotras.titulo')}</h2>
          <p className="hn-parrafo">{t('home.nosotras.texto')}</p>
          <dl className="hn-cifras">
            {cifras.map(c => (
              <div key={c.valor} className="hn-cifra">
                <dt className="hn-cifra__valor">{c.valor}</dt>
                <dd className="hn-cifra__texto">{c.texto}</dd>
              </div>
            ))}
          </dl>
          <L to="/sobre-nosotras" className="hn-enlace">
            {t('home.nosotras.enlace')}<span aria-hidden="true"> →</span>
          </L>
        </div>
      </div>
    </section>
  )
}

/* ── 7b. Cómo reservar + preguntas frecuentes ────────────────────────── */
function ComoReservar() {
  const { t } = useTranslation()
  const pasos = t('home.reservar.pasos', { returnObjects: true })
  const faq = t('home.reservar.faq', { returnObjects: true })
  return (
    <section id="como-reservar" className="hn-seccion" aria-labelledby="hn-reservar-titulo">
      <div className="hn-wrap">
        <div className="hn-cabecera">
          <p className="hn-etiqueta">{t('home.reservar.etiqueta')}</p>
          <h2 id="hn-reservar-titulo" className="hn-h2">{t('home.reservar.titulo')}</h2>
        </div>
        {/* role="list": sin viñetas, Safari quitaría la semántica de lista */}
        <ol className="hn-pasos" role="list">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="hn-paso">
              <span className="hn-paso__num" aria-hidden="true">{i + 1}</span>
              <p className="hn-paso__texto"><strong>{p.titulo}</strong> {p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="hn-faq">
          <h2 id="hn-faq-titulo" className="hn-h3 hn-faq__titulo">{t('home.reservar.faqTitulo')}</h2>
          {faq.map(({ q, a }, i) => (
            <Desplegable key={q} id={`hn-faq-${i + 1}`} boton={q} Titulo="h3" className="hn-faq__item">
              <p>{a}</p>
            </Desplegable>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 8. Pedir itinerario ─────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TEL_RE = /^\+?[\d\s().-]{7,20}$/
const SPAM_DELAY_MS = 60_000

function PedirItinerario({ viaje, setViaje }) {
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
    <section id="itinerario" className="hn-seccion" aria-labelledby="hn-itinerario-titulo">
      <div className="hn-wrap hn-itinerario">
        <div className="hn-itinerario__texto">
          <h2 id="hn-itinerario-titulo" className="hn-h2">{t('home.itinerario.titulo')}</h2>
          <p className="hn-entradilla">{t('home.itinerario.texto')}</p>
          <p className="hn-parrafo hn-itinerario__llamada">{t('home.itinerario.videollamadaLinea')}</p>
          <div className="hn-botones hn-itinerario__botones">
            <BotonVideollamada className="hn-btn hn-btn--borde-petroleo" />
          </div>
          <a href={WHATSAPP} className="hn-enlace-icono" target="_blank" rel="noopener noreferrer">
            <Icono nombre="chat" />
            <span>{t('home.itinerario.whatsapp')}</span>
            <span className="sr-only"> {t('common.newTab')}</span>
          </a>
        </div>

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

              <button type="submit" disabled={state.submitting} className="hn-btn hn-btn--coral hn-btn--ancho">
                {state.submitting ? t('home.itinerario.enviando') : t('home.itinerario.enviar')}
              </button>
              <p className="hn-ayuda hn-itinerario__respuesta">{t('home.itinerario.respuesta')}</p>
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

/* ── Home ────────────────────────────────────────────────────────────────
 * Maqueta aprobada: hero → Nueva Zelanda → nuestros viajes → próxima
 * salida → quiénes somos → reseñas → cómo reservar y preguntas
 * frecuentes → pedir itinerario. Estilos en
 * HomeNueva.css (todo bajo .hn-*), con la paleta de theme.css.
 * ──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('')

  // Anillo de foco ámbar y cabecera sobre la foto solo en la home
  useEffect(() => {
    document.body.classList.add('pagina-home')
    return () => document.body.classList.remove('pagina-home')
  }, [])

  return (
    <>
      <Seo pageType="home" title={t('home.seo.title')} description={t('home.seo.description')} />
      <Hero />
      <NuevaZelanda />
      <NuestrosViajes elegirViaje={setViaje} />
      <ProximaSalida />
      <QuienesSomos />
      <ResenasDestacadas
        tono="arena"
        variante="home"
        id="resenas"
        antetitulo={t('home.resenas.etiqueta')}
        titulo={t('home.resenas.titulo')}
        textoEnlace={t('home.resenas.todas')}
      />
      <ComoReservar />
      <PedirItinerario viaje={viaje} setViaje={setViaje} />
    </>
  )
}
