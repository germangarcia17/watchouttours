/* Cabecera común de las páginas interiores (Todas las experiencias,
   Reseñas, Blog, Contacto): antetítulo, h1 y entradilla sobre la banda
   crema, alineados a la izquierda con el ancho de lectura. */
export function CabeceraPagina({ antetitulo, titulo, children }) {
  return (
    <section className="page-head band-cream">
      <div className="wrap">
        {antetitulo && <p className="sec-eyebrow">{antetitulo}</p>}
        <h1 className="page-head__titulo">{titulo}</h1>
        {children && <div className="page-head__intro">{children}</div>}
      </div>
    </section>
  )
}
