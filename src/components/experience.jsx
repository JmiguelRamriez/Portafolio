import { useRef, useEffect } from 'react'
import './Experience.css'

const experienceData = [
  {
    type: 'education',
    title: 'B.S. in Robotics and Digital Systems Engineering',
    institution: 'ITESM — Tecnológico de Monterrey',
    period: 'Aug 2024 – Expected 2028',
    description: 'Pursuing a degree focused on embedded systems, PCB design, firmware development, and digital systems engineering.',
    logo: null,
  },
  {
    type: 'work',
    title: 'Automated Positioning System Contractor — PEPS Validation',
    institution: 'valeo-peps',
    period: 'Apr 2026 – Jun 2026',
    description: [
      'Designed and implemented CoreXY kinematics firmware in C++ with non-blocking stepper control, trapezoidal acceleration profiles, and a serial command protocol for remote operation.',
      'Built an autonomous workspace calibration system using 4 HC-SR04 ultrasonic sensors with a halving-approach algorithm for precise spatial positioning across the designated area.',
      'Developed a Python/Tkinter GUI for real-time control, programmable movement sequences with EEPROM persistence, configurable origin selection, and emergency stop handling.',
    ],
    logo: null,
  },
  {
    type: 'work',
    title: 'IT Consultant',
    institution: 'BinarySails',
    period: 'May 2025 – Present',
    description: [
      'Collaborated to verify and standardize Microsoft OneDrive functionality, remote sharing, and synchronization across multiple external computers.',
      'Formulated an official instructional curriculum syllabus outlining cloud storage collaboration techniques and synchronization states for workplace environments.',
      'Developed and delivered training presentations guiding users on effective cloud file management and the transition from local storage to OneDrive structures.',
      'Professionalized the delivery of project documentation by standardizing the organization of electronic and firmware files within shared cloud drives.',
    ],
    logo: 'images/BinarySails.png',
  },
]

function ExperienceItem({ item, index }) {
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
    <div className={`exp-item ${item.type} reveal-up`} ref={ref} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="exp-dot" />
      <div className="exp-card">
        <div className="exp-header">
          {item.logo && (
            <div className="exp-logo">
              <img src={item.logo} alt={item.institution} />
            </div>
          )}
          <div className="exp-header-text">
            <span className="exp-type">{item.type === 'education' ? 'Education' : 'Experience'}</span>
            <h3>{item.title}</h3>
            <p className="exp-institution">{item.institution}</p>
            <span className="exp-period">{item.period}</span>
          </div>
        </div>
        <div className="exp-body">
          {Array.isArray(item.description) ? (
            <ul>
              {item.description.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : (
            <p>{item.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <div className="section-header reveal-up">
          <span className="section-tag">// EXPERIENCE</span>
          <h2>Education &amp; Work</h2>
        </div>
        <div className="exp-timeline">
          {experienceData.map((item, index) => (
            <ExperienceItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
