import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { client, urlFor } from '../utils/sanity';
import { PortableText } from '@portabletext/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

  const handleRequestQuote = () => {
    // Navigate to home page and scroll to contact section
    navigate('/#contact');
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const contactElement = document.querySelector('#contact');
      if (contactElement) {
        contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-700 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
            <p className="text-gray-300 mb-8">The service you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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
      <main className="bg-gray-700 text-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
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
            className="section-title text-5xl md:text-6xl mb-8 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {serviceData.title}
          </motion.h1>

          {/* Preview Description */}
          {serviceData.description && (
            <motion.p
              className="text-xl text-gray-300 mb-12 leading-relaxed"
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
              className="prose prose-invert prose-lg max-w-none mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PortableText value={serviceData.fullDescription} />
            </motion.div>
          )}

          {/* Images Gallery */}
          {serviceData.images && serviceData.images.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {serviceData.images.map((img, index) => {
                if (!img.asset) return null;
                const imageUrl = img.asset.url
                  ? `${img.asset.url}?w=800&q=85&auto=format`
                  : urlFor(img).width(800).quality(85).auto('format').url();
                
                return (
                  <div key={index} className="rounded-xl overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={img.alt || `${serviceData.title} image ${index + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p className="text-sm text-gray-400 mt-2 text-center">
                        {img.caption}
                      </p>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Features List */}
          {serviceData.features && serviceData.features.length > 0 && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-black border border-gray-600"
                  >
                    {feature.title && (
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                    )}
                    {feature.description && (
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Request a Quote Button */}
          <motion.div
            className="flex justify-center mt-16 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleRequestQuote}
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg"
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
