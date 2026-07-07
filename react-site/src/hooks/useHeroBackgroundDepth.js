import { useEffect } from 'react'
import { useMotionValueEvent, useTransform } from 'framer-motion'

// Drives the fixed hero background's scale/brightness from the hero's own
// scroll progress (0 = hero fully in view, 1 = About has just finished
// covering it). The background lives on a ::before pseudo-element
// (main.main-with-fixed-bg::before in index.css), which motion values can't
// target directly, so we write plain CSS custom properties on the nearest
// .main-with-fixed-bg ancestor instead — no React re-renders involved.
export function useHeroBackgroundDepth(sectionRef, scrollYProgress, prefersReducedMotion) {
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.82])

  useMotionValueEvent(scale, 'change', (value) => {
    if (prefersReducedMotion) return
    const mainEl = sectionRef.current?.closest('.main-with-fixed-bg')
    mainEl?.style.setProperty('--hero-bg-scale', value)
  })

  useMotionValueEvent(brightness, 'change', (value) => {
    if (prefersReducedMotion) return
    const mainEl = sectionRef.current?.closest('.main-with-fixed-bg')
    mainEl?.style.setProperty('--hero-bg-brightness', value)
  })

  // If reduced-motion turns on mid-session (or on mount), make sure the
  // background snaps back to its neutral, non-animated state rather than
  // freezing at whatever scale/brightness it last reached.
  useEffect(() => {
    if (!prefersReducedMotion) return
    const mainEl = sectionRef.current?.closest('.main-with-fixed-bg')
    mainEl?.style.removeProperty('--hero-bg-scale')
    mainEl?.style.removeProperty('--hero-bg-brightness')
  }, [prefersReducedMotion, sectionRef])
}
