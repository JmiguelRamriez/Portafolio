import { useRef, useEffect } from 'react'
import './Skills.css'

const skillsData = [
  {
    titulo: 'Hardware & Electronics',
    color: 'green',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    items: [
      { name: 'KiCad' },
      { name: 'ESP32' },
      { name: 'Arduino' },
      { name: 'FPGA' },
      { name: 'Raspberry Pi' },
      { name: 'Allwinner V3s' },
      { name: 'Electronic Design' },
    ],
  },
  {
    titulo: 'Programming & Firmware',
    color: 'blue',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    items: [
      { name: 'C++' },
      { name: 'Python' },
      { name: 'Rust' },
      { name: 'MicroPython' },
      { name: 'Embedded Linux' },
      { name: 'Firmware' },
      { name: 'MQTT' },
    ],
  },
  {
    titulo: 'Web & Software',
    color: 'purple',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    items: [
      { name: 'React' },
      { name: 'Flask' },
      { name: 'Axum' },
      { name: 'Node.js' },
      { name: 'Tkinter' },
      { name: 'REST APIs' },
      { name: 'Git' },
      { name: 'SQL' },
      { name: 'NoSQL' },
    ],
  },
  {
    titulo: 'Complementary',
    color: 'amber',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
    items: [
      { name: 'Linux' },
      { name: 'Docker' },
      { name: 'Problem Solving' },
      { name: 'Teamwork' },
    ],
  },
]

function SkillCard({ skill, index }) {
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
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="skill-card reveal-up" ref={ref} data-color={skill.color} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="skill-icon">{skill.icon}</div>
      <h3>{skill.titulo}</h3>
      <div className="skill-tags">
        {skill.items.map((item, i) => (
          <span key={i}>{item.name}</span>
        ))}
      </div>
    </div>
  )
}

function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">$ cat skills</span>
          <h2>Tech Stack &amp; Tools</h2>
        </div>
        <div className="skills-grid">
          {skillsData.map((skill, index) => (
            <SkillCard key={skill.titulo} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
