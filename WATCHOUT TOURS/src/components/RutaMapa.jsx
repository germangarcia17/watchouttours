import { useTranslation } from 'react-i18next'
import '../styles/components/RutaMapa.css'

/* Coordenadas del pin en % sobre el viewBox del mapa (340×470). El
   contorno y las ciudades salen de la misma proyección de latitud y
   longitud reales (simplificada), así que los pines caen en su sitio. El contenido real
   y equivalente para lectores de pantalla vive en la lista de abajo, no
   en el mapa — un mapa interactivo por sí solo nunca es accesible para
   alguien que no puede verlo. */
const COORDS = [
  { id: 'auckland', x: 67.2, y: 21.0 },
  { id: 'rotorua', x: 78.5, y: 30.4 },
  { id: 'kaikoura', x: 59.0, y: 61.4 },
  { id: 'tekapo', x: 34.7, y: 73.1 },
  { id: 'queenstown', x: 20.9, y: 80.6 },
]

/* Ruta de Sin Prisa (/sin-prisa): Auckland → Rotorua → Queenstown →
   Tekapo → Christchurch → Kaikōura. Mismo mapa esquemático. */
export const COORDS_SIN_PRISA = [
  { x: 67.2, y: 21.0 },  // Auckland
  { x: 78.5, y: 30.4 },  // Rotorua
  { x: 20.9, y: 80.6 },  // Queenstown
  { x: 34.7, y: 73.1 },  // Tekapo
  { x: 51.1, y: 69.6 },  // Christchurch
  { x: 59.0, y: 61.4 },  // Kaikōura
]

/* `ns` es el namespace de i18n con los textos del mapa (title, navAria,
   paradas y, opcionalmente, eyebrow y sub); `coords` las posiciones de los
   pines, en el mismo orden que las paradas; `className`, p. ej. una banda
   de fondo (band-cream). Por defecto, la ruta de
   /productos. El resumen de cada parada también es opcional. */
export default function RutaMapa({ ns = 'productos.mapa', coords = COORDS, className = '' }) {
  const { t } = useTranslation()
  const textos = t(`${ns}.paradas`, { returnObjects: true })
  const paradas = coords.map((c, i) => ({ ...c, ...textos[i] }))
  const eyebrow = t(`${ns}.eyebrow`, { defaultValue: '' })
  const sub = t(`${ns}.sub`, { defaultValue: '' })

  return (
    <section className={`ruta-mapa ${className}`.trim()} aria-labelledby="ruta-mapa-heading">
      <div className="wrap">
        {eyebrow && <p className="sec-eyebrow">{eyebrow}</p>}
        <h2 id="ruta-mapa-heading" className="sec-title">{t(`${ns}.title`)}</h2>
        {sub && <p className="sec-sub">{sub}</p>}

        <div className="ruta-mapa__grid">
          {/* Mapa esquemático: apoyo visual y navegación rápida por teclado.
              Cada pin es un enlace real a su parada en la lista de texto. */}
          <nav className="ruta-mapa__svg-wrap" aria-label={t(`${ns}.navAria`)}>
            <svg viewBox="0 0 340 470" className="ruta-mapa__svg" aria-hidden="true" focusable="false">
              <path className="ruta-mapa__isla" d="M174.6,16.2 C174.0,11.8 179.6,12.2 182.9,15.1 C186.2,18.1 189.8,29.4 194.5,33.9 C199.2,38.5 206.6,37.4 211.3,42.5 C216.0,47.6 219.8,58.6 222.9,64.7 C226.0,70.9 228.8,75.0 229.9,79.4 C230.9,83.9 227.7,87.8 229.4,91.4 C231.0,94.9 237.3,101.5 239.7,100.6 C242.0,99.7 241.0,86.5 243.5,85.9 C246.1,85.3 252.8,91.9 255.2,97.2 C257.5,102.5 256.0,112.9 257.7,117.7 C259.5,122.6 260.8,123.1 265.5,126.3 C270.2,129.4 281.1,134.5 285.9,136.5 C290.6,138.5 289.6,140.6 293.9,138.2 C298.1,135.8 306.0,123.9 311.4,122.2 C316.8,120.4 326.0,121.1 326.1,127.6 C326.2,134.1 314.7,153.1 311.9,161.1 C309.1,169.2 314.0,171.2 309.4,175.8 C304.7,180.5 287.5,186.0 284.1,189.2 C280.6,192.3 290.1,190.0 288.7,194.6 C287.3,199.3 279.6,209.7 275.8,216.9 C272.0,224.0 271.6,229.9 266.0,237.4 C260.4,244.9 248.2,259.1 242.0,261.7 C235.8,264.2 230.3,256.4 228.8,252.8 C227.4,249.2 231.4,245.1 233.2,240.1 C235.0,235.1 239.5,228.6 239.7,222.7 C239.9,216.8 238.4,209.9 234.5,204.9 C230.6,199.9 221.8,196.8 216.5,192.9 C211.1,189.1 203.2,185.1 202.3,182.0 C201.3,178.9 206.9,177.8 210.5,174.5 C214.2,171.2 221.1,167.8 224.2,162.2 C227.3,156.5 228.3,145.7 229.4,140.6 C230.4,135.5 231.1,135.3 230.6,131.4 C230.2,127.5 228.2,121.6 226.8,117.4 C225.4,113.1 223.6,108.9 222.4,105.7 C221.2,102.6 221.0,101.9 219.5,98.2 C218.1,94.5 216.3,88.5 213.9,83.5 C211.4,78.5 208.4,73.1 204.8,68.1 C201.3,63.2 195.5,58.2 192.5,53.8 C189.4,49.3 189.7,47.7 186.8,41.5 C183.8,35.2 175.3,20.5 174.6,16.2 Z" />
              <path className="ruta-mapa__isla" d="M174.6,223.7 C177.2,224.1 176.4,234.1 177.7,235.7 C179.1,237.3 180.8,230.9 182.9,233.3 C185.0,235.7 186.5,249.2 190.1,250.0 C193.7,250.9 200.2,240.0 204.6,238.4 C209.0,236.8 214.5,238.6 216.5,240.5 C218.4,242.3 216.6,245.1 216.5,249.4 C216.3,253.6 218.3,259.1 215.7,265.8 C213.0,272.4 204.6,283.0 200.5,289.4 C196.3,295.7 194.9,299.1 190.6,304.1 C186.4,309.1 177.5,315.5 175.2,319.5 C172.8,323.4 174.7,325.2 176.5,328.0 C178.2,330.9 187.0,334.7 185.5,336.6 C184.0,338.4 175.4,335.9 167.4,339.3 C159.5,342.7 143.8,350.1 137.7,357.1 C131.6,364.0 133.1,372.7 130.8,381.0 C128.4,389.3 128.5,399.0 123.5,406.6 C118.6,414.3 110.9,422.9 100.8,427.2 C90.7,431.4 70.7,432.9 62.9,432.3 C55.1,431.7 61.4,426.3 53.9,423.7 C46.3,421.2 24.2,420.3 17.7,416.9 C11.3,413.5 9.6,412.1 15.2,403.2 C20.8,394.4 42.3,374.1 51.3,363.9 C60.3,353.8 64.6,346.6 69.4,342.4 C74.1,338.1 69.6,345.4 79.7,338.3 C89.8,331.1 120.5,307.6 130.0,299.6 C139.5,291.6 133.7,295.9 136.5,290.4 C139.2,284.9 142.5,276.0 146.8,266.5 C151.1,256.9 157.6,240.4 162.3,233.3 C166.9,226.2 172.1,223.3 174.6,223.7 Z" />
              <path className="ruta-mapa__isla" d="M42.3,437.4 C45.1,436.3 54.9,437.1 57.7,439.1 C60.5,441.1 61.4,446.8 59.0,449.4 C56.7,452.0 46.6,455.1 43.5,454.5 C40.5,454.0 41.2,448.8 41.0,446.0 C40.8,443.1 39.5,438.6 42.3,437.4 Z" />
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
                  {p.resumen && <p className="ruta-mapa__resumen">{p.resumen}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
