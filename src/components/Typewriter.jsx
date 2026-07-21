import { useState, useEffect } from 'react'

function Typewriter({ text, speed = 60, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    setDisplayed('')
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  useEffect(() => {
    const blink = setInterval(() => setShowCursor(v => !v), 530)
    return () => clearInterval(blink)
  }, [])

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor" style={{ opacity: showCursor ? 1 : 0 }}>|</span>
    </span>
  )
}

export default Typewriter
