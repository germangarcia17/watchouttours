import { Link, NavLink, useLocation } from 'react-router-dom'

/* ── Idioma a partir de la URL ─────────────────────────────
   La URL es la fuente de verdad: si el path empieza por /en, inglés;
   en cualquier otro caso, español (idioma por defecto). */
export function useLang() {
  const { pathname } = useLocation()
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/* Devuelve la versión sin prefijo de idioma de un pathname
   (/en/productos -> /productos, /en -> /). */
export function stripLang(pathname) {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}

/* Añade el prefijo /en a una ruta española cuando el idioma es inglés. */
export function localizePath(path, lang) {
  if (lang !== 'en') return path
  return path === '/' ? '/en' : `/en${path}`
}

/* Hook: función que localiza rutas según el idioma actual. */
export function useLocalize() {
  const lang = useLang()
  return (path) => localizePath(path, lang)
}

/* <Link> que respeta el idioma actual. Uso idéntico a react-router Link. */
export function L({ to, ...rest }) {
  const localize = useLocalize()
  return <Link to={localize(to)} {...rest} />
}

/* <NavLink> que respeta el idioma actual. */
export function LNav({ to, ...rest }) {
  const localize = useLocalize()
  return <NavLink to={localize(to)} {...rest} />
}
