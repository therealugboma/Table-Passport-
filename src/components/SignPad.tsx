import { useEffect, useRef } from 'react'
export default function SignPad({ onChange }: { onChange: (d: string) => void }) {
  const c = useRef<HTMLCanvasElement>(null); const drawing = useRef(false)
  useEffect(() => { const cv = c.current!; const r = cv.getBoundingClientRect(); cv.width = r.width * 2; cv.height = r.height * 2; const x = cv.getContext('2d')!; x.scale(2, 2); x.lineWidth = 2; x.lineCap = 'round'; x.strokeStyle = '#08080a' }, [])
  const pos = (e: React.PointerEvent) => { const r = c.current!.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  return <div className="sign">
    <canvas ref={c} data-testid="sign" onPointerDown={e => { drawing.current = true; const [x, y] = pos(e); const g = c.current!.getContext('2d')!; g.beginPath(); g.moveTo(x, y) }}
      onPointerMove={e => { if (!drawing.current) return; const [x, y] = pos(e); const g = c.current!.getContext('2d')!; g.lineTo(x, y); g.stroke() }}
      onPointerUp={() => { drawing.current = false; onChange(c.current!.toDataURL()) }} onPointerLeave={() => { if (drawing.current) { drawing.current = false; onChange(c.current!.toDataURL()) } }} />
    <div className="spread"><span className="label">Owner signature</span><button className="btn soft sm" type="button" onClick={() => { const cv = c.current!; cv.getContext('2d')!.clearRect(0, 0, cv.width, cv.height); onChange('') }}>Clear</button></div>
  </div>
}
