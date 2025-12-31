import { useEffect, useState, Suspense, lazy } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import CompanyStats from '../components/CompanyStats'
import ServicesSection from '../components/ServicesSection'
import Footer from '../components/Footer'

// Lazy load below-fold components for better initial load performance
const Portfolio = lazy(() => import('../components/Portfolio'))
const Careers = lazy(() => import('../components/Careers'))
const Contact = lazy(() => import('../pages/Contact'))

export default function Home() {
  const [scrollSlide, setScrollSlide] = useState(0);

  // Ensure page starts at top on load, unless we're scrolling to a specific section
  useEffect(() => {
    const scrollTo = sessionStorage.getItem('scrollTo');
    if (!scrollTo) {
      window.scrollTo(0, 0);
    }
  }, []);

  // Scroll-triggered animation for Stats + Services sliding under Safety
  useEffect(() => {
    const handleScroll = () => {
      const safetySection = document.querySelector('#safety');
      if (!safetySection) return;

      const rect = safetySection.getBoundingClientRect();
      const safetyBottom = rect.bottom;
      const viewportHeight = window.innerHeight;

      // Start sliding when Safety bottom reaches 70% of viewport
      const slideStart = viewportHeight * 0.7;
      const slideEnd = 0;

      if (safetyBottom <= slideStart && safetyBottom >= slideEnd) {
        // Calculate progress from 0 to 1
        const progress = 1 - (safetyBottom / slideStart);
        const maxSlide = 300; // How far to slide up (pixels)
        setScrollSlide(-progress * maxSlide);
      } else if (safetyBottom < slideEnd) {
        // Fully slid under
        setScrollSlide(-300);
      } else {
        // Not started yet
        setScrollSlide(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      <Header />

      <main>
        <section id="hero" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 0 }}>
          <HeroSection />
        </section>
        <div className="bg-gray-700" style={{ marginTop: 'calc(100vh - 300px)', position: 'relative', zIndex: 1 }}>

          <AboutAndSafety />

          <div 
            style={{ 
              position: 'relative',
              transform: `translateY(${scrollSlide}px)`,
              transition: 'transform 0.15s ease-out',
              zIndex: 5,
            }}
          >
            <CompanyStats />

            <ServicesSection />
          </div>

          <Suspense fallback={<div className="py-20 bg-gray-700 text-center text-white">Loading...</div>}>
            <Portfolio />
          </Suspense>

          <Suspense fallback={<div className="py-20 bg-gray-700 text-center text-white">Loading...</div>}>
            <Careers />
          </Suspense>

          <Suspense
            fallback={
              <section
                id="contact"
                className="py-20 bg-gray-700 text-center text-white"
                style={{ minHeight: '60vh' }}
              >
                Loading contact...
              </section>
            }
          >
            <Contact />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}

