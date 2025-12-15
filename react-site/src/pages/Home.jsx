import { useEffect, Suspense, lazy } from 'react'
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
  // Ensure page starts at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
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

          <CompanyStats />

          <ServicesSection />

          <Suspense fallback={<div className="py-20 bg-gray-700 text-center text-white">Loading...</div>}>
            <Portfolio />
          </Suspense>

          <Suspense fallback={<div className="py-20 bg-gray-700 text-center text-white">Loading...</div>}>
            <Careers />
          </Suspense>

          <Suspense fallback={<div className="py-20 bg-gray-700 text-center text-white">Loading...</div>}>
            <Contact />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  )
}

