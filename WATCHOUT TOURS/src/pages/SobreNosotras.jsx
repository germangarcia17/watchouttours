import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pagestyle/SobreNosotras.css'
import '../styles/pagestyle/Filosofia.css'
import imgNosotras from '../images/sobre-nosotras.webp'
import { useSiteImage } from '../lib/siteImages'

const MONICA = [
  { emoji: '❤️', text: 'Cree que los mejores recuerdos nacen de las conversaciones que no estaban planeadas.' },
  { emoji: '☕', text: 'Un café con vistas siempre le parece un buen plan.' },
  { emoji: '🌿', text: 'Es de las que se detiene para escuchar un río, sentir el viento o simplemente respirar.' },
  { emoji: '😂', text: 'Tiene una risa contagiosa.' },
  { emoji: '🎧', text: 'Le fascina escuchar las historias de las personas, porque está convencida de que cada una tiene algo que enseñar.' },
]

const SYLVIE = [
  { emoji: '❄️', text: 'Creció viendo a su padre guiar a personas ciegas en la nieve, aprendiendo el verdadero valor de la confianza.' },
  { emoji: '🧭', text: 'Tiene un talento natural para salirse de la ruta y descubrir lugares únicos y secretos.' },
  { emoji: '☕', text: 'Su intuición nunca falla: siempre sabe dónde está el mejor café o el postre más espectacular.' },
  { emoji: '🌊', text: 'Transmite una calma contagiosa que transforma cualquier imprevisto en una nueva aventura.' },
  { emoji: '🤍', text: 'Lo tiene claro: las personas y sus emociones siempre van por delante del itinerario.' },
]

const PRINCIPIOS = [
  { num: '01', titulo: 'Diseñado para, no adaptado desde', texto: 'Construimos cada viaje desde el primer paso pensando en quién viaja con nosotras.' },
  { num: '02', titulo: 'El lujo es sensorial, no visual', texto: 'El silencio de un fiordo al amanecer es opulento para cualquier sentido.' },
  { num: '03', titulo: 'Grupos de máximo seis', texto: 'Porque la experiencia sensorial requiere espacio y cada persona tiene su ritmo.' },
  { num: '04', titulo: 'Respeto a la cultura maorí', texto: 'Trabajamos con las comunidades locales, no sobre ellas.' },
  { num: '05', titulo: 'Cero condescendencia', texto: 'Nuestras viajeras son adultas que han decidido vivir una aventura extraordinaria.' },
]

export default function SobreNosotras() {
  useEffect(() => { document.title = 'Sobre nosotras | Watchout Tours' }, [])

  const heroImg = useSiteImage('sobre-nosotras', 'hero', imgNosotras,
    'Mónica y Sylvie sonriendo en un selfie frente a un géiser humeante en Rotorua, Nueva Zelanda')

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="sn-hero">
        <div className="dots-texture"></div>
        <div className="wrap sn-hero-grid">
          <div className="sn-hero-inner">
            <h1 className="sec-eyebrow">El corazón del proyecto</h1>
            <p className="sn-titulo">Mucho más<br />que un viaje.</p>
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
          <div className="ink-block sn-aprendizaje">
            <h2 className="sec-eyebrow">Lo que hemos aprendido</h2>
            <p className="sn-aprendizaje-titulo">
              Antes de empezar esta aventura pensábamos que estábamos creando viajes
              accesibles. Hoy sabemos que es mucho más que eso.
            </p>
            <div className="sn-aprendizaje-cols">
              <p>
                Cada viaje nos recuerda que existen muchas maneras de percibir el mundo.
                Cuando compartimos esas formas de sentir, escuchar, tocar y descubrir,
                algo cambia en todos los que estamos allí.
              </p>
              <p>
                Hemos visto cómo personas que no se conocían terminan conectando de una
                forma profundamente humana. Cómo un pequeño detalle pasa a tener un gran
                significado. Cómo aprendemos a confiar más, a escuchar mejor y a estar
                realmente presentes.
              </p>
            </div>
            <p className="sn-aprendizaje-final">
              Por eso creemos que el verdadero impacto de estos viajes no está solo en los
              lugares que visitamos. Está en las personas en las que nos convertimos cuando
              los vivimos juntos.
            </p>
            <p className="sn-aprendizaje-negrita">
              <strong>
                Nuestra mayor ilusión es que vuelvas a casa con la sensación de haber vivido
                algo que recordarás toda la vida. Porque los mejores viajes no se miden por
                los kilómetros recorridos, sino por lo que dejan dentro de nosotros.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* ── Hola, somos Mónica y Sylvie ─────────────── */}
      <section>
        <div className="wrap sn-hola">
          <h2 className="sec-eyebrow"><span aria-hidden="true">👋 </span>Hola</h2>
          <p className="sec-title">Somos Mónica y Sylvie.</p>
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
          <h2 className="sec-eyebrow">De tú a tú</h2>
          <p className="sec-title">Cinco cosas sobre nosotras</p>
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

      {/* ── Nuestra filosofía (integrada) ────────────── */}
      <section aria-labelledby="filosofia-heading">
        <div className="wrap">
          <h2 id="filosofia-heading" className="sec-eyebrow">Nuestra filosofía</h2>
          <p className="sec-title">Cinco principios que guían cada decisión</p>
          <ol role="list" className="filo-lista">
            {PRINCIPIOS.map(({ num, titulo, texto }) => (
              <li key={num} className="filo-principio">
                <span aria-hidden="true" className="filo-principio__num">{num}</span>
                <div className="filo-principio__contenido">
                  <h3 className="filo-principio__titulo">{titulo}</h3>
                  <p className="filo-principio__texto">{texto}</p>
                </div>
              </li>
            ))}
          </ol>
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
            <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
          </div>
        </div>
      </section>
    </>
  )
}
