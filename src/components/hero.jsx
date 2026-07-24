import { useRef, useEffect } from 'react'
import '../App.css'
import Typewriter from './Typewriter'
import CircuitBg from './CircuitBg'

function Hero() {
  const aboutRef = useRef(null)

  useEffect(() => {
    const el = aboutRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="hero">
      <CircuitBg />
      <div className="hero-content">
        <span className="section-tag" data-cursor="logo">
          <span className="tag-dot" />
          $ whoami  →  josemiguel
        </span>

        <h1>
          Robotics &amp; Digital Systems<br />
          <span className="gradient-text"><Typewriter text="Engineering Student" /></span>
        </h1>

        <p>
          Building intelligent systems at the intersection of AI, Robotics and Embedded Systems.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary" data-cursor="cta">
            <span>View Projects</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#contact" className="btn btn-outline" data-cursor="link">Contact Me</a>
          <a href="/Portafolio/files/cv.pdf" download className="btn btn-outline" data-cursor="link">Download CV</a>
        </div>

        <div className="hero-socials">
          <a href="https://github.com/JmiguelRamriez" target="_blank" rel="noopener noreferrer" data-cursor="link">GitHub</a>
          <a href="https://www.linkedin.com/in/jos%C3%A9-miguel-ramirez-gutierrez-a592a4351/" target="_blank" rel="noopener noreferrer" data-cursor="link">LinkedIn</a>
          <a href="mailto:2005josemiguelramirez@gmail.com" data-cursor="link">Email</a>
        </div>
      </div>

      <div className="hero-about reveal-up" ref={aboutRef}>
        <div className="hero-about-card">
          <div className="hero-about-photo">
            <img src="images/YoTec.jpg" alt="Jose Miguel Ramirez" />
          </div>
          <div className="hero-about-body">
            <span className="section-tag">$ cat about.md</span>
            <p className="hero-about-name">Jos&eacute; Miguel Ram&iacute;rez</p>
            <p>
              I&apos;m Jos&eacute; Miguel, an engineering student from Chile, currently studying Robotics and Digital Systems at Tecnol&oacute;gico de Monterrey, Campus Quer&eacute;taro.
            </p>
            <p>
              I&apos;m passionate about embedded systems and the automotive industry &mdash; I believe the future of mobility is being written in firmware, and I want to be part of that story.
            </p>
            <div className="hero-about-badges">
              <span className="badge">Chile</span>
              <span className="badge">Tec de Monterrey</span>
              <span className="badge">Embedded Systems</span>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
