import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './lib/auth'
import App from './App'
import i18n from './i18n'

/* Punto de entrada para el prerenderizado estático (SSG), ejecutado en Node
   por scripts/prerender.mjs. No se usa en el navegador: el cliente sigue
   arrancando por src/main.jsx exactamente igual que antes. */
export async function render(url) {
  // <LangSync> (Layout.jsx) cambia el idioma de i18next dentro de un
  // useEffect, que nunca se ejecuta en renderToString. Aquí hay que fijarlo
  // explícitamente a partir de la URL antes de renderizar.
  const lang = url === '/en' || url.startsWith('/en/') ? 'en' : 'es'
  await i18n.changeLanguage(lang)

  const helmetContext = {}

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  )

  return { html, helmet: helmetContext.helmet }
}
