import { useMemo } from 'react'
import './CircuitBg.css'

const COLS = 30
const ROWS = 20
const CELL = 40
const CHAMFER = 0.5

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

function Chip({ x, y, w, h, pinsX, pinsY }) {
  const gapX = w / (pinsX + 1)
  const gapY = h / (pinsY + 1)
  return (
    <g className="chip">
      <rect x={x} y={y} width={w} height={h} rx="2" />
      {Array.from({ length: pinsX }).map((_, i) => (
        <g key={`x${i}`}>
          <line x1={x + gapX * (i + 1)} y1={y} x2={x + gapX * (i + 1)} y2={y - 8} />
          <line x1={x + gapX * (i + 1)} y1={y + h} x2={x + gapX * (i + 1)} y2={y + h + 8} />
        </g>
      ))}
      {Array.from({ length: pinsY }).map((_, i) => (
        <g key={`y${i}`}>
          <line x1={x} y1={y + gapY * (i + 1)} x2={x - 8} y2={y + gapY * (i + 1)} />
          <line x1={x + w} y1={y + gapY * (i + 1)} x2={x + w + 8} y2={y + gapY * (i + 1)} />
        </g>
      ))}
    </g>
  )
}

function CircuitBg() {
  const traces = useMemo(() => Array.from({ length: 70 }, () => generateTrace()), [])

  return (
    <div className="circuit-bg">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="pour" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="800" fill="url(#pour)" />

        {traces.map((points, i) => (
          <path
            key={`t${i}`}
            d={toChamferedPath(points)}
            pathLength="100"
            className={i % 3 === 0 ? 'trace pulse' : 'trace'}
            style={i % 3 === 0 ? { animationDelay: `${(i * 0.4) % 5}s` } : undefined}
          />
        ))}

        {traces.filter((_, i) => i % 4 === 0).flatMap((points, gi) =>
          points.slice(1, -1).map(([x, y], pi) => (
            <circle key={`v${gi}-${pi}`} className="via" cx={x * CELL} cy={y * CELL} r="3.5" />
          ))
        )}

        <Chip x={520} y={330} w={160} h={140} pinsX={10} pinsY={8} />
        <Chip x={880} y={140} w={90} h={70} pinsX={5} pinsY={4} />
        <Chip x={140} y={560} w={80} h={60} pinsX={4} pinsY={3} />
      </svg>
      <div className="circuit-vignette" />
    </div>
  )
}

export default CircuitBg
