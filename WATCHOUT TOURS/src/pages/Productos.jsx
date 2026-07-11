import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import '../styles/pagestyle/Productos.css'

const rutas = [
  {
    id: 'ruta-a',
    tag: 'Ruta A',
    noches: '11 noches',
    camino: ['Auckland', 'Rotorua', 'Queenstown', 'Tekapo', 'Christchurch'],
    highlights: ['Wētā Workshop', 'Hobbiton', 'Te Puia · hāngi', 'Milford Sound', 'Onsen', 'Stargazing'],
    descripcion: 'La ruta clásica: la geotermia de Rotorua, la Tierra Media de Hobbiton, la adrenalina de Queenstown y las estrellas de Tekapo.',
  },
  {
    id: 'ruta-b',
    tag: 'Ruta B',
    noches: '13 noches · con Kaikōura',
    camino: ['Todo lo de la Ruta A', 'Kaikōura', 'vuelta a Christchurch'],
    highlights: ['Todo lo de la Ruta A', 'Whale Watch · oír a las ballenas'],
    descripcion: 'La extensión con Kaikōura: dos noches más para escuchar a las ballenas por hidrófono en mar abierto.',
    destacada: true,
  },
]

const formatos = [
  {
    id: 'grupo',
    etiqueta: '14 días por Nueva Zelanda · grupo de 3 a 6 viajeros + nosotras dos',
    titulo: 'La aventura compartida',
    cuerpo: 'Un grupo pequeñito de gente con las mismas ganas que tú de comerse el mundo. 13 noches recorriendo Nueva Zelanda, riéndonos, flipando y sintiéndolo todo juntos. De esos viajes de los que vuelves con amigos para toda la vida. Y siempre nosotras dos pegadas al grupo, de principio a fin.',
    precioTitulo: 'Desde 9.500 € por persona · todo incluido',
    precioNota: 'Viajamos de 3 a 6 personas. Sin letra pequeña: te damos el número exacto en cuanto hablemos.',
    incluye: 'Alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo las 13 noches.',
    cta: 'Quiero apuntarme',
  },
  {
    id: 'privado',
    etiqueta: 'Privado · solo para ti y los tuyos · duración a tu ritmo',
    titulo: 'Tu viaje, a tu medida',
    cuerpo: 'Un viaje pensado solo para ti, y para quien quieras traer contigo. Nosotras dos, en exclusiva, diseñándolo a tu ritmo: tus días, tu energía, tu tiempo. Si quieres más calma, más calma. Si quieres más adrenalina, más adrenalina. Aquí no hay molde. Hay un viaje que te hacemos a medida, como un traje.',
    precioTitulo: 'Precio a medida',
    precioNota: 'Como lo diseñamos contigo, el precio también depende de ti: de cuántos días, de qué quieras vivir, de cómo lo sueñes. Sin compromiso y sin rollos.',
    incluye: 'Alojamientos, todas las actividades, transporte durante la ruta, comidas indicadas y nosotras dos contigo de principio a fin.',
    cta: 'Diseñemos el tuyo',
  },
]

export default function Productos() {
  return (
    <>
      <Seo
        pageType="productos"
        title="Rutas y viajes | WatchOut! Sensory Tours"
        description="Ruta clásica de 11 noches y su extensión con Kaikōura por Nueva Zelanda, para personas ciegas y con baja visión. En grupo pequeño o privado a medida."
      />

      {/* ── Cabecera ─────────────────────────────────── */}
      <section className="prod-hero">
        <div className="dots-texture"></div>
        <div className="wrap prod-hero-inner">
          <span className="sec-eyebrow">Las dos rutas</span>
          <h1 className="prod-titulo">Qué viaje vendemos</h1>
          <p className="prod-intro">
            Ruta clásica de 11 noches y su extensión con Kaikōura.
            Dos guías dedicadas de principio a fin.
          </p>
        </div>
      </section>

      {/* ── Rutas ────────────────────────────────────── */}
      <section className="prod-rutas">
        <div className="wrap">
          {rutas.map(({ id, tag, noches, camino, highlights, descripcion, destacada }) => (
            <article
              key={id}
              id={id}
              aria-labelledby={`${id}-heading`}
              className={`route${destacada ? ' route--destacada' : ''}`}
            >
              {destacada && <span className="route__ribbon">Recomendada</span>}
              <div className="route-head">
                <h2 id={`${id}-heading`} className="route-tag">{tag}</h2>
                <span className="route-nights">· {noches}</span>
              </div>
              <p className="route-desc">{descripcion}</p>
              <p className="route-path" aria-label={`Recorrido: ${camino.join(', luego ')}`}>
                <span aria-hidden="true">
                  {camino.map((parada, i) => (
                    <span key={parada}>
                      {i > 0 && ' → '}
                      <b>{parada}</b>
                    </span>
                  ))}
                </span>
              </p>
              <div className="hl">
                {highlights.map(h => <span key={h} className="hl-pill">{h}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Formatos ─────────────────────────────────── */}
      <section className="prod-formatos">
        <div className="wrap">
          <div className="sec-eyebrow">Nuestras opciones</div>
          <h2 className="sec-title">Dos maneras de vivirlo</h2>
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
                  <p className="prod-card__incluye-nota"><strong>Todo incluido:</strong> {incluye}</p>
                  <div className="cta-row">
                    <Link to="/contacto" className="btn btn-solid">{cta}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────── */}
      <section className="prod-cta-section">
        <div className="wrap">
          <div className="ink-block prod-cta">
            <div className="sec-eyebrow" style={{ color: 'var(--jade-soft)' }}>¿Dudas?</div>
            <h2 className="prod-cta__titulo">Hablar es gratis.</h2>
            <p>
              Cuéntanos qué tienes en la cabeza y vemos juntas cómo darle forma.
              Sin compromiso, sin prisa y sin rollos.
            </p>
            <Link to="/contacto" className="btn btn-solid">Cuéntanos tu sueño</Link>
          </div>
        </div>
      </section>
    </>
  )
}
