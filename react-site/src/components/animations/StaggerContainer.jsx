import { createContext, useContext, useMemo, memo } from 'react'
import { motion } from 'framer-motion'

const StaggerIntensityContext = createContext('default')

const ITEM_VARIANTS = {
  default: {
    hidden: { opacity: 0, y: 36, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] },
    },
  },
  strong: {
    hidden: { opacity: 0, y: 56, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  },
}

export const StaggerContainer = memo(function StaggerContainer({
  children,
  className = '',
  style,
  intensity = 'default',
  staggerDelay: staggerDelayProp,
  initialDelay = 0,
  once = true,
}) {
  const staggerDelay =
    staggerDelayProp ?? (intensity === 'strong' ? 0.16 : 0.11)

  const variants = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: initialDelay,
        },
      },
    }),
    [staggerDelay, initialDelay]
  )

  return (
    <StaggerIntensityContext.Provider value={intensity}>
      <motion.div
        className={className}
        style={style}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.01, margin: '100px 0px' }}
        variants={variants}
      >
        {children}
      </motion.div>
    </StaggerIntensityContext.Provider>
  )
})

export const StaggerItem = memo(function StaggerItem({ children, className = '' }) {
  const intensity = useContext(StaggerIntensityContext)
  const variants = ITEM_VARIANTS[intensity] ?? ITEM_VARIANTS.default

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
})
