import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '../utils/sanity';

export default function TestimonialTransition() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock testimonials as fallback
  const mockTestimonials = [
    {
      quote: "US Mechanical delivered exceptional quality on our complex HVAC project. Their attention to detail and professionalism exceeded our expectations.",
      author: "John Smith",
      company: "ABC Construction",
      role: "Project Manager"
    },
    {
      quote: "Working with US Mechanical has been a game-changer for our facility. Their expertise in mechanical systems is unmatched.",
      author: "Sarah Johnson",
      company: "Tech Industries Inc.",
      role: "Facilities Director"
    },
    {
      quote: "The team at US Mechanical consistently delivers on time and on budget. They're our go-to partner for all mechanical work.",
      author: "Michael Chen",
      company: "Downtown Development Group",
      role: "Senior Engineer"
    }
  ];

  useEffect(() => {
    // Fetch testimonials from Sanity
    client
      .fetch(
        `*[_type == "testimonial"] | order(_createdAt desc) {
          quote,
          author,
          company,
          role,
          _id
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(mockTestimonials);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error);
        setTestimonials(mockTestimonials);
        setLoading(false);
      });
  }, []);

  // Auto-rotate testimonials every 6 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  if (loading || !currentTestimonial) {
    return (
      <div 
        className="relative w-full overflow-hidden py-20"
        style={{ 
          position: 'relative', 
          zIndex: 12,
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(255, 255, 255, 1) 100%)'
        }}
      />
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden py-20"
      style={{ 
        position: 'relative', 
        zIndex: 12,
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.95) 30%, rgba(50, 50, 50, 0.8) 70%, rgba(255, 255, 255, 1) 100%)'
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.05, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '1000px',
            height: '1000px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto opacity-50" />
        </motion.div>

        {/* Testimonial Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div 
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 100px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Quote Icon */}
              <div className="text-6xl text-white/20 mb-4 font-serif">"</div>
              
              {/* Quote Text */}
              <p className="text-white text-xl md:text-2xl leading-relaxed mb-8 italic">
                {currentTestimonial.quote}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-white font-bold text-lg">
                    {currentTestimonial.author}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {currentTestimonial.role}
                    {currentTestimonial.company && ` • ${currentTestimonial.company}`}
                  </p>
                </div>

                {/* Navigation Dots */}
                {testimonials.length > 1 && (
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-white w-8' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

