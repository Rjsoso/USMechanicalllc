import { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { client } from '../utils/sanity';
import CardSwap, { Card } from './CardSwap';

const ServicesSection = () => {
  const FORM_ENDPOINT = 'https://formspree.io/f/xgvrvody';
  const [servicesData, setServicesData] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
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
            deliveryMethodsFormHeadline,
            deliveryMethodsFormCopy,
            deliveryMethodsEmail,
            deliveryMethods[] {
              title,
              summary,
              badge,
              badgeTone,
              ctaLabel,
              ctaUrl,
              backgroundImage {
                asset-> {
                  url,
                  _id
                },
                alt
              },
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

  const handleExpand = useCallback((index) => {
    setActiveTab(index);
    setExpandedIndex(index);
    setSubmitStatus('idle');
  }, []);

  const handleClose = useCallback(() => {
    setExpandedIndex(null);
    setSubmitStatus('idle');
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (expandedIndex === null) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedIndex, handleClose]);

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

  const handleQuoteSubmit = async (event, methodTitle = '') => {
    event.preventDefault();
    if (!servicesData) return;

    const emailTarget = servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com';
    setSubmitting(true);
    setSubmitStatus('loading');

    try {
      const formData = new FormData(event.target);
      formData.set('deliveryMethod', methodTitle);
      formData.set('targetEmail', emailTarget);

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      setSubmitStatus('success');
      event.target.reset();
    } catch (error) {
      console.error('Quote request failed:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!servicesData) {
    return (
      <section id="services" className="py-20 bg-black text-white text-center">
        <p>Loading services...</p>
      </section>
    );
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            className="section-title text-5xl md:text-6xl text-center mb-12 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {servicesData.sectionTitle || 'Our Services'}
          </motion.h2>
          <p className="text-center text-white">No services available.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="services" 
      className="py-20 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 
          className="section-title text-5xl md:text-6xl text-center mb-12 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {servicesData.sectionTitle || 'Our Services'}
        </motion.h2>
        <p className="text-white text-lg mb-8 text-left">
          {servicesData.descriptionText}
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 md:gap-12">
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
                    <p className="text-sm text-gray-300 opacity-75 line-clamp-2 leading-relaxed mb-4">
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

        {/* RIGHT — DELIVERY METHODS CONTENT */}
        {servicesData.deliveryMethods?.length > 0 && (
          <div className="w-full md:w-1/2 px-6 md:px-0 flex flex-col">
            {/* Single Rectangle Tabs / Accordion */}
            <div className="relative border border-white/10 bg-gradient-to-br from-gray-500 via-gray-500/95 to-gray-500 shadow-2xl overflow-hidden flex-1 flex flex-col rounded-l-2xl">
              <div className="flex flex-col divide-y divide-white/10 h-full">
                {[...servicesData.deliveryMethods, { title: 'Request a Quote', isQuote: true }].map((method, idx) => {
                  const isActive = activeTab === idx;
                  const badgeClass = badgeToneClasses[method.badgeTone] || badgeToneClasses.slate;
                  const bodyPreview = extractPlainText(method.body);
                  const bgUrl = method.backgroundImage?.asset?.url
                    ? `${method.backgroundImage.asset.url}?w=900&q=80&auto=format`
                    : null;
                  const emailTarget = servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com';

                  return (
                    <div key={idx} className="bg-white/3">
                      <button
                        onClick={() => handleExpand(idx)}
                        className={`w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 transition ${
                          isActive ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 font-semibold">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            {!method.isQuote && method.badge && (
                              <span 
                                className={`inline-flex items-center border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                                style={{
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
                            {method.title}
                            {method.isQuote && (
                              <span 
                                className="inline-flex items-center justify-center h-6 w-6 bg-gray-600 text-white text-xs font-bold"
                                style={{
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)'
                                }}
                              >→</span>
                            )}
                          </span>
                        </div>
                        <FiArrowRight className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                      </button>
                      
                      {isActive && (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className="flex flex-col gap-4 p-4 sm:p-6 border-t border-white/10"
                              style={bgUrl ? {
                                backgroundImage: `linear-gradient(180deg, rgba(10,12,17,0.82), rgba(5,7,12,0.94)), url(${bgUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              } : undefined}
                            >
                              {!method.isQuote && (
                                <div className="space-y-3">
                                  <p className="text-xs uppercase tracking-[0.25em] text-gray-300">Delivery Method</p>
                                  <h4 className="text-2xl md:text-3xl font-semibold text-white">
                                    {method.title}
                                  </h4>
                                  {method.summary && (
                                    <p className="text-white leading-relaxed text-sm">
                                      {method.summary}
                                    </p>
                                  )}
                                  {bodyPreview && (
                                    <p className="text-white leading-relaxed text-sm">
                                      {bodyPreview}
                                    </p>
                                  )}
                                </div>
                              )}

                              {method.isQuote ? (
                                <div className="bg-white/5 border border-white/10 p-4 md:p-5 shadow-lg">
                                  <div className="mb-4">
                                    <p className="text-xs uppercase tracking-[0.25em] text-gray-300 mb-1">
                                      Request a Quote
                                    </p>
                                    <h5 className="text-xl font-semibold text-white">
                                      {servicesData.deliveryMethodsFormHeadline || 'Tell us about your project'}
                                    </h5>
                                    <p className="text-white mt-2 text-sm">
                                      {servicesData.deliveryMethodsFormCopy || 'Share a few details and we will follow up quickly.'}
                                    </p>
                                  </div>
                                  <form
                                    onSubmit={(e) => handleQuoteSubmit(e, 'Request a Quote')}
                                    className="grid gap-3"
                                  >
                                    <input
                                      name="name"
                                      type="text"
                                      required
                                      placeholder="Name"
                                      className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/60"
                                    />
                                    <input
                                      name="email"
                                      type="email"
                                      required
                                      placeholder="Email"
                                      className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/60"
                                    />
                                    <input
                                      name="phone"
                                      type="tel"
                                      placeholder="Phone"
                                      className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/60"
                                    />
                                    <select
                                      name="deliveryMethod"
                                      defaultValue="General Inquiry"
                                      className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/60 bg-gray-700"
                                    >
                                      <option value="General Inquiry">General Inquiry</option>
                                      {servicesData.deliveryMethods.map((m, optionIdx) => (
                                        <option key={optionIdx} value={m.title || `Method ${optionIdx + 1}`}>
                                          {m.title || `Method ${optionIdx + 1}`}
                                        </option>
                                      ))}
                                    </select>
                                    <textarea
                                      name="message"
                                      required
                                      rows="4"
                                      placeholder="Project details, timelines, and any specifics"
                                      className="w-full border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400/60"
                                    />
                                    <input type="hidden" name="targetEmail" value={emailTarget} />
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-5 py-3 transition disabled:opacity-60"
                                      >
                                        {submitting ? 'Sending...' : 'Send Request'}
                                      </button>
                                      {submitStatus === 'success' && (
                                        <span className="text-emerald-300 text-sm font-semibold">Sent! We'll respond shortly.</span>
                                      )}
                                      {submitStatus === 'error' && (
                                        <span className="text-amber-300 text-sm font-semibold">There was an issue. Please try again.</span>
                                      )}
                                    </div>
                                  </form>
                                </div>
                              ) : (
                                <div className="bg-white/5 border border-white/10 p-4 md:p-5 shadow-lg">
                                  <div className="mb-1 flex items-center justify-between">
                                    <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
                                      Delivery Method Details
                                    </p>
                                  </div>
                                  <div className="text-white text-sm">
                                    <p>Click "Request a Quote" tab to inquire about this method.</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Methods Title */}
      {servicesData.deliveryMethods?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-20 md:mt-24">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            {servicesData.deliveryMethodsAccent && (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                {servicesData.deliveryMethodsAccent}
              </span>
            )}
            <motion.h3
              className="section-title text-5xl md:text-6xl text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {servicesData.deliveryMethodsHeading || 'Delivery Methods'}
            </motion.h3>
            <p className="text-white text-lg max-w-3xl mx-auto">
              {servicesData.deliveryMethodsIntro ||
                'Predictable delivery, tailored engagement, and clear ownership at every step.'}
            </p>
          </div>

          {/* THE CARD SWAP (moved here) */}
          <div
            className="w-full flex justify-center items-center relative mb-16 md:mb-24 px-6 md:px-0"
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
            <p className="text-white">No gallery images found.</p>
          )}
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(ServicesSection);
