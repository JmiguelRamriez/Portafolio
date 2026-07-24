import { useRef, useEffect } from 'react'
import './Skills.css'

const skillsData = [
  {
    titulo: 'Hardware & Electronics',
    items: ['KiCad', 'ESP32', 'Arduino', 'FPGA', 'Raspberry Pi', 'Allwinner V3s', 'Electronic Design'],
  },
  {
    titulo: 'Programming & Firmware',
    items: ['C++', 'Python', 'Rust', 'MicroPython', 'Embedded Linux', 'Firmware', 'MQTT'],
  },
  {
    titulo: 'Web & Software',
    items: ['React', 'Flask', 'Axum', 'Node.js', 'Tkinter', 'REST APIs', 'Git', 'SQL', 'NoSQL'],
  },
  {
    titulo: 'Complementary',
    items: ['Linux', 'Docker', 'Problem Solving', 'Teamwork'],
  },
]

function SkillCategory({ skill, index }) {
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
    <div className="skill-category fade-in" ref={ref} style={{ transitionDelay: `${index * 0.1}s` }}>
      <h3 className="skill-category-title">{skill.titulo}</h3>
      <div className="skill-tags">
        {skill.items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function Skills() {
  return (
    <section id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-tag">$ cat skills</span>
          <h2>Tech Stack &amp; Tools</h2>
        </div>
        <div className="skills-flow">
          {skillsData.map((skill, index) => (
            <SkillCategory key={skill.titulo} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills