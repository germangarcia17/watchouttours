import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/SobreNosotras.css'

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

  return (
    <div className="sn-page">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="container sn-hero">
        <p className="sn-eyebrow">El corazón del proyecto</p>
        <h1 className="sn-titulo">Mucho más que un viaje.</h1>
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
        <p className="sn-intro">
          Creemos que muchas veces el mundo no necesita más velocidad, sino saber apreciar
          lo que ya tenemos de una forma más real.
        </p>
      </div>

      {/* ── Lo que hemos aprendido ───────────────────── */}
      <div className="sn-aprendizaje">
        <div className="container sn-aprendizaje__inner">
          <h2 className="sn-aprendizaje__titulo">
            Los viajeros nos han enseñado a cambiar nuestra manera de mirar el mundo.
          </h2>
          <div className="sn-aprendizaje__cols">
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

      {/* ── Hola, somos Mónica y Sylvie ─────────────── */}
      <div className="container sn-hola">
        <p className="sn-eyebrow">👋 Hola</p>
        <h2 className="sn-section-titulo">Somos Mónica y Sylvie.</h2>
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

      {/* ── 5 cosas sobre nosotras ───────────────────── */}
      <div className="container sn-cinco">
        <h2 className="sn-section-titulo">Cinco cosas sobre nosotras</h2>
        <div className="sn-cinco__grid">

          <div className="sn-persona-card">
            <h3 className="sn-persona-card__nombre">Mónica</h3>
            <ul role="list" className="sn-cinco__lista">
              {MONICA.map(({ emoji, text }) => (
                <li key={text} className="sn-cinco__item">
                  <span aria-hidden="true">{emoji}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="sn-persona-card">
            <h3 className="sn-persona-card__nombre">Sylvie</h3>
            <ul role="list" className="sn-cinco__lista">
              {SYLVIE.map(({ emoji, text }) => (
                <li key={text} className="sn-cinco__item">
                  <span aria-hidden="true">{emoji}</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Si viajaras con nosotras ─────────────────── */}
      <div className="container sn-viajando">
        <h2 className="sn-section-titulo">Si viajaras con nosotras descubrirías que…</h2>
        <ul role="list" className="sn-viajando__lista">
          {VIAJANDO_CON_NOSOTRAS.map(({ emoji, text }) => (
            <li key={text} className="sn-viajando__item">
              <span aria-hidden="true" className="sn-viajando__emoji">{emoji}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Lo que encontrarás ───────────────────────── */}
      <div className="sn-valores">
        <div className="container">
          <h2 className="sn-section-titulo">Lo que encontrarás si viajas con nosotras</h2>
          <ul role="list" className="sn-valores__lista">
            {VALORES.map(v => (
              <li key={v} className="sn-valores__item">
                <span className="sn-valores__check" aria-hidden="true">✓</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Cierre ───────────────────────────────────── */}
      <div className="container sn-cierre">
        <p className="sn-text">
          Pensábamos que íbamos a enseñar Nueva Zelanda. Y al final ha sido Nueva
          Zelanda —y las personas con las que hemos compartido el camino— quien nos
          ha enseñado a nosotras.
        </p>
        <p className="sn-cierre__deseo">
          Nuestra mayor ilusión es que cuando vuelvas a casa no solo recuerdes los
          lugares que visitaste. Que también descubras que prestas atención a cosas
          que antes pasaban desapercibidas.
        </p>
        <p className="sn-text">
          Porque quizá ese sea el mejor souvenir que puedas llevarte.
        </p>

        <div className="sn-cierre__ctas">
          <Link to="/contacto" className="btn btn--primary btn--hero">Hablemos</Link>
          <Link to="/filosofia" className="sn-cierre__link">Conoce nuestra filosofía →</Link>
        </div>
      </div>

    </div>
  )
}

