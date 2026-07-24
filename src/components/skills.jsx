import { useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import './Skills.css'

const skillsData = [
  {
    tituloKey: 'skills.categories.hardware',
    items: ['KiCad', 'ESP32', 'Arduino', 'FPGA', 'Raspberry Pi', 'Allwinner V3s', 'Electronic Design'],
  },
  {
    tituloKey: 'skills.categories.firmware',
    items: ['C++', 'Python', 'Rust', 'MicroPython', 'Embedded Linux', 'Firmware', 'MQTT'],
  },
  {
    tituloKey: 'skills.categories.web',
    items: ['React', 'Flask', 'Axum', 'Node.js', 'Tkinter', 'REST APIs', 'Git', 'SQL', 'NoSQL'],
  },
  {
    tituloKey: 'skills.categories.complementary',
    items: ['Linux', 'Docker', 'Problem Solving', 'Teamwork'],
  },
]

function SkillCategory({ skill, index }) {
  const { t } = useLanguage()
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
      <div className="skill-category-header">{t(skill.tituloKey)}</div>
      <div className="skill-items">
        {skill.items.map((item, i) => (
          <div key={i} className="skill-line">
            <span className="skill-tree">{i === skill.items.length - 1 ? '\u2514\u2500' : '\u251c\u2500'}</span>
            <span className="skill-name">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Skills() {
  const { t } = useLanguage()
  return (
    <section id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-tag">{t('skills.sectionTag')}</span>
          <h2>{t('skills.title')}</h2>
        </div>
        <div className="skills-flow">
          {skillsData.map((skill, index) => (
            <SkillCategory key={skill.tituloKey} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
