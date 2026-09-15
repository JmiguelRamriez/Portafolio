import { useState, useRef, useEffect, useCallback } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import OptimizedImage from './OptimizedImage'
import Placeholder from './Placeholder'

/**
 * Localization helper
 */
function loc(project, field, lang) {
  const esField = field + '_es'
  return lang === 'es' && project[esField] ? project[esField] : project[field]
}

/**
 * Focus trap hook for modal accessibility
 */
function useFocusTrap(isActive, containerRef) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return
    
    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    // Focus first element on open
    firstElement?.focus()
    
    function handleTab(e) {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTab)
    return () => container.removeEventListener('keydown', handleTab)
  }, [isActive, containerRef])
}

/**
 * ProjectModal - Accessible modal with image carousel and keyboard navigation
 */
export default function ProjectModal({ project, onClose }) {
  const { lang, t } = useLanguage()
  const [modalImg, setModalImg] = useState(0)
  const modalIntervalRef = useRef(null)
  const modalRef = useRef(null)
  const prevFocusRef = useRef(null)
  
  // Focus trap
  useFocusTrap(true, modalRef)
  
  // Save previous focus and restore on close
  useEffect(() => {
    prevFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      prevFocusRef.current?.focus()
    }
  }, [])
  
  // Auto-advance carousel
  useEffect(() => {
    if (!project.imagenes || project.imagenes.length < 2) return
    modalIntervalRef.current = setInterval(() => {
      setModalImg(prev => (prev + 1) % project.imagenes.length)
    }, 3000)
    return () => clearInterval(modalIntervalRef.current)
  }, [project])
  
  // Keyboard navigation for carousel
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    
    if (!project.imagenes || project.imagenes.length < 2) return
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setModalImg(prev => (prev - 1 + project.imagenes.length) % project.imagenes.length)
      clearInterval(modalIntervalRef.current)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setModalImg(prev => (prev + 1) % project.imagenes.length)
      clearInterval(modalIntervalRef.current)
    }
  }, [project, onClose])
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
  
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }
  
  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-window" 
        ref={modalRef}
        onKeyDown={handleKeyDown}
      >
        <div className="modal-titlebar">
          <div className="modal-dots">
            <span className="modal-dot red" />
            <span className="modal-dot yellow" />
            <span className="modal-dot green" />
          </div>
          <span id="modal-title" className="modal-title">{loc(project, 'titulo', lang)}</span>
          <button 
            className="modal-close" 
            onClick={onClose} 
            data-cursor="link"
            aria-label={t('projects.closeModal') || 'Close modal'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-image">
            {project.imagenes && project.imagenes.length > 0 ? (
              <>
                {/* Carousel navigation */}
                {project.imagenes.length > 1 && (
                  <>
                    <button
                      className="modal-nav prev"
                      onClick={() => setModalImg(prev => (prev - 1 + project.imagenes.length) % project.imagenes.length)}
                      aria-label={t('projects.prevImage') || 'Previous image'}
                      data-cursor="link"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                    <button
                      className="modal-nav next"
                      onClick={() => setModalImg(prev => (prev + 1) % project.imagenes.length)}
                      aria-label={t('projects.nextImage') || 'Next image'}
                      data-cursor="link"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                    {/* Dots indicator */}
                    <div className="modal-dots-indicator" aria-label={t('projects.imageIndicator') || 'Image indicators'}>
                      {project.imagenes.map((_, i) => (
                        <span
                          key={i}
                          className={`modal-dot-indicator ${i === modalImg ? 'active' : ''}`}
                          onClick={() => setModalImg(i)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setModalImg(i)
                            }
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
                <OptimizedImage
                  src={project.imagenes[modalImg]}
                  alt={loc(project, 'titulo', lang)}
                  loading="eager"
                />
              </>
            ) : (
              <div className="modal-placeholder">
                <Placeholder project={project} />
              </div>
            )}
          </div>
          <div className="modal-info">
            {project.badge && <span className="project-badge">{loc(project, 'badge', lang)}</span>}
            <div className="modal-tags">
              {project.stack.map((tech, i) => (
                <span key={i}>{tech}</span>
              ))}
            </div>
            <p className="modal-description">{loc(project, 'descripcion', lang)}</p>
            <div className="modal-actions">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary modal-repo-btn"
                data-cursor="cta"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {t('projects.viewOnGitHub')}
              </a>
              {project.document && (
                <a
                  href={project.document}
                  download
                  className="modal-doc-btn"
                  data-cursor="link"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  {t('projects.downloadManual')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}