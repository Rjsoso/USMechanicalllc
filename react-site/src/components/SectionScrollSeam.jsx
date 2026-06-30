import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// A scroll-tied wipe between the black About section and the white Safety
// section: a horizontal boundary sweeps from black to white as the zone
// scrolls through the viewport (reversible — scroll back up and it un-wipes),
// with a thin red accent line riding the moving edge. Tied directly to scroll
// position rather than a one-shot trigger, so it never feels like a stuck-on
// shape — it responds to how the user is actually moving through the page.
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
  const linePosition = useTransform(wipePercent, (v) => `${v}%`)
  const lineOpacity = useTransform(scrollYProgress, [0.12, 0.2, 0.8, 0.88], [0, 1, 1, 0])

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
    >
      <motion.div
        className="absolute left-1/2 h-[2px] w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#dc2626] md:w-40"
        style={{ top: linePosition, opacity: lineOpacity }}
      />
    </motion.div>
  )
}

export default SectionScrollSeam
