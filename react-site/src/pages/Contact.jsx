import { useEffect, useState } from 'react';
import { client } from '../utils/sanity';
import { urlFor } from '../utils/sanity';
import { motion } from 'framer-motion';

export default function Contact() {
  const [contactData, setContactData] = useState(null);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        // Fetch contact data
        const contactQuery = `*[_type == "contact"][0]{
          ...,
          backgroundImage {
            asset-> {
              _id,
              url
            }
          }
        }`;
        const contactData = await client.fetch(contactQuery);
        setContactData(contactData);
        
        // Fetch hero background image as fallback
        const heroQuery = `*[_type == "heroSection"][0]{
          backgroundImage {
            asset-> {
              _id,
              url
            }
          },
          carouselImages[0] {
            image {
              asset-> {
                _id,
                url
              }
            },
            "imageUrl": image.asset->url
          }
        }`;
        const heroData = await client.fetch(heroQuery);
        
        // Use carousel image if available, otherwise use backgroundImage
        const heroImageUrl = heroData?.carouselImages?.imageUrl || 
                            heroData?.carouselImages?.image?.asset?.url ||
                            heroData?.backgroundImage?.asset?.url;
        setHeroBackgroundImage(heroImageUrl);
        
        if (!contactData) {
          setError('No contact page data found. Please create a Contact Page document in Sanity Studio.');
        }
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact page. Please check your Sanity connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-center text-lg text-white">Loading...</p>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-2xl px-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Contact Page Not Found</h1>
          <p className="text-gray-300 mb-4">{error || 'No contact page data found.'}</p>
          <p className="text-sm text-gray-400">
            Please create a "Contact Page" document in Sanity Studio at{' '}
            <a href="http://localhost:3333" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
              http://localhost:3333
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Determine which background image to use (contact's own or hero's as fallback)
  const backgroundImageUrl = contactData?.backgroundImage?.asset?.url || heroBackgroundImage;
  
  return (
    <section 
      id="contact"
      className="relative py-20 px-6 w-full"
      style={{
        backgroundColor: 'transparent',
        minHeight: '100vh',
      }}
    >
      {/* Background Image - absolute position relative to section */}
      {backgroundImageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center brightness-75"
            style={{
              backgroundImage: `url(${backgroundImageUrl}?w=1920&q=85&auto=format)`,
              zIndex: 0,
              width: '100%',
            }}
          />
          {/* Dark overlay for readability */}
          <div 
            className="absolute inset-0 bg-black/60"
            style={{
              zIndex: 1,
              width: '100%',
            }}
          />
        </>
      )}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title text-4xl text-center mb-8 text-white"
        >
          {contactData.heroTitle || 'Contact Us'}
        </motion.h1>

        <p className="text-center text-gray-300 mb-12">{contactData.description}</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT SIDE — OFFICE INFO */}
          <div>
            {contactData.offices && contactData.offices.length > 0 ? (
              contactData.offices.map((office, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">{office.locationName}</h2>
                  <p className="text-white">{office.address}</p>
                  <p className="text-white">Phone: <span className="text-blue-300">{office.phone}</span></p>
                  {office.fax && <p className="text-white">Fax: {office.fax}</p>}
                </div>
              ))
            ) : (
              <p className="text-white">No office locations available.</p>
            )}

            {/* AFFILIATES */}
            {contactData.affiliates && contactData.affiliates.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Affiliate Companies</h2>
                {contactData.affiliates.map((affiliate, i) => (
                  <div key={i} className="mb-6">
                    {affiliate.logo && urlFor(affiliate.logo) && (
                      <img
                        src={urlFor(affiliate.logo).width(200).url()}
                        alt={affiliate.name}
                        className="h-12 mb-2 object-contain"
                      />
                    )}
                    <p className="font-semibold text-white">{affiliate.name}</p>
                    {affiliate.description && <p className="text-gray-300">{affiliate.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              {contactData.formSettings?.headline || 'Send Us a Message'}
            </h3>
            <form
              action="https://formspree.io/f/xgvrvody"
              method="POST"
              className="flex flex-col space-y-4"
            >
              <input type="text" name="name" placeholder="Name" required className="border border-white/30 bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50" />
              <input type="email" name="email" placeholder="Email" required className="border border-white/30 bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50" />
              <input type="tel" name="phone" placeholder="Phone" className="border border-white/30 bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50" />
              <textarea name="message" placeholder="Message" required className="border border-white/30 bg-white/10 text-white placeholder-white/70 p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-white/50" />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

