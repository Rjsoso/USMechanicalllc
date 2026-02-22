import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="text-6xl font-extrabold text-blue-500">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Page Not Found</h1>
        <p className="mt-4 max-w-md text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold transition-colors hover:bg-blue-500"
          >
            Go to Homepage
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
