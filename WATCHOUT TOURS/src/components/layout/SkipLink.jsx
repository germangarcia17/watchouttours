import { useTranslation } from 'react-i18next'
import './SkipLink.css'

export function SkipLink() {
  const { t } = useTranslation()
  return (
    <a href="#main-content" className="skip-link">
      {t('common.skipToContent')}
    </a>
  )
}
