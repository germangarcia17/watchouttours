import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'

/* Configuración de internacionalización.
   El idioma real lo fija <LangSync> a partir de la URL (prefijo /en),
   no la detección del navegador: así la URL es siempre la fuente de verdad
   y los enlaces se pueden compartir. */
i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: 'es',
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

export default i18n
