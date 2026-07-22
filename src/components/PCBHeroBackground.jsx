import { useMemo } from 'react'
import './PCBHeroBackground.css'

const S = 20

function route(x1, y1, x2, y2, b) {
  const pts = [[x1, y1]], dx = x2 - x1, dy = y2 - y1, h = Math.abs(dx) >= Math.abs(dy)
  if (b === 2) pts.push(h ? [x2, y1] : [x1, y2])
  else if (b === 3) { const m = h ? (x1 + x2) / 2 : (y1 + y2) / 2; pts.push(h ? [m, y1] : [x1, m], h ? [m, y2] : [x2, m]) }
  else if (b === 4) {
    if (h) { const a = x1 + dx * .35, c = x1 + dx * .65; pts.push([a, y1], [a, y1 + dy * .5], [c, y1 + dy * .5], [c, y2]) }
    else { const a = y1 + dy * .35, c = y1 + dy * .65; pts.push([x1, a], [x1 + dx * .5, a], [x1 + dx * .5, c], [x2, c]) }
  } else if (b === 5) {
    if (h) { const a = x1 + dx * .2, c = x1 + dx * .5, d = x1 + dx * .8; pts.push([a, y1], [a, y1 + dy * .3], [c, y1 + dy * .3], [c, y1 + dy * .6], [d, y1 + dy * .6], [d, y2]) }
    else { const a = y1 + dy * .2, c = y1 + dy * .5, d = y1 + dy * .8; pts.push([x1, a], [x1 + dx * .3, a], [x1 + dx * .3, c], [x1 + dx * .6, c], [x1 + dx * .6, d], [x2, d]) }
  }
  pts.push([x2, y2])
  return pts
}

function toPath(pts) {
  return 'M ' + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L ')
}

// ─── Generate parallel bus traces ───

function genBus(x1, y1, x2, y2, count, pitch, bends, baseWidth, animated) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy)
  const nx = -dy / len * pitch, ny = dx / len * pitch
  const res = []
  for (let i = 0; i < count; i++) {
    const off = i - (count - 1) / 2
    const sx = x1 + nx * off, sy = y1 + ny * off
    const ex = x2 + nx * off, ey = y2 + ny * off
    res.push({ x1: sx, y1: sy, x2: ex, y2: ey, bends, width: baseWidth, animated: animated && i === Math.floor(count / 2) })
  }
  return res
}

// ─── SVG sub-components ───

function MountingHole({ cx, cy }) {
  return (
    <g>
      <circle className="mount-hole-outer" cx={cx} cy={cy} r="14" />
      <circle className="mount-hole-inner" cx={cx} cy={cy} r="10" />
      <circle className="mount-hole-outer" cx={cx} cy={cy} r="3" fill="none" opacity="0.3" />
    </g>
  )
}

function Via({ cx, cy }) {
  return (
    <g>
      <circle className="via-ring" cx={cx} cy={cy} r="5" />
      <circle className="via-hole" cx={cx} cy={cy} r="2.2" />
    </g>
  )
}

function PadTHT({ cx, cy, r = 6 }) {
  return (
    <g>
      <circle className="pad-tht-outer" cx={cx} cy={cy} r={r} />
      <circle className="pad-tht-hole" cx={cx} cy={cy} r={r * 0.45} />
    </g>
  )
}

function QFP({ cx, cy, w, h, pins, label }) {
  const pitch = w / (pins + 1), pinLen = 14, sx = cx - w / 2, sy = cy - h / 2
  return (
    <g>
      <rect className="component-shadow" x={sx + 3} y={sy + 3} width={w} height={h} rx="4" />
      <rect className="qfp-body-main" x={sx} y={sy} width={w} height={h} rx="4" />
      {Array.from({ length: pins * 4 }).map((_, i) => {
        const side = Math.floor(i / 12), idx = i % 12
        const px = sx + pitch * (idx + 1), py = sy + pitch * (idx + 1)
        if (side === 0) return <line key={i} className="qfp-pin" x1={px} y1={sy} x2={px} y2={sy - pinLen} />
        if (side === 1) return <line key={i} className="qfp-pin" x1={px} y1={sy + h} x2={px} y2={sy + h + pinLen} />
        if (side === 2) return <line key={i} className="qfp-pin" x1={sx} y1={py} x2={sx - pinLen} y2={py} />
        return <line key={i} className="qfp-pin" x1={sx + w} y1={py} x2={sx + w + pinLen} y2={py} />
      })}
      <circle className="pin-mark" cx={sx + pitch} cy={sy - pinLen - 5} r="3" />
      <rect className="silkscreen-outline" x={sx - 6} y={sy - 6} width={w + 12} height={h + 12} rx="5" />
      <text className="silkscreen-sm" x={cx} y={cy + 1}>{label}</text>
      <text className="silkscreen-sm" x={cx} y={cy + 14} fontSize="7">{pins * 4}pin</text>
    </g>
  )
}

function SOT223({ cx, cy, w, h, label }) {
  const pitch = h / 4, sy = cy - h / 2, right = cx + w / 2
  return (
    <g>
      <rect className="component-shadow" x={cx - w / 2 + 2} y={sy + 2} width={w} height={h} rx="3" />
      <rect className="component-body" x={cx - w / 2} y={sy} width={w} height={h} rx="3" />
      {[0, 1, 2].map(i => <line key={i} className="sot-pin" x1={right} y1={sy + pitch * (i + 1)} x2={right + 8} y2={sy + pitch * (i + 1)} />)}
      <rect className="silkscreen-outline" x={cx - w / 2 - 4} y={sy - 4} width={w + 8} height={h + 8} rx="4" />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function SOIC({ cx, cy, w, h, pins, label }) {
  const pitch = w / (pins + 1), sx = cx - w / 2, ty = cy - h / 2, by = cy + h / 2
  return (
    <g>
      <rect className="component-shadow" x={sx + 2} y={ty + 2} width={w} height={h} rx="2" />
      <rect className="soic-body" x={sx} y={ty} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => {
        const px = sx + pitch * (i + 1)
        return <line key={`t${i}`} className="soic-pin" x1={px} y1={ty} x2={px} y2={ty - 10} />
      })}
      {Array.from({ length: pins }).map((_, i) => {
        const px = sx + pitch * (i + 1)
        return <line key={`b${i}`} className="soic-pin" x1={px} y1={by} x2={px} y2={by + 10} />
      })}
      <rect className="silkscreen-outline" x={sx - 4} y={ty - 4} width={w + 8} height={h + 8} rx="3" />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function SSOP({ cx, cy, w, h, pins, label }) {
  const pitch = h / (pins + 1), sy = cy - h / 2, left = cx - w / 2, right = cx + w / 2
  return (
    <g>
      <rect className="component-shadow" x={left + 2} y={sy + 2} width={w} height={h} rx="2" />
      <rect className="soic-body" x={left} y={sy} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => {
        const py = sy + pitch * (i + 1)
        return <line key={`l${i}`} className="soic-pin" x1={left} y1={py} x2={left - 10} y2={py} />
      })}
      {Array.from({ length: pins }).map((_, i) => {
        const py = sy + pitch * (i + 1)
        return <line key={`r${i}`} className="soic-pin" x1={right} y1={py} x2={right + 10} y2={py} />
      })}
      <rect className="silkscreen-outline" x={left - 4} y={sy - 4} width={w + 8} height={h + 8} rx="3" />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function TSSOP({ cx, cy, w, h, pins, label }) {
  const pitch = h / (pins + 1), sy = cy - h / 2, left = cx - w / 2, right = cx + w / 2
  return (
    <g>
      <rect className="component-shadow" x={left + 2} y={sy + 2} width={w} height={h} rx="2" />
      <rect className="soic-body" x={left} y={sy} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => {
        const py = sy + pitch * (i + 1)
        return <line key={`l${i}`} className="soic-pin" x1={left} y1={py} x2={left - 8} y2={py} />
      })}
      {Array.from({ length: pins }).map((_, i) => {
        const py = sy + pitch * (i + 1)
        return <line key={`r${i}`} className="soic-pin" x1={right} y1={py} x2={right + 8} y2={py} />
      })}
      <rect className="silkscreen-outline" x={left - 4} y={sy - 4} width={w + 8} height={h + 8} rx="3" />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function USBC({ x, y, w, h, label, num }) {
  return (
    <g>
      <rect className="component-shadow" x={x + 2} y={y + 2} width={w} height={h} rx="2" />
      <rect className="usbc-body" x={x} y={y} width={w} height={h} rx="2" />
      <rect className="usbc-inner" x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} className="soic-pin" x1={x} y1={y + 8 + i * ((h - 16) / 5)} x2={x - 6} y2={y + 8 + i * ((h - 16) / 5)} />
      ))}
      <text className="silkscreen-sm" x={x + w / 2} y={y + h + 14}>{num}</text>
      <text className="silkscreen-sm" x={x + w / 2} y={y + h + 26}>{label}</text>
    </g>
  )
}

function Header({ x, cy, pins, label }) {
  const pitch = 12, h = pins * pitch, sy = cy - h / 2
  return (
    <g>
      <rect className="component-shadow" x={x + 2} y={sy + 2} width={14} height={h} rx="2" />
      <rect className="header-body" x={x} y={sy} width={14} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => (
        <PadTHT key={i} cx={x + 7} cy={sy + pitch / 2 + i * pitch} r={4.5} />
      ))}
      <rect className="silkscreen-outline" x={x - 4} y={sy - 4} width={22} height={h + 8} rx="3" />
      <text className="silkscreen-sm" x={x + 7} y={cy + h / 2 + 16}>{label}</text>
    </g>
  )
}

function Crystal({ cx, cy, label }) {
  return (
    <g>
      <rect className="component-shadow" x={cx - 16} y={cy - 10} width={32} height={20} rx="3" />
      <rect className="crystal-body" x={cx - 18} y={cy - 12} width={36} height={24} rx="3" />
      <line className="crystal-pin" x1={cx - 8} y1={cy + 12} x2={cx - 8} y2={cy + 24} />
      <line className="crystal-pin" x1={cx + 8} y1={cy + 12} x2={cx + 8} y2={cy + 24} />
      <rect className="silkscreen-outline" x={cx - 22} y={cy - 16} width={44} height={56} rx="4" />
      <text className="silkscreen-sm" x={cx} y={cy + 1}>{label}</text>
      <text className="silkscreen-sm" x={cx} y={cy + 14} fontSize="7">8MHz</text>
    </g>
  )
}

function Tactile({ cx, cy, label }) {
  return (
    <g>
      <rect className="component-shadow" x={cx - 13} y={cy - 13} width={26} height={26} rx="2" />
      <rect className="tactile-body" x={cx - 15} y={cy - 15} width={30} height={30} rx="2" />
      <line className="soic-pin" x1={cx - 11} y1={cy + 15} x2={cx - 11} y2={cy + 24} />
      <line className="soic-pin" x1={cx + 11} y1={cy + 15} x2={cx + 11} y2={cy + 24} />
      <line className="soic-pin" x1={cx - 15} y1={cy - 9} x2={cx - 24} y2={cy - 9} />
      <line className="soic-pin" x1={cx - 15} y1={cy + 9} x2={cx - 24} y2={cy + 9} />
      <rect className="tactile-btn" x={cx - 8} y={cy - 8} width={16} height={16} rx="2" />
      <rect className="silkscreen-outline" x={cx - 28} y={cy - 19} width={56} height={62} rx="4" />
      <text className="silkscreen-sm" x={cx} y={cy + 15 + 16}>{label}</text>
    </g>
  )
}

function LEDIndicator({ cx, cy, colorClass, label }) {
  return (
    <g>
      <circle className={colorClass} cx={cx} cy={cy} r="7" />
      <circle className={`${colorClass}-inner`} cx={cx} cy={cy} r="5" />
      <line className="led-leg" x1={cx + 7} y1={cy} x2={cx + 14} y2={cy} />
      <rect className="silkscreen-outline" x={cx - 12} y={cy - 12} width={30} height={40} rx="4" />
      <text className="silkscreen-sm" x={cx} y={cy + 20}>{label}</text>
    </g>
  )
}

function SMDResistor({ cx, cy, rot = 0 }) {
  return (
    <g transform={`rotate(${rot},${cx},${cy})`}>
      <rect className="component-shadow" x={cx - 6} y={cy - 3} width={12} height={6} rx="1" />
      <rect className="smd-resistor" x={cx - 6} y={cy - 3} width={12} height={6} rx="1" />
      <rect className="smd-resistor-end" x={cx - 6} y={cy - 3} width={3} height={6} rx="0.5" />
      <rect className="smd-resistor-end" x={cx + 3} y={cy - 3} width={3} height={6} rx="0.5" />
    </g>
  )
}

function SMDCap({ cx, cy, rot = 0 }) {
  return (
    <g transform={`rotate(${rot},${cx},${cy})`}>
      <rect className="component-shadow" x={cx - 5} y={cy - 4} width={10} height={8} rx="1" />
      <rect className="smd-cap" x={cx - 5} y={cy - 4} width={10} height={8} rx="1" />
      <rect className="smd-cap" x={cx - 3} y={cy - 4} width={6} height={8} rx="1" fill="rgba(255,255,255,0.02)" />
    </g>
  )
}

// ─── Bus definitions → flattened into traces ───

const BUS_CONFIGS = [
  // U1 bottom → U2 AMS1117 (3 power traces)
  ...genBus(475, 427, 185, 190, 3, 10, 4, 2.5, true),
  ...genBus(505, 427, 185, 200, 3, 8, 4, 1.5, false),

  // U1 bottom → U5 SN74LVC245 (8 data bus)
  ...genBus(465, 427, 175, 480, 4, 7, 4, 1.5, false),
  ...genBus(545, 427, 175, 520, 4, 7, 4, 1.5, false),

  // U1 bottom → SW1/SW2
  ...genBus(495, 427, 210, 684, 1, 0, 4, 1.5, false),
  ...genBus(525, 427, 330, 684, 1, 0, 4, 1.5, false),

  // U1 right → U3 24AA256 (4 I2C/control)
  ...genBus(597, 325, 870, 155, 4, 7, 4, 1.5, true),

  // U1 right → U4 CH340C (6 UART)
  ...genBus(597, 375, 965, 435, 3, 7, 4, 1.5, true),
  ...genBus(597, 405, 965, 455, 3, 7, 4, 1.5, false),

  // U1 top → Y1 8MHz (2 clock)
  ...genBus(485, 273, 832, 660, 2, 12, 4, 2, true),

  // U1 top → J6 GPIO (6 traces)
  ...genBus(465, 273, 56, 410, 3, 8, 4, 1.5, false),
  ...genBus(505, 273, 56, 450, 3, 8, 4, 1.5, false),

  // U4 → J4 USB-C (4 traces)
  ...genBus(1015, 435, 1100, 375, 4, 8, 3, 1.5, true),

  // LEDs
  ...genBus(445, 295, 100, 92, 1, 0, 4, 2, false),
  ...genBus(465, 273, 160, 672, 1, 0, 4, 2, true),

  // Extra U1→U5 bus (4 traces)
  ...genBus(443, 385, 175, 500, 4, 7, 4, 1.5, false),
]

// Keepout areas (components that need copper pour clearance)
const KEEPOUTS = [
  { x: 520 - 75, y: 350 - 75, w: 150, h: 150 },
  { x: 160 - 35, y: 200 - 25, w: 70, h: 50 },
  { x: 880 - 35, y: 170 - 25, w: 70, h: 50 },
  { x: 990 - 35, y: 450 - 55, w: 70, h: 110 },
  { x: 150 - 30, y: 510 - 55, w: 60, h: 110 },
  { x: 840 - 30, y: 650 - 30, w: 60, h: 60 },
  { x: 1100 - 5, y: 350 - 5, w: 50, h: 70 },
  { x: 56 - 5, y: 375, w: 24, h: 110 },
  { x: 210 - 25, y: 680 - 25, w: 50, h: 70 },
  { x: 330 - 25, y: 680 - 25, w: 50, h: 70 },
  { x: 100 - 20, y: 92 - 20, w: 40, h: 45 },
  { x: 160 - 20, y: 672 - 20, w: 40, h: 45 },
]

// Via positions (corners of animated trace routes + some extra)
const EXTRA_VIAS = [
  [400, 300], [600, 400], [350, 350], [700, 300],
  [300, 500], [700, 500], [500, 550], [600, 250],
  [350, 450], [450, 330], [580, 280], [620, 380],
  [250, 400], [750, 350], [680, 550], [320, 420],
]

function PCBHeroBackground() {
  const traceData = useMemo(() => {
    return BUS_CONFIGS.map(c => {
      const pts = route(c.x1, c.y1, c.x2, c.y2, c.bends)
      return { path: toPath(pts), pts, width: c.width, animated: c.animated }
    })
  }, [])

  const viaPositions = useMemo(() => {
    const set = new Set()
    traceData.forEach((t, i) => {
      if (i % 3 === 0 && t.pts) {
        t.pts.slice(1, -1).forEach(([x, y]) => {
          set.add(`${Math.round(x / 8) * 8},${Math.round(y / 8) * 8}`)
        })
      }
    })
    EXTRA_VIAS.forEach(([x, y]) => set.add(`${x},${y}`))
    return Array.from(set).map(k => k.split(',').map(Number))
  }, [traceData])

  const signalDots = useMemo(() => {
    return traceData
      .map((t, i) => ({ ...t, idx: i }))
      .filter(t => t.animated && t.pts.length >= 4)
      .map(t => {
        const mid = Math.floor(t.pts.length / 2)
        const p = t.pts[mid]
        return { cx: p[0], cy: p[1], delay: (t.idx * 0.7) % 4 }
      })
  }, [traceData])

  return (
    <div className="pcb-bg">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="g-sm" width={S} height={S} patternUnits="userSpaceOnUse">
            <circle className="pcb-grid-dot" cx={S / 2} cy={S / 2} r="0.8" />
          </pattern>
          <pattern id="g-lg" width={S * 5} height={S * 5} patternUnits="userSpaceOnUse">
            <circle className="pcb-grid-dot-large" cx={S * 2.5} cy={S * 2.5} r="1.5" />
          </pattern>
          <pattern id="copper-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0L12 12M12 0L0 12" className="copper-pour-hatch" />
          </pattern>
        </defs>

        {/* Board substrate */}
        <rect width="1200" height="800" fill="var(--bg)" />
        <rect width="1200" height="800" fill="url(#g-sm)" />
        <rect width="1200" height="800" fill="url(#g-lg)" />

        {/* Board outline */}
        <rect className="pcb-board" x="30" y="30" width="1140" height="740" rx="8" />

        {/* Copper pour (ground plane) */}
        <rect className="copper-pour-bg" x="35" y="35" width="1130" height="730" rx="6" />
        <rect x="35" y="35" width="1130" height="730" rx="6" fill="url(#copper-hatch)" />

        {/* Copper pour cutouts (keepout around components) */}
        {KEEPOUTS.map((k, i) => (
          <rect key={i} className="copper-keepout" x={k.x} y={k.y} width={k.w} height={k.h} rx="4" />
        ))}

        {/* Traces */}
        {traceData.map((t, i) => (
          <path
            key={i}
            d={t.path}
            className={
              t.animated ? 'trace trace-pulse' :
              t.width >= 2 ? 'trace trace-pwr' :
              'trace trace-signal'
            }
            style={{
              strokeWidth: t.width,
              animationDelay: t.animated ? `${(i * 0.6) % 4}s` : undefined,
              animationDuration: t.animated ? `${4 + (i % 3) * 0.5}s` : undefined,
            }}
          />
        ))}

        {/* Vias */}
        {viaPositions.map(([x, y], i) => (
          <Via key={i} cx={x} cy={y} />
        ))}

        {/* Signal dots */}
        {signalDots.map((d, i) => (
          <circle
            key={i}
            className="signal-dot"
            cx={d.cx}
            cy={d.cy}
            r="2.5"
            style={{ animationDelay: `${d.delay}s` }}
          />
        ))}

        {/* ─── Components ─── */}
        <QFP cx={520} cy={350} w={130} h={130} pins={12} label="U1 STM32F407VGT6" />
        <SOT223 cx={160} cy={200} w={50} h={40} label="U2 AMS1117" />
        <SOIC cx={880} cy={170} w={50} h={30} pins={4} label="U3 24AA256" />
        <SSOP cx={990} cy={450} w={50} h={90} pins={8} label="U4 CH340C" />
        <TSSOP cx={150} cy={510} w={40} h={100} pins={10} label="U5 SN74LVC245" />
        <Crystal cx={840} cy={650} label="Y1" />
        <USBC x={1100} y={350} w={40} h={60} label="USB-C" num="J4" />
        <Header x={56} cy={430} pins={8} label="J6 GPIO" />
        <Tactile cx={210} cy={680} label="SW1 RESET" />
        <Tactile cx={330} cy={680} label="SW2 BOOT0" />
        <LEDIndicator cx={100} cy={92} colorClass="led-pwr" label="LED1 PWR" />
        <LEDIndicator cx={160} cy={672} colorClass="led-d13" label="LED2 D13" />

        {/* ─── SMD passives (resistors & capacitors) ─── */}
        <SMDResistor cx={300} cy={250} rot={90} />
        <SMDResistor cx={310} cy={280} rot={90} />
        <SMDResistor cx={700} cy={280} rot={-90} />
        <SMDResistor cx={720} cy={250} rot={-90} />
        <SMDCap cx={350} cy={500} rot={0} />
        <SMDCap cx={380} cy={500} rot={0} />
        <SMDCap cx={720} cy={550} rot={0} />
        <SMDResistor cx={680} cy={250} rot={0} />
        <SMDCap cx={650} cy={580} rot={90} />
        <SMDResistor cx={400} cy={300} rot={0} />
        <SMDResistor cx={750} cy={450} rot={90} />
        <SMDCap cx={280} cy={600} rot={0} />
        <SMDResistor cx={780} cy={200} rot={0} />
        <SMDCap cx={450} cy={600} rot={90} />
        <SMDResistor cx={300} cy={150} rot={90} />
        <SMDCap cx={750} cy={650} rot={0} />

        {/* ─── Mounting holes ─── */}
        <MountingHole cx={50} cy={50} />
        <MountingHole cx={1150} cy={50} />
        <MountingHole cx={50} cy={750} />
        <MountingHole cx={1150} cy={750} />
      </svg>
      <div className="pcb-vignette" />
    </div>
  )
}

export default PCBHeroBackground
