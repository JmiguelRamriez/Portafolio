import { useRef, useEffect } from 'react'
import './About.css'

function About() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
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
    <section id="about">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">$ cat about.md</span>
          <h2>About Me</h2>
        </div>
        <div className="about-card reveal-up" ref={ref}>
          <div className="about-photo">
            <img src="images/YoTec.jpg" alt="Jose Miguel Ramirez" />
          </div>
          <div className="about-text">
            <p>
              I&apos;m Jos&eacute; Miguel, an engineering student from Ecuador, currently studying Robotics and Digital Systems at Tecnol&oacute;gico de Monterrey, Campus Quer&eacute;taro.
            </p>
            <p>
              I&apos;m passionate about embedded systems and the automotive industry &mdash; I believe the future of mobility is being written in firmware, and I want to be part of that story. I&apos;m looking for professional projects where I can contribute, learn, and push my skills further, working on real problems that matter.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About