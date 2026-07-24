import { useLanguage } from '../i18n/LanguageContext'
import { img, file } from '../utils'
import CircuitBg from './CircuitBg'

function Hero() {
  const { t } = useLanguage()
  return (
    <section id="hero">
      <CircuitBg />
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-photo">
            <img src={img('images/YoTec.jpg')} alt="Jose Miguel Ramirez" />
          </div>
          <div className="hero-info">
            <span className="section-tag" data-cursor="logo">
              <span className="tag-dot" />
              {t('hero.whoami')}
            </span>
            <h1>{t('hero.name')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
            <p className="hero-detail">{t('hero.institution')}</p>
          </div>
        </div>

        <p className="hero-bio">{t('hero.bio')}</p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary" data-cursor="cta">
            <span>{t('hero.viewProjects')}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#contact" className="btn btn-outline" data-cursor="link">{t('hero.contactMe')}</a>
          <a href={file('files/cv.pdf')} download className="btn btn-outline" data-cursor="link">{t('hero.downloadCv')}</a>
        </div>

        <div className="hero-socials">
          <a href="https://github.com/JmiguelRamriez" target="_blank" rel="noopener noreferrer" data-cursor="link">{t('hero.github')}</a>
          <a href="https://www.linkedin.com/in/jos%C3%A9-miguel-ramirez-gutierrez-a592a4351/" target="_blank" rel="noopener noreferrer" data-cursor="link">{t('hero.linkedin')}</a>
          <a href="mailto:2005josemiguelramirez@gmail.com" data-cursor="link">{t('hero.email')}</a>
        </div>
      </div>

      <div className="scroll-hint">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
