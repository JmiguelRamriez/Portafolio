import { useState, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './GitHubFeed.css'

const CACHE_KEY = 'gh-contrib-cache'
const CACHE_TTL = 10 * 60 * 1000
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function parseContributions(html) {
  const fromMatch = html.match(/data-from="(\d{4}-\d{2}-\d{2})/)
  const toMatch = html.match(/data-to="(\d{4}-\d{2}-\d{2})/)
  if (!fromMatch || !toMatch) throw new Error('no date range')

  const start = new Date(fromMatch[1] + 'T00:00:00')
  const end = new Date(toMatch[1] + 'T00:00:00')

  const counts = []
  const re = /(?:(\d+)|No)\s+contributions?\s+on\s+\w+\s+\d+/g
  let m
  while ((m = re.exec(html)) !== null) {
    counts.push(m[1] ? parseInt(m[1]) : 0)
  }

  const entries = {}
  const cur = new Date(start)
  let i = 0
  while (cur <= end && i < counts.length) {
    const key = cur.toISOString().slice(0, 10)
    entries[key] = counts[i]
    cur.setDate(cur.getDate() + 1)
    i++
  }
  return { entries, start, end }
}

function getLevel(count) {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 10) return 2
  if (count <= 25) return 3
  return 4
}

function GitHubFeed() {
  const { t } = useLanguage()
  const [grid, setGrid] = useState(null)
  const [total, setTotal] = useState(null)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        const { grid: g, total: tot, meta: m, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setGrid(g); setTotal(tot); setMeta(m)
          return
        }
      } catch { sessionStorage.removeItem(CACHE_KEY) }
    }

    fetch('https://github.com/users/JmiguelRamriez/contributions')
      .then(r => r.text())
      .then(html => {
        const { entries, start, end } = parseContributions(html)
        const totalCount = Object.values(entries).reduce((a, b) => a + b, 0)

        const first = new Date(start)
        while (first.getDay() !== 0) first.setDate(first.getDate() - 1)
        const last = new Date(end)

        const cols = Math.ceil((last - first) / (7 * 86400000))
        const cells = []
        const months = []

        let prevMonth = -1
        for (let w = 0; w < cols; w++) {
          for (let d = 0; d < 7; d++) {
            const date = new Date(first)
            date.setDate(date.getDate() + w * 7 + d)
            const key = date.toISOString().slice(0, 10)
            const count = entries[key]
            if (count !== undefined) {
              cells.push({ key, count, day: d, week: w, level: getLevel(count) })
            } else {
              cells.push({ key, count: null, day: d, week: w, level: -1 })
            }
          }
          const m = new Date(first)
          m.setDate(m.getDate() + w * 7 + 3)
          const month = m.getMonth()
          if (month !== prevMonth) {
            months.push({ label: MONTHS[month], col: w })
            prevMonth = month
          }
        }

        const dayLabels = ['Mon','','Wed','','Fri','','Sun']

        const result = { cells, months, dayLabels, cols, first, last }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ grid: result, total: totalCount, meta: null, ts: Date.now() }))
        setGrid(result)
        setTotal(totalCount)
      })
      .catch(() => {})
  }, [])

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

        {grid ? (
          <div className="contrib-wrap">
            <div className="contrib-header">
              <span className="contrib-total">{total} contributions in the last year</span>
            </div>
            <div className="contrib-table">
              <div className="contrib-labels">
                {grid.dayLabels.map((l, i) => (
                  <span key={i} className="contrib-dow">{l}</span>
                ))}
              </div>
              <div className="contrib-body" style={{ '--cols': grid.cols }}>
                {grid.months.map((m, i) => (
                  <span
                    key={i}
                    className="contrib-month"
                    style={{ gridColumn: m.col + 1 }}
                  >
                    {m.label}
                  </span>
                ))}
                {grid.cells.map((c) => (
                  <span
                    key={c.key}
                    className={`contrib-cell ${c.level >= 0 ? 'contrib-cell--active' : ''} contrib-cell--l${Math.max(0, c.level)}`}
                    style={{ gridRow: c.day + 1 }}
                    title={c.count !== null ? `${c.count} contribution${c.count !== 1 ? 's' : ''} on ${new Date(c.key + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="contrib-skeleton">
            {Array.from({ length: 200 }).map((_, i) => (
              <span key={i} className="contrib-cell contrib-cell--skeleton" />
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
