import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadData, loadSavedData } from './utils/dataService';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Recognition from './components/Recognition';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Try loading saved data first (from localStorage)
      const savedData = loadSavedData();
      if (savedData) {
        setData(savedData);
        setLoading(false);
        return;
      }

      // Otherwise load from JSON file
      const websiteData = await loadData();
      setData(websiteData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-orange"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">Please check your data.json file</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard data={data} setData={setData} />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen">
              <Navbar data={data.navigation} />
              <Hero data={data.hero} />
              <Services data={data.services} />
              <About data={data.about} />
              <Recognition data={data.recognition} />
              <Contact data={data.contact} />
              <Footer data={data.footer} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

