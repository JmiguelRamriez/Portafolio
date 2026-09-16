import { LanguageProvider } from './i18n/LanguageContext'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/projects'
import Skills from './components/Skills'
import GitHubFeed from './components/GitHubFeed'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import './components/Cursor.css'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <a href="#projects" className="skip-link">Skip to content</a>
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
        <GitHubFeed />
        <Experience />
        <Contact />
        <Footer />
      </div>
      <BackToTop />
    </LanguageProvider>
  )
}

export default App
