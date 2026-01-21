import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../utils/sanity';
import { PortableText } from '@portabletext/react';
import { navigateAndScroll } from '../utils/scrollToSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import FadeInWhenVisible from '../components/FadeInWhenVisible';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        // Fetch the ourServices document and find the service with matching slug
        const data = await client.fetch(
          `*[_type == "ourServices"][0]{
            servicesInfo[] {
              title,
              description,
              slug {
                current
              },
              fullDescription,
              images[] {
                asset-> {
                  _id,
                  url
                },
                alt,
                caption
              },
              features[] {
                title,
                description
              }
            }
          }`
        );

        if (!data || !data.servicesInfo) {
          setError('Service not found');
          setLoading(false);
          return;
        }

        // Find the service with matching slug
        const service = data.servicesInfo.find(
          (s) => s.slug?.current === slug
        );

        if (!service) {
          setError('Service not found');
          setLoading(false);
          return;
        }

        setServiceData(service);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleRequestQuote = () => {
    navigateAndScroll('contact', navigate);
  };

  // Map images to carousel items format (exact same as AboutAndSafety)
  const carouselItems = useMemo(() => {
    if (!serviceData?.images || !Array.isArray(serviceData.images) || serviceData.images.length === 0) {
      return [];
    }
    
    return serviceData.images.map((photo, index) => {
      if (!photo || !photo.asset) return null;
      const imageUrl = photo.asset.url
        ? `${photo.asset.url}?w=800&q=85&auto=format`
        : urlFor(photo).width(800).quality(85).auto('format').url();
      return {
        id: `service-photo-${index}`,
        src: imageUrl,
        alt: photo.alt || `${serviceData.title} ${index + 1}`,
        caption: photo.caption || null
      };
    }).filter(Boolean);
  }, [serviceData?.images, serviceData?.title]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <p>Loading service...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !serviceData) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-black flex items-center justify-center" style={{ paddingTop: '180px' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-black mb-8">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white text-black min-h-screen" style={{ paddingTop: '180px' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Back Button */}
          <button
            onClick={() => navigateAndScroll('services', navigate)}
            className="mb-8 text-black hover:text-gray-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Services
          </button>

          {/* Service Title */}
          <motion.h1
            className="section-title text-5xl md:text-6xl mb-8 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {serviceData.title}
          </motion.h1>

          {/* Preview Description */}
          {serviceData.description && (
            <motion.p
              className="text-xl text-black mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {serviceData.description}
            </motion.p>
          )}

          {/* Full Description (Rich Text) */}
          {serviceData.fullDescription && serviceData.fullDescription.length > 0 && (
            <motion.div
              className="prose prose-lg max-w-none mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PortableText value={serviceData.fullDescription} />
            </motion.div>
          )}

          {/* Images Carousel and Features Side by Side */}
          {(serviceData.images && serviceData.images.length > 0) || (serviceData.features && serviceData.features.length > 0) ? (
            <motion.div
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Carousel on left, features on right (or reverse on mobile) */}
              {carouselItems.length > 0 && (
                <div className="md:w-1/2 w-full order-2 md:order-1 flex justify-center">
                  <FadeInWhenVisible>
                    <Carousel
                      items={carouselItems}
                      baseWidth={550}
                      containerClassName="h-[500px]"
                      autoplay={true}
                      autoplayDelay={4000}
                      pauseOnHover={true}
                      loop={true}
                      round={false}
                    />
                  </FadeInWhenVisible>
                </div>
              )}

              {/* Features List on Right */}
              {serviceData.features && serviceData.features.length > 0 && (
                <div className={`${carouselItems.length > 0 ? 'md:w-1/2' : 'w-full'} order-1 md:order-2`}>
                  <FadeInWhenVisible delay={0.1}>
                    <h2 className="text-3xl font-bold mb-6 text-black">Key Features</h2>
                  </FadeInWhenVisible>
                  <FadeInWhenVisible delay={0.2}>
                    <div className="space-y-4">
                      {serviceData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="p-6 rounded-xl bg-white border border-gray-300"
                        >
                          {feature.title && (
                            <h3 className="text-xl font-semibold text-black mb-2">
                              {feature.title}
                            </h3>
                          )}
                          {feature.description && (
                            <p className="text-black leading-relaxed">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </FadeInWhenVisible>
                </div>
              )}
            </motion.div>
          ) : null}

          {/* Request a Quote Button */}
          <motion.div
            className="flex justify-center mt-16 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleRequestQuote}
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Request a Quote
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
