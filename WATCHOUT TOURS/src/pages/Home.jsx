import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import imgNosotras from '../images/sobre-nosotras.webp'
import logoImg from '../images/logo-header-watchout.png'
import videoParapente from '../images/parapente-teaser.mp4'
import { AudioPlayer } from '../components/AudioPlayer'
import { useSiteImage } from '../lib/siteImages'
import audioParapente from '../images/Saltando en parapente.mp3'
import audioAlpaca from '../images/Cuando la alpaca le mordió.mp3'

const TARGET_DATE = new Date('2026-09-20T00:00:00')

function calcularTiempo() {
  const ahora = new Date()
  const diferencia = TARGET_DATE - ahora
  if (diferencia <= 0) return { dias: 0, horas: 0 }
  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
  }
}

export default function Home() {
  const [resenaDestacada, setResenaDestacada] = useState(null)
  const [posts, setPosts] = useState([])
  const [tiempo, setTiempo] = useState(calcularTiempo())
  const [playingAudio, setPlayingAudio] = useState(null)

  const heroImg = useSiteImage('home', 'hero', imgHero,
    'La montaña más alta de Nueva Zelanda, Aoraki / Mount Cook, una montaña nevada e imponente que sobresale entre los demás')
  const nosotrasImg = useSiteImage('home', 'nosotras', imgNosotras,
    'Sylvie y Moni, guías de WatchOut!, sonriendo frente a un géiser humeante en Rotorua')

  useEffect(() => {
    document.title = 'WatchOut! Sensory Tours — Viajes de lujo sensorial por Nueva Zelanda'

    supabase
      .from('resenas')
      .select('id, author_name, author_context, content, featured')
      .eq('published', true)
      .eq('featured', true)
      .limit(3)
      .then(({ data }) => setResenaDestacada(data))

    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published_at, reading_time')
      .eq('status', 'published')
      .eq('resena', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => setPosts(data ?? []))
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => setTiempo(calcularTiempo()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  const unidades = [
    { label: 'Días', valor: tiempo.dias },
    { label: 'Horas', valor: tiempo.horas },
  ]

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="dots-texture"></div>
        <div className="wrap hero-grid">
          <div className="hero-inner">
            <span className="eyebrow">WatchOut! Sensory Tours · Nueva Zelanda</span>
            <h1>No toda visión<br />necesita ojos.</h1>
            <p>Viajes sensoriales por Nueva Zelanda para personas ciegas y con baja visión. Dos guías, contigo de principio a fin. Sin límites.</p>
            <div className="cta-row">
              <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
              <Link to="/resenas" className="btn btn-outline">Mira cómo lo vivimos</Link>
            </div>
            <svg className="wave" viewBox="0 0 130 28" fill="none" aria-hidden="true">
              <g stroke="#2E7F60" strokeWidth="2" strokeLinecap="round">
                <path d="M22 14 Q65 -9 108 14" opacity=".35" />
                <path d="M30 14 Q65 -1 100 14" opacity=".55" />
                <path d="M40 14 Q65 6 90 14" opacity=".85" />
                <circle cx="65" cy="14" r="2.6" fill="#2E7F60" stroke="none" />
              </g>
            </svg>
          </div>
          <div className="hero-photo-panel">
            <img src={heroImg.src} alt={heroImg.alt} />
          </div>
        </div>

        <div className="wrap">
          <div className="stats">
            <div className="stat"><div className="n">2</div><div className="l">Formatos: viajes en grupo y a medida</div></div>
            <div className="stat"><div className="n">3–6</div><div className="l">Viajeros por salida</div></div>
            <div className="stat"><div className="n">2</div><div className="l">Guías full-time, todo el viaje</div></div>
          </div>
        </div>
      </section>

      {/* ── Intro / Cómo son nuestros viajes ──────────── */}
      <section id="viajes">
        <div className="wrap">
          <div className="intro-grid">
            <div>
              <div className="sec-eyebrow">¿Cómo son nuestros viajes?</div>
              <h2 className="sec-title">Se vive con las manos, el oído y la piel</h2>
              <p>¡Te entiendo! Sabemos que venir a Nueva Zelanda está al otro lado del mundo y eso impone.</p>
              <p>Por eso creamos experiencias inclusivas que permiten a las personas ciegas y con baja visión explorar Nueva Zelanda con libertad, confianza y mucha adrenalina.</p>
              <p>El rugido de las cascadas de Milford Sound, el vapor geotermal de Rotorua, la textura tallada a mano de un moko en Hobbiton — nosotras te guiamos, la experiencia es tuya.</p>
            </div>
            <div className="intro-card">
              <p>"Lo mejor de este viaje no se ve — se escucha, se toca, se siente."</p>
              <span className="tag">Filosofía WatchOut!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tres pilares sensoriales ──────────────────── */}
      <section>
        <div className="wrap">
          <div className="sec-eyebrow">Lo que van a vivir</div>
          <h2 className="sec-title">Tres formas de explorar Nueva Zelanda</h2>
          <p className="sec-sub">No hay límites para nuestros grupos — cada ruta combina adrenalina, inmersión sensorial y cultura maorí real.</p>
          <div className="pillars">
            <div className="pillar">
              <div className="ico" aria-hidden="true">🪂</div>
              <h3>Adrenalina y superación</h3>
              <p>Parapente en Queenstown, kayak en Kaikōura, lanchas rápidas. Sin límites mentales.</p>
            </div>
            <div className="pillar">
              <div className="ico" aria-hidden="true">✋</div>
              <h3>Inmersión sensorial</h3>
              <p>El tacto, el olfato y el oído como guía: Hobbiton, Rotorua, Milford Sound, Te Puia.</p>
            </div>
            <div className="pillar">
              <div className="ico" aria-hidden="true">🌊</div>
              <h3>Cultura y conexión</h3>
              <p>El moko, el hāngi, el canto de las ballenas por hidrófono en Kaikōura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Video reel — Parapente ────────────────────── */}
      <section id="en-accion">
        <div className="wrap">
          <div className="reel-grid">
            <div className="reel-frame">
              <video
                src={videoParapente}
                controls
                playsInline
                preload="metadata"
                aria-label="Vídeo: uno de nuestros viajeros ciegos despega en parapente sobre Queenstown. Se escucha al instructor gritar «corre, corre, corre», el despegue y la emoción del vuelo."
              />
            </div>
            <div className="reel-copy">
              <div className="sec-eyebrow">Así se siente, no se ve</div>
              <p className="callout">¿Quién dice que los ciegos no se tiran en parapente? <em>Aquí no venimos a ver pasar la vida — venimos a disfrutarla a 1000 por hora.</em></p>
              <p>Uno de nuestros viajeros volando por todo lo alto sobre Queenstown. Subid el volumen: lo mejor de este vídeo no se ve, se escucha.</p>
              <a className="btn btn-outline" href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">Ver más en Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ──────────────────────────────── */}
      {resenaDestacada && resenaDestacada.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-eyebrow">Lo que cuentan</div>
            <h2 className="sec-title">Así lo viven nuestros viajeros</h2>
            <div className="testi-grid">
              {resenaDestacada.map(resena => (
                <div key={resena.id} className="testi">
                  <q>{resena.content}</q>
                  <div className="who">{resena.author_name}</div>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/resenas">Leer más reseñas<span aria-hidden="true"> →</span></Link>
            </p>
          </div>
        </section>
      )}

      {/* ── Rutas ────────────────────────────────────── */}
      <section id="rutas">
        <div className="wrap">
          <div className="sec-eyebrow">Las dos rutas</div>
          <h2 className="sec-title">Qué viaje vendemos</h2>
          <p className="sec-sub">Ruta clásica de 11 noches y su extensión con Kaikōura. Dos guías dedicadas de principio a fin.</p>

          <div className="route">
            <div className="route-head">
              <span className="route-tag">Ruta A</span>
              <span className="route-nights">· 11 noches</span>
            </div>
            <p className="route-path"><b>Auckland</b> → <b>Rotorua</b> → <b>Queenstown</b> → <b>Tekapo</b> → <b>Christchurch</b></p>
            <div className="hl">
              <span>Wētā Workshop</span><span>Hobbiton</span><span>Te Puia · hāngi</span><span>Milford Sound</span><span>Onsen</span><span>Stargazing</span>
            </div>
          </div>

          <div className="route">
            <div className="route-head">
              <span className="route-tag">Ruta B</span>
              <span className="route-nights">· 13 noches · con Kaikōura</span>
            </div>
            <p className="route-path">Todo lo de la Ruta A + <b>Kaikōura</b> → vuelta a <b>Christchurch</b></p>
            <div className="hl">
              <span>Todo lo de la Ruta A</span><span>Whale Watch · oír a las ballenas</span>
            </div>
          </div>

          <div className="contador-aviso">
            <p className="contador-aviso__texto">¡Nuestro próximo viaje en grupo comienza en:</p>
            <div
              className="contador"
              role="timer"
              aria-label={`${tiempo.dias} días y ${tiempo.horas} horas para el próximo viaje en grupo`}
            >
              {unidades.map(({ label, valor }) => (
                <div key={label} className="contador__bloque" aria-hidden="true">
                  <span className="contador__numero">{String(valor).padStart(2, '0')}</span>
                  <span className="contador__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Audio clips ──────────────────────────────── */}
      <section aria-labelledby="audio-clips-heading">
        <div className="wrap">
          <div className="sec-eyebrow">El país por los sentidos</div>
          <h2 id="audio-clips-heading" className="sec-title">Cierra los ojos. Así se siente Nueva Zelanda.</h2>
          <div className="audio-cards">
            <div className="audio-card">
              <div className="audio-card__header">
                <span className="audio-card__icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </span>
                <div>
                  <h3 className="audio-card__titulo">¡Salto en parapente!</h3>
                  <span className="audio-card__etiqueta">Así suena volar por primera vez</span>
                </div>
              </div>
              <p className="audio-card__descripcion">El viento en la cara, la sensación de libertad, el corazón latiendo al ritmo de la aventura.</p>
              <AudioPlayer src={audioParapente} playerId="parapente" playingId={playingAudio} setPlayingId={setPlayingAudio} label="Salto en parapente" />
            </div>
            <div className="audio-card">
              <div className="audio-card__header">
                <span className="audio-card__icono" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </span>
                <div>
                  <h3 className="audio-card__titulo">La mordida de una alpaca</h3>
                  <span className="audio-card__etiqueta">Un ataque inesperado</span>
                </div>
              </div>
              <p className="audio-card__descripcion">Ni siquiera en Nueva Zelanda estás a salvo de una alpaca curiosa.</p>
              <AudioPlayer src={audioAlpaca} playerId="alpaca" playingId={playingAudio} setPlayingId={setPlayingAudio} label="La mordida de una alpaca" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Nosotras ─────────────────────────────────── */}
      <section id="nosotras">
        <div className="wrap">
          <div className="origin">
            <div className="origin-grid">
              <div className="origin-photo">
                <img src={nosotrasImg.src} alt={nosotrasImg.alt} />
              </div>
              <div className="origin-inner">
                <div className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>Nuestra historia</div>
                <p>Hace casi 8 años llegamos a Nueva Zelanda con una mochila llena de sueños e incertidumbre. Hoy somos Sylvie y Moni, las guías de WatchOut! — porque nadie como nosotras para contar, más allá de lo visual, la magia de este país que llamamos casa.</p>
                <Link to="/filosofia" className="btn btn-outline" style={{ color: 'var(--paper)', borderColor: 'var(--gold-soft)' }}>Conoce nuestra historia completa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog preview ─────────────────────────────── */}
      {posts && posts.title && (
        <section>
          <div className="wrap">
            <div className="sec-eyebrow">Del blog</div>
            <h2 className="sec-title">¿Cómo se vive? El país por los sentidos</h2>
            <div className="blog-preview-card">
              <h3>{posts.title}</h3>
              <p>{posts.excerpt}</p>
              <p className="reading-time">Tiempo de lectura: {posts.reading_time} mins</p>
              <Link to={`/blog/${posts.slug}`} className="btn btn-outline">Leer artículo</Link>
            </div>
            <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link to="/blog">Ver todos los artículos<span aria-hidden="true"> →</span></Link>
            </p>
          </div>
        </section>
      )}

      {/* ── CTA final ────────────────────────────────── */}
      <section className="final-cta">
        <div className="wrap">
          <h2>¿Le contamos tu sueño a Nueva Zelanda?</h2>
          <p>Escríbenos por WhatsApp y hablamos de tú a tú — sin formularios eternos.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link to="/contacto" className="btn btn-solid">Escríbenos</Link>
            <a
              href="https://wa.me/64XXXXXXXXX"
              className="btn btn-outline btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contáctanos por WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false" width="18" height="18">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z" fill="currentColor"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
