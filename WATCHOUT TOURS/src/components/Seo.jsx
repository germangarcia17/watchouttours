import { Helmet } from 'react-helmet-async'
import { useSeo } from '../lib/useSeo'

/* Renderiza los metadatos SEO de una página. Toma los valores de la tabla
   seo_metadata (editable desde /admin/seo) y, si algún campo está vacío,
   usa los valores por defecto que le pasa la página. */
export function Seo({ pageType, title, description, keywords }) {
  const row = useSeo(pageType)

  const metaTitle   = row?.meta_title || title
  const metaDesc    = row?.meta_description || description
  const metaKeys    = row?.keywords || keywords || null
  const ogTitle     = row?.og_title || metaTitle
  const ogDesc      = row?.og_description || metaDesc
  const ogImage     = row?.og_image_url || null
  const twTitle     = row?.twitter_title || ogTitle
  const twDesc      = row?.twitter_description || ogDesc
  const twImage     = row?.twitter_image_url || ogImage
  const canonical   = row?.canonical_url || null

  return (
    <Helmet>
      <title>{metaTitle}</title>
      {metaDesc && <meta name="description" content={metaDesc} />}
      {metaKeys && <meta name="keywords" content={metaKeys} />}
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:type" content="website" />
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
