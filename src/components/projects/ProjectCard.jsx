import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import useScrollReveal from '../../hooks/useScrollReveal'
import OptimizedImage from './OptimizedImage'
import Placeholder from './Placeholder'
import { ArrowUpRightIcon } from '../icons'
import { loc } from '../../utils'

/**
 * ProjectCard - Individual project card with hover image carousel
 */
export default function ProjectCard({ project, index, onSelect }) {
  const { lang, t } = useLanguage()
  const [imgIndex, setImgIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef(null)
  const cardRef = useScrollReveal()

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

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
      aria-label={loc(project, 'titulo', lang)}
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
            <ArrowUpRightIcon size={16} />
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
