import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { L } from '../i18n/routing'

export default function NotFound() {
  const { t } = useTranslation()
  useEffect(() => { document.title = t('notFound.docTitle') }, [t])

  return (
    <div className="not-found">
      <p className="not-found__code" aria-hidden="true">404</p>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.text')}</p>
      <L to="/" className="btn btn--primary">
        {t('notFound.home')}
      </L>
    </div>
  )
}
