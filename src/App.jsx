import Cursor from './components/Cursor'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Projects from './components/projects'
import Contact from './components/contact'
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
        <Contact />
      </div>
    </div>
  )
}

export default App
