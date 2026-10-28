/** Top-down table illustration drawn from the passport's own spec (wood + cloth colours). */
export default function TableArt({ wood, cloth, game = 'Snooker', bed, className }: { wood: string; cloth: string; game?: string; bed?: string; className?: string }) {
  const W = 400, H = game === 'Pool' ? 230 : 214, rail = 22, pk = 11
  const pockets = [[rail, rail], [W / 2, rail - 3], [W - rail, rail], [rail, H - rail], [W / 2, H - rail + 3], [W - rail, H - rail]]
  return (
    <svg viewBox={`-10 -10 ${W + 20} ${H + 46}`} className={className} role="img" aria-label="Table illustration">
      <defs>
        <linearGradient id="wd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={wood} stopOpacity=".85" /><stop offset=".5" stopColor={wood} /><stop offset="1" stopColor="#000" stopOpacity=".35" /></linearGradient>
        <radialGradient id="cl" cx=".5" cy=".45" r=".7"><stop offset="0" stopColor={cloth} stopOpacity=".86" /><stop offset="1" stopColor={cloth} /></radialGradient>
        <pattern id="grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 Q10 1 20 3 T40 3" stroke="#000" strokeOpacity=".12" fill="none" /></pattern>
      </defs>
      <ellipse cx={W / 2} cy={H + 6} rx={W * .44} ry="6" fill="#08080a" opacity=".12" />
      <rect x="0" y="0" width={W} height={H} rx="18" fill="url(#wd)" />
      <rect x="0" y="0" width={W} height={H} rx="18" fill="url(#grain)" />
      <rect x={rail} y={rail} width={W - rail * 2} height={H - rail * 2} rx="4" fill="url(#cl)" />
      <rect x={rail} y={rail} width={W - rail * 2} height={H - rail * 2} rx="4" fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="3" />
      {[.25, .5, .75].map(f => <g key={f}><circle cx={W * f} cy={6} r="1.6" fill="#f3e6c8" opacity=".8" /><circle cx={W * f} cy={H - 6} r="1.6" fill="#f3e6c8" opacity=".8" /></g>)}
      {game === 'Snooker' ? <>
        <line x1={W * .78} y1={rail} x2={W * .78} y2={H - rail} stroke="#fff" strokeOpacity=".55" strokeWidth="1" />
        <path d={`M${W * .78} ${H / 2 - 34} A34 34 0 0 1 ${W * .78} ${H / 2 + 34}`} fill="none" stroke="#fff" strokeOpacity=".55" />
        {[[W * .78, H / 2 - 34, '#2a8c3e'], [W * .78, H / 2, '#7a4a22'], [W * .78, H / 2 + 34, '#e5c33a'], [W / 2, H / 2, '#2f5fb0'], [W * .27, H / 2, '#e98bb0'], [W * .095 + rail, H / 2, '#111']].map(([x, y, c], i) => <circle key={i} cx={x as number} cy={y as number} r="4.6" fill={c as string} />)}
        {[0, 1, 2, 3, 4].map(r => Array.from({ length: r + 1 }).map((_, j) => <circle key={r + '-' + j} cx={W * .25 - 10 - r * 8} cy={H / 2 + (j - r / 2) * 9.4} r="4.4" fill="#c4161c" />))}
        <circle cx={W * .84} cy={H / 2 + 14} r="4.6" fill="#fbf7ee" />
      </> : <>
        <circle cx={W * .25} cy={H / 2} r="2" fill="#fff" opacity=".6" />
        {[0, 1, 2, 3, 4].map(r => Array.from({ length: r + 1 }).map((_, j) => <circle key={r + '-' + j} cx={W * .27 - r * 8.4} cy={H / 2 + (j - r / 2) * 9.6} r="4.6" fill={['#e5c33a', '#2f5fb0', '#c4161c', '#5b2a86', '#e2712b', '#1f7a3a', '#7a2020', '#111'][(r * 3 + j) % 8]} />))}
        <circle cx={W * .74} cy={H / 2} r="4.6" fill="#fbf7ee" />
      </>}
      {pockets.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={pk} fill="#0c0c0d" />)}
      <rect x={W / 2 - 34} y={H - 9} width="68" height="7" rx="3.5" fill="#d7c28d" opacity=".9" />
      {bed && <text x={W / 2} y={H + 28} textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.2" fill="#646b76">{bed.toUpperCase()} BED · TOP VIEW</text>}
    </svg>
  )
}
