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

          <div className="relative min-h-[620px] md:min-h-[700px]">
            <div className="grid gap-6 md:gap-8 md:grid-cols-2">
              {servicesData.deliveryMethods.map((method, idx) => {
                const bodyPreview = extractPlainText(method.body);
                const badgeClass = badgeToneClasses[method.badgeTone] || badgeToneClasses.slate;

                return (
                  <motion.div
                    layout
                    layoutId={`delivery-card-${idx}`}
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
                    <div className="relative z-10 mt-5 flex flex-wrap gap-3 items-center">
                      <button
                        onClick={() => handleExpand(idx)}
                        className="inline-flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      >
                        Get a Quote
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {expandedIndex !== null && servicesData.deliveryMethods?.[expandedIndex] && (
                <>
                  <motion.div
                    className="absolute inset-0 z-10 rounded-3xl bg-black/65 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                  />
                  <div className="absolute inset-0 flex items-stretch justify-center p-3 md:p-6">
                    <motion.div
                      layoutId={`delivery-card-${expandedIndex}`}
                      className="relative z-20 overflow-hidden rounded-2xl md:rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900 shadow-2xl w-full max-w-5xl max-h-[90vh] md:max-h-[82vh] overflow-y-auto p-5 md:p-8"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                    {(() => {
                      const method = servicesData.deliveryMethods[expandedIndex];
                      const bodyPreview = extractPlainText(method.body);
                      const badgeClass = badgeToneClasses[method.badgeTone] || badgeToneClasses.slate;
                      const emailTarget = servicesData.deliveryMethodsEmail || 'info@usmechanicalllc.com';
                      return (
                        <div className="flex flex-col h-full gap-6 md:gap-8 pb-4 md:pb-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {method.badge && (
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                                  {method.badge}
                                </span>
                              )}
                              <span className="text-sm text-gray-400 font-semibold">
                                {String(expandedIndex + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <button
                              onClick={handleClose}
                              className="text-gray-300 hover:text-white text-sm font-semibold"
                            >
                              Close
                            </button>
                          </div>

                          <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-start">
                            <div className="md:col-span-2 space-y-3">
                              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Delivery Method</p>
                              <h4 className="text-3xl md:text-4xl font-semibold text-white">
                                {method.title}
                              </h4>
                              {method.summary && (
                                <p className="text-gray-200 leading-relaxed">
                                  {method.summary}
                                </p>
                              )}
                              {bodyPreview && (
                                <p className="text-gray-400 leading-relaxed">
                                  {bodyPreview}
                                </p>
                              )}
                            </div>

                            <div className="md:col-span-3">
                              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                                <div className="mb-4">
                                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-1">
                                    Request a Quote
                                  </p>
                                  <h5 className="text-2xl font-semibold text-white">
                                    {servicesData.deliveryMethodsFormHeadline || 'Tell us about your project'}
                                  </h5>
                                  <p className="text-gray-300 mt-2 text-sm">
                                    {servicesData.deliveryMethodsFormCopy || 'Share a few details and we will follow up quickly.'}
                                  </p>
                                </div>
                                <form
                                  onSubmit={(e) => handleQuoteSubmit(e, method.title)}
                                  className="grid gap-3 md:gap-4"
                                >
                                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                                    <input
                                      name="name"
                                      type="text"
                                      required
                                      placeholder="Name"
                                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                    />
                                    <input
                                      name="email"
                                      type="email"
                                      required
                                      placeholder="Email"
                                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                    />
                                  </div>
                                  <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                                    <input
                                      name="phone"
                                      type="tel"
                                      placeholder="Phone"
                                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                    />
                                    <input
                                      name="deliveryMethod"
                                      readOnly
                                      value={method.title}
                                      className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                    />
                                  </div>
                                  <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="Project details, timelines, and any specifics"
                                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                                  />
                                  <input type="hidden" name="targetEmail" value={emailTarget} />
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <button
                                      type="submit"
                                      disabled={submitting}
                                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition disabled:opacity-60"
                                    >
                                      {submitting ? 'Sending...' : 'Send Request'}
                                    </button>
                                    {submitStatus === 'success' && (
                                      <span className="text-emerald-300 text-sm font-semibold">Sent! We’ll respond shortly.</span>
                                    )}
                                    {submitStatus === 'error' && (
                                      <span className="text-amber-300 text-sm font-semibold">There was an issue. Please try again.</span>
                                    )}
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
};

export default memo(ServicesSection);
