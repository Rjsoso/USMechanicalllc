import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Recognition from './components/Recognition'
import Contact from './components/Contact'
import AdminDashboard from './components/AdminDashboard'
import data from '../data.json'
import './App.css'

function Home() {
  const [websiteData, setWebsiteData] = useState(data)

  useEffect(() => {
    // Load data from localStorage if available
    const savedData = localStorage.getItem('websiteData')
    if (savedData) {
      setWebsiteData(JSON.parse(savedData))
    }
  }, [])

  // Update data when it changes (from admin panel)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedData = localStorage.getItem('websiteData')
      if (savedData) {
        setWebsiteData(JSON.parse(savedData))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('websiteDataUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('websiteDataUpdated', handleStorageChange)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar data={websiteData} />
      <Hero data={websiteData.hero} />
      <About data={websiteData.about} />
      <Services data={websiteData.services} />
      <Recognition data={websiteData.recognition} />
      <Contact data={websiteData.contact} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App

