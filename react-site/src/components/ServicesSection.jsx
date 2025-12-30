import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { client } from '../utils/sanity';
import CardSwap, { Card } from './CardSwap';

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = () => {
      client
        .fetch(
          `*[_type == "ourServices"][0]{
            sectionTitle,
            descriptionText,
            servicesInfo[] {
              title,
              description,
              backgroundImage {
                asset-> {
                  _id,
                  url
                },
                alt
              },
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
            },
            services[] {
              title,
              description,
              "imageUrl": image.asset->url
            }
          }`
        )
        .then((data) => {
          setServicesData(data);
        })
        .catch((error) => {
          console.error('Error fetching services from Sanity:', error);
        });
    };

    fetchServices();
  }, []);

  // Emit scroll progress so downstream sections (e.g., CompanyStats) can reveal smoothly
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let frame = null;

    const updateProgress = () => {
      frame = null;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(
        1,
        Math.max(0, (viewport - rect.top) / (viewport + rect.height))
      );
      window.dispatchEvent(new CustomEvent('servicesProgress', { detail: progress }));
    };

    const handleScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, [servicesData]);

  const handleLearnMore = useCallback((service) => {
    if (service?.slug?.current) {
      navigate(`/services/${service.slug.current}`);
    }
  }, [navigate]);

  if (!servicesData) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="py-20 bg-gray-700 text-white text-center"
        style={{ zIndex: 15 }}
      >
        <p>Loading services...</p>
      </section>
    );
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="py-20 bg-gray-700 text-white"
        style={{ zIndex: 15 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="section-title text-5xl md:text-6xl text-center mb-12 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {servicesData.sectionTitle || 'Our Services'}
          </motion.h2>
          <p className="text-center text-gray-200">No services available.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gray-700 text-white relative"
      style={{
        zIndex: 15,
        marginBottom: '-180px',
        paddingBottom: '220px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          className="section-title text-5xl md:text-6xl text-center mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>
        <p className="text-gray-200 text-lg mb-8 text-left">
          {servicesData.descriptionText}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-12">
        {/* LEFT — DESCRIPTION TEXT + SERVICE BOXES (full-bleed to the left edge) */}
        <div className="flex-1 md:w-1/2 pr-6 md:pr-10">
          <div className="space-y-4">
            {servicesData.servicesInfo && servicesData.servicesInfo.map((box, index) => {
              const backgroundImageUrl = box.backgroundImage?.asset?.url
                ? `${box.backgroundImage.asset.url}?w=1200&q=80&auto=format`
                : null;

              const backgroundStyle = backgroundImageUrl
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url(${backgroundImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : undefined;

              return (
                <div
                  key={index}
                    className="p-8 bg-black shadow relative group overflow-hidden transform transition-transform duration-200 ease-out hover:scale-105 focus-within:scale-105 rounded-r-xl"
                  style={backgroundStyle}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">{box.title}</h3>
                  {box.description && (
                    <p className="text-sm text-gray-400 opacity-75 line-clamp-2 leading-relaxed mb-4">
                      {box.description}
                    </p>
                  )}
                  <button
                    onClick={() => handleLearnMore(box)}
                    className="absolute bottom-4 right-4 bg-transparent text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:-translate-y-1 transition-all"
                  >
                    Learn More
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — THE CARD SWAP */}
        <div
          className="w-full md:w-1/2 flex justify-center items-start relative mt-10 md:mt-20 mb-16 md:mb-24 px-6 md:px-0"
          style={{ minHeight: '450px' }}
        >
          {servicesData.services?.length > 0 ? (
            <div
              className="relative flex justify-center items-start"
              style={{ width: "650px", height: "500px", marginTop: "40px" }}
            >
              <CardSwap
                cardDistance={30}
                verticalDistance={40}
                width={650}
                height={500}
                delay={5000}
                pauseOnHover={true}
                skewAmount={0}
              >
                {servicesData.services.map((item, i) => {
                  const optimizedUrl = item.imageUrl?.includes('cdn.sanity.io')
                    ? `${item.imageUrl}?w=1300&q=85&auto=format`
                    : item.imageUrl;
                  
                  return (
                    <Card key={i} className="service-card">
                      <img
                        src={optimizedUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </Card>
                  );
                })}
              </CardSwap>
            </div>
          ) : (
            <p className="text-gray-300">No gallery images found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(ServicesSection);
