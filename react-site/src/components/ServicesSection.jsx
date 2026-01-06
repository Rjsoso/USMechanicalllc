import { useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { client } from '../utils/sanity';

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
            deliveryMethodsBoxTitle,
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
      <section id="services" className="pt-12 pb-0 bg-black text-white text-center">
        <p>Loading services...</p>
      </section>
    );
  }

  if (!servicesData?.services || servicesData.services.length === 0) {
    return (
      <section id="services" className="pt-12 pb-1 bg-black text-white">
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
      className="pt-12 pb-0 bg-black text-white"
      style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)', position: 'relative', zIndex: 15 }}
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
            {/* Horizontal Split Layout: 25% Nav | 75% Content */}
            <div className="relative border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-2xl overflow-hidden flex-1 flex flex-col rounded-l-2xl min-h-[600px]">
              
              {/* HEADER - Full Width Centered */}
              {servicesData.deliveryMethodsHeading && (
                <div className="w-full border-b border-gray-200 bg-white/60 px-8 py-6">
                  <h2 className="section-title text-4xl md:text-5xl text-gray-900 text-center">
                    {servicesData.deliveryMethodsHeading || 'Delivery Methods'}
                  </h2>
                </div>
              )}
              
              {/* CONTENT AREA - Horizontal Split */}
              <div className="flex flex-row flex-1">
                {/* LEFT SIDEBAR - 25% Navigation */}
                <div className="w-1/4 border-r border-gray-200 bg-white/50 flex flex-col">
                  {[...servicesData.deliveryMethods, { title: 'Request a Quote', isQuote: true }].map((method, idx) => {
                    const isActive = activeTab === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleExpand(idx)}
                        className={`w-full px-4 py-6 flex items-center justify-center text-center transition-all border-b border-gray-200 ${
                          isActive 
                            ? 'bg-gray-100 text-gray-900 font-bold' 
                            : 'bg-white/30 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-2xl font-bold">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT CONTENT AREA - 75% */}
                <div className="w-3/4 bg-white/80 overflow-y-auto">
                  <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    {(() => {
                      const allMethods = [...servicesData.deliveryMethods, { title: 'Request a Quote', isQuote: true }];
                      const method = allMethods[activeTab];
                      const badgeClass = badgeToneClasses[method?.badgeTone] || badgeToneClasses.slate;
                      const bodyPreview = extractPlainText(method?.body);
                      const bgUrl = method?.backgroundImage?.asset?.url
                        ? `${method.backgroundImage.asset.url}?w=900&q=80&auto=format`
                        : null;
                      const emailTarget = servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com';

                      return (
                        <div 
                          className="p-6 sm:p-8 h-full flex flex-col relative"
                          style={bgUrl ? {
                            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.90)), url(${bgUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                          } : undefined}
                        >
                          {/* Method Title and Badge */}
                          <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {method?.title}
                              </h3>
                              {!method?.isQuote && method?.badge && (
                                <span 
                                  className={`inline-flex items-center border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                                  style={{
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  {method.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          {!method?.isQuote ? (
                            <div className="space-y-4 flex-1">
                              <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
                                Delivery Method Details
                              </p>
                              {method?.summary && (
                                <p className="text-gray-900 leading-relaxed text-lg">
                                  {method.summary}
                                </p>
                              )}
                              {bodyPreview && (
                                <p className="text-gray-700 leading-relaxed text-base">
                                  {bodyPreview}
                                </p>
                              )}
                              
                              <div className="bg-gray-50 border border-gray-200 p-5 mt-6">
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-2">
                                  Interested?
                                </p>
                                <p className="text-gray-900 text-sm">
                                  Click "5" tab to inquire about this method.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <div className="bg-gray-50 border border-gray-200 p-5 shadow-sm">
                                <div className="mb-4">
                                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-1">
                                    Request a Quote
                                  </p>
                                  <h5 className="text-xl font-semibold text-gray-900">
                                    {servicesData.deliveryMethodsFormHeadline || 'Tell us about your project'}
                                  </h5>
                                  <p className="text-gray-700 mt-2 text-sm">
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
                                    className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                                  <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email"
                                    className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                                  <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                                  <select
                                    name="deliveryMethod"
                                    defaultValue="General Inquiry"
                                    className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                    className="w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                                  />
                                  <input type="hidden" name="targetEmail" value={emailTarget} />
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                      type="submit"
                                      disabled={submitting}
                                      className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 transition disabled:opacity-60"
                                    >
                                      {submitting ? 'Sending...' : 'Send Request'}
                                    </button>
                                    {submitStatus === 'success' && (
                                      <span className="text-emerald-600 text-sm font-semibold">Sent! We'll respond shortly.</span>
                                    )}
                                    {submitStatus === 'error' && (
                                      <span className="text-amber-600 text-sm font-semibold">There was an issue. Please try again.</span>
                                    )}
                                  </div>
                                </form>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                </AnimatePresence>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(ServicesSection);
