import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StructuredData from './components/StructuredData'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingScreen from './components/LoadingScreen'

// Helper function to ensure minimum display time for loading animation
const delayedImport = (importFunc, minDelay = 1600) => {
  return Promise.all([
    importFunc(),
    new Promise(resolve => setTimeout(resolve, minDelay))
  ]).then(([module]) => module)
}

// Lazy load pages for code splitting with minimum loader display time
const Home = lazy(() => delayedImport(() => import('./pages/Home')))
const About = lazy(() => delayedImport(() => import('./pages/About')))
const CareersPage = lazy(() => delayedImport(() => import('./pages/CareersPage')))
const PortfolioPage = lazy(() => delayedImport(() => import('./pages/PortfolioPage')))
const ServiceDetail = lazy(() => delayedImport(() => import('./pages/ServiceDetail')))
const CategoryDetail = lazy(() => delayedImport(() => import('./pages/CategoryDetail')))
const ProjectDetail = lazy(() => delayedImport(() => import('./pages/ProjectDetail')))
const Contact = lazy(() => delayedImport(() => import('./pages/Contact')))

function LoadingFallback() {
  return <LoadingScreen minimal />
}

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

        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Router>
    </ErrorBoundary>
  )
}

export default App
