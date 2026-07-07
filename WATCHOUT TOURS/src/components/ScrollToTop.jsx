import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Al cambiar de ruta, vuelve al inicio de la página.
   Si la URL lleva un ancla (#seccion), salta a ese elemento. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
