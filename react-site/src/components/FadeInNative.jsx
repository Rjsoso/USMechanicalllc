import { useEffect, useRef, useState, memo } from 'react'

function FadeInNative({ children, delay = 0, className = '' }) {
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
        threshold: 0.01,
        rootMargin: '100px 0px',
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [delay])

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
