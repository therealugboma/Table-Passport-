import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
export default function Qr({ text, size = 120, dark = '#08080a', light = '#ffffff' }: { text: string; size?: number; dark?: string; light?: string }) {
  const [src, set] = useState('')
  useEffect(() => { QRCode.toDataURL(text, { margin: 0, width: size * 2, errorCorrectionLevel: 'M', color: { dark, light } }).then(set) }, [text, size, dark, light])
  return src ? <img src={src} width={size} height={size} alt={'QR code for ' + text} style={{ display: 'block', imageRendering: 'pixelated' }} /> : <div style={{ width: size, height: size }} />
}
