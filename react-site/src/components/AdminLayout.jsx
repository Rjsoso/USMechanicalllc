import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLayout({ children, previewUrl = 'http://localhost:3000' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    navigate('/login')
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left: Website Preview */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Header - only overlays the preview area */}
        <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <nav className="flex space-x-4">
              <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">
                Content
              </button>
              <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">
                Media
              </button>
              <button className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">
                Settings
              </button>
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>
        
        <div className="h-full flex flex-col">
          <div className="bg-gray-200 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Website Preview</span>
            <button
              onClick={() => window.open(previewUrl, '_blank')}
              className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Open in New Tab
            </button>
          </div>
          <iframe
            src={previewUrl}
            className="flex-1 w-full border-0"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>

      {/* Right: Editor Controls */}
      <div className="w-[400px] overflow-y-auto bg-gray-100 relative z-20">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

