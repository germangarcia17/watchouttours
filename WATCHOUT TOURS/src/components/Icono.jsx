/* Iconos de línea fina de Watchout Tours.
 *
 * Dibujos propios (sin licencia de terceros) sobre una rejilla de 24×24,
 * trazo de 1,5 px y color heredado (currentColor), para que tomen el color
 * de la marca desde el CSS (.icono). Son siempre decorativos: el texto de
 * al lado ya dice lo mismo, así que van con aria-hidden y sin foco.
 */
const TRAZOS = {
  // Personas: dos siluetas (grupos pequeños)
  grupo: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16.2 14.1c2.7.2 4.8 2.1 4.8 4.9" />
    </>
  ),
  // Brújula: las guías que acompañan
  guias: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6Z" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" />
    </>
  ),
  // Llave: visitas privadas, solo para el grupo
  privado: (
    <>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M15.5 12v2" />
    </>
  ),
  // Casa: años viviendo en Nueva Zelanda
  casa: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  // Bocadillo de conversación: idioma
  idioma: (
    <>
      <path d="M4 5.5h16v10H10l-4.5 4v-4H4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  // Marca de verificación en círculo: todo resuelto
  resuelto: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.7 2.7L16.2 9.5" />
    </>
  ),
  // Cama: hoteles
  hotel: (
    <>
      <path d="M3 18.5V6M3 14.5h18v4M21 14.5v-2.5a3 3 0 0 0-3-3h-7v5.5" />
      <circle cx="7" cy="11" r="1.75" />
    </>
  ),
  // Tenedor y cuchillo: comidas
  comida: (
    <>
      <path d="M7 3v7M5 3v5a2 2 0 0 0 4 0V3M7 10v11" />
      <path d="M17 21V3c-2 1.5-3 4-3 7v3h3" />
    </>
  ),
  // Furgoneta: transporte
  transporte: (
    <>
      <path d="M3 16.5V7.5A1.5 1.5 0 0 1 4.5 6h10l3.5 4.5h1.5A1.5 1.5 0 0 1 21 12v4.5h-2" />
      <path d="M3 16.5h2M10 16.5h4" />
      <circle cx="7.5" cy="17" r="2" />
      <circle cx="16.5" cy="17" r="2" />
      <path d="M14.5 6v4.5H18" />
    </>
  ),
  // Reloj: asistencia las 24 horas
  asistencia: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  // Parapente: vela, cordajes y piloto
  parapente: (
    <>
      <path d="M3 9c2.5-3.2 5.6-4.5 9-4.5S18.5 5.8 21 9c-2.6-.9-5.6-1.3-9-1.3S5.6 8.1 3 9Z" />
      <path d="M4.5 8.6 11 17M19.5 8.6 13 17M12 7.7V17" />
      <circle cx="12" cy="18.8" r="1.6" />
    </>
  ),
  // Oreja: inmersión sensorial
  sentidos: (
    <>
      <path d="M7 9a5 5 0 0 1 10 0c0 3.2-3 4-3 7a2.5 2.5 0 0 1-4.6 1.4" />
      <path d="M10 9.2a2 2 0 0 1 4 0c0 1.3-1.2 1.8-1.6 2.8" />
    </>
  ),
  // Olas: cultura y conexión con el océano
  ola: (
    <>
      <path d="M3 9c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
      <path d="M3 14c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
      <path d="M3 19c1.5-1.3 3-1.3 4.5 0s3 1.3 4.5 0 3-1.3 4.5 0 3 1.3 4.5 0" />
    </>
  ),
  // Altavoz: audios
  altavoz: (
    <>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
      <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
    </>
  ),
  // Bocadillo de chat: WhatsApp (trazo de línea, sin logotipo)
  chat: (
    <>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5Z" />
      <path d="M9 10.5h6M9 13.5h4" />
    </>
  ),
  // Flecha
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
}

export function Icono({ nombre, className = '' }) {
  const trazo = TRAZOS[nombre]
  if (!trazo) return null
  return (
    <svg
      className={`icono ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {trazo}
    </svg>
  )
}
