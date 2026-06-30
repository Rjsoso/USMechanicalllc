import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied wipe between two solid-color blocks: a horizontal boundary
// sweeps from `from` to `to` as the zone scrolls through the viewport
// (reversible — scroll back up and it un-wipes). Tied directly to scroll
// position rather than a one-shot trigger, so it never feels like a
// stuck-on shape — it responds to how the user is actually moving through
// the page. Reusable at any black/white (or other two-tone) section seam.
function SectionScrollSeam({ from = '#000000', to = '#ffffff', className = 'h-28 w-full md:h-56' }) {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const wipePercent = useTransform(scrollYProgress, [0.18, 0.82], [0, 100])
  const background = useTransform(
    wipePercent,
    (v) => `linear-gradient(to bottom, ${from} 0%, ${from} ${v}%, ${to} ${v}%, ${to} 100%)`
  )

  if (prefersReducedMotion) {
    return (
      <div
        className="h-px w-full"
        style={{ background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)` }}
        aria-hidden="true"
      />
    )
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ background }}
      aria-hidden="true"
    />
  )
}

export default SectionScrollSeam
