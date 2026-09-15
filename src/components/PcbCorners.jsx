function PcbCorners() {
  // viewBox 320×320 → maps to 320px box centered on 280px photo
  // photo area in viewBox coords: (20,20) to (300,300)
  const L = 50 // arm length of each L-bracket

  const corners = [
    // TL
    {
      lines: [
        { x1: 20, y1: 20, x2: 20 + L, y2: 20 },
        { x1: 20, y1: 20, x2: 20, y2: 20 + L },
      ],
      label: { x: 20 + L + 10, y: 16, text: 'J1' },
      via: { cx: 20, cy: 20 },
    },
    // TR
    {
      lines: [
        { x1: 300, y1: 20, x2: 300 - L, y2: 20 },
        { x1: 300, y1: 20, x2: 300, y2: 20 + L },
      ],
      label: { x: 300 - L - 6, y: 16, text: 'Y1', anchor: 'end' },
      via: { cx: 300, cy: 20 },
    },
    // BL
    {
      lines: [
        { x1: 20, y1: 300, x2: 20 + L, y2: 300 },
        { x1: 20, y1: 300, x2: 20, y2: 300 - L },
      ],
      label: { x: 20 + L + 10, y: 306, text: 'R1' },
      via: { cx: 20, cy: 300 },
    },
    // BR
    {
      lines: [
        { x1: 300, y1: 300, x2: 300 - L, y2: 300 },
        { x1: 300, y1: 300, x2: 300, y2: 300 - L },
      ],
      label: { x: 300 - L - 6, y: 306, text: 'TP1', anchor: 'end' },
      via: { cx: 300, cy: 300 },
    },
  ]

  return (
    <svg
      className="hero-corners-svg"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          .corner-line { stroke: var(--accent); stroke-width: 2; stroke-linecap: round; opacity: 0.55; }
          .corner-label { font-family: 'JetBrains Mono', 'Consolas', monospace; font-size: 8.5px; fill: var(--accent); opacity: 0.5; }
          .corner-via-outer { fill: var(--surface); stroke: var(--accent); stroke-width: 1.5; opacity: 0.6; }
          .corner-via-inner { fill: var(--accent); opacity: 0.7; }
        `}</style>
      </defs>

      {corners.map((c, i) => (
        <g key={i}>
          {/* L-bracket lines */}
          {c.lines.map((line, j) => (
            <line
              key={j}
              className="corner-line"
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
            />
          ))}

          {/* label */}
          <text
            className="corner-label"
            x={c.label.x}
            y={c.label.y}
            textAnchor={c.label.anchor || 'start'}
          >
            {c.label.text}
          </text>

          {/* via at corner */}
          <circle className="corner-via-outer" cx={c.via.cx} cy={c.via.cy} r="4" />
          <circle className="corner-via-inner" cx={c.via.cx} cy={c.via.cy} r="1.5" />
        </g>
      ))}

      {/* micro crosshair at center */}
      <g opacity="0.2">
        <line x1="157" y1="160" x2="163" y2="160" stroke="var(--accent)" strokeWidth="1" />
        <line x1="160" y1="157" x2="160" y2="163" stroke="var(--accent)" strokeWidth="1" />
        <circle cx="160" cy="160" r="3" stroke="var(--accent)" strokeWidth="0.5" fill="none" />
      </g>
    </svg>
  )
}

export default PcbCorners
