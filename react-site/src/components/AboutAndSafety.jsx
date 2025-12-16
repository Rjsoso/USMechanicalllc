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
              _ref,
              _type,
              url
            },
            alt,
            caption
          }
        }`)
      ])
        .then(([aboutData]) => {
          console.log('=== AboutAndSafety Data Fetched ===');
          console.log('Full data object:', aboutData);
          console.log('Safety images array:', aboutData?.safetyImages);
          console.log('Safety images count:', aboutData?.safetyImages?.length || 0);
          
          if (aboutData?.safetyImages && aboutData.safetyImages.length > 0) {
            console.log('Safety images details:');
            aboutData.safetyImages.forEach((img, idx) => {
              console.log(`  Image ${idx + 1}:`, {
                hasAsset: !!img?.asset,
                assetId: img?.asset?._id,
                assetRef: img?.asset?._ref,
                assetUrl: img?.asset?.url,
                alt: img?.alt,
                caption: img?.caption
              });
            });
          } else {
            console.warn('⚠️ No safety images found in Sanity data!');
            console.warn('Make sure you have published images in the "About & Safety Section" document in Sanity Studio.');
          }
          
          console.log('Photo1:', aboutData?.photo1);
          
          const mergedData = {
            ...defaultData,
            ...aboutData,
            safetyImages: aboutData?.safetyImages || [],
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{data.aboutTitle}</h2>
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
              <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
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
                    if (!img) {
                      console.warn(`Safety image ${index + 1} is null or undefined`);
                      return null;
                    }
                    
                    if (!img.asset) {
                      console.warn(`Safety image ${index + 1} is missing asset data:`, img);
                      return null;
                    }
                    
                    // Log the image structure for debugging
                    console.log(`Safety image ${index + 1} structure:`, {
                      hasAsset: !!img.asset,
                      assetType: img.asset?._type,
                      assetRef: img.asset?._ref,
                      assetId: img.asset?._id,
                      assetUrl: img.asset?.url,
                      fullImage: img
                    });
                    
                    // Build image URL - handle both expanded asset and urlFor
                    let imageUrl;
                    try {
                      // If asset is expanded with URL, use it directly with optimization
                      if (img.asset?.url) {
                        imageUrl = `${img.asset.url}?w=600&q=85&auto=format`;
                        console.log(`Safety image ${index + 1} URL from expanded asset:`, imageUrl);
                      } 
                      // Otherwise, use urlFor to generate URL from reference
                      else if (img.asset?._ref || img.asset?._id) {
                        const urlBuilder = urlFor(img);
                        if (!urlBuilder) {
                          console.error(`Safety image ${index + 1}: urlFor returned null/undefined`);
                          return null;
                        }
                        imageUrl = urlBuilder.width(600).quality(85).auto('format').url();
                        console.log(`Safety image ${index + 1} URL from urlFor:`, imageUrl);
                      } else {
                        console.error(`Safety image ${index + 1} has invalid asset structure. Asset:`, img.asset);
                        return null;
                      }
                      
                      if (!imageUrl) {
                        console.error(`Safety image ${index + 1} generated empty URL. Image object:`, JSON.stringify(img, null, 2));
                        return null;
                      }
                    } catch (error) {
                      console.error(`Error generating URL for safety image ${index + 1}:`, error);
                      console.error('Error details:', error.message, error.stack);
                      console.error('Image object:', JSON.stringify(img, null, 2));
                      return null;
                    }
                    
                    return (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          className="safety-photo"
                          alt={img?.alt || `Safety image ${index + 1}`}
                          loading="lazy"
                          style={{ height: 'auto', minHeight: '200px' }}
                          onError={(e) => {
                            console.error(`Failed to load safety image ${index + 1}:`, imageUrl);
                            console.error('Image object:', JSON.stringify(img, null, 2));
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
