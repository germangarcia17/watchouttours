import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/* Al cambiar de ruta:
   1. Vuelve al inicio de la página (o al ancla #seccion si la hay).
   2. Mueve el foco a <main>, para que los lectores de pantalla
      empiecen a leer la página nueva en lugar de quedarse donde estaban. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const prevPathname = useRef(null)

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)

    // Solo movemos el foco cuando la ruta CAMBIA de verdad. En la carga
    // inicial (aunque StrictMode ejecute el efecto dos veces) no lo tocamos,
    // para que el primer Tab siga llegando al enlace "Saltar al contenido".
    const isRealNavigation = prevPathname.current !== null && prevPathname.current !== pathname
    prevPathname.current = pathname
    if (isRealNavigation) {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return null
}
