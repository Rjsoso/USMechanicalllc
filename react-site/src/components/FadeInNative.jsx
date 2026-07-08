import { useEffect, useRef, useState, memo } from 'react'

function FadeInNative({ children, delay = 0, className = '', variant = 'fade' }) {
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
          observer.disconnect()
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000)
          } else {
            setIsVisible(true)
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -4% 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

  if (variant === 'wipe') {
    // The clip-path lives on an inner wrapper, never on the observed element itself.
    // A self-clipped target reports a permanent zero intersection ratio to
    // IntersectionObserver (its visible render area is zero), which would
    // deadlock the reveal — the observer would never see it as "visible."
    return (
      <div ref={elementRef} className={className}>
        <div className={`wipe-reveal-native ${isVisible ? 'wipe-reveal-native--visible' : ''}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`fade-in-native ${isVisible ? 'fade-in-native--visible' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default memo(FadeInNative)
