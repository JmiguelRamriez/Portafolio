import { useMemo } from 'react'
import './PCBHeroBackground.css'

const COLS = 30, ROWS = 20, CELL = 40
const CHAMFER = 0.5
const W = COLS * CELL, H = ROWS * CELL
const CHIP_GX = 11, CHIP_GY = 7, CHIP_GW = 8, CHIP_GH = 6

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0
    var t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const rand = mulberry32(11)

function sign(v) {
  return (v > 0) - (v < 0)
}

function chipPins(perTop = 7, perBottom = 7, perLeft = 5, perRight = 5) {
  const pins = []
  for (let i = 0; i < perTop; i++) {
    const x = CHIP_GX + Math.round((i + 1) * CHIP_GW / (perTop + 1))
    pins.push([x, CHIP_GY, 'top'])
  }
  for (let i = 0; i < perBottom; i++) {
    const x = CHIP_GX + Math.round((i + 1) * CHIP_GW / (perBottom + 1))
    pins.push([x, CHIP_GY + CHIP_GH, 'bottom'])
  }
  for (let i = 0; i < perLeft; i++) {
    const y = CHIP_GY + Math.round((i + 1) * CHIP_GH / (perLeft + 1))
    pins.push([CHIP_GX, y, 'left'])
  }
  for (let i = 0; i < perRight; i++) {
    const y = CHIP_GY + Math.round((i + 1) * CHIP_GH / (perRight + 1))
    pins.push([CHIP_GX + CHIP_GW, y, 'right'])
  }
  return pins
}

function generateTraceFromPin(x, y, side) {
  const points = [[x, y]]
  const verticalFirst = side === 'top' || side === 'bottom'
  const away = side === 'top' || side === 'left' ? -1 : 1

  const stub = 1 + Math.floor(rand() * 2)
  if (verticalFirst) {
    y += away * stub
  } else {
    x += away * stub
  }
  points.push([x, y])

  let horizontal = verticalFirst
  const segments = 3 + Math.floor(rand() * 4)

  for (let i = 0; i < segments; i++) {
    const length = 2 + Math.floor(rand() * 5)
    if (horizontal) {
      const d = rand() > 0.5 ? 1 : -1
      x = Math.max(0, Math.min(COLS, x + length * d))
    } else {
      const d = rand() < 0.75 ? away : -away
      y = Math.max(0, Math.min(ROWS, y + length * d))
    }
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
      const dx = sign(x - px) * CHAMFER
      const dy = sign(ny - y) * CHAMFER
      d += `L ${(x - dx) * CELL} ${y * CELL} L ${x * CELL} ${(y + dy) * CELL} `
    } else {
      const dy = sign(y - py) * CHAMFER
      const dx = sign(nx - x) * CHAMFER
      d += `L ${x * CELL} ${(y - dy) * CELL} L ${(x + dx) * CELL} ${y * CELL} `
    }
  }
  const [lx, ly] = points[points.length - 1]
  d += `L ${lx * CELL} ${ly * CELL} `
  return d
}

export default function PCBHeroBackground() {
  const pins = useMemo(() => chipPins(), [])
  const traces = useMemo(() => pins.map(([x, y, side]) => generateTraceFromPin(x, y, side)), [pins])

  const chipSVG = (() => {
    const x = CHIP_GX * CELL, y = CHIP_GY * CELL, w = CHIP_GW * CELL, h = CHIP_GH * CELL
    let s = []
    s.push(<rect key="body" x={x} y={y} width={w} height={h} rx="3" fill="rgba(139,92,246,0.06)" stroke="#4a4a5e" strokeWidth="1.6" />)
    pins.forEach(([px, py, side], i) => {
      const cx = px * CELL, cy = py * CELL
      if (side === 'top') s.push(<line key={`pin-t${i}`} x1={cx} y1={y} x2={cx} y2={y - 10} stroke="#4a4a5e" strokeWidth="1.6" />)
      else if (side === 'bottom') s.push(<line key={`pin-b${i}`} x1={cx} y1={y + h} x2={cx} y2={y + h + 10} stroke="#4a4a5e" strokeWidth="1.6" />)
      else if (side === 'left') s.push(<line key={`pin-l${i}`} x1={x} y1={cy} x2={x - 10} y2={cy} stroke="#4a4a5e" strokeWidth="1.6" />)
      else s.push(<line key={`pin-r${i}`} x1={x + w} y1={cy} x2={x + w + 10} y2={cy} stroke="#4a4a5e" strokeWidth="1.6" />)
    })
    return s
  })()

  const pathsSVG = useMemo(() =>
    traces.map((pts, i) => {
      const isPulse = i % 3 === 0
      const color = isPulse ? '#8b5cf6' : '#2e2e3a'
      const width = isPulse ? 1.9 : 1.3
      const opacity = isPulse ? 0.95 : 0.6
      return (
        <path
          key={i}
          d={toChamferedPath(pts)}
          fill="none"
          stroke={color}
          strokeWidth={width}
          opacity={opacity}
        />
      )
    }),
  [traces])

  const viasSVG = useMemo(() => {
    const els = []
    traces.forEach((pts, i) => {
      if (i % 2 === 0) {
        for (let j = 1; j < pts.length - 1; j++) {
          const [x, y] = pts[j]
          els.push(<circle key={`via-${i}-${j}`} cx={x * CELL} cy={y * CELL} r="3.2" fill="#5b8dee" opacity="0.85" />)
        }
      }
    })
    return els
  }, [traces])

  return (
    <div className="pcb-bg">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="pcb-pour" cx="50%" cy="47%" r="55%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="#0a0a0f" />
        <rect width={W} height={H} fill="url(#pcb-pour)" />
        {pathsSVG}
        {viasSVG}
        {chipSVG}
      </svg>
      <div className="pcb-vignette" />
    </div>
  )
}
