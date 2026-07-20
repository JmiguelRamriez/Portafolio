import '../App.css'

const skills = [
  'KiCad', 'PCB Design', 'C++', 'Python', 'Rust', 'React',
  'ESP32', 'Flask', 'Axum', 'MQTT', 'Embedded Linux', 'MicroPython',
  'IoT', 'Electronic Design', 'Firmware', 'Git',
]

function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg-grid" />
      <div className="hero-content">
        <span className="section-tag" data-cursor="logo">
          <span className="tag-dot" />
          HI, I'M JOSE MIGUEL
        </span>

        <h1>
          Robotics &amp; Digital Systems<br />
          <span className="gradient-text">Engineering Student</span>
        </h1>

        <p>
          Passionate about embedded systems, PCB design, and building
          technology that bridges hardware and software.
        </p>

        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary" data-cursor="cta">
            <span>View Projects</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#contact" className="btn btn-outline" data-cursor="link">Contact Me</a>
        </div>

        <div className="hero-socials">
          <a href="https://github.com/JmiguelRamriez" target="_blank" rel="noopener noreferrer" data-cursor="link">GitHub</a>
          <a href="https://www.linkedin.com/in/jos%C3%A9-miguel-ramirez-gutierrez-a592a4351/" target="_blank" rel="noopener noreferrer" data-cursor="link">LinkedIn</a>
          <a href="mailto:2005josemiguelramirez@gmail.com" data-cursor="link">Email</a>
        </div>
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <div className="ticker-track">
          {[...skills, ...skills].map((s, i) => (
            <span key={i}>
              {s}
              <span className="ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>scroll</span>
      </div>
    </section>
  )
}

export default Hero
