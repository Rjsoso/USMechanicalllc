import { useEffect, useRef, useState, memo } from 'react'

// A self-contained seam between the black About section and the white Safety
// section: a short diagonal "cut" (instead of a flat color swap) with a thin
// accent line that draws itself in once the seam scrolls into view. Painting
// both the black and white halves itself (rather than clipping either real
// section) keeps it independent of whatever sits behind them in the stacking
// context, and keeps it from touching #about/#safety's own DOM structure.
function SectionAccentDivider() {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let hasTriggered = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={elementRef} className="section-seam" aria-hidden="true">
      <div className="section-seam__black" />
      <div className="section-seam__white" />
      <div
        className={`section-seam__accent ${isVisible ? 'section-seam__accent--visible' : ''}`}
      />
    </div>
  )
}

export default memo(SectionAccentDivider)
