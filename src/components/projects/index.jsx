import { useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import SectionBg from '../SectionBg'
import '../SectionBg.css'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'
import projects from '../../data/projects'
import '../Project.css'

const categories = [
  { key: 'featured', labelKey: 'projects.featured' },
  { key: 'todos', labelKey: 'projects.all' },
  { key: 'hardware', labelKey: 'projects.hardware' },
  { key: 'software', labelKey: 'projects.software' },
  { key: 'data', labelKey: 'projects.data' },
]

export default function Projects() {
  const { t } = useLanguage()
  const [active, setActive] = useState('featured')
  const [selected, setSelected] = useState(null)
  
  const filtered = active === 'featured'
    ? projects.filter(p => p.featured)
    : active === 'todos' ? projects : projects.filter(p => p.categoria === active)

  return (
    <section id="projects" style={{ position: 'relative' }}>
      <SectionBg variant="top-right" />
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-tag">{t('projects.sectionTag')}</span>
          <h2>{t('projects.title')}</h2>
        </div>

        <div className="projects-tabs" role="tablist" aria-label={t('projects.categoryFilter') || 'Project categories'}>
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`projects-tab ${active === cat.key ? 'active' : ''}`}
              onClick={() => setActive(cat.key)}
              data-cursor="link"
              role="tab"
              aria-selected={active === cat.key}
              aria-controls={`panel-${cat.key}`}
              id={`tab-${cat.key}`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        <div className="projects-grid" key={active} role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
          {filtered.map((project, index) => (
            <ProjectCard key={project.titulo} project={project} index={index} onSelect={setSelected} />
          ))}
        </div>
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}