import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import '../styles/pagestyle/Productos.css'



const formatos = [
  {
    id: 'grupo',
    etiqueta: '14 días por Nueva Zelanda · grupo de 3 a 6 viajeros + nosotras dos',
    titulo: 'La aventura compartida',
    cuerpo: 'Un grupo pequeñito de gente con las mismas ganas que tú de comerse el mundo. 13 noches recorriendo Nueva Zelanda, riéndonos, flipando y sintiéndolo todo juntos. De esos viajes de los que vuelves con amigos para toda la vida. Y siempre nosotras dos pegadas al grupo, de principio a fin.',
    precioTitulo: 'Desde 9.500 € por persona',
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
      
      {/* ── Formatos ─────────────────────────────────── */}
      <section className="prod-formatos">
        <div className="wrap">
          <h1 className="sec-eyebrow">Nuestras opciones</h1>
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
                  <p className="prod-card__incluye-nota"><strong>Incluye:</strong> {incluye}</p>
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
