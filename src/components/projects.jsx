import { useState, useRef, useEffect } from 'react'
import './Project.css'
import projects from "../data/projects"

const categories = [
  { key: 'todos', label: 'Todos' },
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

function ProjectCard({ project, index }) {
  const [imgIndex, setImgIndex] = useState(0)
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
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card reveal-up"
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.08}s` }}
      data-cursor="link"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card-image">
        {project.imagenes && project.imagenes.length > 0 ? (
          <img src={project.imagenes[imgIndex]} alt={project.titulo} loading="lazy" />
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
        <h3>{project.titulo}</h3>
        <p>{project.descripcion}</p>
        <div className="project-card-tags">
          {project.stack.slice(0, 4).map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
          {project.stack.length > 4 && <span className="tag-more">+{project.stack.length - 4}</span>}
        </div>
      </div>
    </a>
  )
}

function Projects() {
  const [active, setActive] = useState('todos')
  const filtered = active === 'todos' ? projects : projects.filter(p => p.categoria === active)

  return (
    <section id="projects">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">// PROJECTS</span>
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
            <ProjectCard key={project.titulo} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
