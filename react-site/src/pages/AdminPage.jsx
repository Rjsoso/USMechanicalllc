import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getContent, saveContent } from '../utils/storage'

const AdminPage = () => {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [content, setContent] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setAuthenticated(true)
    }
    
    // Load content from storage utility
    const loadedContent = getContent()
    setContent(loadedContent)
  }, [])

  const handleLogin = () => {
    if (password === 'admin123') {
      setAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Incorrect password.')
    }
  }

  const handleChange = (section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  const handleArrayChange = (section, index, key, value) => {
    setContent(prev => {
      const newContent = { ...prev }
      const arr = [...newContent[section]]
      arr[index] = { ...arr[index], [key]: value }
      newContent[section] = arr
      return newContent
    })
  }

  const handleFileUpload = (section, key, file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      handleChange(section, key, base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleProjectFileUpload = (index, file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      handleArrayChange('recognition', index, 'image', base64String)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    saveContent(content)
    setMessage('✅ Changes saved successfully!')
    setTimeout(() => setMessage(''), 4000)
    
    // Dispatch custom event to notify HomePage to reload content
    window.dispatchEvent(new Event('contentUpdated'))
  }

  if (!authenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-96 rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-center text-2xl font-bold">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter password"
            className="mb-4 w-full rounded border p-3"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleLogin()
            }}
          />
          <button
            onClick={handleLogin}
            className="w-full rounded bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              View Website
            </Link>
            <button
              onClick={() => {
                setAuthenticated(false)
                localStorage.removeItem('adminAuth')
                window.location.href = '/'
              }}
              className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

              {message && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 font-medium text-center text-lg shadow-md">
                  {message}
                </div>
              )}

        {/* Hero Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Hero Section</h2>
          <label className="mb-2 block">Headline</label>
          <input
            value={content.hero?.headline || ''}
            onChange={e => handleChange('hero', 'headline', e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <label className="mb-2 block">Subtext</label>
          <textarea
            value={content.hero?.subtext || ''}
            onChange={e => handleChange('hero', 'subtext', e.target.value)}
            className="mb-4 w-full rounded border p-2"
            rows={3}
          />

          <label className="mb-2 block">Button Text</label>
          <input
            value={content.hero?.buttonText || ''}
            onChange={e => handleChange('hero', 'buttonText', e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <label className="mb-2 block">Background Image</label>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) handleFileUpload('hero', 'backgroundImage', file)
              }}
              className="mb-2 w-full rounded border p-2 text-sm"
            />
            <p className="mb-2 text-xs text-gray-500">Or enter URL:</p>
            <input
              type="text"
              value={content.hero?.backgroundImage || ''}
              onChange={e => handleChange('hero', 'backgroundImage', e.target.value)}
              className="w-full rounded border p-2"
              placeholder="https://example.com/image.jpg or /hero-bg.jpg"
            />
          </div>
          {content.hero?.backgroundImage && (
            <img
              src={content.hero.backgroundImage}
              alt="Hero background preview"
              className="mb-4 h-32 w-full object-cover rounded-lg"
              onError={e => {
                e.target.style.display = 'none'
              }}
            />
          )}

          <label className="mb-2 block">Background Video URL (optional)</label>
          <input
            type="text"
            value={content.hero?.backgroundVideo || ''}
            onChange={e => handleChange('hero', 'backgroundVideo', e.target.value)}
            className="w-full rounded border p-2"
            placeholder="/hero-bg.mp4 or https://example.com/video.mp4"
          />
          <p className="mt-1 text-xs text-gray-500">
            If both image and video are provided, video will be used
          </p>
        </div>

        {/* About Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">About Section</h2>
          <label className="mb-2 block">Title</label>
          <input
            value={content.about?.title || ''}
            onChange={e => handleChange('about', 'title', e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <label className="mb-2 block">Image</label>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) handleFileUpload('about', 'image', file)
              }}
              className="mb-2 w-full rounded border p-2 text-sm"
            />
            <p className="mb-2 text-xs text-gray-500">Or enter URL:</p>
            <input
              type="text"
              value={content.about?.image || ''}
              onChange={e => handleChange('about', 'image', e.target.value)}
              className="w-full rounded border p-2"
              placeholder="/about-photo.jpg or https://example.com/image.jpg"
            />
          </div>
          {content.about?.image && (
            <img
              src={content.about.image}
              alt="About section preview"
              className="mb-4 h-32 w-full object-cover rounded-lg"
              onError={e => {
                e.target.style.display = 'none'
              }}
            />
          )}

          <label className="mb-2 block">Text</label>
          <textarea
            value={content.about?.text || ''}
            onChange={e => handleChange('about', 'text', e.target.value)}
            className="w-full rounded border p-2"
            rows={6}
          />
        </div>

        {/* Safety Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Safety Section</h2>
          <label className="mb-2 block">Title</label>
          <input
            value={content.safety?.title || ''}
            onChange={e => handleChange('safety', 'title', e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <label className="mb-2 block">Text</label>
          <textarea
            value={content.safety?.text || ''}
            onChange={e => handleChange('safety', 'text', e.target.value)}
            className="mb-4 w-full rounded border p-2"
            rows={6}
          />

          <label className="mb-2 block">Image</label>
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0]
                if (file) handleFileUpload('safety', 'image', file)
              }}
              className="mb-2 w-full rounded border p-2 text-sm"
            />
            <p className="mb-2 text-xs text-gray-500">Or enter URL:</p>
            <input
              type="text"
              value={content.safety?.image || ''}
              onChange={e => handleChange('safety', 'image', e.target.value)}
              className="w-full rounded border p-2"
              placeholder="/safety-photo.jpg or https://example.com/image.jpg"
            />
          </div>
          {content.safety?.image && (
            <img
              src={content.safety.image}
              alt="Safety section preview"
              className="mb-4 h-32 w-full object-cover rounded-lg"
              onError={e => {
                e.target.style.display = 'none'
              }}
            />
          )}
        </div>

        {/* Recognition Section */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Recognition Projects ({content.recognition?.length || 0})
          </h2>
          {content.recognition?.map((project, index) => (
            <div key={index} className="mb-4 rounded-lg border-2 border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Project {index + 1}</h3>
                {content.recognition.length > 1 && (
                  <button
                    onClick={() => {
                      const newRecognition = content.recognition.filter((_, i) => i !== index)
                      setContent(prev => ({ ...prev, recognition: newRecognition }))
                    }}
                    className="rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
              <label className="mb-2 block text-sm">Project Title</label>
              <input
                value={project.title || ''}
                onChange={e => handleArrayChange('recognition', index, 'title', e.target.value)}
                className="mb-3 w-full rounded border p-2"
              />
              <label className="mb-2 block text-sm">Image</label>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0]
                    if (file) handleProjectFileUpload(index, file)
                  }}
                  className="mb-2 w-full rounded border p-2 text-sm"
                />
                <p className="mb-2 text-xs text-gray-500">Or enter URL:</p>
                <input
                  type="text"
                  value={project.image || ''}
                  onChange={e => handleArrayChange('recognition', index, 'image', e.target.value)}
                  className="w-full rounded border p-2"
                  placeholder="/proj1.jpg or https://example.com/image.jpg"
                />
              </div>
              {project.image && (
                <img
                  src={project.image}
                  alt="Project preview"
                  className="mb-3 h-24 w-full object-cover rounded-lg"
                  onError={e => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <label className="mb-2 block text-sm">Award/Certification</label>
              <input
                value={project.award || ''}
                onChange={e => handleArrayChange('recognition', index, 'award', e.target.value)}
                className="w-full rounded border p-2"
              />
            </div>
          ))}
          <button
            onClick={() => {
              const newRecognition = [...(content.recognition || []), { title: 'New Project', award: 'Award Name' }]
              setContent(prev => ({ ...prev, recognition: newRecognition }))
            }}
            className="mt-2 rounded border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-2 text-gray-700 transition hover:border-blue-600 hover:bg-blue-50"
          >
            + Add New Project
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="rounded bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default AdminPage
