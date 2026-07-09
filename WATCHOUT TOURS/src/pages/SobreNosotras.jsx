import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/SobreNosotras.css'
import imgNosotras from '../images/sobre-nosotras.webp'
import { useSiteImage } from '../lib/siteImages'

const MONICA = [
  { emoji: '❤️', text: 'Cree que las mejores conversaciones aparecen caminando.' },
  { emoji: '☕', text: 'Nunca dice que no a un café con vistas.' },
  { emoji: '🌿', text: 'Siempre encuentra una excusa para parar cinco minutos más en la naturaleza.' },
  { emoji: '😂', text: 'Se ríe muy fuerte.' },
  { emoji: '🎧', text: 'Es capaz de emocionarse escuchando una historia.' },
]

const SYLVIE = [
  { emoji: '⛷️', text: 'Creció viendo a su padre guiar a personas ciegas en la nieve.' },
  { emoji: '🧭', text: 'Tiene un talento especial para encontrar lugares únicos.' },
  { emoji: '🍰', text: 'Siempre sabe dónde está el mejor café... o el mejor postre.' },
  { emoji: '🌊', text: 'Transmite calma incluso cuando el plan cambia.' },
  { emoji: '🤍', text: 'Cree que las personas siempre están por delante del itinerario.' },
]

const VIAJANDO_CON_NOSOTRAS = [
  { emoji: '☕', text: 'Siempre hay tiempo para un buen café.' },
  { emoji: '🥾', text: 'Nos cuesta pasar de largo cuando un lugar merece cinco minutos más.' },
  { emoji: '😂', text: 'Creemos que el sentido del humor hace cualquier viaje mejor.' },
  { emoji: '🌿', text: 'Somos unas enamoradas de la naturaleza.' },
  { emoji: '❤️', text: 'Disfrutamos muchísimo viendo cómo un grupo de desconocidos acaba sintiéndose como un equipo.' },
]

const VALORES = [
  'Mucho sentido del humor.',
  'Conversaciones que probablemente recordarás durante años.',
  'Flexibilidad, porque los mejores momentos casi nunca están en el itinerario.',
  'Respeto por cada persona y su manera de vivir el mundo.',
  'Ganas de compartir, aprender y sorprendernos juntos.',
]

export default function SobreNosotras() {
  useEffect(() => { document.title = 'Sobre nosotras | WatchOut! Sensory Tours' }, [])

  const heroImg = useSiteImage('sobre-nosotras', 'hero', imgNosotras,
    'Mónica y Sylvie sonriendo en un selfie frente a un géiser humeante en Rotorua, Nueva Zelanda')

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="sn-hero">
        <div className="dots-texture"></div>
        <div className="wrap sn-hero-grid">
          <div className="sn-hero-inner">
            <span className="sec-eyebrow">El corazón del proyecto</span>
            <h1 className="sn-titulo">Mucho más<br />que un viaje.</h1>
            <p className="sn-intro">
              Watchout nace del deseo de crear experiencias donde las personas ciegas o con
              discapacidad visual puedan descubrir Nueva Zelanda desde un lugar más sensorial,
              humano y auténtico.
            </p>
            <p className="sn-intro">
              Pero también nace con otro propósito: ayudar a abrir conversaciones, generar
              conciencia de lo invisible y despertar nuevas formas de viajar que las personas
              quieran compartir.
            </p>
          </div>
          <div className="sn-hero-photo">
            <img src={heroImg.src} alt={heroImg.alt} />
          </div>
        </div>
      </section>

      {/* ── Lo que hemos aprendido — bloque oscuro ───── */}
      <section>
        <div className="wrap">
          <div className="ink-block">
            <div className="sec-eyebrow sn-eyebrow-jade">Lo que hemos aprendido</div>
            <h2 className="sn-aprendizaje-titulo">
              Los viajeros nos han enseñado a cambiar nuestra manera de mirar el mundo.
            </h2>
            <div className="sn-aprendizaje-cols">
              <p>
                Cuando dejamos de vivir únicamente desde la vista, empezamos a conectar de
                forma mucho más profunda con las personas, los lugares y los pequeños detalles.
              </p>
              <p>
                Los viajeros ciegos no solo viven la experiencia, sino que muchas veces también
                transforman la de quienes les rodean. Nos recuerdan otras formas de escuchar,
                sentir, confiar y estar presentes. Y eso tiene un impacto humano enorme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hola, somos Mónica y Sylvie ─────────────── */}
      <section>
        <div className="wrap sn-hola">
          <div className="sec-eyebrow"><span aria-hidden="true">👋 </span>Hola</div>
          <h2 className="sec-title">Somos Mónica y Sylvie.</h2>
          <p className="sn-text">
            Dos españolas que llegaron a Nueva Zelanda hace siete años con una mochila llena
            de ilusión... y que todavía siguen sorprendiéndose con este país.
          </p>
          <p className="sn-text">
            Nos encanta madrugar para ver un amanecer, improvisar una parada porque alguien
            ha escuchado un río escondido, reírnos durante horas en la furgoneta y terminar
            el día compartiendo historias alrededor de una mesa.
          </p>
          <blockquote className="sn-quote">
            <p>"Nunca había vivido algo así."</p>
            <cite>— Lo que más nos emociona escuchar</cite>
          </blockquote>
          <p className="sn-text">
            Somos curiosas por naturaleza. Nos encanta preguntar, escuchar historias y
            descubrir cómo vive el mundo cada persona. Quizá por eso Watchout nació de
            forma tan natural.
          </p>
        </div>
      </section>

      {/* ── 5 cosas sobre nosotras ───────────────────── */}
      <section>
        <div className="wrap">
          <div className="sec-eyebrow">De tú a tú</div>
          <h2 className="sec-title">Cinco cosas sobre nosotras</h2>
          <div className="sn-cinco-grid">

            <article className="sn-persona-card">
              <h3 className="sn-persona-nombre">Mónica</h3>
              <ul role="list" className="sn-lista">
                {MONICA.map(({ emoji, text }) => (
                  <li key={text} className="sn-lista__item">
                    <span aria-hidden="true" className="sn-lista__emoji">{emoji}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="sn-persona-card">
              <h3 className="sn-persona-nombre">Sylvie</h3>
              <ul role="list" className="sn-lista">
                {SYLVIE.map(({ emoji, text }) => (
                  <li key={text} className="sn-lista__item">
                    <span aria-hidden="true" className="sn-lista__emoji">{emoji}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </article>

          </div>
        </div>
      </section>

      {/* ── Si viajaras con nosotras ─────────────────── */}
      <section>
        <div className="wrap">
          <div className="sec-eyebrow">Aviso honesto</div>
          <h2 className="sec-title">Si viajaras con nosotras descubrirías que…</h2>
          <ul role="list" className="sn-pills">
            {VIAJANDO_CON_NOSOTRAS.map(({ emoji, text }) => (
              <li key={text} className="sn-pill">
                <span aria-hidden="true">{emoji}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Lo que encontrarás ───────────────────────── */}
      <section>
        <div className="wrap">
          <div className="sn-valores-card">
            <h2 className="sn-valores-titulo">Lo que encontrarás si viajas con nosotras</h2>
            <ul role="list" className="sn-valores-lista">
              {VALORES.map(v => (
                <li key={v} className="sn-valores-item">
                  <span className="sn-valores-check" aria-hidden="true">✓</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────── */}
      <section className="sn-cierre">
        <div className="wrap">
          <p className="sn-cierre-texto">
            Pensábamos que íbamos a enseñar Nueva Zelanda. Y al final ha sido Nueva
            Zelanda —y las personas con las que hemos compartido el camino— quien nos
            ha enseñado a nosotras.
          </p>
          <p className="sn-cierre-deseo">
            Nuestra mayor ilusión es que cuando vuelvas a casa no solo recuerdes los
            lugares que visitaste. Que también descubras que prestas atención a cosas
            que antes pasaban desapercibidas.
          </p>
          <p className="sn-cierre-texto">Porque quizá ese sea el mejor souvenir que puedas llevarte.</p>

          <div className="cta-row sn-cierre-ctas">
            <Link to="/contacto" className="btn btn-solid">Hablemos</Link>
            <Link to="/filosofia" className="btn btn-outline">Conoce nuestra filosofía</Link>
          </div>
        </div>
      </section>
    </>
  )
}
