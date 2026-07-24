const base = import.meta.env.BASE_URL || '/'

export function img(path) {
  return base + path
}

export function file(path) {
  return base + path
}
