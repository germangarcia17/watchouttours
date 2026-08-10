import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useSeo } from '../lib/useSeo'
import { useLang, stripLang } from '../i18n/routing'
import { pickLocalized } from '../i18n/content'
import { SITE_URL } from '../lib/site'

/* Las etiquetas hreflang y el lang del <html> se gestionan globalmente en el
   Layout; aquí solo emitimos título, descripción, canónica y metadatos
   sociales, ya localizados. */

/* Renderiza los metadatos SEO de una página. Toma los valores de la tabla
   seo_metadata (editable desde /admin/seo), usa la variante en inglés cuando
   procede y, si algún campo está vacío, cae a los valores por defecto que le
   pasa la página. Añade también las etiquetas hreflang para las dos versiones
   de idioma (fase 4). */
export function Seo({ pageType, title, description, keywords }) {
  const row = useSeo(pageType)
  const lang = useLang()
  const { pathname } = useLocation()

  const metaTitle   = pickLocalized(row, 'meta_title', lang) || title
  const metaDesc    = pickLocalized(row, 'meta_description', lang) || description
  const metaKeys    = pickLocalized(row, 'keywords', lang) || keywords || null
  const ogTitle     = pickLocalized(row, 'og_title', lang) || metaTitle
  const ogDesc      = pickLocalized(row, 'og_description', lang) || metaDesc
  const ogImage     = row?.og_image_url || null
  const twTitle     = pickLocalized(row, 'twitter_title', lang) || ogTitle
  const twDesc      = pickLocalized(row, 'twitter_description', lang) || ogDesc
  const twImage     = row?.twitter_image_url || ogImage

  const basePath    = stripLang(pathname)
  const esUrl       = `${SITE_URL}${basePath}`
  const enUrl       = `${SITE_URL}${basePath === '/' ? '/en' : `/en${basePath}`}`
  const canonical   = row?.canonical_url || (lang === 'en' ? enUrl : esUrl)

  return (
    <Helmet>
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}
      {metaKeys && <meta name="keywords" content={metaKeys} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content={lang === 'en' ? 'en_NZ' : 'es_ES'} />
      <meta property="og:title" content={ogTitle} />
      {ogDesc && <meta property="og:description" content={ogDesc} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={twImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={twTitle} />
      {twDesc && <meta name="twitter:description" content={twDesc} />}
      {twImage && <meta name="twitter:image" content={twImage} />}
    </Helmet>
  )
}
