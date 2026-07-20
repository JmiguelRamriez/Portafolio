import Cursor from './components/Cursor'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Skills from './components/skills'
import Contact from './components/contact'
import Footer from './components/footer'
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
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App
