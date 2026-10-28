export default function Photos({ value, onChange, max = 4, label = 'Add photo' }: { value: string[]; onChange: (v: string[]) => void; max?: number; label?: string }) {
  const add = (fl: FileList | null) => { if (!fl) return; Array.from(fl).slice(0, max - value.length).forEach(f => { const r = new FileReader(); r.onload = () => { const img = new Image(); img.onload = () => { const cv = document.createElement('canvas'); const s = Math.min(1, 480 / img.width); cv.width = img.width * s; cv.height = img.height * s; cv.getContext('2d')!.drawImage(img, 0, 0, cv.width, cv.height); onChange([...value, cv.toDataURL('image/jpeg', .7)].slice(0, max)) }; img.src = r.result as string }; r.readAsDataURL(f) }) }
  return <div className="photos">
    {value.map((p, i) => <div key={i} className="ph"><img src={p} alt="" /><button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove">×</button></div>)}
    {value.length < max && <label className="ph add"><input type="file" accept="image/*" capture="environment" multiple onChange={e => add(e.target.files)} data-testid="photo" /><span>+</span><em>{label}</em></label>}
  </div>
}
