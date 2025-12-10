import { useEffect } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import CompanyStats from '../components/CompanyStats'
import ServicesSection from '../components/ServicesSection'
import Portfolio from '../components/Portfolio'
import Careers from '../components/Careers'
import Contact from '../pages/Contact'
import Footer from '../components/Footer'

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
        <div className="bg-gray-50" style={{ marginTop: 'calc(100vh - 300px)', position: 'relative', zIndex: 1 }}>

          <AboutAndSafety />

          <CompanyStats />

          <ServicesSection />

          <Portfolio />

          <Careers />

          <Contact />
        </div>
      </main>

      <Footer />
    </>
  )
}

