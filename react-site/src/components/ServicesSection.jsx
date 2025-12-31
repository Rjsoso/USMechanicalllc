import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { client } from '../utils/sanity';
import CardSwap, { Card } from './CardSwap';

const ServicesSection = () => {
  const [servicesData, setServicesData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = () => {
      client
        .fetch(
          `*[_type == "ourServices"][0]{
            sectionTitle,
            rotatingText,
            descriptionText,
            deliveryMethodsHeading,
            deliveryMethodsIntro,
            deliveryMethodsAccent,
            deliveryMethods[] {
              title,
              summary,
              badge,
              badgeTone,
              ctaLabel,
              ctaUrl,
              body
            },
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

  const handleLearnMore = useCallback((service) => {
    if (service?.slug?.current) {
      navigate(`/services/${service.slug.current}`);
    }
  }, [navigate]);

  const badgeToneClasses = {
    sky: 'bg-sky-500/15 text-sky-50 border-sky-500/40',
    amber: 'bg-amber-400/15 text-amber-50 border-amber-400/40',
    emerald: 'bg-emerald-400/15 text-emerald-50 border-emerald-400/40',
    pink: 'bg-pink-400/15 text-pink-50 border-pink-400/40',
    slate: 'bg-white/5 text-slate-100 border-white/10',
  };

  const extractPlainText = (blocks = []) => {
    if (!Array.isArray(blocks)) return '';
    return blocks
      .filter((block) => block?._type === 'block' && Array.isArray(block.children))
      .map((block) => block.children.map((child) => child.text || '').join(''))
      .join(' ')
      .trim();
  };

  if (!servicesData) {
    return (
      <section id="services" className="py-20 bg-gray-700 text-white text-center">
        <p>Loading services...</p>
      </section>
    );
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="py-20 bg-gray-700 text-white">
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
    <section id="services" className="py-20 bg-gray-700 text-white">
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

      {/* Delivery Methods Slice */}
      {servicesData.deliveryMethods?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-6 md:mt-0">
          <div className="flex flex-col gap-4 mb-8">
            {servicesData.deliveryMethodsAccent && (
              <span className="inline-flex items-center w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gray-200">
                {servicesData.deliveryMethodsAccent}
              </span>
            )}
            <motion.h3
              className="text-4xl md:text-5xl font-semibold text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {servicesData.deliveryMethodsHeading || 'Delivery Methods'}
            </motion.h3>
            <p className="text-gray-200 text-lg max-w-3xl">
              {servicesData.deliveryMethodsIntro ||
                'Predictable delivery, tailored engagement, and clear ownership at every step.'}
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {servicesData.deliveryMethods.map((method, idx) => {
              const bodyPreview = extractPlainText(method.body);
              const badgeClass = badgeToneClasses[method.badgeTone] || badgeToneClasses.slate;

              return (
                <motion.div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-cyan-500/10 via-sky-400/10 to-indigo-500/10" />
                  <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                    {method.badge && (
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                        {method.badge}
                      </span>
                    )}
                    <span className="text-sm text-gray-400 font-semibold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h4 className="text-2xl font-semibold text-white mb-2 relative z-10">
                    {method.title}
                  </h4>
                  {method.summary && (
                    <p className="text-gray-200 leading-relaxed mb-3 relative z-10">
                      {method.summary}
                    </p>
                  )}
                  {bodyPreview && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 relative z-10">
                      {bodyPreview}
                    </p>
                  )}
                  {(method.ctaLabel || method.ctaUrl) && (
                    <a
                      href={method.ctaUrl || '#'}
                      target={method.ctaUrl ? "_blank" : undefined}
                      rel="noreferrer"
                      className="relative z-10 mt-5 inline-flex items-center gap-2 text-sky-200 font-semibold hover:text-white transition-colors"
                    >
                      {method.ctaLabel || 'Learn more'}
                      <FiArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(ServicesSection);
