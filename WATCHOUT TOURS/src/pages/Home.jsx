import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../styles/pagestyle/Home.css'

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
  const [tiempo, setTiempo] = useState(calcularTiempo());

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
      <section className="section" aria-labelledby="sensorial-heading">
        <div className="container">
        <h2 className='section-info-title'>¿Cómo son nuestros viajes?</h2>
        <div className="section-info">
          <div className="section-info-text">
              <h3>¡Te entiendo! Sabemos que venir a Nueva Zelanda está al otro lado del mundo y eso impone. </h3>
              <p>Por eso creamos experiencias inclusivas que permiten a las personas ciegas y con baja visión explorar Nueva Zelanda con libertad, confianza y mucha emoción. </p>
          </div>
          <img src="/images/sensorial-cards.jpg" alt="Imagen de experiencias sensoriales" style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }} />
        </div>
          {/* Testimonio destacado */}
      {resenaDestacada && (
        <div className="testimonio" aria-labelledby="testimonio-heading">
          <h3 id="testimonio-heading" className="sr-only">Testimonio destacado</h3>
          {resenaDestacada.map(resena => (
            <figure key={resena.id}>
              <blockquote className="testimonio__author">
                <strong>{resena.author_name}</strong>
              <p className="testimonio__quote">&ldquo;{resena.content && ` — ${resena.content}`}&rdquo;</p>
            </blockquote>
          </figure>))}
          <Link to="/resenas" className="testimonio__link">
            Leer más reseñas →
          </Link>
        </div>
      )}
          </div>
      </section>

      <section className="section sobre-nosotras-section" aria-labelledby="sobre-nosotras-heading">
        <div className="container">
          <h2 id="sobre-nosotras-heading" className="section__title">Sobre nosotras</h2>
          <div className="sobre-nosotras-text">
            <p>Somos un equipo de mujeres apasionadas por la aventura y la inclusión. Nos dedicamos a crear experiencias de viaje únicas para personas ciegas y con baja visión, permitiéndoles explorar Nueva Zelanda de una manera sensorial y enriquecedora.</p>
            <Link to="/filosofia" className="btn btn--primary">Conoce nuestra filosofía</Link>
          </div>
        </div>
        <div className="sobre-nosotras-image">
          <img src="/images/sobre-nosotras.jpg" alt="Imagen de nosotras" style={{ width: '100%', marginTop: '1rem', borderRadius: '8px' }} />
        </div>
      </section>
      

      {/* Últimos artículos */}
      {posts && (
        <section className="section" aria-labelledby="blog-home-heading">
          <div className="container">
            <h2 id="blog-home-heading" className="section__title">¿Cómo se vive? El país por los sentidos</h2>
            <div className="blog-main-card">
                  <article key={posts.id} className="card blog-card-main">
                    <h3>{posts.title}</h3>
                    <p>{posts.excerpt}</p>
                    <div className="blog-card__footer">
                      <Link to={`/blog/${posts.slug}`}>
                        Leer artículo<span className="sr-only">: {posts.title}</span> en {posts.reading_time} min
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

      <section className="section" aria-labelledby="group-trip-heading">
        <div>


        <h2>Nuestras opciones</h2>
        <div className='container'>
          <h3>Viajes individuales</h3>
          <div className="individual-trips">blablabla</div>
        </div>
        <div className="container">
          <h2 id="group-trip-heading" className="section__title">Viajes en grupo</h2>
            <div className="group-trip-info">
                <p>¡Nuestro próximo viaje en grupo comienza en:</p>
            </div>
            <div className="contador">
                {unidades.map(({ label, valor }) => (
                    <div key={label} className="contador__bloque">
                    <span className="contador__numero">
                        {String(valor).padStart(2, '0')}
                    </span>
                    <span className="contador__label">{label}</span>
                    </div>
                ))}
            </div>
            
        </div>
        </div>
    </section>

    <section className="section" aria-labelledby="audio-clips-heading">
        <div className="container">
            <h2 id="audio-clips-heading" className="section__title">El pais de los sentidos</h2>
            <div className="audio-clips">
                <audio controls>
                    <source src="/audio/clip1.mp3" type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
            </audio>
            <audio controls>
                <source src="/audio/clip2.mp3" type="audio/mpeg" />
                Tu navegador no soporta el elemento de audio.
            </audio>
            </div>
        </div>
    </section>

      {/* CTA final */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <h2 id="cta-heading">Creemos en un mundo donde la aventura pertenece a todos. 🌎✨ </h2>
          <p>Cuéntanos quién eres y qué sueñas sentir. Diseñaremos juntas el viaje que mereces.</p>
          <Link to="/contacto" className="btn btn--primary">Comenzar mi viaje</Link>
        </div>
      </section>
    </>
  )
}
