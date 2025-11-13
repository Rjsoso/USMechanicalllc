import { useEffect } from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import CompanyStats from '../components/CompanyStats'
import OurServices from '../components/OurServices'
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

      <main className="pt-40 md:pt-48">
        <section id="hero">
          <HeroSection />
        </section>

        <section id="about">
          <AboutAndSafety />
        </section>

        <CompanyStats />

        <section id="services">
          <OurServices />
        </section>

        <section id="portfolio">
          <Portfolio />
        </section>

        <section id="careers">
          <Careers />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </>
  )
}

