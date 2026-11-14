import { useTranslation } from 'react-i18next'

/* Enlace a la agenda de Calendly para reservar una videollamada de
   30 minutos con Mónica y Sylvie. Se abre en una pestaña nueva y lo anuncia
   a los lectores de pantalla. `className` decide el aspecto del botón
   (siempre con borde, nunca el principal) y `children`, si se pasa,
   sustituye al texto por defecto. */
export const CALENDLY = 'https://calendly.com/watchouttours-info/30min'

export function BotonVideollamada({ className, children }) {
  const { t } = useTranslation()
  return (
    <a href={CALENDLY} className={className} target="_blank" rel="noopener noreferrer">
      {children ?? t('common.videollamada')}
      <span className="sr-only"> {t('common.newTab')}</span>
    </a>
  )
}
