import useScrollReveal from '../hooks/useScrollReveal'
import './SectionBg.css'

const PATTERNS = {
  'top-right': (w, h) => ({
    lines: [
      { x1: w - 120, y1: h, x2: w - 120, y2: 80 },
      { x1: w - 120, y1: 80, x2: w, y2: 80 },
      { x1: w - 80, y1: 80, x2: w - 80, y2: 0 },
      { x1: w - 200, y1: 140, x2: w - 120, y2: 140 },
      { x1: w, y1: 140, x2: w - 40, y2: 140 },
      { x1: w - 40, y1: 140, x2: w - 40, y2: 0 },
    ],
    vias: [
      { cx: w - 120, cy: 80 },
      { cx: w - 80, cy: 80 },
      { cx: w - 120, cy: 140 },
      { cx: w - 40, cy: 140 },
    ],
    pulses: [1],
  }),
  'bottom-left': (w, h) => ({
    lines: [
      { x1: 120, y1: 0, x2: 120, y2: h - 80 },
      { x1: 120, y1: h - 80, x2: 0, y2: h - 80 },
      { x1: 80, y1: h - 80, x2: 80, y2: h },
      { x1: 200, y1: h - 140, x2: 120, y2: h - 140 },
      { x1: 0, y1: h - 140, x2: 40, y2: h - 140 },
      { x1: 40, y1: h - 140, x2: 40, y2: h },
    ],
    vias: [
      { cx: 120, cy: h - 80 },
      { cx: 80, cy: h - 80 },
      { cx: 120, cy: h - 140 },
      { cx: 40, cy: h - 140 },
    ],
    pulses: [3],
  }),
  'scattered': (w, h) => ({
    lines: [
      { x1: 60, y1: 60, x2: 200, y2: 60 },
      { x1: 200, y1: 60, x2: 200, y2: 200 },
      { x1: w - 60, y1: h - 100, x2: w - 60, y2: 100 },
      { x1: w - 200, y1: 100, x2: w - 60, y2: 100 },
      { x1: w / 2 - 80, y1: h - 40, x2: w / 2 + 80, y2: h - 40 },
    ],
    vias: [
      { cx: 200, cy: 60 },
      { cx: 200, cy: 200 },
      { cx: w - 60, cy: 100 },
      { cx: w / 2 - 80, cy: h - 40 },
      { cx: w / 2 + 80, cy: h - 40 },
    ],
    pulses: [0, 2],
  }),
}

function SectionBg({ variant = 'top-right' }) {
  const ref = useScrollReveal(0.05)

  const w = 800
  const h = 600
  const pattern = PATTERNS[variant] || PATTERNS['top-right']
  const { lines, vias, pulses } = pattern(w, h)

  return (
    <div className="section-bg" ref={ref} aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice">
        {lines.map((l, i) => (
          <line
            key={i}
            {...l}
            className={`section-trace ${pulses.includes(i) ? 'section-pulse' : ''}`}
          />
        ))}
        {vias.map((v, i) => (
          <circle key={i} {...v} r={3} className="section-via" />
        ))}
      </svg>
    </div>
  )
}

export default SectionBg
