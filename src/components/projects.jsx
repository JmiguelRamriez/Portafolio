import { useRef, useEffect } from 'react'
import './Project.css'
import projects from "../data/projects"

function ProjectItem({ project, index }) {
  const itemRef = useRef(null)

  useEffect(() => {
    const el = itemRef.current
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

  const Wrapper = project.url ? 'a' : 'div'
  const wrapperProps = project.url
    ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      className="project-item reveal-up"
      ref={itemRef}
      data-cursor="link"
      {...wrapperProps}
    >
      <span className="project-number">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="project-info">
        <h3>{project.titulo}</h3>
        <p>{project.descripcion}</p>
        <div className="project-tags">
          {project.stack.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>
      <div className="project-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {project.imagenes && project.imagenes[0] && (
        <div className="project-preview">
          <img src={project.imagenes[0]} alt={project.titulo} loading="lazy" />
        </div>
      )}
    </Wrapper>
  )
}

function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">// PROJECTS</span>
          <h2>Featured Work</h2>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <ProjectItem key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
