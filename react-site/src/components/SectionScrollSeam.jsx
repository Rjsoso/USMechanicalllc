import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied wipe between the black About section and the white Safety
// section: a horizontal boundary sweeps from black to white as the zone
// scrolls through the viewport (reversible — scroll back up and it un-wipes).
// Tied directly to scroll position rather than a one-shot trigger, so it
// never feels like a stuck-on shape — it responds to how the user is
// actually moving through the page.
function SectionScrollSeam() {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const wipePercent = useTransform(scrollYProgress, [0.18, 0.82], [0, 100])
  const background = useTransform(
    wipePercent,
    (v) => `linear-gradient(to bottom, #000 0%, #000 ${v}%, #fff ${v}%, #fff 100%)`
  )

  if (prefersReducedMotion) {
    return (
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(to bottom, #000 0%, #fff 100%)' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <motion.div
      ref={ref}
      className="relative h-28 w-full overflow-hidden md:h-56"
      style={{ background }}
      aria-hidden="true"
    />
  )
}

export default SectionScrollSeam
