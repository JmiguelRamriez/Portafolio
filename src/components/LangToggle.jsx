import { useLanguage } from '../i18n/LanguageContext'

export default function LangToggle() {
  const { lang, t, toggle } = useLanguage()
  return (
    <button className="nav-toggle lang-toggle" onClick={toggle} data-cursor="link" aria-label={t('langToggle.ariaLabel')}>
      {lang === 'en' ? 'ES' : 'EN'}
    </button>
  )
}
