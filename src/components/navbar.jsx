import { useEffect, useRef } from 'react'

function Navbar() {
  const navRef = useRef(null)

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

  return (
    <nav ref={navRef}>
      <div className="nav-container">
        <a href="#hero" className="nav-logo" data-cursor="logo">
          <span className="nav-bracket">&lt;</span>
          <span className="nav-name">JR</span>
          <span className="nav-bracket">/&gt;</span>
        </a>

        <ul className="nav-links">
          <li><a href="#hero" className="nav-link" data-cursor="link">Home</a></li>
          <li><a href="#projects" className="nav-link" data-cursor="link">Projects</a></li>
          <li><a href="#skills" className="nav-link" data-cursor="link">Skills</a></li>
          <li><a href="/Portafolio/files/cv.pdf" download className="nav-link" data-cursor="link">CV</a></li>
          <li><a href="#contact" className="btn btn-primary nav-cta" data-cursor="cta">Contact</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
