import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { client, urlFor } from '../utils/sanity'
import MetalTitle from './MetalTitle'

// Fallback hero data
const defaultHeroData = {
  headline: 'Building the Future of Mechanical Contracting',
  subtext: 'Excellence in Plumbing, HVAC, and Mechanical Systems since 1963.',
  buttonText: 'Request a Quote',
  buttonLink: '#contact',
  backgroundImage: null,
  logo: null,
}

export default function HeroSection() {
  const [heroData, setHeroData] = useState(defaultHeroData)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchHero = () => {
      client
        .fetch(
          `*[_type == "heroSection"][0]{
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
        .then(data => {
          if (data) {
            // Debug: log what we received
            console.log('Hero data received:', {
              hasBackgroundImage: !!data.backgroundImage,
              backgroundImageUrl: data.backgroundImage?.asset?.url,
              carouselImagesCount: data.carouselImages?.length || 0,
              carouselImages: data.carouselImages
            });
            
            setHeroData(data)
            // Reset to first image when new data loads
            if (data.carouselImages && data.carouselImages.length > 0) {
              setCurrentImageIndex(0)
            }
          } else {
            // Use default data if Sanity returns null
            setHeroData(defaultHeroData)
          }
          setLoading(false)
        })
        .catch(error => {
          // On error, use default data
          setHeroData(defaultHeroData)
          setLoading(false)
        })
    };

    fetchHero();

    // Refresh data when window regains focus
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
                  ? `${imageUrl}?w=1920&q=85&auto=format` 
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
              ? `url(${heroData.backgroundImage.asset.url}?w=1920&q=85&auto=format)`
              : heroData.backgroundImage && urlFor(heroData.backgroundImage)
              ? urlFor(heroData.backgroundImage).width(1920).quality(85).auto('format').url()
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

      <div className="relative z-10 px-6 max-w-4xl mx-auto text-center">
        {/* Logo */}
        {heroData.logo && urlFor(heroData.logo) && (
          <motion.img
            src={urlFor(heroData.logo).width(400).quality(90).auto('format').url()}
            alt="US Mechanical Logo"
            className="mx-auto mb-6 w-52 md:w-64"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            loading="eager"
            onError={e => {
              e.target.style.display = 'none'
            }}
          />
        )}

        {/* Metal Title - Replaces headline */}
        <MetalTitle />

        <motion.p
          className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          {heroData.subtext}
        </motion.p>

        <motion.a
          href={heroData.buttonLink || '#contact'}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          >
          {heroData.buttonText}
        </motion.a>
      </div>
    </section>
  )
}

