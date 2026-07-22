import { useState, useRef, useEffect } from 'react'
import './Project.css'
import projects from "../data/projects"

const categories = [
  { key: 'featured', label: 'Featured' },
  { key: 'todos', label: 'All' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'software', label: 'Software' },
  { key: 'data', label: 'Data' },
]

const categoryIcons = {
  hardware: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>
    </svg>
  ),
  software: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  data: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
}

function Placeholder({ project }) {
  const letter = project.titulo.charAt(0)
  const icon = categoryIcons[project.categoria]
  return (
    <div className="project-card-placeholder" data-categoria={project.categoria}>
      <div className="placeholder-icon">{icon}</div>
      <span className="placeholder-letter">{letter}</span>
    </div>
  )
}

function ProjectCard({ project, index, onSelect }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const intervalRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
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
      className="project-card reveal-up"
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.08}s` }}
      data-cursor="link"
      onClick={() => onSelect(project)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card-image">
        {project.imagenes && project.imagenes.length > 0 ? (
          <img
            src={project.imagenes[imgIndex]}
            alt={project.titulo}
            loading="lazy"
            className={loaded ? 'loaded' : ''}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <Placeholder project={project} />
        )}
        <div className="project-card-overlay">
          <span className="project-card-link">
            View Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </span>
        </div>
      </div>
      <div className="project-card-body">
        {project.badge && <span className="project-badge">{project.badge}</span>}
        <h3>{project.titulo}</h3>
        <p>{project.brief || project.descripcion}</p>
        <div className="project-card-tags">
          {project.stack.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }) {
  const [modalImg, setModalImg] = useState(0)
  const modalIntervalRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    if (!project.imagenes || project.imagenes.length < 2) return
    modalIntervalRef.current = setInterval(() => {
      setModalImg(prev => (prev + 1) % project.imagenes.length)
    }, 2500)
    return () => clearInterval(modalIntervalRef.current)
  }, [project])

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-window">
        <div className="modal-titlebar">
          <div className="modal-dots">
            <span className="modal-dot red" />
            <span className="modal-dot yellow" />
            <span className="modal-dot green" />
          </div>
          <span className="modal-title">{project.titulo}</span>
          <button className="modal-close" onClick={onClose} data-cursor="link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-image">
            {project.imagenes && project.imagenes.length > 0 ? (
              <img src={project.imagenes[modalImg]} alt={project.titulo} />
            ) : (
              <div className="modal-placeholder">
                <Placeholder project={project} />
              </div>
            )}
          </div>
          <div className="modal-info">
            {project.badge && <span className="project-badge">{project.badge}</span>}
            <div className="modal-tags">
              {project.stack.map((tech, i) => (
                <span key={i}>{tech}</span>
              ))}
            </div>
            <p className="modal-description">{project.descripcion}</p>
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
                View on GitHub
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
                  Download Manual
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const [active, setActive] = useState('featured')
  const [selected, setSelected] = useState(null)
  const filtered = active === 'featured'
    ? projects.filter(p => p.featured)
    : active === 'todos' ? projects : projects.filter(p => p.categoria === active)

  return (
    <section id="projects">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">$ ls projects/</span>
          <h2>Featured Work</h2>
        </div>

        <div className="projects-tabs">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`projects-tab ${active === cat.key ? 'active' : ''}`}
              onClick={() => setActive(cat.key)}
              data-cursor="link"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="projects-grid" key={active}>
          {filtered.map((project, index) => (
            <ProjectCard key={project.titulo} project={project} index={index} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

export default Projects
