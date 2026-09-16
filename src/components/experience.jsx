import { useLanguage } from '../i18n/LanguageContext'
import useScrollReveal from '../hooks/useScrollReveal'
import { img } from '../utils'
import experienceData from '../data/experience.json'
import './Experience.css'

function ExperienceItem({ item, index }) {
  const { lang, t } = useLanguage()
  const ref = useScrollReveal()

  const isEs = lang === 'es'
  const title = isEs && item.title_es ? item.title_es : item.title
  const inst = isEs && item.institution_es ? item.institution_es : item.institution
  const period = isEs && item.period_es ? item.period_es : item.period
  const desc = isEs && item.description_es ? item.description_es : item.description

  return (
    <div className={`exp-item ${item.type} fade-in`} ref={ref} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="exp-marker">
        <div className={`exp-dot ${item.type}`} />
        <svg className="exp-line" viewBox="0 0 2 100" preserveAspectRatio="none">
          <line x1="1" y1="0" x2="1" y2="100" />
        </svg>
      </div>
      <div className="exp-card">
        <div className="exp-header">
          {item.logo && (
            <div className="exp-logo">
              <img src={img(item.logo)} alt={inst} />
            </div>
          )}
          <div className="exp-header-text">
            <span className="exp-type">{item.type === 'education' ? t('experience.education') : t('experience.experience')}</span>
            <h3>{title}</h3>
            <p className="exp-institution">{inst}</p>
            <span className="exp-period">{period}</span>
          </div>
        </div>
        <div className="exp-body">
          {Array.isArray(desc) ? (
            <ul>
              {desc.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : (
            <p>{desc}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Experience() {
  const { t } = useLanguage()
  return (
    <section id="experience">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-tag">{t('experience.sectionTag')}</span>
          <h2>{t('experience.title')}</h2>
        </div>
        <div className="exp-timeline">
          {experienceData.map((item, index) => (
            <ExperienceItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
