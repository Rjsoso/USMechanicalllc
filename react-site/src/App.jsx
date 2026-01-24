import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StructuredData from './components/StructuredData'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
    </div>
  )
}

function App() {
  // Disable browser scroll restoration globally
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return (
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
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/portfolio/:categoryId" element={<CategoryDetail />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
