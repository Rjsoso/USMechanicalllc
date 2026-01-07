import { useEffect, useState, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'
import GradientText from './GradientText'

// Fallback hero data
const defaultHeroData = {
  headline: 'Building the Future of Mechanical Contracting',
  subtext: 'Excellence in Plumbing, HVAC, and Mechanical Systems since 1963.',
  buttonText: 'Request a Quote',
  buttonLink: '#contact',
  backgroundImage: null,
  logo: null,
}

function HeroSection() {
  const [heroData, setHeroData] = useState(defaultHeroData)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchHero = () => {
      // Simplified query matching the pattern used in ServicesSection (which works)
      // Try document with _id "heroSection" first, fallback to first document
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
            carouselImages[] {
              image {
                asset-> {
                  _id,
                  url
                }
              },
              "imageUrl": image.asset->url
            },
            logo {
              asset-> {
                _id,
                url
              }
            },
            headline,
            subtext,
            buttonText,
            buttonLink
          }`
        )
        .then(data => {
          // If document with specific ID not found, try first document
          if (!data || !data._id) {
            return client.fetch(
              `*[_type == "heroSection"][0]{
                _id,
                backgroundImage {
                  asset-> {
                    _id,
                    url
                  }
                },
                carouselImages[] {
                  image {
                    asset-> {
                      _id,
                      url
                    }
                  },
                  title,
                  description,
                  "imageUrl": image.asset->url
                },
                logo {
                  asset-> {
                    _id,
                    url
                  }
                },
                headline,
                subtext,
                buttonText,
                buttonLink
              }`
            )
          }
          return Promise.resolve(data);
        })
        .then(data => {
          if (data) {
            // Ensure buttonText and buttonLink are set with fallbacks
            const heroDataWithDefaults = {
              ...data,
              buttonText: (data.buttonText && typeof data.buttonText === 'string' && data.buttonText.trim() !== '') 
                ? data.buttonText 
                : defaultHeroData.buttonText,
              buttonLink: data.buttonLink || defaultHeroData.buttonLink,
            };
            
            setHeroData(heroDataWithDefaults)
            // Reset to first image when new data loads
            if (data.carouselImages && data.carouselImages.length > 0) {
              setCurrentImageIndex(0)
            }
          } else {
            // Use default data if Sanity returns null
            setHeroData(defaultHeroData)
          }
        })
        .catch(error => {
          console.error('Error fetching hero section:', error);
          // On error, use default data
          setHeroData(defaultHeroData)
        })
    };

    fetchHero();
    
    // Refresh data when window regains focus (helps catch updates)
    const handleFocus = () => {
      fetchHero();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [])

  // Auto-cycle through carousel images if available
  useEffect(() => {
    if (heroData.carouselImages && heroData.carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % heroData.carouselImages.length)
      }, 5000) // Change image every 5 seconds
      return () => clearInterval(interval)
    }
  }, [heroData.carouselImages])

  // Memoize logo URL to prevent recalculation
  const logoUrl = useMemo(() => {
    if (!heroData.logo || !urlFor(heroData.logo)) return null;
    return urlFor(heroData.logo).width(400).quality(90).auto('format').url();
  }, [heroData.logo]);

  return (
    <section
      id="hero"
      className="hero-section relative w-full h-screen flex items-center justify-center text-center"
      style={{
        marginTop: 0,
        paddingTop: 0,
        position: 'relative',
        top: 0,
      }}
    >
      {/* Background - extends to very top of viewport, covering header gap */}
      {/* Use carousel images if available, otherwise fall back to backgroundImage */}
      {heroData.carouselImages && Array.isArray(heroData.carouselImages) && heroData.carouselImages.length > 0 && heroData.carouselImages.some(img => img.imageUrl || img.image?.asset?.url) ? (
        <>
          {/* Only render current and next image for performance */}
          {heroData.carouselImages.map((item, index) => {
            const isCurrent = currentImageIndex === index;
            const isNext = currentImageIndex === (index - 1 + heroData.carouselImages.length) % heroData.carouselImages.length;
            
            // Only render current image and preload next one
            if (!isCurrent && !isNext) return null;
            
            const imageUrl = item.imageUrl || (item.image?.asset?.url);
            // Optimize image: use Sanity CDN with width/quality params if available
            const optimizedUrl = imageUrl 
              ? (imageUrl.includes('cdn.sanity.io') 
                  ? `${imageUrl}?w=1600&q=80&auto=format` 
                  : imageUrl)
              : undefined;
            
            return (
              <motion.div
                key={index}
                className="fixed bg-cover bg-center brightness-75"
                style={{
                  backgroundImage: optimizedUrl ? `url(${optimizedUrl})` : undefined,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '100vh',
                  width: '100%',
                  zIndex: isCurrent ? -2 : -3,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isCurrent ? 1 : 0 }}
                transition={{ duration: 1 }}
              ></motion.div>
            );
          })}
        </>
      ) : (
        <div
          className="fixed bg-cover bg-center brightness-75"
          style={{
            backgroundImage: heroData.backgroundImage?.asset?.url
              ? `url(${heroData.backgroundImage.asset.url}?w=1600&q=80&auto=format)`
              : heroData.backgroundImage && urlFor(heroData.backgroundImage)
              ? urlFor(heroData.backgroundImage).width(1600).quality(80).auto('format').url()
              : undefined,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100%',
            zIndex: -2,
          }}
        ></div>
      )}

      <div 
        className="fixed bg-gradient-to-b from-black/30 via-black/10 to-black/40"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          width: '100%',
          zIndex: -1,
        }}
      ></div>

      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center" style={{ marginTop: '80px' }}>
        {/* Logo */}
        {logoUrl && (
          <motion.img
            src={logoUrl}
            alt="US Mechanical Logo"
            className="mx-auto mb-6 w-52 md:w-64"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={e => {
              e.target.style.display = 'none'
            }}
          />
        )}

        <motion.h1
          className="hero-3d-text"
          data-text={heroData.headline}
          initial={{ opacity: 0, y: -300 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "tween",
            ease: [0.5, 0, 0.75, 0],
            duration: 0.4,
            delay: 0.3 
          }}
        >
          {(() => {
            const headline = heroData.headline;
            if (!headline || typeof headline !== 'string') {
              return headline || '';
            }
            
            // Match "Since" and "1963" separately
            const match = headline.match(/(.*?)\s*(since)\s+(1963)(.*)/i);
            
            if (match) {
              console.log('✨ Applying gradient to BIG headline 1963');
              return (
                <>
                  {match[1]}{' '}
                  <span className="hero-since">{match[2]}</span>
                  <GradientText>{match[3]}</GradientText>
                  {match[4]}
                </>
              );
            }
            
            return headline;
          })()}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {heroData.subtext}
        </motion.p>

        <motion.a
          href={heroData.buttonLink || '#contact'}
          className="hero-button-3d inline-block bg-black hover:bg-zinc-800 text-white font-semibold px-8 py-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          onClick={(e) => {
            // Handle smooth scroll if it's an anchor link
            const href = heroData.buttonLink || '#contact';
            if (href.startsWith('#')) {
              e.preventDefault();
              const element = document.querySelector(href);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }}
          data-button-text={heroData.buttonText || defaultHeroData.buttonText}
          >
          {heroData.buttonText || defaultHeroData.buttonText}
        </motion.a>
      </div>
    </section>
  )
}

export default memo(HeroSection)

