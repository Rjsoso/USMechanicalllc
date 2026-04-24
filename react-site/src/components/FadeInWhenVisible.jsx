import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { viewportPreset } from '../utils/viewport'

function FadeInWhenVisible({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={viewportPreset}
    >
      {children}
    </motion.div>
  )
}

export default memo(FadeInWhenVisible)
