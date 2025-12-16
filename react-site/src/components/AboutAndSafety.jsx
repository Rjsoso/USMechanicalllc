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
    safetyImage: null,
  }

  // Fetch all content from Sanity (text and images)
  useEffect(() => {
    const fetchData = () => {
      // First, test a direct query to see raw structure
      client.fetch(`*[_type == "aboutAndSafety"][0]{
        _id,
        safetyImage
      }`)
        .then(testData => {
          console.log('=== DIRECT TEST QUERY ===');
          console.log('Document ID:', testData?._id);
          console.log('Raw safetyImage:', testData?.safetyImage);
          console.log('safetyImage type:', typeof testData?.safetyImage);
        })
        .catch(err => console.error('Test query error:', err));
      
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
        safetyImage {
          asset-> {
            _id,
            url
          },
          alt,
          caption
        }
      }`)
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
          console.log('Safety image:', aboutData?.safetyImage);
          console.log('Safety image type:', typeof aboutData?.safetyImage);
          
          // Handle single image (not array)
          // Check if safetyImage exists and has valid asset data
          let safetyImage = aboutData?.safetyImage || null;
          
          // Validate that safetyImage has an asset
          if (safetyImage && (!safetyImage.asset || (!safetyImage.asset.url && !safetyImage.asset._id))) {
            console.warn('⚠️ safetyImage exists but has invalid asset structure:', safetyImage);
            safetyImage = null; // Treat as null if asset is invalid
          }
          
          console.log('=== PROCESSED SAFETY IMAGE ===');
          console.log('Safety image:', safetyImage);
          console.log('Has image?', !!safetyImage);
          console.log('Has asset?', !!safetyImage?.asset);
          console.log('Has asset URL?', !!safetyImage?.asset?.url);
          console.log('Has asset ID?', !!safetyImage?.asset?._id);
          
          if (!safetyImage || !safetyImage.asset) {
            if (aboutData?.safetyImage === null || !aboutData?.safetyImage) {
              console.warn('⚠️ safetyImage field is NULL or missing in Sanity (no image added yet)');
            } else if (aboutData?.safetyImage && !aboutData.safetyImage.asset) {
              console.warn('⚠️ safetyImage exists but has no asset - image may not be fully uploaded');
            }
            console.warn('📝 To add safety image:');
            console.warn('1. Go to: https://sanity-henna.vercel.app/structure');
            console.warn('2. Open "About & Safety Section" document');
            console.warn('3. Scroll to "Safety Photo" field');
            console.warn('4. Click to upload an image');
            console.warn('5. Fill in "Alternative Text"');
            console.warn('6. Click "Publish" button (top right, NOT "Save Draft")');
            console.warn('7. Wait for Vercel deployment to complete (check deployments page)');
            console.warn('8. Refresh this page after deployment completes');
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
          <div className={`${data.safetyImage && data.safetyImage.asset ? 'md:w-1/2' : 'w-full'}`}>
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

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-yellow-900 text-yellow-200 text-xs rounded">
              <strong>DEBUG:</strong> safetyImage: {data.safetyImage ? 'exists' : 'null'}, 
              Has asset: {data.safetyImage?.asset ? 'yes' : 'no'}
            </div>
          )}

          {data.safetyImage && data.safetyImage.asset ? (
            <div className="md:w-1/2">
              <FadeInWhenVisible delay={0.5}>
                <div className="relative">
                  {(() => {
                    const img = data.safetyImage;
                    console.log('=== RENDERING Safety Image ===');
                    console.log('Image object:', img);
                    
                    // Check if image has valid asset data
                    if (!img || !img.asset) {
                      console.warn('❌ Safety image is missing asset data:', img);
                      return null;
                    }
                    
                    // Log the image structure for debugging
                    console.log('Safety image structure:', {
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
                      // First, try to use urlFor - it handles most cases including references
                      if (img && (img.asset?._ref || img.asset?._id || img.asset?.url)) {
                        console.log('🔧 Using urlFor to generate image URL');
                        const urlBuilder = urlFor(img);
                        if (urlBuilder) {
                          imageUrl = urlBuilder.width(600).quality(85).auto('format').url();
                          console.log('✅ Safety image URL from urlFor:', imageUrl);
                        } else {
                          console.warn('⚠️ urlFor returned null, trying direct URL');
                        }
                      }
                      
                      // Fallback: If asset is expanded with URL, use it directly with optimization
                      if (!imageUrl && img.asset?.url) {
                        imageUrl = `${img.asset.url}?w=600&q=85&auto=format`;
                        console.log('✅ Safety image URL from expanded asset:', imageUrl);
                      }
                      
                      // If still no URL, there's an issue
                      if (!imageUrl) {
                        console.error('❌ Could not generate image URL. Image structure:', JSON.stringify(img, null, 2));
                        return null;
                      }
                      
                      if (!imageUrl) {
                        console.error('❌ Generated empty URL. Image object:', JSON.stringify(img, null, 2));
                        return null;
                      }
                      
                      console.log('✅ Rendering image with URL:', imageUrl);
                      
                      return (
                        <>
                          <img
                            src={imageUrl}
                            className="safety-photo"
                            alt={img?.alt || 'Safety image'}
                            loading="lazy"
                            style={{ height: 'auto', minHeight: '200px' }}
                            onLoad={() => {
                              console.log('✅ Safety image loaded successfully:', imageUrl);
                            }}
                            onError={(e) => {
                              console.error('❌ Failed to load safety image:', imageUrl);
                              console.error('Image object:', JSON.stringify(img, null, 2));
                              console.error('Error event:', e);
                              e.target.style.display = 'none';
                            }}
                          />
                          {img?.caption && (
                            <p className="text-sm text-gray-400 mt-2 text-center">{img.caption}</p>
                          )}
                        </>
                      );
                    } catch (error) {
                      console.error('❌ Error generating URL for safety image:', error);
                      console.error('Error details:', error.message, error.stack);
                      console.error('Image object:', JSON.stringify(img, null, 2));
                      return null;
                    }
                  })()}
                </div>
              </FadeInWhenVisible>
            </div>
          ) : (
            <div className="md:w-1/2">
              <div className="p-4 bg-gray-600 rounded text-center">
                <p className="text-gray-300">No safety image found.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Check console for details. Make sure image is published in Sanity Studio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
