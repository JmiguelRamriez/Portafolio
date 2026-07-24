import '../App.css'
import CircuitBg from './CircuitBg'

function Hero() {
  return (
    <section id="hero">
      <CircuitBg />
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-photo">
            <img src="images/YoTec.jpg" alt="Jose Miguel Ramirez" />
          </div>
          <div className="hero-info">
            <span className="section-tag" data-cursor="logo">
              <span className="tag-dot" />
              $ whoami  →  josemiguel
            </span>
            <h1>Jos&eacute; Miguel Ram&iacute;rez</h1>
            <p className="hero-subtitle">Robotics &amp; Embedded Systems Student</p>
            <p className="hero-detail">from Chile &middot; Tec de Monterrey</p>
          </div>
        </div>

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

      <div className="scroll-hint">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </div>
    </section>
  )
}

export default Hero
