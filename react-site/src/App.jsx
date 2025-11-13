import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Home from './pages/Home'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
