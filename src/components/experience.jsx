import { useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { img } from '../utils'
import './Experience.css'

const experienceData = [
  {
    type: 'education',
    title: 'B.S. in Robotics and Digital Systems Engineering',
    title_es: 'Ingenier\u00eda en Rob\u00f3tica y Sistemas Digitales',
    institution: 'ITESM \u2014 Tecnol\u00f3gico de Monterrey',
    period: 'Aug 2024 \u2013 Expected 2028',
    period_es: 'Ago 2024 \u2013 2028 (est.)',
    description: 'Developing expertise in embedded firmware for ARM-based microcontrollers, FPGA design (VHDL/Verilog), and real-time control systems for robotic applications. Studying computer vision, sensor fusion, and autonomous navigation algorithms, reinforced by hands-on projects in PCB design, ROS-based control architectures, and IoT system integration with a strong foundation in C/C++, Python, and MATLAB.',
    description_es: 'Desarrollando experiencia en firmware embebido para microcontroladores ARM, dise\u00f1o FPGA (VHDL/Verilog) y sistemas de control en tiempo real para aplicaciones rob\u00f3ticas. Estudiando visi\u00f3n por computadora, fusi\u00f3n de sensores y algoritmos de navegaci\u00f3n aut\u00f3noma, reforzado por proyectos pr\u00e1cticos en dise\u00f1o PCB, arquitecturas de control basadas en ROS e integraci\u00f3n de sistemas IoT con una s\u00f3lida base en C/C++, Python y MATLAB.',
    logo: null,
  },
  {
    type: 'work',
    title: 'Automated Positioning System \u2014 PEPS Validation',
    title_es: 'Sistema de Posicionamiento Automatizado \u2014 Validaci\u00f3n PEPS',
    institution: 'Valeo Contractor',
    institution_es: 'Contratista Valeo',
    period: 'Apr 2026 \u2013 Jun 2026',
    period_es: 'Abr 2026 \u2013 Jun 2026',
    description: [
      'Designed and implemented CoreXY kinematics firmware in C++ with non-blocking stepper control, trapezoidal acceleration profiles, and a serial command protocol for remote operation.',
      'Built an autonomous workspace calibration system using 4 HC-SR04 ultrasonic sensors with a halving-approach algorithm for precise spatial positioning across the designated area.',
      'Developed a Python/Tkinter GUI for real-time control, programmable movement sequences with EEPROM persistence, configurable origin selection, and emergency stop handling.',
    ],
    description_es: [
      'Dise\u00f1\u00e9 e implement\u00e9 firmware de cinem\u00e1tica CoreXY en C++ con control de motor paso a paso no bloqueante, perfiles de aceleraci\u00f3n trapezoidales y un protocolo de comandos serie para operaci\u00f3n remota.',
      'Constru\u00ed un sistema de calibraci\u00f3n aut\u00f3nomo del \u00e1rea de trabajo usando 4 sensores ultras\u00f3nicos HC-SR04 con un algoritmo de aproximaci\u00f3n por mitades para posicionamiento espacial preciso en toda el \u00e1rea designada.',
      'Desarroll\u00e9 una interfaz Python/Tkinter para control en tiempo real, secuencias de movimiento programables con persistencia EEPROM, selecci\u00f3n de origen configurable y manejo de parada de emergencia.',
    ],
    logo: null,
  },
  {
    type: 'work',
    title: 'IT Consultant',
    title_es: 'Consultor TI',
    institution: 'BinarySails',
    period: 'May 2025 \u2013 Present',
    period_es: 'May 2025 \u2013 Presente',
    description: [
      'Collaborated to verify and standardize Microsoft OneDrive functionality, remote sharing, and synchronization across multiple external computers.',
      'Formulated an official instructional curriculum syllabus outlining cloud storage collaboration techniques and synchronization states for workplace environments.',
      'Developed and delivered training presentations guiding users on effective cloud file management and the transition from local storage to OneDrive structures.',
      'Professionalized the delivery of project documentation by standardizing the organization of electronic and firmware files within shared cloud drives.',
    ],
    description_es: [
      'Colabor\u00e9 para verificar y estandarizar la funcionalidad de Microsoft OneDrive, el uso compartido remoto y la sincronizaci\u00f3n en m\u00faltiples computadoras externas.',
      'Formul\u00e9 un plan de estudios oficial que describe t\u00e9cnicas de colaboraci\u00f3n en almacenamiento en la nube y estados de sincronizaci\u00f3n para entornos laborales.',
      'Desarroll\u00e9 y present\u00e9 capacitaciones guiando a usuarios en la gesti\u00f3n efectiva de archivos en la nube y la transici\u00f3n del almacenamiento local a estructuras de OneDrive.',
      'Profesionalic\u00e9 la entrega de documentaci\u00f3n de proyectos estandarizando la organizaci\u00f3n de archivos electr\u00f3nicos y de firmware en unidades compartidas en la nube.',
    ],
    logo: 'images/BinarySails.png',
  },
]

function ExperienceItem({ item, index }) {
  const { lang, t } = useLanguage()
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

  const isEs = lang === 'es'
  const title = isEs && item.title_es ? item.title_es : item.title
  const inst = isEs && item.institution_es ? item.institution_es : item.institution
  const period = isEs && item.period_es ? item.period_es : item.period
  const desc = isEs && item.description_es ? item.description_es : item.description

  return (
    <div className={`exp-item ${item.type} fade-in`} ref={ref} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="exp-pad" />
      <div className="exp-card">
        <div className="exp-header">
          {item.logo && (
            <div className="exp-logo">
              <img src={img(item.logo)} alt={inst} />
            </div>
          )}
          <div className="exp-header-text">
            <span className="exp-type">{item.type === 'education' ? t('experience.education') : t('experience.experience')}</span>
            <h3>{title}</h3>
            <p className="exp-institution">{inst}</p>
            <span className="exp-period">{period}</span>
          </div>
        </div>
        <div className="exp-body">
          {Array.isArray(desc) ? (
            <ul>
              {desc.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          ) : (
            <p>{desc}</p>
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
