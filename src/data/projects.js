import projectsData from './projects.json'
const base = import.meta.env.BASE_URL || '/'

// Prepend base URL to image paths and document paths
const projects = projectsData.map(p => ({
  ...p,
  imagenes: p.imagenes.map(img => `${base}${img}`),
  document: p.document ? `${base}${p.document}` : undefined
}))

export default projects