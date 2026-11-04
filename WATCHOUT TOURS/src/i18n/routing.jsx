import { Link, NavLink, useLocation } from 'react-router-dom'
import { enPathFor, baseFromEnSlug } from './pageLanguages'

/* ── Idioma a partir de la URL ─────────────────────────────
   La URL es la fuente de verdad: si el path empieza por /en, inglés;
   en cualquier otro caso, español (idioma por defecto). */
export function useLang() {
  const { pathname } = useLocation()
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es'
}

/* Devuelve la ruta base española de un pathname: quita el prefijo de
   idioma y traduce los slugs que cambian en inglés
   (/en/productos -> /productos, /en -> /, /en/unhurried -> /sin-prisa).
   Ver LOCALIZED_SLUGS en ./pageLanguages. */
export function stripLang(pathname) {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return baseFromEnSlug(pathname.slice(3))
  return pathname
}

/* Convierte una ruta base española en la ruta del idioma indicado: en
   inglés añade el prefijo /en y traduce el slug si cambia
   (/sin-prisa -> /en/unhurried). Las anclas (#…) y la query (?…) se
   conservan. */
export function localizePath(path, lang) {
  if (lang !== 'en') return path
  const i = path.search(/[?#]/)
  const base = i === -1 ? path : path.slice(0, i)
  const rest = i === -1 ? '' : path.slice(i)
  return `${enPathFor(base)}${rest}`
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
