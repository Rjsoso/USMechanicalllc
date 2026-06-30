import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied diagonal wipe: an angled boundary (via clip-path) sweeps
// left-to-right across the seam as the zone scrolls through the viewport —
// a blueprint-style cut that slides into place instead of a flat horizontal
// line. Reversible — scroll back up and the angle retracts. The sweep
// param runs past [0, 100] on both ends so the leading/trailing edges
// clear the box entirely at rest, leaving a clean solid color before and
// after the active window.
function DiagonalScrollSeam({ from = '#ffffff', to = '#000000', skew = 16, className = 'h-28 w-full md:h-56' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const sweep = useTransform(scrollYProgress, [0.18, 0.82], [-skew, 100 + skew])
  const clipPath = useTransform(sweep, (v) => {
    const lead = v + skew
    const trail = v - skew
    return `polygon(0% 0%, ${lead}% 0%, ${trail}% 100%, 0% 100%)`
  })

  if (prefersReducedMotion) {
    return (
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(to right, ${from} 0%, ${to} 100%)` }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: from }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0" style={{ backgroundColor: to, clipPath }} />
    </div>
  )
}

export default DiagonalScrollSeam
