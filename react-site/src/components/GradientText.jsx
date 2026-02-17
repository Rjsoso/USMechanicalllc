import { useEffect, useRef } from 'react'

// Direct DOM color animation — zero React re-renders
export default function GradientText({ children }) {
  const spanRef = useRef(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return

    const r1 = 52, g1 = 4, b1 = 246   // #3404f6
    const r2 = 244, g2 = 1, b2 = 1     // #f40101

    let progress = 0
    const interval = setInterval(() => {
      progress += 0.016
      const t = (Math.sin(progress) + 1) / 2
      const r = Math.round(r1 + (r2 - r1) * t)
      const g = Math.round(g1 + (g2 - g1) * t)
      const b = Math.round(b1 + (b2 - b1) * t)
      el.style.color = `rgb(${r},${g},${b})`
    }, 100)

    return () => clearInterval(interval)
  }, [children])

  return (
    <span
      ref={spanRef}
      style={{
        color: '#3404f6',
        display: 'inline',
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  )
}
