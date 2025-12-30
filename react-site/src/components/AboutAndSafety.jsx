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
  const safetySectionRef = useRef(null)
  const [safetySlide, setSafetySlide] = useState(0)

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
    const fetchData = () => {
      // First, comprehensive diagnostic query to see raw structure
      Promise.all([
        // Check all documents (including drafts)
        client.fetch(`*[_type == "aboutAndSafety"]{
          _id,
          _rev,
          safetyImage,
          "safetyImageExpanded": safetyImage {
            asset-> {
              _id,
              _type,
              url,
              originalFilename
            },
            alt,
            caption
          }
        }`),
        // Check raw safetyImage without expansion
        client.fetch(`*[_type == "aboutAndSafety"][0]{
          _id,
          safetyImage,
          "safetyImageRaw": safetyImage
        }`),
        // Check if image exists as a reference
        client.fetch(`*[_type == "aboutAndSafety"][0]{
          _id,
          safetyImage {
            asset-> {
              _id,
              _type,
              url,
              originalFilename,
              size,
              mimeType
            },
            alt,
            caption,
            "hasAsset": defined(asset)
          }
        }`)
      ])
        .then(([allDocs, rawData, expandedData]) => {
          console.log('=== COMPREHENSIVE DIAGNOSTIC QUERY ===');
          console.log('Total documents found:', allDocs?.length);
          console.log('All documents:', JSON.stringify(allDocs, null, 2));
          console.log('---');
          console.log('Raw data (no expansion):', JSON.stringify(rawData, null, 2));
          console.log('---');
          console.log('Expanded data:', JSON.stringify(expandedData, null, 2));
          console.log('---');
          console.log('Raw safetyImage value:', rawData?.safetyImage);
          console.log('Raw safetyImage type:', typeof rawData?.safetyImage);
          console.log('Expanded safetyImage:', expandedData?.safetyImage);
          console.log('Has asset in expanded?', !!expandedData?.safetyImage?.asset);
          if (expandedData?.safetyImage?.asset) {
            console.log('Asset details:', {
              id: expandedData.safetyImage.asset._id,
              url: expandedData.safetyImage.asset.url,
              type: expandedData.safetyImage.asset._type,
              filename: expandedData.safetyImage.asset.originalFilename
            });
          }
        })
        .catch(err => {
          console.error('❌ Diagnostic query error:', err);
          console.error('Error details:', err.message, err.stack);
        });
      
      // Main query with proper asset expansion
      // Query for document with safetyImage first, or fallback to document with _id "aboutAndSafety", or first document
      Promise.resolve()
        .then(() => {
          // First try: Get document that has safetyImage
          return client.fetch(`*[_type == "aboutAndSafety" && defined(safetyImage) && safetyImage != null] | order(_updatedAt desc)[0]{
            _id,
            _rev,
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
                originalFilename,
                size,
                mimeType
              },
              alt,
              caption
            },
            safetyImage2 {
              asset-> {
                _id,
                url,
                originalFilename,
                size,
                mimeType
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
                alt
              },
              icon,
              title,
              href
            },
            "safetyImageExists": defined(safetyImage),
            "safetyImageHasAsset": defined(safetyImage.asset)
          }`)
        })
        .then(data => {
          // If found document with safetyImage, use it
          if (data && data.safetyImage) {
            console.log('✅ Found document with safetyImage:', data._id);
            return Promise.resolve(data);
          }
          // Second try: Get document with specific ID "aboutAndSafety"
          console.log('⚠️ No document with safetyImage found, trying _id "aboutAndSafety"');
          return client.fetch(`*[_type == "aboutAndSafety" && _id == "aboutAndSafety"][0]{
            _id,
            _rev,
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
                originalFilename,
                size,
                mimeType
              },
              alt,
              caption
            },
            safetyImage2 {
              asset-> {
                _id,
                url,
                originalFilename,
                size,
                mimeType
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
                alt
              },
              icon,
              title,
              href
            },
            "safetyImageExists": defined(safetyImage),
            "safetyImageHasAsset": defined(safetyImage.asset)
          }`)
        })
        .then(data => {
          // If found document with specific ID, use it
          if (data) {
            console.log('✅ Found document with _id "aboutAndSafety":', data._id);
            return Promise.resolve(data);
          }
          // Final fallback: Get first document
          console.log('⚠️ Document with _id "aboutAndSafety" not found, using first document');
          return client.fetch(`*[_type == "aboutAndSafety"][0]{
            _id,
            _rev,
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
                originalFilename,
                size,
                mimeType
              },
              alt,
              caption
            },
            safetyImage2 {
              asset-> {
                _id,
                url,
                originalFilename,
                size,
                mimeType
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
                alt
              },
              icon,
              title,
              href
            },
            "safetyImageExists": defined(safetyImage),
            "safetyImageHasAsset": defined(safetyImage.asset)
          }`)
        })
        .then((aboutData) => {
          console.log('=== AboutAndSafety Data Fetched ===');
          
          // Check if document exists
          if (!aboutData) {
            console.error('❌ No "About & Safety Section" document found in Sanity!');
            console.error('Please create a document in Sanity Studio:');
            console.error('1. Go to Sanity Studio');
            console.error('2. Create "About & Safety Section" document');
            console.error('3. Add content and publish');
            setData(defaultData);
            setLoading(false);
            return;
          }
          
          console.log('=== FULL DATA OBJECT ===');
          console.log(JSON.stringify(aboutData, null, 2));
          console.log('Document ID:', aboutData?._id);
          console.log('Document revision:', aboutData?._rev);
          console.log('Safety image exists check:', aboutData?.safetyImageExists);
          console.log('Safety image has asset check:', aboutData?.safetyImageHasAsset);
          console.log('Safety image:', aboutData?.safetyImage);
          console.log('Safety image type:', typeof aboutData?.safetyImage);
          
          // Handle single image (not array)
          // Check if safetyImage exists and has valid asset data
          let safetyImage = aboutData?.safetyImage || null;
          
          // Check for various edge cases
          if (safetyImage) {
            console.log('🔍 Analyzing safetyImage structure...');
            console.log('safetyImage keys:', Object.keys(safetyImage));
            console.log('safetyImage.asset:', safetyImage.asset);
            console.log('safetyImage.asset type:', typeof safetyImage.asset);
            
            // If safetyImage exists but asset is missing or invalid
            if (!safetyImage.asset) {
              console.error('❌ safetyImage object exists but has NO asset property');
              console.error('This usually means:');
              console.error('1. Image was uploaded but document was not saved/published');
              console.error('2. Image reference is broken or incomplete');
              console.error('3. Image needs to be re-uploaded in Sanity Studio');
              safetyImage = null;
            } else if (!safetyImage.asset.url && !safetyImage.asset._id) {
              console.error('❌ safetyImage.asset exists but has no URL or ID');
              console.error('Asset structure:', JSON.stringify(safetyImage.asset, null, 2));
              safetyImage = null;
            } else {
              console.log('✅ safetyImage has valid asset structure');
            }
          }
          
          console.log('=== PROCESSED SAFETY IMAGE ===');
          console.log('Safety image:', safetyImage);
          console.log('Has image?', !!safetyImage);
          console.log('Has asset?', !!safetyImage?.asset);
          console.log('Has asset URL?', !!safetyImage?.asset?.url);
          console.log('Has asset ID?', !!safetyImage?.asset?._id);
          
          if (!safetyImage || !safetyImage.asset) {
            console.warn('⚠️ ===== SAFETY IMAGE DIAGNOSIS =====');
            if (aboutData?.safetyImage === null || !aboutData?.safetyImage) {
              console.warn('⚠️ safetyImage field is NULL or missing in Sanity');
              console.warn('Possible causes:');
              console.warn('  - Image was never uploaded');
              console.warn('  - Image was uploaded but document was not saved');
              console.warn('  - Image was uploaded to wrong document');
            } else if (aboutData?.safetyImage && !aboutData.safetyImage.asset) {
              console.warn('⚠️ safetyImage object exists but has NO asset property');
              console.warn('This indicates the image upload did not complete properly.');
              console.warn('Possible causes:');
              console.warn('  - Image upload was interrupted');
              console.warn('  - Document was saved before image finished uploading');
              console.warn('  - Image reference is broken');
              console.warn('SOLUTION: Delete the image field and re-upload the image');
            }
            console.warn('');
            console.warn('📝 Step-by-step fix:');
            console.warn('1. Go to: https://sanity-henna.vercel.app/structure');
            console.warn('2. Open "About & Safety Section" document (ID: ' + aboutData?._id + ')');
            console.warn('3. Scroll to "Safety Photo" field');
            console.warn('4. If there\'s already an image there, DELETE it first');
            console.warn('5. Click to upload a NEW image');
            console.warn('6. Wait for upload to complete (you should see the image preview)');
            console.warn('7. Fill in "Alternative Text" field');
            console.warn('8. Click "Publish" button (top right, NOT "Save Draft")');
            console.warn('9. Wait for Vercel deployment to complete');
            console.warn('10. Hard refresh this page (Cmd+Shift+R or Ctrl+Shift+R)');
            console.warn('⚠️ ====================================');
          } else {
            console.log('✅ Found safety image');
            console.log('=== Safety Image Details ===');
            console.log('Full image object:', JSON.stringify(safetyImage, null, 2));
            console.log('Has asset?', !!safetyImage?.asset);
            console.log('Asset object:', safetyImage?.asset);
            console.log('Asset ID:', safetyImage?.asset?._id);
            console.log('Asset URL:', safetyImage?.asset?.url);
            console.log('Alt text:', safetyImage?.alt);
            console.log('Caption:', safetyImage?.caption);
          }
          
          console.log('Photo1:', aboutData?.photo1);
          
          const mergedData = {
            ...defaultData,
            ...aboutData,
            safetyImage: safetyImage,
          }
          setData(mergedData)
          setLoading(false)
        })
        .catch((error) => {
          console.error('❌ Error fetching AboutAndSafety data:', error);
          console.error('Error details:', error.message, error.stack);
          // On error, use default data
          setData(defaultData)
          setLoading(false)
        })
    };

    fetchData();

    // Refresh data when window regains focus
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [])

  // Use default data if still loading after a short delay (handles case where Sanity returns null)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (!data) {
          setData(defaultData)
          setLoading(false)
        }
      }, 2000) // Wait 2 seconds for Sanity fetch
      return () => clearTimeout(timer)
    }
  }, [loading, data])

  // Map aboutPhotos to carousel items format
  const carouselItems = useMemo(() => {
    if (!data?.aboutPhotos || !Array.isArray(data.aboutPhotos) || data.aboutPhotos.length === 0) {
      // Fallback to photo1 if aboutPhotos is empty
      if (data?.photo1 && data.photo1.asset) {
        const imageUrl = data.photo1.asset.url 
          ? `${data.photo1.asset.url}?w=800&q=85&auto=format`
          : urlFor(data.photo1).width(800).quality(85).auto('format').url();
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
        ? `${photo.asset.url}?w=1400&q=92&auto=format`
        : urlFor(photo).width(1400).quality(92).auto('format').url();
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
          ? `${data.safetyImage.asset.url}?w=200&q=85&auto=format`
          : urlFor(data.safetyImage).width(200).quality(85).auto('format').url();
        fallbackItems.push({
          src: imageUrl,
          alt: data.safetyImage.alt || 'Safety image',
          title: data.safetyImage.caption || 'Safety image',
          href: undefined
        });
      }
      if (data?.safetyImage2 && data.safetyImage2.asset) {
        const imageUrl = data.safetyImage2.asset.url
          ? `${data.safetyImage2.asset.url}?w=200&q=85&auto=format`
          : urlFor(data.safetyImage2).width(200).quality(85).auto('format').url();
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
          ? `${item.image.asset.url}?w=200&q=85&auto=format`
          : urlFor(item.image).width(200).quality(85).auto('format').url();
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

  // Bidirectional slide for Safety section linked to scroll (covers and reveals stats)
  useEffect(() => {
    if (loading) return
    const node = safetySectionRef.current
    if (!node) return

    let ticking = false

    const updateSlide = () => {
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const start = viewport * 0.9   // begin lifting when top is near bottom
      const end = viewport * 0.35    // finish lift by mid-section
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const slide = -220 * progress
      setSafetySlide(slide)
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(updateSlide)
      }
    }

    updateSlide()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [loading])

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
        ref={safetySectionRef}
        className="py-20 bg-white text-gray-900 relative z-10 -mt-10"
        style={{
          transform: `translateY(${safetySlide}px)`,
          transition: 'transform 120ms linear, opacity 200ms ease',
          opacity: 1 - 0.06 * Math.min(1, Math.abs(safetySlide) / 220),
          willChange: 'transform, opacity'
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
