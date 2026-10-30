// Drawn app mockups in each project's hue. Placeholders until real screenshots arrive (R2, #13).
export function DeviceMock({
  kind,
  hue,
  label,
}: {
  kind: 'phone' | 'desktop'
  hue: number
  label: string
}) {
  const c = (l: number, chroma = 0.14, h = hue) =>
    `oklch(${String(l)} ${String(chroma)} ${String(h)})`
  const initial = label
    .replace(/^Sample:\s*/, '')
    .slice(0, 1)
    .toUpperCase()

  if (kind === 'desktop') {
    return (
      <svg
        viewBox="0 0 320 200"
        role="img"
        aria-label={`${label}, desktop app mockup`}
        className="w-full"
      >
        <rect
          x="1"
          y="1"
          width="318"
          height="198"
          rx="12"
          fill={c(0.2, 0.03)}
          stroke={c(0.35, 0.04)}
        />
        <circle cx="16" cy="14" r="3.5" fill="#ff5f57" />
        <circle cx="28" cy="14" r="3.5" fill="#febc2e" />
        <circle cx="40" cy="14" r="3.5" fill="#28c840" />
        <rect x="10" y="28" width="62" height="160" rx="8" fill={c(0.26, 0.05)} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x="20"
            y={44 + i * 18}
            width={i === 0 ? 42 : 34}
            height="7"
            rx="3.5"
            fill={i === 0 ? c(0.75) : c(0.45, 0.05)}
          />
        ))}
        <rect x="84" y="28" width="226" height="56" rx="10" fill={c(0.62)} />
        <text x="100" y="62" fontSize="20" fontWeight="700" fill={c(0.18, 0.05)}>
          {initial}
        </text>
        <rect x="84" y="94" width="108" height="94" rx="10" fill={c(0.28, 0.05)} />
        <rect x="202" y="94" width="108" height="44" rx="10" fill={c(0.32, 0.06)} />
        <rect x="202" y="144" width="108" height="44" rx="10" fill={c(0.36, 0.08, hue + 40)} />
        <polyline
          points="94,170 112,150 128,160 148,130 168,140 182,112"
          fill="none"
          stroke={c(0.8)}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 150 300"
      role="img"
      aria-label={`${label}, phone app mockup`}
      className="h-full"
    >
      <rect
        x="2"
        y="2"
        width="146"
        height="296"
        rx="26"
        fill={c(0.16, 0.02)}
        stroke={c(0.35, 0.04)}
        strokeWidth="2"
      />
      <rect x="10" y="10" width="130" height="280" rx="19" fill={c(0.22, 0.04)} />
      <rect x="58" y="16" width="34" height="8" rx="4" fill={c(0.12, 0.01)} />
      <rect x="10" y="10" width="130" height="92" rx="19" fill={c(0.62)} />
      <circle cx="34" cy="60" r="14" fill={c(0.9, 0.05)} />
      <text x="34" y="66" fontSize="16" fontWeight="700" textAnchor="middle" fill={c(0.3)}>
        {initial}
      </text>
      <rect x="56" y="52" width="60" height="7" rx="3.5" fill={c(0.9, 0.05)} />
      <rect x="56" y="64" width="38" height="5" rx="2.5" fill={c(0.8, 0.06)} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="20" y={114 + i * 46} width="110" height="38" rx="10" fill={c(0.3, 0.05)} />
          <circle cx="38" cy={133 + i * 46} r="8" fill={c(0.7 - i * 0.08, 0.12, hue + i * 30)} />
          <rect
            x="52"
            y={127 + i * 46}
            width={60 - i * 10}
            height="5"
            rx="2.5"
            fill={c(0.75, 0.03)}
          />
          <rect x="52" y={136 + i * 46} width="38" height="4" rx="2" fill={c(0.5, 0.03)} />
        </g>
      ))}
      <rect x="10" y="256" width="130" height="34" rx="0" fill={c(0.26, 0.04)} />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={34 + i * 27} cy="272" r="5" fill={i === 0 ? c(0.75) : c(0.45, 0.04)} />
      ))}
    </svg>
  )
}
