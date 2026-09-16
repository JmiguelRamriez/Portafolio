import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { en, es } from './translations'

const translations = { en, es }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback((key, interpolation) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      if (!value) return key
      value = value[k]
    }
    if (typeof value === 'string' && interpolation) {
      return value.replace(/\{(\w+)\}/g, (_, name) =>
        interpolation[name] !== undefined ? interpolation[name] : `{${name}}`
      )
    }
    return value ?? key
  }, [lang])

  const toggle = useCallback(() => {
    setLang(prev => prev === 'en' ? 'es' : 'en')
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
