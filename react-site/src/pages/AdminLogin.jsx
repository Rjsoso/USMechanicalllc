import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = e => {
    e.preventDefault()
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'USMadmin'
    
    // Debug: log what password is expected (remove in production)
    console.log('Expected password:', correctPassword ? 'Set from .env' : 'USMadmin (default)')

    if (password === correctPassword) {
      localStorage.setItem('adminAuthenticated', 'true')
      navigate('/admin')
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800">
      <div className="bg-white shadow-xl rounded-lg p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Admin Login
        </h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
          
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>
      </div>
    </div>
  )
}

