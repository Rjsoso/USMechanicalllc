import { useEffect, useState, Suspense, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import CompanyStats from '../components/CompanyStats'
import ServicesSection from '../components/ServicesSection'
import Footer from '../components/Footer'
import { scrollToSection } from '../utils/scrollToSection'

// Lazy load below-fold components for better initial load performance
const Portfolio = lazy(() => import('../components/Portfolio'))
const LogoLoopSection = lazy(() => import('../components/LogoLoopSection'))
const Careers = lazy(() => import('../components/Careers'))
const Contact = lazy(() => import('../pages/Contact'))

export default function Home() {
  const location = useLocation();
  const [scrollSlide, setScrollSlide] = useState(0);

  // Disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Ensure page starts at top on load, unless we're scrolling to a specific section
  useEffect(() => {
    // Check React Router location state first (most reliable)
    const scrollTo = location.state?.scrollTo;
    console.log('Home.jsx useEffect - scrollTo from location.state:', scrollTo);
    
    if (scrollTo) {
      // We have a section to scroll to - wait for components to load
      console.log(`Home.jsx: Starting scroll to ${scrollTo}`);
      // Use default parameters (50 retries, 200ms delay, 500ms initial delay)
      scrollToSection(scrollTo).then((success) => {
        console.log(`Scroll to ${scrollTo} result: ${success}`);
      });
    } else {
      // No section to scroll to - start at top immediately
      console.log('Home.jsx: No scrollTo in location state, scrolling to top');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.state?.scrollTo]);

  // Scroll-triggered animation for Stats + Services sliding under Safety
  useEffect(() => {
    const handleScroll = () => {
      const safetySection = document.querySelector('#safety');
      if (!safetySection) return;

      const rect = safetySection.getBoundingClientRect();
      const safetyBottom = rect.bottom;
      const viewportHeight = window.innerHeight;

      // Start sliding when Safety bottom reaches 25% from top (75% to top)
      const slideStart = viewportHeight * 0.25;
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
        <div style={{ marginTop: 'calc(100vh - 600px)', position: 'relative', zIndex: 1 }}>

          <AboutAndSafety />

          <div 
            style={{ 
              position: 'relative',
              transform: `translateY(${scrollSlide}px)`,
              transition: 'transform 0.3s ease-out',
              zIndex: 5,
            }}
          >
            <CompanyStats />

            <ServicesSection />

            <Suspense fallback={<div className="py-20 bg-black text-center text-white">Loading...</div>}>
              <Portfolio />
            </Suspense>

            <Suspense fallback={<div className="py-16 bg-black"></div>}>
              <LogoLoopSection />
            </Suspense>
          </div>

          <Suspense fallback={<div className="py-20 bg-black text-center text-white">Loading...</div>}>
            <Careers />
          </Suspense>

          <Suspense
            fallback={
              <section
                className="py-20 bg-black text-center text-white"
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

