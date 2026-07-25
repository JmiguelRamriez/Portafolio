import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './GitHubFeed.css'

const CACHE_KEY = 'gh-lang-cache'
const CACHE_TTL = 30 * 60 * 1000

function GitHubFeed() {
  const { t, lang } = useLanguage()
  const [languages, setLanguages] = useState(null)
  const [totalRepos, setTotalRepos] = useState(0)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { langs, repos, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setLanguages(langs)
          setTotalRepos(repos)
          return
        }
      } catch { sessionStorage.removeItem(CACHE_KEY) }
    }

    fetch('https://api.github.com/users/JmiguelRamriez/repos?per_page=100&sort=pushed')
      .then(r => r.json())
      .then(data => {
        const counts = {}
        data.forEach(r => {
          if (r.language) {
            counts[r.language] = (counts[r.language] || 0) + 1
          }
        })
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }))

        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          langs: sorted, repos: data.length, ts: Date.now()
        }))
        setLanguages(sorted)
        setTotalRepos(data.length)
      })
      .catch(() => {})
  }, [])

  const maxCount = languages ? languages[0]?.count || 1 : 1

  return (
    <section id="github-feed" style={{ position: 'relative' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-dot" />
            {t('githubFeed.sectionTag')}
          </span>
          <h2>{t('githubFeed.title')}</h2>
        </div>

        {languages ? (
          <div className="lang-chart">
            {languages.map((lang, i) => (
              <div key={lang.name} className="lang-row">
                <span
                  className="lang-dot"
                  style={{ opacity: 1 - i * 0.12 }}
                />
                <span className="lang-name">{lang.name}</span>
                <div className="lang-bar-track">
                  <div
                    className="lang-bar-fill"
                    style={{
                      width: `${(lang.count / maxCount) * 100}%`,
                      opacity: 1 - i * 0.12,
                    }}
                  />
                </div>
                <span className="lang-count">{lang.count}</span>
              </div>
            ))}
            <p className="lang-subtitle">
              {lang === 'es'
                ? `Basado en ${totalRepos} repositorios públicos`
                : `Based on ${totalRepos} public repositories`
              }
            </p>
          </div>
        ) : (
          <div className="lang-chart">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="lang-row">
                <span className="lang-dot lang-dot--sk" />
                <span className="lang-name lang-name--sk">&nbsp;</span>
                <div className="lang-bar-track">
                  <div
                    className="lang-bar-fill lang-bar-fill--sk"
                    style={{ width: `${30 + i * 10}%` }}
                  />
                </div>
                <span className="lang-count lang-count--sk">&nbsp;</span>
              </div>
            ))}
          </div>
        )}

        <div className="gh-footer">
          <a
            href="https://github.com/JmiguelRamriez"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            {t('githubFeed.viewAll')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default GitHubFeed
