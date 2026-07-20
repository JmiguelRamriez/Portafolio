import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    function onMove(e) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
    }

    function onHover(el) {
      const attr = el.getAttribute('data-cursor')
      cursor.classList.add('cursor-' + attr)
      follower.classList.add('cursor-' + attr)
    }

    function offHover(el) {
      const attr = el.getAttribute('data-cursor')
      cursor.classList.remove('cursor-' + attr)
      follower.classList.remove('cursor-' + attr)
    }

    function onMouseOver(e) {
      const el = e.target.closest('[data-cursor]')
      if (el) onHover(el)
    }

    function onMouseOut(e) {
      const el = e.target.closest('[data-cursor]')
      if (el) offHover(el)
    }

    function lerp() {
      const dx = mouseRef.current.x - posRef.current.x
      const dy = mouseRef.current.y - posRef.current.y
      posRef.current.x += dx * 0.12
      posRef.current.y += dy * 0.12
      follower.style.left = posRef.current.x + 'px'
      follower.style.top = posRef.current.y + 'px'
      raf = requestAnimationFrame(lerp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    let raf = requestAnimationFrame(lerp)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={cursorRef} />
      <div className="cursor-follower" ref={followerRef} />
    </>
  )
}
