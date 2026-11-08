import { useTranslation } from 'react-i18next'

/* Enlace a la agenda de Calendly para reservar una videollamada de
   30 minutos con Moni y Sylvie. Se abre en una pestaña nueva y lo anuncia
   a los lectores de pantalla. `className` decide el aspecto del botón
   (siempre con borde, nunca el principal). */
export const CALENDLY = 'https://calendly.com/watchouttours-info/30min'

export function BotonVideollamada({ className }) {
  const { t } = useTranslation()
  return (
    <a href={CALENDLY} className={className} target="_blank" rel="noopener noreferrer">
      {t('common.videollamada')}
      <span className="sr-only"> {t('common.newTab')}</span>
    </a>
  )
}
