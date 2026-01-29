import { useEffect, useState } from 'react'

export default function LoadingScreen({ minimal = false }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Minimum display time to prevent flash
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-900"
      style={{
        backgroundColor: '#1a1a1a',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        {/* Logo with rotation animation */}
        <div
          style={{
            animation: 'logoRotate 3.5s linear infinite, fadeInLoader 0.5s ease-out',
            width: window.innerWidth < 768 ? '120px' : '180px',
            height: 'auto',
          }}
        >
          <img
            src="/logo.png"
            alt="US Mechanical Logo"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* Loading text with bouncing dots */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            animation: 'fadeInLoader 0.6s ease-out',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 700,
            fontSize: window.innerWidth < 768 ? '1.5rem' : '2rem',
            color: '#ffffff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>LOADING</span>
          <span
            style={{
              display: 'inline-block',
              animation: 'dotBounce 0.6s ease-in-out infinite',
              animationDelay: '0s',
            }}
          >
            .
          </span>
          <span
            style={{
              display: 'inline-block',
              animation: 'dotBounce 0.6s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          >
            .
          </span>
          <span
            style={{
              display: 'inline-block',
              animation: 'dotBounce 0.6s ease-in-out infinite',
              animationDelay: '0.4s',
            }}
          >
            .
          </span>
        </div>
      </div>

      {/* Respect prefers-reduced-motion */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            div[style*="animation"] {
              animation: none !important;
            }
            span[style*="animation"] {
              animation: none !important;
            }
          }
        `}
      </style>
    </div>
  )
}
