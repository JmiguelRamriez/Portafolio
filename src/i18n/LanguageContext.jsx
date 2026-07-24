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

  const t = useCallback((key, fallback) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      if (!value) return fallback ?? key
      value = value[k]
    }
    return value ?? fallback ?? key
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
