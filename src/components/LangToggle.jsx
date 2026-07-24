import { useLanguage } from '../i18n/LanguageContext'

export default function LangToggle() {
  const { lang, toggle } = useLanguage()
  return (
    <button className="nav-toggle lang-toggle" onClick={toggle} data-cursor="link" aria-label="Toggle language">
      {lang === 'en' ? 'ES' : 'EN'}
    </button>
  )
}
