import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './GitHubFeed.css'

const CACHE_KEY = 'gh-feed-cache'
const CACHE_TTL = 5 * 60 * 1000

const LANG_COLORS = {
  'C++': '#f34b7d',
  'C': '#555555',
  'Python': '#3572a5',
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Rust': '#dea584',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Java': '#b07219',
  'Kotlin': '#a97bff',
  'Go': '#00add8',
  'Shell': '#89e051',
  'Makefile': '#427819',
  'CMake': '#da3434',
  'SystemVerilog': '#dae1c2',
  'VHDL': '#adb2cb',
  'Swift': '#f05138',
  'Dart': '#00b4ab',
  'Jupyter Notebook': '#da5b0b',
  'Verilog': '#b2b7f8',
}

function relativeTime(dateStr) {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function SkeletonCard() {
  return (
    <div className="gh-card gh-skeleton">
      <div className="gh-sk-line gh-sk-line--short" />
      <div className="gh-sk-line gh-sk-line--long" />
      <div className="gh-sk-row">
        <div className="gh-sk-badge" />
        <div className="gh-sk-badge gh-sk-badge--short" />
      </div>
    </div>
  )
}

function GitHubFeed() {
  const { t } = useLanguage()
  const [repos, setRepos] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setRepos(data)
          return
        }
      } catch {
        sessionStorage.removeItem(CACHE_KEY)
      }
    }

    fetch('https://api.github.com/users/JmiguelRamriez/repos?sort=pushed&per_page=6&type=owner')
      .then((res) => {
        if (!res.ok) throw new Error('GitHub API error')
        return res.json()
      })
      .then((data) => {
        const filtered = data.filter((r) => !r.fork)
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: filtered, ts: Date.now() }))
        setRepos(filtered)
      })
      .catch(() => setError(true))
  }, [])

  if (error) return null
  if (!repos) {
    return (
      <section id="github-feed">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-dot" />
              {t('githubFeed.sectionTag')}
            </span>
            <h2>{t('githubFeed.title')}</h2>
          </div>
          <div className="gh-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="github-feed">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-dot" />
            {t('githubFeed.sectionTag')}
          </span>
          <h2>{t('githubFeed.title')}</h2>
        </div>
        <div className="gh-grid">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="gh-card"
            >
              <div className="gh-card-top">
                <svg className="gh-repo-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
                </svg>
                <span className="gh-repo-name">{repo.name}</span>
              </div>
              {repo.description && (
                <p className="gh-repo-desc">{repo.description}</p>
              )}
              <div className="gh-card-bottom">
                {repo.language && (
                  <span className="gh-lang">
                    <span
                      className="gh-lang-dot"
                      style={{ background: LANG_COLORS[repo.language] || '#8b949e' }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="gh-time">{relativeTime(repo.pushed_at)}</span>
              </div>
            </a>
          ))}
        </div>
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
