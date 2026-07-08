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

  const baseClass = variant === 'wipe' ? 'wipe-reveal-native' : 'fade-in-native'

  return (
    <div
      ref={elementRef}
      className={`${baseClass} ${isVisible ? `${baseClass}--visible` : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export default memo(FadeInNative)
