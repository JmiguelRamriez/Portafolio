import categoryIcons from '../categoryIcons'

/**
 * Placeholder - Shows a category icon + first letter when no image is available
 */
export default function Placeholder({ project }) {
  const letter = project.titulo.charAt(0)
  const icon = categoryIcons[project.categoria]
  
  return (
    <div className="project-card-placeholder" data-categoria={project.categoria}>
      <div className="placeholder-icon">{icon}</div>
      <span className="placeholder-letter">{letter}</span>
    </div>
  )
}