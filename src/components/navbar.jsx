import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { file } from '../utils'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'

function Navbar() {
  const { t } = useLanguage()
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    function onScroll() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled')
      } else {
        nav.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const links = document.querySelectorAll('.nav-link[href^="#"]')
    const sections = Array.from(links).map(link => {
      const id = link.getAttribute('href').slice(1)
      return document.getElementById(id)
    }).filter(Boolean)

    const obs = new IntersectionObserver(
      (entries) => {
        let current = ''
        entries.forEach(entry => {
          if (entry.isIntersecting) current = entry.target.id
        })
        if (!current) return
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current)
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    )

    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav ref={navRef}>
      <div className="nav-container">
        <a href="#hero" className="nav-logo" data-cursor="logo" onClick={closeMenu}>
          <span className="nav-bracket">&lt;</span>
          <span className="nav-name">JR</span>
          <span className="nav-bracket">/&gt;</span>
        </a>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#hero" className="nav-link" data-cursor="link" onClick={closeMenu}>{t('nav.home')}</a></li>
          <li><a href="#projects" className="nav-link" data-cursor="link" onClick={closeMenu}>{t('nav.projects')}</a></li>
          <li><a href="#skills" className="nav-link" data-cursor="link" onClick={closeMenu}>{t('nav.skills')}</a></li>
          <li><a href="#experience" className="nav-link" data-cursor="link" onClick={closeMenu}>{t('nav.experience')}</a></li>
          <li><a href={file('files/Cv_Jose_Miguel_Ramirez_.pdf')} download className="nav-link" data-cursor="link" onClick={closeMenu}>{t('nav.cv')}</a></li>
          <li><LangToggle /></li>
          <li><ThemeToggle /></li>
          <li><a href="#contact" className="btn btn-primary nav-cta" data-cursor="cta" onClick={closeMenu}>{t('nav.contact')}</a></li>
        </ul>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          data-cursor="link"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </nav>
  )
}

export default Navbar
