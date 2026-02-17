import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StructuredData from './components/StructuredData'
import ErrorBoundary from './components/ErrorBoundary'

// Regular imports for instant page navigation
import Home from './pages/Home'
import About from './pages/About'
import CareersPage from './pages/CareersPage'
import PortfolioPage from './pages/PortfolioPage'
import ServiceDetail from './pages/ServiceDetail'
import CategoryDetail from './pages/CategoryDetail'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'

function App() {
  // Disable browser scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* Add Schema.org structured data for SEO */}
        <StructuredData />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio/:categoryId" element={<CategoryDetail />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
