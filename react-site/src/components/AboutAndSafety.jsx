import { useEffect, useState, useMemo, useRef } from 'react'
import { client } from '../utils/sanity'
import { urlFor } from '../utils/sanity'
import { PortableText } from '@portabletext/react'
import FadeInWhenVisible from './FadeInWhenVisible'
import Carousel from './Carousel'
import LogoLoop from './LogoLoop'

export default function AboutAndSafety() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoopsHovered, setIsLoopsHovered] = useState(false)

  // Default content fallback
  const defaultData = {
    aboutTitle: 'About U.S. Mechanical',
    aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.`,
    safetyTitle: 'Safety & Risk Management',
    safetyText: `U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.`,
    photo1: null,
    safetyImage: null,
  }

  // Fetch all content from Sanity (text and images)
  useEffect(() => {
    let isCancelled = false

    const fetchData = async () => {
      try {
        const aboutData = await client.fetch(
          `*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
            aboutTitle,
            aboutText,
            aboutPhotos[] {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
            photo1 {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt
            },
            safetyTitle,
            safetyText,
            safetyImage {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
            safetyImage2 {
              asset-> {
                _id,
                url,
                originalFilename
              },
              alt,
              caption
            },
            safetyLogos[] {
              image {
                asset-> {
                  _id,
                  url,
                  originalFilename
                },
                alt,
                caption
              },
              icon,
              title,
              href
            }
          }`
        )

        if (isCancelled) return

        if (!aboutData) {
          setData(defaultData)
        } else {
          setData({ ...defaultData, ...aboutData })
        }
      } catch (error) {
        if (!isCancelled) {
          setData(defaultData)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isCancelled = true
    }
  }, [])

  // Map aboutPhotos to carousel items format
  const carouselItems = useMemo(() => {
    if (!data?.aboutPhotos || !Array.isArray(data.aboutPhotos) || data.aboutPhotos.length === 0) {
      // Fallback to photo1 if aboutPhotos is empty
      if (data?.photo1 && data.photo1.asset) {
        const imageUrl = data.photo1.asset.url 
          ? `${data.photo1.asset.url}?w=1000&q=82&auto=format`
          : urlFor(data.photo1).width(1000).quality(82).auto('format').url();
        return [{
          id: 'photo1',
          src: imageUrl,
          alt: data.photo1.alt || "About US Mechanical",
          caption: null
        }];
      }
      return [];
    }
    
    return data.aboutPhotos.map((photo, index) => {
      if (!photo || !photo.asset) return null;
      const imageUrl = photo.asset.url
        ? `${photo.asset.url}?w=1200&q=82&auto=format`
        : urlFor(photo).width(1200).quality(82).auto('format').url();
      return {
        id: `about-photo-${index}`,
        src: imageUrl,
        alt: photo.alt || `About US Mechanical ${index + 1}`,
        caption: photo.caption || null
      };
    }).filter(Boolean);
  }, [data?.aboutPhotos, data?.photo1]);

  // Transform safetyLogos to LogoLoop format
  const safetyLogoItems = useMemo(() => {
    if (!data?.safetyLogos || !Array.isArray(data.safetyLogos) || data.safetyLogos.length === 0) {
      // Fallback to safetyImage and safetyImage2 if safetyLogos is empty
      const fallbackItems = [];
      if (data?.safetyImage && data.safetyImage.asset) {
        const imageUrl = data.safetyImage.asset.url
          ? `${data.safetyImage.asset.url}?w=200&q=80&auto=format`
          : urlFor(data.safetyImage).width(200).quality(80).auto('format').url();
        fallbackItems.push({
          src: imageUrl,
          alt: data.safetyImage.alt || 'Safety image',
          title: data.safetyImage.caption || 'Safety image',
          href: undefined
        });
      }
      if (data?.safetyImage2 && data.safetyImage2.asset) {
        const imageUrl = data.safetyImage2.asset.url
          ? `${data.safetyImage2.asset.url}?w=200&q=80&auto=format`
          : urlFor(data.safetyImage2).width(200).quality(80).auto('format').url();
        fallbackItems.push({
          src: imageUrl,
          alt: data.safetyImage2.alt || 'Safety image 2',
          title: data.safetyImage2.caption || 'Safety image 2',
          href: undefined
        });
      }
      return fallbackItems;
    }

    return data.safetyLogos.map((item, index) => {
      if (!item) return null;
      
      // Handle image-based items
      if (item.image && item.image.asset) {
        const imageUrl = item.image.asset.url
          ? `${item.image.asset.url}?w=200&q=80&auto=format`
          : urlFor(item.image).width(200).quality(80).auto('format').url();
        return {
          src: imageUrl,
          alt: item.image.alt || item.title || `Safety logo ${index + 1}`,
          title: item.title || item.image.alt || `Safety logo ${index + 1}`,
          href: item.href || undefined
        };
      }
      
      // Handle icon-based items (for future use with react-icons)
      // For now, skip icon items if no image is provided
      // This can be extended later to support icon components
      return null;
    }).filter(Boolean);
  }, [data?.safetyLogos, data?.safetyImage, data?.safetyImage2]);


  if (loading || !data) {
    return (
      <div className="text-center py-20 text-gray-200 bg-gray-700">Loading content...</div>
    )
  }

  return (
    <>
      <section id="about" className="py-20 text-white bg-gray-700 relative z-0">
        <div className="max-w-7xl mx-auto px-6">
          {/* ABOUT SECTION - Full-width carousel with overlay text */}
          {carouselItems.length > 0 && (
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden mb-20">
              <div className="h-[420px] md:h-[520px] lg:h-[620px]">
                <Carousel
                  items={carouselItems}
                  baseWidth={1100}
                  autoplay={true}
                  autoplayDelay={4000}
                  pauseOnHover={true}
                  loop={true}
                  round={false}
                />
              </div>
            <div className="absolute inset-0 flex items-center">
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent pointer-events-none"></div>
              
              <div className="w-full relative z-10">
                <div className="w-full px-6">
                  <div className="space-y-4 md:space-y-6 max-w-3xl text-right relative" style={{ marginLeft: 'auto', marginRight: '3%' }}>
                    {/* Backdrop blur container */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg -m-4 pointer-events-none"></div>
                    
                    <div className="relative z-10 px-4 py-2">
                      <FadeInWhenVisible delay={0.1}>
                        <h2 className="section-title text-5xl md:text-6xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                          {data.aboutTitle}
                        </h2>
                      </FadeInWhenVisible>
                      <FadeInWhenVisible delay={0.2}>
                        <p className="text-lg text-gray-100 leading-relaxed whitespace-pre-line drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                          {data.aboutText}
                        </p>
                      </FadeInWhenVisible>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </section>

      <section
        id="safety"
        className="py-20 bg-white text-gray-900 -mt-10"
        style={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* SAFETY SECTION - Text + LogoLoops Horizontal (reversed layout, side-by-side on desktop, stacked on mobile) */}
          {/* All content (text and logos) comes from Sanity CMS */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative">
            {/* Text on left */}
            <div className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'}`}>
              <FadeInWhenVisible delay={0.3}>
                <h3 className="section-title text-5xl md:text-6xl mb-4 text-gray-900">
                  {data.safetyTitle}
                </h3>
              </FadeInWhenVisible>
              <FadeInWhenVisible delay={0.4}>
                <div className="text-lg text-gray-700 leading-relaxed">
                  {Array.isArray(data.safetyText) ? (
                    <PortableText value={data.safetyText} />
                  ) : (
                    <p className="whitespace-pre-line">{data.safetyText}</p>
                  )}
                </div>
              </FadeInWhenVisible>
            </div>

            {/* LogoLoops on right - extends to page edge, centered vertically */}
            {safetyLogoItems.length > 0 && (
              <div className={`${safetyLogoItems.length > 0 ? 'md:w-1/2' : 'w-full'} relative flex items-center`}>
                <div
                  className="absolute right-0 md:right-[-24px] lg:right-[-48px] xl:right-[-96px] w-full md:w-[48vw] max-w-none overflow-hidden"
                  onMouseEnter={() => setIsLoopsHovered(true)}
                  onMouseLeave={() => setIsLoopsHovered(false)}
                >
                  <div className="space-y-8">
                    {/* Top loop - scrolls left */}
                    <div style={{ height: '160px', position: 'relative' }}>
                      <LogoLoop
                        logos={safetyLogoItems}
                        speed={120}
                        direction="left"
                        logoHeight={120}
                        gap={40}
                        fadeOut={true}
                        fadeOutColor="#ffffff"
                        hoverSpeed={20}
                        externalHoverState={isLoopsHovered}
                        scaleOnHover={true}
                        ariaLabel="Safety logos and certifications"
                      />
                    </div>
                    
                    {/* Bottom loop - scrolls right */}
                    <div style={{ height: '160px', position: 'relative' }}>
                      <LogoLoop
                        logos={safetyLogoItems}
                        speed={120}
                        direction="right"
                        logoHeight={120}
                        gap={40}
                        fadeOut={true}
                        fadeOutColor="#ffffff"
                        hoverSpeed={20}
                        externalHoverState={isLoopsHovered}
                        scaleOnHover={true}
                        ariaLabel="Safety logos and certifications"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
