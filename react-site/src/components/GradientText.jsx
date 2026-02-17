import { useState, useEffect } from 'react'

// Helper function to interpolate between colors
function interpolateColor(color1, color2, ratio) {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function GradientText({ children }) {
  const [color, setColor] = useState('#3404f6')

  useEffect(() => {
    const blue = '#3404f6'
    const red = '#f40101'

    let progress = 0
    const interval = setInterval(() => {
      // Slow smooth progress (~10 seconds for full cycle)
      progress += 0.016

      // Use sine wave for smooth back-and-forth motion
      const sineValue = (Math.sin(progress) + 1) / 2 // 0 to 1

      // Smooth transition: Blue → Red → Blue
      const newColor = interpolateColor(blue, red, sineValue)
      setColor(newColor)
    }, 100)

    return () => clearInterval(interval)
  }, [children])

  return (
    <span
      style={{
        color: color,
        display: 'inline',
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 900,
      }}
    >
      {children}
    </span>
  )
}
