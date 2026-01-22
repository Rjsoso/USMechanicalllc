import { useEffect, useLayoutEffect, useState, Suspense, lazy, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import Footer from '../components/Footer'
import { scrollToSection } from '../utils/scrollToSection'

// Lazy load below-fold components for better initial load performance
const CompanyStats = lazy(() => import('../components/CompanyStats'))
const ServicesSection = lazy(() => import('../components/ServicesSection'))
const Portfolio = lazy(() => import('../components/Portfolio'))
const LogoLoopSection = lazy(() => import('../components/LogoLoopSection'))
const Careers = lazy(() => import('../components/Careers'))
const Contact = lazy(() => import('../pages/Contact'))

export default function Home() {
  const location = useLocation();
  const [scrollSlide, setScrollSlide] = useState(0);
  const initialScrollDone = useRef(false);
  
  // Detect if this is a page reload (not navigation)
  const isPageReload = useRef(
    !location.state?.scrollTo && 
    (performance.getEntriesByType('navigation')[0]?.type === 'reload' || 
     performance.navigation?.type === 1)
  );

  // Disable browser scroll restoration
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top IMMEDIATELY before paint (unless navigating to a section)
  useLayoutEffect(() => {
    if (!initialScrollDone.current) {
      // On page reload, clear location state immediately
      if (isPageReload.current) {
        console.log('Home.jsx: Clearing location state on page reload');
        window.history.replaceState({}, document.title);
      }
      
      const scrollTo = location.state?.scrollTo;
      if (!scrollTo || isPageReload.current) {
        // Clear any URL hash that might trigger scrolling
        if (window.location.hash) {
          console.log('Clearing hash:', window.location.hash);
          window.history.replaceState({}, '', window.location.pathname);
        }
        // Force scroll to top immediately before browser paints
        window.scrollTo(0, 0);
      }
      initialScrollDone.current = true;
    }
  }, []);

  // Handle navigation to specific sections (runs after paint)
  // BUT: Skip on page reload to prevent unwanted scrolling
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    console.log('Home.jsx useEffect - scrollTo from location.state:', scrollTo);
    
    // If this is a page reload, don't run any scroll logic
    if (isPageReload.current) {
      console.log('Home.jsx: Page reload detected, skipping scroll logic');
      // Clear location state to prevent it from persisting
      if (scrollTo) {
        window.history.replaceState({}, document.title);
      }
      return;
    }
    
    if (scrollTo) {
      // We have a section to scroll to - wait for components to load
      console.log(`Home.jsx: Starting scroll to ${scrollTo}`);
      scrollToSection(scrollTo).then((success) => {
        console.log(`Scroll to ${scrollTo} result: ${success}`);
        // Clear the state after successful scroll
        if (success) {
          window.history.replaceState({}, document.title);
        }
      });
    }
  }, [location.state?.scrollTo]);

  // Scroll-triggered animation for Stats + Services sliding under Safety
  // Optimized with requestAnimationFrame throttling for smooth iOS performance
  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;
    const THROTTLE = 16; // ~60fps max

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < THROTTLE) return; // Throttle to prevent excessive updates
      lastScrollTime = now;

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
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
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
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
            className="has-scroll-animation"
            style={{ 
              position: 'relative',
              transform: `translate3d(0, ${scrollSlide}px, 0)`,
              WebkitTransform: `translate3d(0, ${scrollSlide}px, 0)`,
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: 2,
              willChange: 'transform',
              isolation: 'isolate',
            }}
          >
            <Suspense fallback={<div className="py-16 bg-black"></div>}>
              <CompanyStats />
            </Suspense>

            <Suspense fallback={<div className="py-16 bg-black"></div>}>
              <ServicesSection />
            </Suspense>

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

