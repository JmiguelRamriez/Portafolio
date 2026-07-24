import { LanguageProvider } from './i18n/LanguageContext'
import Cursor from './components/Cursor'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Skills from './components/skills'
import Experience from './components/experience'
import Contact from './components/contact'
import Footer from './components/footer'
import BackToTop from './components/BackToTop'
import './components/Cursor.css'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Cursor />
      <div className="noise" />
      <div className="app-content">
        <Navbar />
        <Hero />
        <div className="ticker-bar" aria-hidden="true">
          <div className="ticker-track">
            {[
              'KiCad', 'PCB Design', 'C++', 'Python', 'Rust', 'React',
              'ESP32', 'Flask', 'Axum', 'MQTT', 'Embedded Linux', 'MicroPython',
              'IoT', 'Electronic Design', 'Firmware', 'Git',
            ].map((s, i) => (
              <span key={i}>
                {s}
                <span className="ticker-sep">✦</span>
              </span>
            ))}
          </div>
        </div>
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </div>
      <BackToTop />
    </LanguageProvider>
  )
}

export default App
