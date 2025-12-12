import { useEffect, useState } from 'react'
import { client } from '../utils/sanity'
import { urlFor } from '../utils/sanity'
import { PortableText } from '@portabletext/react'
import FadeInWhenVisible from './FadeInWhenVisible'

export default function AboutAndSafety() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
    safetyImages: [],
  }

  // Fetch all content from Sanity (text and images)
  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        client.fetch(`*[_type == "aboutAndSafety"][0]{
          aboutTitle,
          aboutText,
          photo1 {
            asset-> {
              _id,
              url
            },
            alt
          },
          safetyTitle,
          safetyText,
          safetyImages[] {
            asset-> {
              _id,
              url
            },
            alt,
            caption
          }
        }`)
      ])
        .then(([aboutData]) => {
          console.log('AboutAndSafety data fetched from Sanity:', aboutData);
          console.log('Safety images:', aboutData?.safetyImages);
          console.log('Photo1:', aboutData?.photo1);
          
          const mergedData = {
            ...defaultData,
            ...aboutData,
            safetyImages: aboutData?.safetyImages || [],
          }
          setData(mergedData)
          setLoading(false)
        })
        .catch(() => {
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

  if (loading || !data) {
    return (
      <div className="text-center py-20 text-gray-200 bg-gray-700">Loading content...</div>
    )
  }

  return (
    <section className="py-20 text-white bg-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        {/* ABOUT SECTION - Image + Text Horizontal (side-by-side on desktop, stacked on mobile) */}
        {/* All content (text and images) comes from Sanity CMS */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-20">
          {/* Image on left, text on right (or reverse on mobile) */}
          {data.photo1 && data.photo1.asset && (
            <div className="md:w-1/2 order-2 md:order-1">
          <FadeInWhenVisible>
                <img
                  src={data.photo1.asset.url ? `${data.photo1.asset.url}?w=600&q=85&auto=format` : urlFor(data.photo1).width(600).url()}
                  alt={data.photo1.alt || "About US Mechanical"}
                  className="rounded-2xl shadow-lg w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load about photo:', data.photo1);
                    e.target.style.display = 'none';
                  }}
                />
          </FadeInWhenVisible>
            </div>
          )}

          <div className={`${data.photo1 ? 'md:w-1/2' : 'w-full'} order-1 md:order-2`}>
          <FadeInWhenVisible delay={0.1}>
              <h2 className="section-title text-5xl md:text-6xl mb-4 text-white">{data.aboutTitle}</h2>
            </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.2}>
              <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-line">
              {data.aboutText}
            </p>
          </FadeInWhenVisible>
          </div>
        </div>

        {/* SAFETY SECTION - Text + Image Horizontal (reversed layout, side-by-side on desktop, stacked on mobile) */}
        {/* All content (text and images) comes from Sanity CMS */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text on left, image on right */}
          <div className={`${data.safetyImages && data.safetyImages.length > 0 ? 'md:w-1/2' : 'w-full'}`}>
            <FadeInWhenVisible delay={0.3}>
              <h3 className="section-title text-5xl md:text-6xl mb-4 text-white">
              {data.safetyTitle}
            </h3>
          </FadeInWhenVisible>
            <FadeInWhenVisible delay={0.4}>
              <div className="text-lg text-gray-300 leading-relaxed">
                {Array.isArray(data.safetyText) ? (
                  <PortableText value={data.safetyText} />
                ) : (
                  <p className="whitespace-pre-line">{data.safetyText}</p>
                )}
              </div>
          </FadeInWhenVisible>
          </div>

          {data.safetyImages && data.safetyImages.length > 0 && (
            <div className="md:w-1/2">
              <FadeInWhenVisible delay={0.5}>
                <div className="safety-images-grid">
                  {data.safetyImages.map((img, index) => {
                    // Check if image has valid asset data
                    if (!img || !img.asset) {
                      console.warn(`Safety image ${index + 1} is missing asset data:`, img);
                      return null;
                    }
                    
                    // Build image URL - handle both expanded asset and reference
                    let imageUrl;
                    try {
                      if (img.asset.url) {
                        // If asset is expanded with URL, use it directly with optimization
                        imageUrl = `${img.asset.url}?w=600&q=85&auto=format`;
                      } else if (img.asset._id || img.asset._ref) {
                        // If asset is a reference, use urlFor
                        imageUrl = urlFor(img).width(600).quality(85).auto('format').url();
                      } else {
                        console.warn(`Safety image ${index + 1} has invalid asset structure:`, img);
                        return null;
                      }
                    } catch (error) {
                      console.error(`Error generating URL for safety image ${index + 1}:`, error, img);
                      return null;
                    }
                    
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          className="safety-photo"
                          alt={img?.alt || `Safety image ${index + 1}`}
                          loading="lazy"
                          onError={(e) => {
                            console.error(`Failed to load safety image ${index + 1}:`, imageUrl);
                            e.target.style.display = 'none';
                          }}
                        />
                        {img?.caption && (
                          <p className="text-sm text-gray-400 mt-2 text-center">{img.caption}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FadeInWhenVisible>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
