import { useMemo, useState, useCallback, useRef } from 'react'
import './CircuitBg.css'

const COLS = 30
const ROWS = 20
const CELL = 40
const CHAMFER = 0.5
const PROX_RADIUS = 150

function randomEdgePoint() {
  const edge = Math.floor(Math.random() * 4)
  if (edge === 0) return [0, Math.floor(Math.random() * ROWS)]
  if (edge === 1) return [COLS, Math.floor(Math.random() * ROWS)]
  if (edge === 2) return [Math.floor(Math.random() * COLS), 0]
  return [Math.floor(Math.random() * COLS), ROWS]
}

function generateTrace() {
  let [x, y] = randomEdgePoint()
  const points = [[x, y]]
  const segments = 3 + Math.floor(Math.random() * 5)
  let horizontal = Math.random() > 0.5

  for (let i = 0; i < segments; i++) {
    const length = 2 + Math.floor(Math.random() * 5)
    const dir = Math.random() > 0.5 ? 1 : -1
    if (horizontal) x = Math.max(0, Math.min(COLS, x + length * dir))
    else y = Math.max(0, Math.min(ROWS, y + length * dir))
    points.push([x, y])
    horizontal = !horizontal
  }
  return points
}

function toChamferedPath(points) {
  let d = `M ${points[0][0] * CELL} ${points[0][1] * CELL} `
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1]
    const [x, y] = points[i]
    const [nx, ny] = points[i + 1]
    const horizontalIn = py === y

    if (horizontalIn) {
      const dx = Math.sign(x - px) * CHAMFER
      const dy = Math.sign(ny - y) * CHAMFER
      d += `L ${(x - dx) * CELL} ${y * CELL} L ${x * CELL} ${(y + dy) * CELL} `
    } else {
      const dy = Math.sign(y - py) * CHAMFER
      const dx = Math.sign(nx - x) * CHAMFER
      d += `L ${x * CELL} ${(y - dy) * CELL} L ${(x + dx) * CELL} ${y * CELL} `
    }
  }
  const [lx, ly] = points[points.length - 1]
  d += `L ${lx * CELL} ${ly * CELL} `
  return d
}

function computeBounds(points) {
  const xs = points.map(p => p[0] * CELL)
  const ys = points.map(p => p[1] * CELL)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, minX, maxX, minY, maxY }
}

function pointToRectDist(mx, my, b) {
  const closestX = Math.max(b.minX, Math.min(mx, b.maxX))
  const closestY = Math.max(b.minY, Math.min(my, b.maxY))
  const dx = mx - closestX
  const dy = my - closestY
  return Math.sqrt(dx * dx + dy * dy)
}

const chipDefs = [
  { x: 520, y: 310, w: 160, h: 140, label: 'CPU' },
  { x: 880, y: 130, w: 90, h: 70, label: 'MEM' },
  { x: 140, y: 550, w: 80, h: 60, label: 'IO' },
  { x: 60, y: 200, w: 70, h: 50, label: 'PWR' },
  { x: 1040, y: 500, w: 100, h: 80, label: 'DSP' },
]

function Chip({ x, y, w, h, label, intensity }) {
  const pinsX = Math.round(w / 16)
  const pinsY = Math.round(h / 16)
  const gapX = w / (pinsX + 1)
  const gapY = h / (pinsY + 1)
  const active = intensity > 0.2
  return (
    <g className={`chip${active ? ' active' : ''}`}>
      <rect x={x} y={y} width={w} height={h} rx="3" />
      {Array.from({ length: pinsX }).map((_, i) => (
        <g key={`px${i}`}>
          <circle cx={x + gapX * (i + 1)} cy={y} r="2.5" className="chip-pad" />
          <circle cx={x + gapX * (i + 1)} cy={y + h} r="2.5" className="chip-pad" />
        </g>
      ))}
      {Array.from({ length: pinsY }).map((_, i) => (
        <g key={`py${i}`}>
          <circle cx={x} cy={y + gapY * (i + 1)} r="2.5" className="chip-pad" />
          <circle cx={x + w} cy={y + gapY * (i + 1)} r="2.5" className="chip-pad" />
        </g>
      ))}
      <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="chip-label">
        {label}
      </text>
    </g>
  )
}

function CircuitBg() {
  const [mousePos, setMousePos] = useState(null)
  const svgRef = useRef(null)
  const rafRef = useRef(null)

  const traces = useMemo(() => Array.from({ length: 70 }, () => generateTrace()), [])
  const traceBounds = useMemo(() => traces.map(computeBounds), [traces])
  const chips = useMemo(() => chipDefs.map(c => ({
    ...c,
    bounds: { minX: c.x, maxX: c.x + c.w, minY: c.y, maxY: c.y + c.h, cx: c.x + c.w / 2, cy: c.y + c.h / 2 },
  })), [])

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 1200,
        y: ((e.clientY - rect.top) / rect.height) * 800,
      })
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePos(null)
  }, [])

  function getIntensity(b) {
    if (!mousePos) return 0
    const dist = pointToRectDist(mousePos.x, mousePos.y, b)
    if (dist > PROX_RADIUS) return 0
    return 1 - (dist / PROX_RADIUS)
  }

  return (
    <div className="circuit-bg">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <radialGradient id="pour" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="800" fill="url(#pour)" />

        {traces.map((points, i) => {
          const intensity = getIntensity(traceBounds[i])
          const isPulse = i % 3 === 0
          return (
            <path
              key={`t${i}`}
              d={toChamferedPath(points)}
              pathLength="100"
              className={isPulse ? 'trace pulse' : 'trace'}
              style={{
                '--prox': intensity,
                animationDelay: isPulse ? `${(i * 0.4) % 5}s` : undefined,
              }}
            />
          )
        })}

        {traces.filter((_, i) => i % 4 === 0).flatMap((points, gi) =>
          points.slice(1, -1).map(([x, y], pi) => {
            const intensity = getIntensity({
              minX: x * CELL - 5, maxX: x * CELL + 5,
              minY: y * CELL - 5, maxY: y * CELL + 5,
              cx: x * CELL, cy: y * CELL,
            })
            return (
              <circle
                key={`v${gi}-${pi}`}
                className="via"
                cx={x * CELL}
                cy={y * CELL}
                r="3.5"
                style={{ '--prox': intensity }}
              />
            )
          })
        )}

        {chips.map(c => (
          <Chip key={c.label} x={c.x} y={c.y} w={c.w} h={c.h} label={c.label} intensity={getIntensity(c.bounds)} />
        ))}
      </svg>
      <div className="circuit-vignette" />
    </div>
  )
}

export default CircuitBg