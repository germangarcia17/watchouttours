import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SkipLink } from './SkipLink'
import { Header } from './Header'
import { Footer } from './Footer'
import { useLang, stripLang } from '../../i18n/routing'

/* Sincroniza el idioma de i18next y el atributo lang del <html> con la URL.
   El lang del documento es clave para que los lectores de pantalla pronuncien
   bien el contenido. */
function LangSync() {
  const lang = useLang()
  const { i18n } = useTranslation()
  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang)
    document.documentElement.lang = lang
  }, [lang, i18n])
  return null
}

/* Etiquetas hreflang para todas las páginas: enlazan cada URL con su
   equivalente en el otro idioma (misma ruta, distinto prefijo). Válido para
   toda página bajo el Layout, use o no el componente Seo. */
function AlternateLinks() {
  const { pathname } = useLocation()
  const basePath = stripLang(pathname)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const esUrl = `${origin}${basePath}`
  const enUrl = `${origin}${basePath === '/' ? '/en' : `/en${basePath}`}`
  return (
    <Helmet>
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="x-default" href={esUrl} />
    </Helmet>
  )
}

export function Layout() {
  const { t } = useTranslation()
  return (
    <>
      <LangSync />
      <AlternateLinks />
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <a
        href="https://wa.me/64272677006?text=¡Hola!%20Quiero%20información%20sobre%20los%20viajes%20de%20WatchOut!"
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('common.whatsappFab')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.471 2.027 7.77L0 32l8.43-2.008A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.772-1.852l-.486-.29-5.007 1.193 1.215-4.878-.317-.5A13.268 13.268 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.352-1.16-2.717-1.292-.364-.133-.63-.199-.895.199-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.178-.177.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.226-2.956-.323-.776-.65-.671-.895-.683l-.762-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.317s1.427 3.847 1.626 4.112c.199.265 2.808 4.287 6.803 6.013.951.41 1.693.655 2.272.839.955.303 1.824.26 2.511.158.766-.114 2.352-.962 2.684-1.89.332-.928.332-1.724.232-1.89-.1-.166-.364-.265-.762-.464z"/>
        </svg>
      </a>
    </>
  )
}
