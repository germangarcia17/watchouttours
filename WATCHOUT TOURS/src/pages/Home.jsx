import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/Home.css'
import imgSensorial from '../images/farrinni-0dso2fC54ug-unsplash.webp'
import imgSobreNosotras from '../images/sobre-nosotras.webp'
import { AudioPlayer } from '../components/AudioPlayer'
import audioParapente from '../images/Saltando en parapente.mp3'
import audioAlpaca from '../images/Cuando la alpaca le mordió.mp3'

/*todo esto antes del export default es la funcion de la fecha,
 para cambiar la fecha simplemente cambiar la fecha de debajo de este comentario*/ 
const TARGET_DATE = new Date('2026-09-20T00:00:00');

function calcularTiempo() {
  const ahora = new Date();
  const diferencia = TARGET_DATE - ahora;

  if (diferencia <= 0) return { dias: 0, horas: 0};

  return {
    dias: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diferencia / (1000 * 60 * 60)) % 24),
  };
}

export default function Home() {
  const [resenaDestacada, setResenaDestacada] = useState(null)
  const [posts, setPosts]                     = useState([])
  const [tiempo, setTiempo] = useState(calcularTiempo())
  const [playingAudio, setPlayingAudio] = useState(null)

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
    const intervalo = setInterval(() => {
      setTiempo(calcularTiempo());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const unidades = [
    { label: 'Días', valor: tiempo.dias },
    { label: 'Horas', valor: tiempo.horas },
    
  ];

  return (
    <>
    {/* Hero */}
        <section className="section" aria-labelledby="intro-video-heading">
        <div className="video-container">
            <video controls src="" poster="/videos/intro-poster.jpg" controls />
        </div>
        <div className="container hero-container">
          <h1 id="hero-heading" className="hero__title"> No toda visión necesita ojos </h1>
          <div className="hero__actions">
            <Link to="/contacto" className="btn btn--hero btn--primary">Cuéntanos tu sueño</Link>
            <Link to="/resenas" className="btn btn--hero btn--primary">Mira como lo vivimos!</Link>
          </div>
        </div>
      </section>
      


      {/* Sensorial cards */}
      <section className="section main-section-info" aria-labelledby="sensorial-heading">
        <h2 className='section-info-title'>¿Cómo son nuestros viajes?</h2>
        <div className="container container-info">
        <div className="section-info">
          <div className="section-info-text">
              <h3>¡Te entiendo! Sabemos que venir a Nueva Zelanda está al otro lado del mundo y eso impone. </h3>
              <p>Por eso creamos experiencias inclusivas que permiten a las personas ciegas y con baja visión explorar Nueva Zelanda con libertad, confianza y mucha emoción. </p>
          </div>
          <img src={imgSensorial} alt="Imagen de experiencias sensoriales" className='section-img' />
        </div>
          {/* Testimonio destacado */}
      {resenaDestacada && (
        <div className="testimonio-container">
          <div className="testimonio" aria-labelledby="testimonio-heading">
            <h3 id="testimonio-heading" className="sr-only">Testimonio destacado</h3>
            {resenaDestacada.map(resena => (
              <figure key={resena.id}>
                <blockquote className="testimonio__author">
                  <strong>{resena.author_name}</strong>
                  <p className="testimonio__quote">&ldquo;{resena.content && ` — ${resena.content}`}&rdquo;</p>
                </blockquote>
              </figure>
            ))}
          </div>
          <Link to="/resenas" className="testimonio-link">Leer más reseñas →</Link>
        </div>
      )}
          </div>
      </section>

      <section className="section sobre-nosotras-section" aria-labelledby="sobre-nosotras-heading">
        <div className="container">
          <h2 id="sobre-nosotras-heading" className="section__title">Sobre nosotras</h2>
          <div className="sobre-nosotras-text">
            <p className="sobre-nosotras-p">Soñamos con una Nueva Zelanda donde la accesibilidad no sea una excepción, sino parte natural de la experiencia viajera.</p>
            <p className="sobre-nosotras-p">Queremos colaborar con personas, empresas y organizaciones que crean en un turismo más humano, inclusivo y consciente.</p>
            <p className="sobre-nosotras-p">Y sobre todo, queremos seguir creando experiencias que permitan a más personas sentirse parte del mundo, independientemente de cómo lo perciban.</p>
            <Link to="/filosofia" className="btn btn--primary btn--hero">Conoce nuestra filosofía</Link>
          </div>
        </div>
        <div className="sobre-nosotras-image">
          <img src={imgSobreNosotras} alt="Imagen de nosotras" className='section-img-nosotras' />
        </div>
      </section>
      

      {/* Últimos artículos */}
      {posts && (
        <section className="section" aria-labelledby="blog-home-heading">
          <div className="container">
            <h2 id="blog-home-heading" className="section-title-blogs">¿Cómo se vive? El país por los sentidos</h2>
            <div className="blog-main-card">
                  <article key={posts.id} className="card blog-card-main">
                    <h3 className="blog-card__title">{posts.title}</h3>
                    <p>{posts.excerpt}</p>
                    <p>Tiempo de lectura: {posts.reading_time} mins</p>
                    <div className="blog-card__footer">
                      <Link to={`/blog/${posts.slug}`} className="blog-link">
                        Leer artículo: <span className="sr-only read-article"> {posts.title}</span> 
                      </Link>
                    </div>
                  </article>
              
            </div>
            <p style={{ marginTop: '2rem' }}>
              <Link to="/blog">Ver todos los artículos →</Link>
            </p>
          </div>
        </section>
      )}

      <section className="section" aria-labelledby="opciones-heading">
        <div className="container container-premium">
          <h2 id="opciones-heading" className="section-info-title">Nuestras opciones</h2>

          <div className="opciones-cards">

            {/* Tarjeta 1 — Viaje privado */}
            <article className="opcion-card">
              <span className="opcion-card__etiqueta">Privado · solo para ti y los tuyos · duración a tu ritmo</span>
              <h3 className="opcion-card__titulo">Tu viaje, a tu medida</h3>
              <p className="opcion-card__cuerpo">
                Un viaje pensado solo para ti, y para quien quieras traer contigo. Nosotras dos, en exclusiva, diseñándolo a tu ritmo: tus días, tu energía, tu tiempo. Si quieres más calma, más calma. Si quieres más adrenalina, más adrenalina. Aquí no hay molde. Hay un viaje que te hacemos a medida, como un traje.
              </p>
              <div className="opcion-card__precio">
                <h4 className="opcion-card__precio-titulo">Precio a medida</h4>
                <p>Como lo diseñamos contigo, el precio también depende de ti: de cuántos días, de qué quieras vivir, de cómo lo sueñes. Cuéntanos qué tienes en la cabeza y te preparamos una propuesta hecha a tu medida. Sin compromiso y sin rollos.</p>
              </div>
              <div className="opcion-card__incluye">
                <p><strong>Todo incluido:</strong> alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo de principio a fin.</p>
              </div>
              <Link to="/contacto" className="btn btn--primary opcion-card__cta">Diseñemos el tuyo</Link>
            </article>

            {/* Tarjeta 2 — Viaje en grupo */}
            <article className="opcion-card">
              <span className="opcion-card__etiqueta">14 días por Nueva Zelanda · grupo de 3 a 6 viajeros + nosotras dos</span>
              <h3 className="opcion-card__titulo">La aventura compartida</h3>
              <p className="opcion-card__cuerpo">
                Un grupo pequeñito de gente con las mismas ganas que tú de comerse el mundo. 13 noches recorriendo Nueva Zelanda, riéndonos, flipando y sintiéndolo todo juntos. De esos viajes de los que vuelves con amigos para toda la vida. Y siempre nosotras dos pegadas al grupo, de principio a fin.
              </p>
              <div className="opcion-card__precio">
                <h4 className="opcion-card__precio-titulo">Desde 9.500 € por persona · todo incluido</h4>
                <p>Viajamos de 3 a 6 personas. Sin letra pequeña: te damos el número exacto en cuanto hablemos.</p>
              </div>
              <div className="opcion-card__incluye">
                <p><strong>Todo incluido:</strong> alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo las 13 noches.</p>
              </div>
              <Link to="/contacto" className="btn btn--primary opcion-card__cta">Quiero apuntarme</Link>
            </article>

          </div>

          {/* Contador — aviso viaje en grupo */}
          <div className="contador-aviso">
            <p className="contador-aviso__texto">¡Nuestro próximo viaje en grupo comienza en:</p>
            <div className="contador">
              {unidades.map(({ label, valor }) => (
                <div key={label} className="contador__bloque">
                  <span className="contador__numero">{String(valor).padStart(2, '0')}</span>
                  <span className="contador__label">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    <section className="section" aria-labelledby="audio-clips-heading">
        <div className="container container-premium">
            <h2 id="audio-clips-heading" className="section-info-title">El país por los sentidos</h2>
            <p className="audio-section__intro">Cierra los ojos. Así se siente Nueva Zelanda.</p>
            <div className="audio-cards">

              <div className="audio-card">
                <div className="audio-card__header">
                  <span className="audio-card__icono" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  </span>
                  <div>
                    <h3 className="audio-card__titulo">¡Salto en parapente!</h3>
                    <span className="audio-card__etiqueta">Así suena volar por primera vez</span>
                  </div>
                </div>
                <p className="audio-card__descripcion">El viento en la cara, la sensación de libertad, el corazón latiendo al ritmo de la aventura. Esto es lo que sientes cuando te lanzas en parapente por primera vez.</p>
                <AudioPlayer src={audioParapente} playerId="parapente" playingId={playingAudio} setPlayingId={setPlayingAudio} />
              </div>

              <div className="audio-card">
                <div className="audio-card__header">
                  <span className="audio-card__icono" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                  </span>
                  <div>
                    <h3 className="audio-card__titulo">La mordida de una alpaca</h3>
                    <span className="audio-card__etiqueta">Un ataque inesperado</span>
                  </div>
                </div>
                <p className="audio-card__descripcion">Ni siquiera en Nueva Zelanda estás a salvo de una alpaca curiosa.</p>
                <AudioPlayer src={audioAlpaca} playerId="alpaca" playingId={playingAudio} setPlayingId={setPlayingAudio} />
              </div>

            </div>
        </div>
    </section>

      {/* CTA final */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container cta-section__inner">
          <p className="cta-section__eyebrow">¿Listo para sentirlo?</p>
          <h2 id="cta-heading" className="cta-section__titulo">
            La aventura pertenece a todas las personas.
          </h2>
          <p className="cta-section__subtitulo">
            Cuéntanos quién eres y qué sueñas sentir.<br />
            Diseñaremos juntas el viaje que mereces.
          </p>
          <div className="cta-section__actions">
            <Link to="/contacto" className="btn btn--primary btn--hero">Escríbenos</Link>
            <a
              href="https://wa.me/64XXXXXXXXX"
              className="cta-section__whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contáctanos por WhatsApp"
            ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z"/>
        </svg>{' '}WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}
