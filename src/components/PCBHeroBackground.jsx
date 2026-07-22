import { useMemo } from 'react'
import './PCBHeroBackground.css'

const GRID_SIZE = 20

// ─── Routing Engine ───

function route(x1, y1, x2, y2, bends = 3) {
  const pts = [[x1, y1]], dx = x2 - x1, dy = y2 - y1, horizFirst = Math.abs(dx) >= Math.abs(dy)

  if (bends === 2) {
    pts.push(horizFirst ? [x2, y1] : [x1, y2])
  } else if (bends === 3) {
    if (horizFirst) { const m = (x1 + x2) / 2; pts.push([m, y1], [m, y2]) }
    else { const m = (y1 + y2) / 2; pts.push([x1, m], [x2, m]) }
  } else if (bends === 4) {
    if (horizFirst) {
      const a = x1 + dx * 0.35, c = x1 + dx * 0.65
      pts.push([a, y1], [a, y1 + dy * 0.5], [c, y1 + dy * 0.5], [c, y2])
    } else {
      const a = y1 + dy * 0.35, c = y1 + dy * 0.65
      pts.push([x1, a], [x1 + dx * 0.5, a], [x1 + dx * 0.5, c], [x2, c])
    }
  } else if (bends === 5) {
    if (horizFirst) {
      const a = x1 + dx * 0.2, c = x1 + dx * 0.5, d = x1 + dx * 0.8
      pts.push([a, y1], [a, y1 + dy * 0.3], [c, y1 + dy * 0.3], [c, y1 + dy * 0.6], [d, y1 + dy * 0.6], [d, y2])
    } else {
      const a = y1 + dy * 0.2, c = y1 + dy * 0.5, d = y1 + dy * 0.8
      pts.push([x1, a], [x1 + dx * 0.3, a], [x1 + dx * 0.3, y1 + dy * 0.5], [x1 + dx * 0.6, y1 + dy * 0.5], [x1 + dx * 0.6, d], [x2, d])
    }
  }
  pts.push([x2, y2])
  return pts
}

function toPath(pts) {
  return 'M ' + pts.map(p => {
    const x = typeof p[0] === 'number' ? p[0] : 0;
    const y = typeof p[1] === 'number' ? p[1] : 0;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' L ');
}

// ─── SVG Building Blocks ───

function Via({ cx, cy }) {
  return (
    <g>
      <circle className="via-ring" cx={cx} cy={cy} r="3.5" />
      <circle className="via-hole" cx={cx} cy={cy} r="1.5" />
    </g>
  )
}

function PadTHT({ cx, cy, r = 6, holeR = 2.5 }) {
  return (
    <g>
      <circle className="pad-tht-outer" cx={cx} cy={cy} r={r} />
      <circle className="pad-tht-hole" cx={cx} cy={cy} r={holeR} />
    </g>
  )
}

function PadSMD({ x, y, w, h, rx = 0.5, ry = 0.5 }) {
  return <rect className="pad-smd" x={x} y={y} width={w} height={h} rx={rx} ry={ry} />
}

function ComponentShadow({ x, y, w, h, rx = 4 }) {
  return <rect className="component-shadow" x={x + 3} y={y + 3} width={w} height={h} rx={rx} />
}

function SilkscreenOutline({ x, y, w, h, rx = 4, ry = 4 }) {
  return <rect className="silkscreen-outline" x={x} y={y} width={w} height={h} rx={rx} ry={ry} />
}

function MountingHole({ cx, cy }) {
  return (
    <g>
      <circle className="mount-hole-outer" cx={cx} cy={cy} r="10" />
      <circle className="mount-hole-inner" cx={cx} cy={cy} r="6" />
    </g>
  )
}

function QFP({ cx, cy, w, h, pinsPerSide, label, flash, ram, speed }) {
  const pitch = w / (pinsPerSide + 1), pinLen = 14, sx = cx - w / 2, sy = cy - h / 2
  return (
    <g>
      <ComponentShadow x={sx} y={sy} w={w} h={h} rx={4} />
      <rect className="qfp-body-main" x={sx} y={sy} width={w} height={h} rx="4" />
      {Array.from({ length: pinsPerSide * 4 }).map((_, i) => {
        const side = Math.floor(i / pinsPerSide), idx = i % pinsPerSide
        const px = sx + pitch * (idx + 1), py = sy + pitch * (idx + 1)
        if (side === 0) return <line key={`t${i}`} className="pin" x1={px} y1={sy} x2={px} y2={sy - pinLen} />
        if (side === 1) return <line key={`b${i}`} className="pin" x1={px} y1={sy + h} x2={px} y2={sy + h + pinLen} />
        if (side === 2) return <line key={`l${i}`} className="pin" x1={sx} y1={py} x2={sx - pinLen} y2={py} />
        return <line key={`r${i}`} className="pin" x1={sx + w} y1={py} x2={sx + w + pinLen} y2={py} />
      })}
      <circle className="pin-mark" cx={sx + pitch} cy={sy - pinLen - 5} r="3" />
      <text className="silkscreen" x={cx} y={cy - 20}>{label}</text>
      <text className="silkscreen-sm" x={cx} y={cy - 5}>ARM</text>
      <text className="silkscreen-sm" x={cx} y={cy + 8}>{speed}</text>
      <text className="silkscreen-sm" x={cx} y={cy + 21}>{flash}</text>
      <text className="silkscreen-sm" x={cx} y={cy + 34}>{ram}</text>
    </g>
  )
}

function SOIC({ cx, cy, w, h, pins, label }) {
  const pitch = w / (pins + 1), sx = cx - w / 2, ty = cy - h / 2, by = cy + h / 2
  return (
    <g>
      <ComponentShadow x={sx} y={ty} w={w} h={h} rx={2} />
      <rect className="component-body" x={sx} y={ty} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => <line key={`t${i}`} className="pin" x1={sx + pitch * (i + 1)} y1={ty} x2={sx + pitch * (i + 1)} y2={ty - 10} />)}
      {Array.from({ length: pins }).map((_, i) => <line key={`b${i}`} className="pin" x1={sx + pitch * (i + 1)} y1={by} x2={sx + pitch * (i + 1)} y2={by + 10} />)}
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function SSOP({ cx, cy, w, h, pins, label }) {
  const pitch = h / (pins + 1), sy = cy - h / 2, left = cx - w / 2, right = cx + w / 2
  return (
    <g>
      <ComponentShadow x={left} y={sy} w={w} h={h} rx={2} />
      <rect className="component-body" x={left} y={sy} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => <line key={`l${i}`} className="pin" x1={left} y1={sy + pitch * (i + 1)} x2={left - 10} y2={sy + pitch * (i + 1)} />)}
      {Array.from({ length: pins }).map((_, i) => <line key={`r${i}`} className="pin" x1={right} y1={sy + pitch * (i + 1)} x2={right + 10} y2={sy + pitch * (i + 1)} />)}
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function TSSOP({ cx, cy, w, h, pins, label }) {
  const pitch = h / (pins + 1), sy = cy - h / 2, left = cx - w / 2, right = cx + w / 2
  return (
    <g>
      <ComponentShadow x={left} y={sy} w={w} h={h} rx={2} />
      <rect className="component-body" x={left} y={sy} width={w} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => <line key={`l${i}`} className="pin" x1={left} y1={sy + pitch * (i + 1)} x2={left - 8} y2={sy + pitch * (i + 1)} />)}
      {Array.from({ length: pins }).map((_, i) => <line key={`r${i}`} className="pin" x1={right} y1={sy + pitch * (i + 1)} x2={right + 8} y2={sy + pitch * (i + 1)} />)}
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function SOT223({ cx, cy, w, h, label }) {
  const sy = cy - h / 2, right = cx + w / 2
  return (
    <g>
      <ComponentShadow x={cx - w / 2} y={sy} w={w} h={h} rx={3} />
      <rect className="component-body" x={cx - w / 2} y={sy} width={w} height={h} rx="3" />
      <line className="pin" x1={right} y1={sy + 10} x2={right + 8} y2={sy + 10} />
      <line className="pin" x1={right} y1={sy + 20} x2={right + 8} y2={sy + 20} />
      <line className="pin" x1={right} y1={sy + 30} x2={right + 8} y2={sy + 30} />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
    </g>
  )
}

function USBC({ cx, cy, label, num }) {
  const w = 40, h = 60, x = cx - w / 2, y = cy - h / 2
  return (
    <g>
      <ComponentShadow x={x} y={y} w={w} h={h} rx={2} />
      <rect className="component-body" x={x} y={y} width={w} height={h} rx="2" />
      <rect className="usbc-inner" x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="1" />
      <PadSMD x={x + 1} y={y + 8} w={6} h={4} />
      <PadSMD x={x + 1} y={y + 16} w={6} h={4} />
      <PadSMD x={x + 1} y={y + 24} w={6} h={4} />
      <PadSMD x={x + 1} y={y + 32} w={6} h={4} />
      <PadSMD x={x + 1} y={y + 40} w={6} h={4} />
      <PadSMD x={x + 1} y={y + 48} w={6} h={4} />
      <text className="silkscreen-sm" x={cx} y={cy + h / 2 + 14}>{num}</text>
      <text className="silkscreen-sm" x={cx} y={cy + h / 2 + 26}>{label}</text>
    </g>
  )
}

function Header({ x, cy, pins, label }) {
  const pitch = 12, h = pins * pitch, sy = cy - h / 2
  return (
    <g>
      <ComponentShadow x={x} y={sy} w={14} h={h} rx={2} />
      <rect className="component-body" x={x} y={sy} width={14} height={h} rx="2" />
      {Array.from({ length: pins }).map((_, i) => (
        <PadTHT key={i} cx={x + 7} cy={sy + pitch / 2 + i * pitch} r={4.5} holeR={2.2} />
      ))}
      <text className="silkscreen-sm" x={x + 7} y={cy + h / 2 + 16}>{label}</text>
    </g>
  )
}

function Crystal({ cx, cy, label }) {
  return (
    <g>
      <ComponentShadow x={cx - 16} y={cy - 10} w={32} h={20} rx={3} />
      <rect className="crystal-body" x={cx - 18} y={cy - 12} width={36} height={24} rx="3" />
      <PadTHT cx={cx - 8} cy={cy + 12 + 4} r={3.5} holeR={1.8} />
      <PadTHT cx={cx + 8} cy={cy + 12 + 4} r={3.5} holeR={1.8} />
      <text className="silkscreen-sm" x={cx} y={cy}>{label}</text>
      <text className="silkscreen-sm" x={cx} y={cy + 13} fontSize="7">8MHz</text>
    </g>
  )
}

function Tactile({ cx, cy, label }) {
  return (
    <g>
      <ComponentShadow x={cx - 15} y={cy - 15} w={30} h={30} rx={2} />
      <rect className="component-body" x={cx - 15} y={cy - 15} width={30} height={30} rx="2" />
      <PadTHT cx={cx - 11} cy={cy + 15 + 4} r={3.5} holeR={1.8} />
      <PadTHT cx={cx + 11} cy={cy + 15 + 4} r={3.5} holeR={1.8} />
      <PadTHT cx={cx - 15 - 4} cy={cy - 9} r={3.5} holeR={1.8} />
      <PadTHT cx={cx - 15 - 4} cy={cy + 9} r={3.5} holeR={1.8} />
      <rect className="tactile-btn" x={cx - 8} y={cy - 8} width={16} height={16} rx="2" />
      <text className="silkscreen-sm" x={cx} y={cy + 15 + 16}>{label}</text>
    </g>
  )
}

function LEDIndicator({ cx, cy, colorClass, label }) {
  return (
    <g>
      <circle className="led-outline" cx={cx} cy={cy} r="7" />
      <circle className={colorClass} cx={cx} cy={cy} r="6" />
      <circle className={`${colorClass}-inner`} cx={cx} cy={cy} r="4" />
      <PadTHT cx={cx + 7} cy={cy} r={3.5} holeR={1.8} />
      <PadTHT cx={cx - 7} cy={cy} r={3.5} holeR={1.8} />
      <text className="silkscreen-sm" x={cx} y={cy + 18}>{label}</text>
    </g>
  )
}

function SMDResistor({ cx, cy, rot = 0, value }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <ComponentShadow x={cx - 6} y={cy - 3} w={12} h={6} rx={1} />
      <rect className="smd-resistor-body" x={cx - 6} y={cy - 3} width={12} height={6} rx="1" />
      <rect className="smd-resistor-end" x={cx - 6} y={cy - 3} width={3} height={6} rx="0.5" />
      <rect className="smd-resistor-end" x={cx + 3} y={cy - 3} width={3} height={6} rx="0.5" />
      {value && <text className="silkscreen-sm" x={cx} y={cy + 10} fontSize="7">{value}</text>}
    </g>
  )
}

function SMDCap({ cx, cy, rot = 0, value }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <ComponentShadow x={cx - 5} y={cy - 4} w={10} h={8} rx={1} />
      <rect className="smd-cap-body" x={cx - 5} y={cy - 4} width={10} height={8} rx="1" />
      <rect className="smd-resistor-end" x={cx - 5} y={cy - 4} width={2} height={8} rx="0.5" />
      <rect className="smd-resistor-end" x={cx + 3} y={cy - 4} width={2} height={8} rx="0.5" />
      {value && <text className="silkscreen-sm" x={cx} y={cy + 10} fontSize="7">{value}</text>}
    </g>
  )
}

function SMDDiode({ cx, cy, rot = 0, label }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <ComponentShadow x={cx - 10} y={cy - 3} w={20} h={6} rx={1} />
      <rect className="smd-resistor-body" x={cx - 10} y={cy - 3} width={20} height={6} rx="1" />
      <rect className="smd-resistor-end" x={cx - 10} y={cy - 3} width={4} height={6} rx="0.5" />
      <rect className="smd-resistor-end" x={cx + 6} y={cy - 3} width={4} height={6} rx="0.5" />
      <line x1={cx - 2} y1={cy - 3} x2={cx - 2} y2={cy + 3} stroke="var(--border)" strokeWidth="1" />
      <text className="silkscreen-sm" x={cx} y={cy + 10} fontSize="7">{label}</text>
    </g>
  )
}

// ─── Component and Trace Definitions from reference image ───

const COMPONENTS = [
  { type: 'QFP', cx: 520, cy: 350, w: 130, h: 130, pinsPerSide: 12, label: 'U1 STM32F407VGT6', flash: '1MB FLASH', ram: '192KB RAM', speed: 'M4F 168MHZ' },
  { type: 'SOIC', cx: 875, cy: 155, w: 50, h: 30, pins: 4, label: 'U3 24AA256 EEPROM' },
  { type: 'SOIC', cx: 275, cy: 155, w: 50, h: 30, pins: 4, label: 'U2 AMS1117 3.3' },
  { type: 'SSOP', cx: 990, cy: 450, w: 50, h: 90, pins: 8, label: 'U4 CH340C USB TO UART' },
  { type: 'TSSOP', cx: 150, cy: 510, w: 40, h: 100, pins: 10, label: 'U5 SN74LVC245 BUS TRANSCEIVER' },
  { type: 'Crystal', cx: 840, cy: 650, label: 'Y1' },
  { type: 'USBC', cx: 1100, cy: 380, label: 'USB-C', num: 'J4' },
  { type: 'Header', x: 56, cy: 400, pins: 12, label: 'J6 GPIO' }, // This is J6 from the left side
  { type: 'Header', x: 90, cy: 150, pins: 1, label: 'J1 12V_IN' }, // J1 from top left
  { type: 'Header', x: 990, cy: 100, pins: 1, label: 'J3 3V3' }, // J3 from top right
  { type: 'Header', x: 990, cy: 650, pins: 1, label: 'J5 TXD' }, // J5 from right bottom
  { type: 'Tactile', cx: 210, cy: 750, label: 'SW1 RESET' },
  { type: 'Tactile', cx: 330, cy: 750, label: 'SW2 BOOT0' },
  { type: 'LEDIndicator', cx: 275, cy: 600, colorClass: 'led-pwr-fill', label: 'LED1 PWR' },
  { type: 'LEDIndicator', cx: 375, cy: 600, colorClass: 'led-d13-fill', label: 'LED2 D13' },
  { type: 'SMDDiode', cx: 220, cy: 110, rot: 90, label: 'D1 SS34'},

  // Capacitors
  { type: 'SMDCap', cx: 250, cy: 90, value: 'C1' }, { type: 'SMDCap', cx: 290, cy: 90, value: 'C2' },
  { type: 'SMDCap', cx: 250, cy: 200, value: 'C3 22uF 25V' }, { type: 'SMDCap', cx: 300, cy: 200, value: 'C4 22uF 25V' },
  { type: 'SMDCap', cx: 700, cy: 90, value: 'C5 100nF' }, { type: 'SMDCap', cx: 740, cy: 90, value: 'C6 100nF' },
  { type: 'SMDCap', cx: 780, cy: 90, value: 'C7 100nF' }, { type: 'SMDCap', cx: 820, cy: 90, value: 'C8 100nF' },
  { type: 'SMDCap', cx: 880, cy: 300, value: 'C9 100nF' }, { type: 'SMDCap', cx: 920, cy: 300, value: 'C10 100nF' },
  { type: 'SMDCap', cx: 800, cy: 690, value: 'C11 22pF' }, { type: 'SMDCap', cx: 860, cy: 690, value: 'C12 22pF' },

  // Resistors
  { type: 'SMDResistor', cx: 250, cy: 350, rot: 0, value: 'R1 10K' }, { type: 'SMDResistor', cx: 280, cy: 350, rot: 0, value: 'R2 10K' },
  { type: 'SMDResistor', cx: 310, cy: 350, rot: 0, value: 'R3 10K' },
  { type: 'SMDResistor', cx: 910, cy: 350, rot: 0, value: 'R4 5.1K' }, { type: 'SMDResistor', cx: 940, cy: 350, rot: 0, value: 'R5 5.1K' },
]

const TRACE_ROUTES = [
  // J1 12V_IN -> D1 -> U2 AMS1117
  { pts: route(100, 100, 180, 100, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // J1 to D1
  { pts: route(240, 100, 240, 170, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // D1 to C3/C4/U2

  // U1 (MCU) routing - approximate actual routes from image
  // Left side bus from U1 to U5
  { pts: route(443, 310, 180, 480, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 320, 180, 490, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 330, 180, 500, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 340, 180, 510, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 350, 180, 520, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 360, 180, 530, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 370, 180, 540, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 380, 180, 550, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(443, 390, 180, 560, 4), width: 1.2, animated: false, class: 'trace-signal' },

  // U1 to J6 (GPIO Header)
  { pts: route(465, 273, 80, 310, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(475, 273, 80, 320, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(485, 273, 80, 330, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(495, 273, 80, 340, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(505, 273, 80, 350, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(515, 273, 80, 360, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(525, 273, 80, 370, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(535, 273, 80, 380, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(545, 273, 80, 390, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(555, 273, 80, 400, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(565, 273, 80, 410, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(575, 273, 80, 420, 4), width: 1.2, animated: false, class: 'trace-signal' },

  // U1 to U3 (EEPROM)
  { pts: route(597, 325, 850, 145, 4), width: 1.2, animated: false, class: 'trace-signal' }, // SCL
  { pts: route(597, 335, 860, 145, 4), width: 1.2, animated: false, class: 'trace-signal' }, // SDA
  { pts: route(597, 345, 870, 145, 4), width: 1.2, animated: false, class: 'trace-signal' }, // WP
  { pts: route(597, 355, 880, 145, 4), width: 1.2, animated: false, class: 'trace-signal' }, // A0

  // U1 to U4 (USB-UART)
  { pts: route(597, 365, 980, 410, 4), width: 1.2, animated: false, class: 'trace-signal' }, // TXD
  { pts: route(597, 375, 980, 420, 4), width: 1.2, animated: false, class: 'trace-signal' }, // RXD
  { pts: route(597, 385, 980, 430, 4), width: 1.2, animated: false, class: 'trace-signal' }, // CTS
  { pts: route(597, 395, 980, 440, 4), width: 1.2, animated: false, class: 'trace-signal' }, // RTS
  { pts: route(597, 405, 980, 450, 4), width: 1.2, animated: false, class: 'trace-signal' }, // DTR
  { pts: route(597, 415, 980, 460, 4), width: 1.2, animated: false, class: 'trace-signal' }, // DSR

  // U4 to J4 (USB-C)
  { pts: route(1015, 410, 1080, 360, 3), width: 1.2, animated: false, class: 'trace-signal' }, // D+
  { pts: route(1015, 420, 1080, 370, 3), width: 1.2, animated: false, class: 'trace-signal' }, // D-
  { pts: route(1015, 430, 1080, 380, 3), width: 2.5, animated: false, class: 'trace-pwr' }, // VBUS
  { pts: route(1015, 440, 1080, 390, 3), width: 2.5, animated: false, class: 'trace-pwr' }, // GND

  // U1 to Y1 (Crystal)
  { pts: route(510, 427, 830, 670, 5), width: 1.8, animated: true, class: 'trace-pulse' },
  { pts: route(520, 427, 850, 670, 5), width: 1.8, animated: true, class: 'trace-pulse' },

  // U1 to SW1/SW2
  { pts: route(480, 427, 210, 720, 4), width: 1.2, animated: false, class: 'trace-signal' }, // SW1 RESET
  { pts: route(500, 427, 330, 720, 4), width: 1.2, animated: false, class: 'trace-signal' }, // SW2 BOOT0

  // U1 to LEDs
  { pts: route(530, 427, 275, 630, 4), width: 1.2, animated: true, class: 'trace-pulse' }, // LED1 PWR
  { pts: route(540, 427, 375, 630, 4), width: 1.2, animated: false, class: 'trace-signal' }, // LED2 D13

  // J1 12V_IN Power Trace
  { pts: route(120, 50, 120, 20, 2), width: 3, animated: false, class: 'trace-pwr' },
  { pts: route(120, 20, 1100, 20, 2), width: 3, animated: false, class: 'trace-pwr' },
  { pts: route(1100, 20, 1100, 50, 2), width: 3, animated: false, class: 'trace-pwr' },

  // J3 3V3 Power Trace
  { pts: route(980, 50, 980, 20, 2), width: 2.5, animated: false, class: 'trace-pwr' },

  // J6 GPIO to U1
  { pts: route(80, 310, 443, 310, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 320, 443, 320, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 330, 443, 330, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 340, 443, 340, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 350, 443, 350, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 360, 443, 360, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 370, 443, 370, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 380, 443, 380, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 390, 443, 390, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 400, 443, 400, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 410, 443, 410, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(80, 420, 443, 420, 4), width: 1.2, animated: false, class: 'trace-signal' },

  // J2 (bottom header) to U1
  { pts: route(500, 750, 500, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(510, 750, 510, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(520, 750, 520, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(530, 750, 530, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(540, 750, 540, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(550, 750, 550, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(560, 750, 560, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },
  { pts: route(570, 750, 570, 427, 4), width: 1.2, animated: false, class: 'trace-signal' },

  // U2 power
  { pts: route(280, 185, 240, 185, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // From U2 to power plane

  // U3 power
  { pts: route(875, 185, 980, 185, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // From U3 to power plane

  // U4 power
  { pts: route(990, 480, 950, 480, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // From U4 to power plane

  // U5 power
  { pts: route(150, 540, 190, 540, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // From U5 to power plane

  // J4 power
  { pts: route(1090, 390, 1050, 390, 2), width: 2.5, animated: false, class: 'trace-pwr' }, // From J4 to power plane

  // SW1/SW2 GND
  { pts: route(210, 760, 240, 760, 2), width: 2.5, animated: false, class: 'trace-pwr' },
  { pts: route(330, 760, 300, 760, 2), width: 2.5, animated: false, class: 'trace-pwr' },
]

const VIA_POSITIONS = [
  [180,100], [240,100], [240,170],
  [443,310], [443,320], [443,330], [443,340], [443,350], [443,360], [443,370], [443,380], [443,390],
  [80,310], [80,320], [80,330], [80,340], [80,350], [80,360], [80,370], [80,380], [80,390], [80,400], [80,410], [80,420],
  [597,325], [597,335], [597,345], [597,355], [597,365], [597,375], [597,385], [597,395], [597,405], [597,415],
  [850,145], [860,145], [870,145], [880,145],
  [980,410], [980,420], [980,430], [980,440], [980,450], [980,460],
  [1080,360], [1080,370], [1080,380], [1080,390],
  [510,427], [520,427],
  [830,670], [850,670],
  [210,720], [330,720],
  [275,630], [375,630],
  [120,50], [120,20], [1100,20], [1100,50],
  [980,50], [980,20],
  [500,750], [510,750], [520,750], [530,750], [540,750], [550,750], [560,750], [570,750],
  [280,185], [980,185], [950,480], [190,540], [1050,390], [240,760], [300,760],
]

const KEEPOUTS = [
  { x: 520 - 75, y: 350 - 75, w: 150, h: 150 }, // U1
  { x: 875 - 35, y: 170 - 25, w: 70, h: 50 }, // U3
  { x: 275 - 35, y: 170 - 25, w: 70, h: 50 }, // U2
  { x: 990 - 35, y: 450 - 55, w: 70, h: 110 }, // U4
  { x: 150 - 30, y: 510 - 55, w: 60, h: 110 }, // U5
  { x: 840 - 30, y: 650 - 30, w: 60, h: 60 }, // Y1
  { x: 1100 - 20, y: 380 - 30, w: 40, h: 60 }, // J4
  { x: 56 - 5, y: 400 - 60, w: 24, h: 120 }, // J6
  { x: 90 - 5, y: 150 - 10, w: 24, h: 20 }, // J1
  { x: 990 - 5, y: 100 - 10, w: 24, h: 20 }, // J3
  { x: 990 - 5, y: 650 - 10, w: 24, h: 20 }, // J5
  { x: 210 - 20, y: 750 - 20, w: 40, h: 40 }, // SW1
  { x: 330 - 20, y: 750 - 20, w: 40, h: 40 }, // SW2
  { x: 275 - 15, y: 600 - 15, w: 30, h: 30 }, // LED1
  { x: 375 - 15, y: 600 - 15, w: 30, h: 30 }, // LED2
  { x: 220 - 15, y: 110 - 10, w: 30, h: 20 }, // D1
  // Capacitors
  { x: 250 - 10, y: 90 - 10, w: 20, h: 20 }, { x: 290 - 10, y: 90 - 10, w: 20, h: 20 },
  { x: 250 - 10, y: 200 - 10, w: 20, h: 20 }, { x: 300 - 10, y: 200 - 10, w: 20, h: 20 },
  { x: 700 - 10, y: 90 - 10, w: 20, h: 20 }, { x: 740 - 10, y: 90 - 10, w: 20, h: 20 },
  { x: 780 - 10, y: 90 - 10, w: 20, h: 20 }, { x: 820 - 10, y: 90 - 10, w: 20, h: 20 },
  { x: 880 - 10, y: 300 - 10, w: 20, h: 20 }, { x: 920 - 10, y: 300 - 10, w: 20, h: 20 },
  { x: 800 - 10, y: 690 - 10, w: 20, h: 20 }, { x: 860 - 10, y: 690 - 10, w: 20, h: 20 },
  // Resistors
  { x: 250 - 10, y: 350 - 10, w: 20, h: 20 }, { x: 280 - 10, y: 350 - 10, w: 20, h: 20 },
  { x: 310 - 10, y: 350 - 10, w: 20, h: 20 },
  { x: 910 - 10, y: 350 - 10, w: 20, h: 20 }, { x: 940 - 10, y: 350 - 10, w: 20, h: 20 },
]

function PCBHeroBackground() {
  const allTraces = useMemo(() => {
    return TRACE_ROUTES.map(t => ({...t, path: toPath(t.pts) }))
  }, [])

  const viaPositions = useMemo(() => {
    const positions = new Set()
    VIA_POSITIONS.forEach(([x, y]) => positions.add(`${x},${y}`))
    return Array.from(positions).map(k => k.split(',').map(Number))
  }, [])

  const signalDots = useMemo(() => {
    return allTraces
      .map((t, i) => ({ ...t, idx: i }))
      .filter(t => t.animated && t.pts.length >= 4)
      .map(t => {
        const midIdx = Math.floor(t.pts.length / 2)
        const p = t.pts[midIdx]
        return { cx: p[0], cy: p[1], delay: (t.idx * 0.7) % 4 }
      })
  }, [allTraces])

  return (
    <div className="pcb-bg">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid-sm" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <circle className="pcb-grid-dot" cx={GRID_SIZE / 2} cy={GRID_SIZE / 2} r="0.8" />
          </pattern>
          <pattern id="grid-lg" width={GRID_SIZE * 5} height={GRID_SIZE * 5} patternUnits="userSpaceOnUse">
            <circle className="pcb-grid-dot-large" cx={GRID_SIZE * 2.5} cy={GRID_SIZE * 2.5} r="1.5" />
          </pattern>
          <pattern id="copper-hatch" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0L12 12M12 0L0 12" className="copper-pour-hatch" />
          </pattern>
        </defs>

        {/* Board base and grid */}
        <rect width="1200" height="800" fill="var(--bg)" />
        <rect width="1200" height="800" fill="url(#grid-sm)" />
        <rect width="1200" height="800" fill="url(#grid-lg)" />

        {/* Board outline */}
        <rect className="pcb-board" x="20" y="20" width="1160" height="760" rx="10" />

        {/* Copper pour (ground plane) */}
        <rect className="copper-pour-bg" x="25" y="25" width="1150" height="750" rx="8" />
        <rect x="25" y="25" width="1150" height="750" rx="8" fill="url(#copper-hatch)" />

        {/* Copper pour cutouts (component keepouts) */}
        {KEEPOUTS.map((k, i) => <rect key={i} className="copper-keepout" x={k.x} y={k.y} width={k.w} height={k.h} rx={k.rx || 4} ry={k.ry || 4} />)}

        {/* Traces */}
        {allTraces.map((t, i) => (
          <path
            key={i}
            d={t.path}
            className={t.class || (t.animated ? 'trace trace-pulse' : 'trace trace-signal')}
            style={{
              strokeWidth: t.width,
              animationDelay: t.animated ? `${(i * 0.6) % 4}s` : undefined,
              animationDuration: t.animated ? `${3.5 + (i % 3) * 0.5}s` : undefined,
            }}
          />
        ))}

        {/* Vias */}
        {viaPositions.map(([x, y], i) => <Via key={i} cx={x} cy={y} />)}

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
        {COMPONENTS.map((comp, i) => {
          const { type, ...props } = comp
          if (type === 'QFP') return <QFP key={i} {...props} />
          if (type === 'SOIC') return <SOIC key={i} {...props} />
          if (type === 'SSOP') return <SSOP key={i} {...props} />
          if (type === 'TSSOP') return <TSSOP key={i} {...props} />
          if (type === 'SOT223') return <SOT223 key={i} {...props} />
          if (type === 'Crystal') return <Crystal key={i} {...props} />
          if (type === 'USBC') return <USBC key={i} {...props} />
          if (type === 'Header') return <Header key={i} {...props} />
          if (type === 'Tactile') return <Tactile key={i} {...props} />
          if (type === 'LEDIndicator') return <LEDIndicator key={i} {...props} />
          if (type === 'SMDResistor') return <SMDResistor key={i} {...props} />
          if (type === 'SMDCap') return <SMDCap key={i} {...props} />
          if (type === 'SMDDiode') return <SMDDiode key={i} {...props} />
          return null
        })}

        {/* Mounting holes */}
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
