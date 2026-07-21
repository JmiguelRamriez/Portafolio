import Cursor from './components/Cursor'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Skills from './components/skills'
import Experience from './components/experience'
import Contact from './components/contact'
import Footer from './components/footer'
import BackToTop from './components/BackToTop'
import GradientBg from './components/GradientBg'
import './components/Cursor.css'
import './components/MoonStars.css'
import './App.css'

function App() {
  return (
    <div>
      <Cursor />
      <div className="noise" />
      <GradientBg />
      <div className="app-content">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
        <Footer />
      </div>
      <BackToTop />
    </div>
  )
}

export default App
