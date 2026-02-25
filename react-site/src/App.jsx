import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import StructuredData from './components/StructuredData'
import ErrorBoundary from './components/ErrorBoundary'
import CustomCursor from './components/CustomCursor'
import Home from './pages/Home'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash && !location.state?.scrollTo) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash, location.state?.scrollTo])
  return null
}

const About = lazy(() => import('./pages/About'))
const CareersPage = lazy(() => import('./pages/CareersPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const DeliveryMethodsPage = lazy(() => import('./pages/DeliveryMethodsPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  // Disable browser scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <ErrorBoundary>
      <CustomCursor />
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        {/* Reset scroll position on route change */}
        <ScrollToTop />

        {/* Add Schema.org structured data for SEO */}
        <StructuredData />

        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/portfolio/:categoryId" element={<CategoryDetail />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/delivery-methods" element={<DeliveryMethodsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
