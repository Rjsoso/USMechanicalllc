import { useEffect, useState, useMemo } from 'react';
import { client } from '../utils/sanity';
import { urlFor } from '../utils/sanity';
import { motion } from 'framer-motion';
import { 
  validateContactForm, 
  sanitizeFormData, 
  detectSpam 
} from '../utils/validation';
import { 
  canSubmitForm, 
  recordSubmission, 
  formatTimeRemaining,
  getRemainingSubmissions
} from '../utils/rateLimit';

export default function Contact() {
  const [contactData, setContactData] = useState(null);
  const [heroBackgroundImage, setHeroBackgroundImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerOffset = 180;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  const [rateLimitError, setRateLimitError] = useState(null);

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

  // Attempt smooth scroll to contact when this component is ready
  useEffect(() => {
    const shouldScroll =
      sessionStorage.getItem('scrollTo') === 'contact' ||
      window.location.hash === '#contact';

    if (!shouldScroll) return undefined;

    const scrollToContact = () => {
      const element = document.getElementById('contact');
      if (!element) return false;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      sessionStorage.removeItem('scrollTo');
      return true;
    };

    let attempts = 0;
    const maxRetries = 20;
    const timer = setInterval(() => {
      attempts += 1;
      if (scrollToContact() || attempts >= maxRetries) {
        clearInterval(timer);
      }
    }, 150);

    // Try immediately in case everything is already mounted
    scrollToContact();

    return () => clearInterval(timer);
  }, [loading, contactData, headerOffset]);

  // Determine which background image to use (contact's own or hero's as fallback)
  const backgroundImageUrl = useMemo(() => {
    const sanityImage = contactData?.backgroundImage;
    if (sanityImage && urlFor(sanityImage)) {
      return urlFor(sanityImage).width(1400).quality(80).auto('format').url();
    }
    if (heroBackgroundImage?.includes('cdn.sanity.io')) {
      return `${heroBackgroundImage}?w=1400&q=80&auto=format`;
    }
    return heroBackgroundImage || null;
  }, [contactData?.backgroundImage, heroBackgroundImage]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    // Clear rate limit error when user modifies form
    if (rateLimitError) {
      setRateLimitError(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    setFormError(null);
    setRateLimitError(null);
    
    // Check rate limiting
    const rateLimitCheck = canSubmitForm();
    if (!rateLimitCheck.allowed) {
      setRateLimitError(
        `${rateLimitCheck.reason} Please try again in ${formatTimeRemaining(rateLimitCheck.timeUntilNext)}.`
      );
      return;
    }
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);
    
    // Validate form data
    const validation = validateContactForm(sanitizedData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }
    
    // Check for spam
    if (detectSpam(sanitizedData)) {
      setFormError('Your message was flagged as potential spam. Please remove any suspicious content and try again.');
      return;
    }
    
    // Submit form
    setFormSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/xgvrvody', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      if (response.ok) {
        // Record successful submission for rate limiting
        recordSubmission();
        
        // Show success message
        setFormSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setFormSuccess(false);
        }, 5000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setFormError('Failed to send message. Please try again later or contact us directly via email.');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Get remaining submissions for display
  const remainingSubmissions = getRemainingSubmissions();
  
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
              backgroundImage: `url(${backgroundImageUrl})`,
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
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-lg text-white">Loading contact...</p>
          </div>
        )}

        {!loading && (error || !contactData) && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-2xl px-6">
              <h1 className="text-2xl font-bold mb-4 text-red-400">Contact Page Not Found</h1>
              <p className="text-white mb-4">{error || 'No contact page data found.'}</p>
              <p className="text-sm text-gray-300">
                Please create a "Contact Page" document in Sanity Studio at{' '}
                <a href="http://localhost:3333" className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">
                  http://localhost:3333
                </a>
              </p>
            </div>
          </div>
        )}

        {!loading && contactData && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-title text-5xl md:text-6xl text-center mb-8 text-white"
            >
              {contactData.heroTitle || 'Contact Us'}
            </motion.h1>

            <p className="text-center text-white mb-12">{contactData.description}</p>

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
                            src={urlFor(affiliate.logo).width(200).quality(80).auto('format').url()}
                            alt={affiliate.name}
                            className="h-12 mb-2 object-contain"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <p className="font-semibold text-white">{affiliate.name}</p>
                        {affiliate.description && <p className="text-white">{affiliate.description}</p>}
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
                
                {/* Success Message */}
                {formSuccess && (
                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-white font-semibold">✓ Message sent successfully!</p>
                    <p className="text-white/80 text-sm mt-1">We'll get back to you soon.</p>
                  </div>
                )}
                
                {/* Rate Limit Error */}
                {rateLimitError && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-white font-semibold">⚠ Rate Limit Exceeded</p>
                    <p className="text-white/80 text-sm mt-1">{rateLimitError}</p>
                  </div>
                )}
                
                {/* General Form Error */}
                {formError && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-white font-semibold">⚠ Error</p>
                    <p className="text-white/80 text-sm mt-1">{formError}</p>
                  </div>
                )}
                
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-4"
                >
                  <div>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Name *" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50`}
                      maxLength="100"
                    />
                    {formErrors.name && (
                      <p className="text-red-300 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email *" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50`}
                      maxLength="254"
                    />
                    {formErrors.email && (
                      <p className="text-red-300 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Phone (optional)" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.phone ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder-white/70 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50`}
                      maxLength="20"
                    />
                    {formErrors.phone && (
                      <p className="text-red-300 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <textarea 
                      name="message" 
                      placeholder="Message * (minimum 10 characters)" 
                      required 
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.message ? 'border-red-500' : 'border-white/30'} bg-white/10 text-white placeholder-white/70 p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none`}
                      maxLength="5000"
                    />
                    {formErrors.message && (
                      <p className="text-red-300 text-sm mt-1">{formErrors.message}</p>
                    )}
                    <p className="text-white/60 text-xs mt-1">
                      {formData.message.length}/5000 characters
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formSubmitting || rateLimitError}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition ${
                      formSubmitting || rateLimitError ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {formSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                  
                  {/* Rate limit info */}
                  {remainingSubmissions < 3 && !rateLimitError && (
                    <p className="text-white/60 text-xs text-center">
                      {remainingSubmissions > 0 
                        ? `${remainingSubmissions} submission${remainingSubmissions !== 1 ? 's' : ''} remaining this hour`
                        : 'Maximum submissions reached for this hour'}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

