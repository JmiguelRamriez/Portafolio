import { useState, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import useScrollReveal from '../../hooks/useScrollReveal'
import OptimizedImage from './OptimizedImage'
import Placeholder from './Placeholder'

/**
 * Localization helper - returns Spanish version if available and lang is 'es'
 */
function loc(project, field, lang) {
  const esField = field + '_es'
  return lang === 'es' && project[esField] ? project[esField] : project[field]
}

/**
 * ProjectCard - Individual project card with hover image carousel
 */
export default function ProjectCard({ project, index, onSelect }) {
  const { lang, t } = useLanguage()
  const [imgIndex, setImgIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef(null)
  const cardRef = useScrollReveal()

  function handleMouseEnter() {
    if (!project.imagenes || project.imagenes.length < 2) return
    intervalRef.current = setInterval(() => {
      setImgIndex(prev => (prev + 1) % project.imagenes.length)
    }, 1500)
  }

  function handleMouseLeave() {
    clearInterval(intervalRef.current)
    setImgIndex(0)
  }

  return (
    <div
      className="project-card fade-in"
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.08}s` }}
      data-cursor="link"
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(project)
        }
      }}
    >
      <div className="project-card-image">
        {project.imagenes && project.imagenes.length > 0 ? (
          <OptimizedImage
            src={project.imagenes[imgIndex]}
            alt={loc(project, 'titulo', lang)}
            loading="lazy"
            className={loaded ? 'loaded' : ''}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <Placeholder project={project} />
        )}
        <div className="project-card-overlay">
          <span className="project-card-link">
            {t('projects.viewProject')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="project-card-body">
        {project.badge && <span className="project-badge">{loc(project, 'badge', lang)}</span>}
        <h3>{loc(project, 'titulo', lang)}</h3>
        <p>{loc(project, 'brief', lang) || loc(project, 'descripcion', lang)}</p>
        <div className="project-card-tags">
          {project.stack.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}