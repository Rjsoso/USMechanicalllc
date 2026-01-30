import { useEffect, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { client, urlFor } from '../utils/sanity'
import { navigateToSection } from '../utils/scrollToSection'
import LoadingScreen from './LoadingScreen'

// Fallback hero data - Last updated: 2026-01-29
const defaultHeroData = {
  // Keep defaults aligned with the published CMS values to avoid “mismatch” confusion
  headline: 'Trusted Mechanical Contractors Since 1963',
  subtext: '',
  buttonText: 'REQUEST A QUOTE',
  buttonLink: '#contact',
  secondButtonText: 'APPLY TO WORK WITH US',
  secondButtonLink: '#careers',
  backgroundImage: null,
}

// Generate random color once during module initialization
const generateYearColor = () => {
  const colors = ['#3404f6', '#dc2626'] // blue and red
  return colors[Math.floor(Math.random() * colors.length)]
}

function HeroSection() {
  const [heroData, setHeroData] = useState(defaultHeroData)
  const [yearColor] = useState(() => generateYearColor())
  const [showLoader, setShowLoader] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleButtonClick = (sectionId) => {
    console.log('[HERO] Button click:', sectionId)
    
    // Show loading screen
    setShowLoader(true)
    
    // Wait 700ms (matching drawer navigation timing), then navigate
    setTimeout(() => {
      console.log('[HERO] Navigating to:', sectionId)
      
      // For contact, wait for unlock event to know correction is complete
      if (sectionId === 'contact') {
        const handleUnlock = () => {
          // Wait additional 200ms after unlock to ensure visual stability
          setTimeout(() => {
            console.log('[HERO] Hiding loader after correction complete')
            setShowLoader(false)
          }, 200)
          window.removeEventListener('unlockContactAnimation', handleUnlock)
        }
        window.addEventListener('unlockContactAnimation', handleUnlock)
        navigateToSection(sectionId, navigate, location.pathname)
      } else {
        // For other sections, use simple delay
        navigateToSection(sectionId, navigate, location.pathname)
        setTimeout(() => {
          console.log('[HERO] Hiding loader')
          setShowLoader(false)
        }, 150)
      }
    }, 700)
  }

  useEffect(() => {
    const fetchHero = () => {
      // Fetch hero section data from Sanity
      client
        .fetch(
          `*[_type == "heroSection" && _id == "heroSection"][0]{
            _id,
            backgroundImage {
              asset-> {
                _id,
                url
              }
            },
            headline,
            subtext,
            buttonText,
            buttonLink,
            secondButtonText,
            secondButtonLink
          }`
        )
        .then(data => {
          // If document with specific ID not found, try first document
          if (!data || !data._id) {
            return client.fetch(
              `*[_type == "heroSection" && !(_id in path("drafts.**"))][0]{
                _id,
                backgroundImage {
                  asset-> {
                    _id,
                    url
                  }
                },
                headline,
                subtext,
                buttonText,
                buttonLink,
                secondButtonText,
                secondButtonLink
              }`
            )
          }
          return Promise.resolve(data)
        })
        .then(data => {
          if (data) {
            // Use data from Sanity, respecting empty values for optional fields
            const heroDataWithDefaults = {
              ...data,
              buttonText: data.buttonText || '',
              buttonLink: data.buttonLink || defaultHeroData.buttonLink,
              secondButtonText: data.secondButtonText || '',
              secondButtonLink: data.secondButtonLink || '',
            }

            setHeroData(heroDataWithDefaults)
          } else {
            // Use default data if Sanity returns null
            console.warn(
              'HeroSection: No published heroSection document found; using default fallback content.'
            )
            setHeroData(defaultHeroData)
          }
        })
        .catch(error => {
          console.error('Error fetching hero section:', error)
          // On error, use default data
          console.warn(
            'HeroSection: Failed to fetch hero data from Sanity; using default fallback content.'
          )
          setHeroData(defaultHeroData)
        })
    }

    fetchHero()

    // Refresh data when window regains focus (helps catch updates)
    const handleFocus = () => {
      fetchHero()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <section
      id="hero"
      className="hero-section relative flex min-h-screen w-full items-center justify-center text-center"
      style={{
        marginTop: 0,
        paddingTop: 0,
        position: 'relative',
        top: 0,
        background: 'transparent',
      }}
    >
      <div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        style={{ marginTop: '140px' }}
      >
        <motion.h1
          className="hero-3d-text"
          data-text={heroData.headline}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          {(() => {
            const headline = heroData.headline
            if (!headline || typeof headline !== 'string') {
              return headline || ''
            }

            // Match "Since" and "1963" separately
            const match = headline.match(/(.*?)\s*(since)\s+(1963)(.*)/i)

            if (match) {
              return (
                <>
                  {match[1]} <span className="hero-since">{match[2]}</span>
                  <span className="hero-1963" style={{ color: yearColor }}>
                    {match[3]}
                  </span>
                  {match[4]}
                </>
              )
            }

            return headline
          })()}
        </motion.h1>

        <motion.p
          className="mx-auto max-w-2xl text-lg text-white md:text-xl"
          style={{ marginBottom: '0px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {heroData.subtext}
        </motion.p>

        {/* CTA Buttons - show if either buttonText or secondButtonText is provided */}
        {((heroData.buttonText && heroData.buttonText.trim() !== '') ||
          (heroData.secondButtonText && heroData.secondButtonText.trim() !== '')) && (
          <motion.div
            className="mt-2 flex flex-col gap-4 sm:flex-row sm:justify-center"
            style={{ marginTop: '-20px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {heroData.buttonText && heroData.buttonText.trim() !== '' && (
              <button
                onClick={() => {
                  const sectionId = (heroData.buttonLink || '#contact').replace('#', '')
                  handleButtonClick(sectionId)
                }}
                className="hero-button-3d inline-block bg-black px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 cursor-pointer"
              >
                {heroData.buttonText}
              </button>
            )}
            {heroData.secondButtonText && heroData.secondButtonText.trim() !== '' && (
              <button
                onClick={() => {
                  const sectionId = (heroData.secondButtonLink || '#careers').replace('#', '')
                  console.warn(`[DEBUG] "${heroData.secondButtonText}" clicked → navigating to: ${sectionId}`)
                  handleButtonClick(sectionId)
                }}
                className="hero-button-3d inline-block bg-black px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 cursor-pointer"
              >
                {heroData.secondButtonText}
              </button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Loading Screen Overlay */}
      {showLoader && <LoadingScreen />}
    </section>
  )
}

export default memo(HeroSection)
