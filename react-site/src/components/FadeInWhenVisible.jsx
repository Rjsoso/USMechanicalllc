import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { viewportScrollPreset } from '../utils/viewport'

function FadeInWhenVisible({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()
  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={viewportScrollPreset}
    >
      {children}
    </motion.div>
  )
}

export default memo(FadeInWhenVisible)
