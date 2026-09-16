const base = import.meta.env.BASE_URL || '/'

export function img(path) {
  return base + path
}

export function file(path) {
  return base + path
}

export function loc(project, field, lang) {
  const esField = field + '_es'
  return lang === 'es' && project[esField] ? project[esField] : project[field]
}
