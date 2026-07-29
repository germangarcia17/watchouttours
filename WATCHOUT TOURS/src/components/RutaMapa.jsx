import { useTranslation } from 'react-i18next'
import '../styles/components/RutaMapa.css'

/* Coordenadas del pin en % sobre el viewBox del mapa esquemático (no es
   cartografía precisa: es una guía visual de conjunto). El contenido real
   y equivalente para lectores de pantalla vive en la lista de abajo, no
   en el mapa — un mapa interactivo por sí solo nunca es accesible para
   alguien que no puede verlo. */
const COORDS = [
  { id: 'auckland', x: 47, y: 8 },
  { id: 'rotorua', x: 57, y: 22 },
  { id: 'kaikoura', x: 57, y: 55 },
  { id: 'tekapo', x: 45, y: 70 },
  { id: 'queenstown', x: 33, y: 87 },
]

export default function RutaMapa() {
  const { t } = useTranslation()
  const textos = t('productos.mapa.paradas', { returnObjects: true })
  const paradas = COORDS.map((c, i) => ({ ...c, ...textos[i] }))

  return (
    <section className="ruta-mapa" aria-labelledby="ruta-mapa-heading">
      <div className="wrap">
        <h2 className="sec-eyebrow">{t('productos.mapa.eyebrow')}</h2>
        <p id="ruta-mapa-heading" className="sec-title">{t('productos.mapa.title')}</p>
        <p className="sec-sub">{t('productos.mapa.sub')}</p>

        <div className="ruta-mapa__grid">
          {/* Mapa esquemático: apoyo visual y navegación rápida por teclado.
              Cada pin es un enlace real a su parada en la lista de texto. */}
          <nav className="ruta-mapa__svg-wrap" aria-label={t('productos.mapa.navAria')}>
            <svg viewBox="0 0 340 620" className="ruta-mapa__svg" aria-hidden="true" focusable="false">
              <path
                className="ruta-mapa__isla"
                d="M170,20 C210,25 240,55 250,90 C260,125 245,150 260,175 C270,195 250,215 220,210 C195,205 175,190 150,195 C120,200 95,190 90,160 C85,130 100,100 110,75 C120,50 140,20 170,20 Z"
              />
              <path
                className="ruta-mapa__isla"
                d="M230,260 C250,290 245,320 225,340 C245,360 240,395 210,410 C230,430 215,460 190,470 C205,495 185,520 160,530 C170,555 145,575 115,570 C90,565 75,540 85,510 C65,495 70,465 90,450 C70,430 80,400 105,390 C85,370 95,340 120,325 C100,305 115,275 145,270 C170,265 200,260 230,260 Z"
              />
            </svg>
            {paradas.map((p, i) => (
              <a
                key={p.id}
                href={`#parada-${p.id}`}
                className="ruta-mapa__pin"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={`${i + 1}. ${p.nombre}`}
              >
                <span aria-hidden="true">{i + 1}</span>
              </a>
            ))}
          </nav>

          {/* Contenido real y completo: no es un resumen del mapa, es la
              información en sí, en el orden de la ruta. */}
          <ol className="ruta-mapa__lista">
            {paradas.map((p, i) => (
              <li key={p.id} id={`parada-${p.id}`} className="ruta-mapa__parada">
                <span className="ruta-mapa__numero" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="ruta-mapa__nombre">{p.nombre}</h3>
                  <p className="ruta-mapa__resumen">{p.resumen}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
