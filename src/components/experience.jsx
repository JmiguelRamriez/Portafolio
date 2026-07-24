import { useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { img } from '../utils'
import './Experience.css'

const experienceData = [
  {
    type: 'education',
    title: 'B.S. in Robotics and Digital Systems Engineering',
    institution: 'ITESM \u2014 Tecnol\u00f3gico de Monterrey',
    period: 'Aug 2024 \u2013 Expected 2028',
    description: 'Developing expertise in embedded firmware for ARM-based microcontrollers, FPGA design (VHDL/Verilog), and real-time control systems for robotic applications. Studying computer vision, sensor fusion, and autonomous navigation algorithms, reinforced by hands-on projects in PCB design, ROS-based control architectures, and IoT system integration with a strong foundation in C/C++, Python, and MATLAB.',
    logo: null,
  },
  {
    type: 'work',
    title: 'Automated Positioning System \u2014 PEPS Validation',
    institution: 'Valeo Contractor',
    period: 'Apr 2026 \u2013 Jun 2026',
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
    period: 'May 2025 \u2013 Present',
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
    <div className={`exp-item ${item.type} fade-in`} ref={ref} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="exp-pad" />
      <div className="exp-card">
        <div className="exp-header">
          {item.logo && (
            <div className="exp-logo">
              <img src={img(item.logo)} alt={item.institution} />
            </div>
          )}
          <div className="exp-header-text">
            <span className="exp-type">{item.type === 'education' ? t('experience.education') : t('experience.experience')}</span>
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
  const { t } = useLanguage()
  return (
    <section id="experience">
      <div className="container">
        <div className="section-header fade-in">
          <span className="section-tag">{t('experience.sectionTag')}</span>
          <h2>{t('experience.title')}</h2>
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
