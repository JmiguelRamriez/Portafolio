import { useEffect, useRef } from 'react'

export default function GradientBg() {
  const dotsRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = dotsRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let dots = []
    let animId

    function resize() {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width * 2
      canvas.height = height * 2
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'

      dots = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.6 + 0.15,
      }))
    }

    function loop() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const dot of dots) {
        dot.y -= dot.speed
        if (dot.y < -dot.r * 2) {
          dot.y = h + dot.r
          dot.x = Math.random() * w
        }
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(57,211,83,0.4)'
        ctx.fill()
      }

      animId = requestAnimationFrame(loop)
    }

    resize()
    animId = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="gradient-bg-wrapper">
      <div className="gradient-blob-container" aria-hidden="true">
        <div className="gradient-blob" />
        <div className="gradient-blob gradient-blob-secondary" />
      </div>
      <canvas ref={dotsRef} className="floating-dots-canvas" />
    </div>
  )
}
