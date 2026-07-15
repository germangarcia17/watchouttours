import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import imgNosotras from '../images/sobre-nosotras.webp'
import videoParapente from '../images/parapente-teaser.mp4'
import { AudioPlayer } from '../components/AudioPlayer'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
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

/* Separador de secciones: un bastón de movilidad estilizado (decorativo) */
function SeparadorBaston() {
  return (
    <div className="separador-baston" aria-hidden="true">
      <svg viewBox="0 0 880 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 14 q-8 -10 4 -10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="13" x2="852" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="859" cy="19.5" r="5" fill="currentColor" />
      </svg>
    </div>
  )
}

const formatos = [
  {
    id: 'grupo',
    etiqueta: '14 días por Nueva Zelanda · grupo de 3 a 6 viajeros + nosotras dos',
    titulo: 'La aventura compartida',
    cuerpo: 'Un grupo reducido de viajeros con las mismas ganas que tú de descubrir el mundo. Durante 14 días recorreremos juntos Nueva Zelanda, compartiendo aventuras, risas y momentos que recordarás toda la vida. Porque algunos viajes terminan… y otros te regalan amistades para siempre. Nosotras estaremos a vuestro lado en cada paso del camino, desde el primer día hasta el último.',
    precioTitulo: 'Desde 9.500 € por persona',
    precioNota: 'Viajamos de 3 a 6 personas. Sin letra pequeña: te damos el número exacto en cuanto hablemos.',
    incluye: 'Alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo las 13 noches.',
    cta: 'Quiero más información',
  },
  {
    id: 'privado',
    etiqueta: 'Privado · solo para ti y los tuyos · duración a tu ritmo',
    titulo: 'Tu viaje, a tu medida',
    cuerpo: 'Un viaje pensado solo para ti, y para quien quieras traer contigo. Nosotras dos, en exclusiva, diseñándolo a tu ritmo: tus días, tu energía, tu tiempo. Si quieres más calma, más calma. Si quieres más adrenalina, más adrenalina. Aquí no hay molde. Hay un viaje que te hacemos a medida, como un traje.',
    precioTitulo: 'Precio a medida',
    precioNota: 'Como lo diseñamos contigo, el precio también depende de ti: de cuántos días, de qué quieras vivir, de cómo lo sueñes. Sin compromiso.',
    incluye: 'Alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo de principio a fin.',
    cta: 'Quiero más información',
  },
]

export default function Home() {
  const [resenaDestacada, setResenaDestacada] = useState(null)
  const [posts, setPosts] = useState([])
  const [tiempo, setTiempo] = useState(calcularTiempo())
  const [playingAudio, setPlayingAudio] = useState(null)

  const heroImg = useSiteImage('home', 'hero', imgHero,
    'La montaña más alta de Nueva Zelanda, Aoraki / Mount Cook, una montaña nevada e imponente que sobresale entre los demás')
  const nosotrasImg = useSiteImage('home', 'nosotras', imgNosotras,
    'Sylvie y Moni, guías de Watchout Tours, sonriendo frente a un géiser humeante en Rotorua')

  useEffect(() => {
    supabase
      .from('resenas')
      .select('id, author_name, author_context, content, featured, video_url')
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
      <Seo
        pageType="home"
        title="Watchout Tours — Viajes sensoriales por Nueva Zelanda"
        description="Viajes sensoriales por Nueva Zelanda para personas ciegas y con baja visión. Dos guías, contigo de principio a fin."
      />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="dots-texture"></div>
        <div className="wrap hero-grid">
          <div className="hero-inner">
            <h1 className="eyebrow">Viajes sensoriales por Nueva Zelanda para personas ciegas y con baja visión</h1>
            <p className='hero-big-text'>No toda visión<br />necesita ojos.</p>
            <p>Dos guías, contigo de principio a fin. Sin límites.</p>
            <div className="cta-row">
              <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
              <Link to="/resenas" className="btn btn-outline">Mira cómo lo vivimos</Link>
            </div>
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

      {/* ── Cómo son nuestros viajes ──────────────────── */}
      <section id="viajes">
        <div className="wrap">
          <div className="intro-grid">
            <div>
              <h2 className="sec-eyebrow">¿Cómo son nuestros viajes?</h2>
              <p className="sec-title">Se vive con las manos, el oído y la piel</p>
              <p>Nueva Zelanda está lejos. Pero no tiene por qué sentirse inalcanzable.</p>
              <p>Hemos diseñado experiencias para que las personas ciegas y con baja visión puedan descubrir este país con seguridad, autonomía y emoción.</p>
              <p>Sentir la brisa y el agua fría en el rostro en Milford Sound. Notar el calor geotermal de Rotorua. Recorrer con las manos el tallado de los diseños maoríes. Cruzar la puerta de la casa de Bilbo y adentrarte en Hobbiton como un auténtico hobbit.</p>
              <p>Y esto es solo el principio.</p>
              <p>Porque la mejor forma de conocer Nueva Zelanda no siempre es con la vista, sino con todos los sentidos.</p>
            </div>
            <div className="intro-card">
              <p>"Lo mejor de este viaje no se ve — se escucha, se toca, se siente."</p>
              <span className="tag">Filosofía Watchout</span>
            </div>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Nuestra forma de explorar ─────────────────── */}
      <section>
        <div className="wrap">
          <h2 className="sec-eyebrow">Lo que van a vivir</h2>
          <p className="sec-title">Nuestra forma de explorar Nueva Zelanda</p>
          <p className="sec-sub">No ponemos límites a la aventura. Cada ruta combina adrenalina, inmersión sensorial y auténtica cultura maorí.</p>
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

      <SeparadorBaston />

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
              <h2 className="sec-eyebrow">Así se vive la aventura</h2>
              <p className="callout">¿Quién dijo que el parapente era solo para algunos?</p>
              <p>En Watchout creemos que la aventura no entiende de límites. Entiende de curiosidad, de emoción y de personas con ganas de lanzarse a vivir experiencias que recordarán toda la vida.</p>
              <p>Este es uno de nuestros viajeros sobrevolando Queenstown. El viento en la cara, la sensación de libertad y esa mezcla de nervios y emoción justo antes de despegar… hay momentos que se quedan contigo para siempre.</p>
            </div>
          </div>
          <div className="reel-instagram">
            <a className="btn btn-outline" href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">Ver más en Instagram<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
          </div>
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Testimonios ──────────────────────────────── */}
      {resenaDestacada && resenaDestacada.length > 0 && (
        <section>
          <div className="wrap">
            <h2 className="sec-eyebrow">Lo que cuentan</h2>
            <p className="sec-title">Así lo viven nuestros viajeros</p>
            <div className="testi-grid">
              {resenaDestacada.map(resena => (
                <div key={resena.id} className="testi">
                  <q>{resena.content}</q>
                  <div className="who">{resena.author_name}</div>
                  {resena.video_url && (
                    <details className="testi-video">
                      <summary>Escuchar testimonio</summary>
                      <video src={resena.video_url} controls playsInline preload="metadata" aria-label={`Testimonio en vídeo de ${resena.author_name}`} />
                    </details>
                  )}
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/resenas">Leer más reseñas<span aria-hidden="true"> →</span></Link>
            </p>
          </div>
        </section>
      )}

      <SeparadorBaston />

      {/* ── Rutas — bloque oscuro ─────────────────────── */}
      <section id="rutas">
        <div className="wrap">
          <div className="ink-block rutas-black">
            <h2 className="sec-eyebrow">Nuestras opciones</h2>
            <p className="sec-title">Dos maneras de vivirlo</p>
            <p className="sec-sub">La misma ruta, tu formato: en grupo pequeño con fechas cerradas, o privado y a tu ritmo.</p>

            <div className="prod-list">
              {formatos.map(({ id, etiqueta, titulo, cuerpo, precioTitulo, precioNota, incluye, cta }) => (
                <article key={id} id={id} aria-labelledby={`${id}-heading`} className="prod-card">
                  <div className="prod-card__head">
                    <span className="prod-card__etiqueta">{etiqueta}</span>
                    <h3 id={`${id}-heading`} className="prod-card__titulo">{titulo}</h3>
                    <p className="prod-card__desc">{cuerpo}</p>
                  </div>

                  <div className="prod-card__footer">
                    <p className="prod-card__precio">{precioTitulo}</p>
                    <p className="prod-card__precio-nota">{precioNota}</p>
                    <p className="prod-card__incluye-nota"><strong>Incluido:</strong> {incluye}</p>
                    <div className="cta-row">
                      <Link to="/contacto" className="btn btn-solid">{cta}</Link>
                    </div>
                  </div>
                </article>
              ))}
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
        </div>
      </section>

      <SeparadorBaston />

      {/* ── Audio clips ──────────────────────────────── */}
      <section aria-labelledby="audio-clips-heading">
        <div className="wrap">
          <h2 id="audio-clips-heading" className="sec-eyebrow">Escucha nuestros momentos más top</h2>
          <p className="sec-title">El país por los sentidos</p>
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

      <SeparadorBaston />

      {/* ── Nosotras ─────────────────────────────────── */}
      <section id="nosotras">
        <div className="wrap">
          <div className="origin">
            <div className="origin-grid">
              <div className="origin-photo">
                <img src={nosotrasImg.src} alt={nosotrasImg.alt} />
              </div>
              <div className="origin-inner">
                <h2 className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>Nuestra historia</h2>
                <p>Hace casi 8 años llegamos a Nueva Zelanda con una mochila llena de sueños e incertidumbre. Hoy somos Sylvie y Moni, las guías de Watchout — porque nadie como nosotras para contar, más allá de lo visual, la magia de este país que llamamos casa.</p>
                <Link to="/sobre-nosotras" className="btn btn-outline" style={{ color: 'var(--paper)', borderColor: 'var(--gold-soft)' }}>Conoce nuestra historia completa</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog preview ─────────────────────────────── */}
      {posts && posts.title && (
        <section>
          <div className="wrap">
            <h2 className="sec-eyebrow">¿Cómo se vive?</h2>
            <p className="sec-title">Por si quieres saber más</p>
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
          <h2>¿No sabes por dónde empezar?</h2>
          <p>Organizar un viaje accesible puede generar muchas preguntas.</p>
          <p>Escríbenos. Resolveremos tus dudas y veremos juntas qué opción encaja mejor contigo.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link to="/contacto" className="btn btn-solid">Cuéntanos qué necesitas</Link>
            <a
              href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20saber%20más%20sobre%20los%20viajes%20de%20Watchout%20Tours"
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
