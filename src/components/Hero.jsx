import { useLanguage } from '../i18n/LanguageContext'
import { img } from '../utils'
import { socials } from '../data/socials'
import { ArrowUpRightIcon } from './icons'
import CircuitBg from './CircuitBg'
import PcbCorners from './PcbCorners'

function Hero() {
  const { t } = useLanguage()
  return (
    <section id="hero">
      <CircuitBg />
      <div className="hero-content">
        <div className="hero-text">
          <span className="section-tag" data-cursor="logo">
            <span className="tag-dot" />
            {t('hero.whoami')}
          </span>
          <h1>{t('hero.name')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <p className="hero-detail">{t('hero.institution')}</p>

          <p className="hero-bio">{t('hero.bio')}</p>

          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary" data-cursor="cta">
              <span>{t('hero.viewProjects')}</span>
              <span className="btn-icon">
                <ArrowUpRightIcon size={14} />
              </span>
            </a>
            <a href="#contact" className="btn btn-outline" data-cursor="link">{t('hero.contactMe')}</a>
            <a href={img('files/cv.pdf')} download className="btn btn-outline" data-cursor="link">{t('hero.downloadCv')}</a>
          </div>

          <div className="hero-socials">
            <a href={socials.github} target="_blank" rel="noopener noreferrer" data-cursor="link">{t('hero.github')}</a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="link">{t('hero.linkedin')}</a>
            <a href={`mailto:${socials.email}`} data-cursor="link">{t('hero.email')}</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-frame">
            <PcbCorners />
            <div className="hero-photo">
              <picture>
                <source srcSet={img('images/optimized/YoTec-1200w.avif')} type="image/avif" />
                <source srcSet={img('images/optimized/YoTec-800w.webp')} type="image/webp" />
                <img
                  src={img('images/optimized/YoTec-800w.webp')}
                  alt="Jose Miguel Ramirez — Robotics and Embedded Systems Engineering Student"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  width="800"
                  height="800"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </picture>
            </div>
            <div className="hero-status">
              <span className="hero-status-dot" />
              <span>{t('hero.status')}</span>
            </div>
          </div>
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
