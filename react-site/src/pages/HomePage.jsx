import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import { getContent } from '../utils/storage'
import { useSanityContent } from '../hooks/useSanityContent'

function HomePage() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  // Try to use Sanity content if configured
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
  const sanityContent = useSanityContent()

  useEffect(() => {
    // If Sanity is configured, use Sanity content
    if (projectId && projectId !== 'your-project-id' && projectId !== '') {
      if (sanityContent.loading) {
        setLoading(true)
      } else {
        setContent(sanityContent.data)
        setLoading(false)
      }
    } else {
      // Otherwise, load from localStorage/content.json
      const loadedContent = getContent()
      setContent(loadedContent)
      setLoading(false)
    }

    // Scroll to top
    window.scrollTo(0, 0)

    // Smooth scroll for anchor links
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [projectId, sanityContent.loading, sanityContent.data])

  if (loading || !content) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero data={content.hero} />
      <Projects
        data={
          content.recognition?.projects
            ? content.recognition
            : { title: 'Our Projects', projects: content.recognition || [] }
        }
      />
      <Testimonials data={content.testimonials || { testimonials: [], trustLogos: [] }} />
      <Contact
        data={content.contact || {}}
        companyInfo={content.companyInfo || { offices: [] }}
      />
      <Footer data={content.companyInfo || { offices: [] }} />
    </div>
  )
}

export default HomePage
