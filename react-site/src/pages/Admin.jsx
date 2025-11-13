import { useState, useEffect } from 'react'
import { client, writeClient, urlFor } from '../utils/sanity'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import AboutAndSafety from '../components/AboutAndSafety'
import RecognitionSection from '../components/RecognitionSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'

// Error boundary component for preview sections
function PreviewSection({ children, sectionName }) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Reset error state when component changes
    setHasError(false)
    setError(null)
  }, [children])

  if (hasError) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg m-4">
        <h3 className="text-red-800 font-semibold mb-2">Error loading {sectionName}</h3>
        <p className="text-red-600 text-sm mb-4">{error?.message || 'Unknown error'}</p>
        <button
          onClick={() => {
            setHasError(false)
            setError(null)
            window.location.reload()
          }}
          className="text-red-700 hover:text-red-900 underline text-sm"
        >
          Reload page
        </button>
      </div>
    )
  }

  try {
    return <>{children}</>
  } catch (err) {
    setHasError(true)
    setError(err)
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg m-4">
        <h3 className="text-red-800 font-semibold mb-2">Error loading {sectionName}</h3>
        <p className="text-red-600 text-sm">{err.message}</p>
      </div>
    )
  }
}

// urlFor is now imported from '../utils/sanity'

export default function Admin() {
  const [activeSection, setActiveSection] = useState(null)
  const [hoveredSection, setHoveredSection] = useState(null)
  const [content, setContent] = useState({})
  const [saving, setSaving] = useState(false)
  const [isDraftMode, setIsDraftMode] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sections = [
    { id: 'headerSection', title: 'Header' },
    { id: 'heroSection', title: 'Hero Section' },
    { id: 'aboutAndSafety', title: 'About & Safety' },
    { id: 'recognitionProject', title: 'Recognition Projects' },
    { id: 'contactSection', title: 'Contact Section' },
    { id: 'companyInformation', title: 'Footer Info' },
  ]

  useEffect(() => {
    const subscriptions = []
    setLoading(true)
    setError(null)

    async function loadOrCreateSections() {
      try {
        console.log('🔄 Loading admin sections...')
        const results = {}

        for (const s of sections) {
          try {
            const query = isDraftMode
              ? `*[_type == "${s.id}"][0]` // includes drafts
              : `*[_type == "${s.id}" && !(_id in path("drafts.**"))][0]` // published only

            console.log(`📡 Fetching ${s.id}...`)
            let doc = await client.fetch(query)
            console.log(`✅ Fetched ${s.id}:`, doc ? 'Found' : 'Not found')

            // If missing, create a new one
            if (!doc) {
              try {
                console.log(`🆕 Creating new document for ${s.id}...`)
                
                if (!import.meta.env.VITE_SANITY_WRITE_TOKEN) {
                  console.warn(`⚠️ No write token found. Cannot create ${s.id}.`)
                  continue
                }
                
                doc = await writeClient.create({
                  _type: s.id,
                  _id: `${s.id}-auto`,
                  title: s.title || '',
                })
                console.log(`✅ Created new Sanity doc for ${s.title}`)
              } catch (createError) {
                console.error(`❌ Error creating ${s.id}:`, createError)
                // Continue with null if creation fails
                doc = null
              }
            }

            if (doc) {
              results[s.id] = doc

              // Only set up live listener in draft mode
              if (isDraftMode) {
                try {
                  const sub = client
                    .listen(`*[_id == "${doc._id}"]`)
                    .subscribe(update => {
                      if (update.result) {
                        console.log(`🔄 Live update for ${s.id}`)
                        setContent(prev => ({
                          ...prev,
                          [s.id]: update.result,
                        }))
                      }
                    })

                  subscriptions.push(sub)
                } catch (listenError) {
                  console.error(`❌ Error setting up listener for ${s.id}:`, listenError)
                }
              }
            } else {
              console.warn(`⚠️ No document found or created for ${s.id}`)
            }
          } catch (sectionError) {
            console.error(`❌ Error loading section ${s.id}:`, sectionError)
            // Continue with other sections even if one fails
          }
        }

        console.log('✅ All sections loaded:', Object.keys(results))
        setContent(results)
        setLoading(false)
      } catch (error) {
        console.error('❌ Critical error loading sections:', error)
        setError(`Failed to load content: ${error.message || 'Unknown error'}. Please check the browser console for details.`)
        setLoading(false)
      }
    }

    loadOrCreateSections()

    // Cleanup subscriptions when leaving page or mode changes
    return () => {
      subscriptions.forEach(s => {
        try {
          s.unsubscribe()
        } catch (e) {
          console.error('Error unsubscribing:', e)
        }
      })
    }
  }, [isDraftMode])

  const handleFieldChange = async (sectionId, field, value) => {
    // Capture current document ID before updating state
    let docId = null
    setContent(prev => {
      docId = prev[sectionId]?._id
      return {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [field]: value,
        },
      }
    })

    // Save to Sanity immediately (auto-save as you type)
    if (docId) {
      try {
        await writeClient.patch(docId).set({ [field]: value }).commit()
      } catch (error) {
        console.error(`Error saving ${field} to Sanity:`, error)
        // Revert local state on error
        setContent(prev => {
          const previousValue = prev[sectionId]?.[field]
          return {
            ...prev,
            [sectionId]: {
              ...prev[sectionId],
              [field]: previousValue, // Revert to previous value
            },
          }
        })
      }
    }
  }

  // Keep handleChange as alias for backward compatibility
  const handleChange = handleFieldChange

  const handleImageChange = async (sectionId, field, event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      // Capture document ID before updating state
      let docId = null
      setContent(prev => {
        docId = prev[sectionId]?._id
        return prev // Don't update yet, just capture ID
      })

      // Upload image asset to Sanity
      const asset = await writeClient.assets.upload('image', file, {
        filename: file.name,
      })

      // Create image reference object
      const imageRef = { _type: 'image', asset: { _ref: asset._id } }

      // Update local state immediately
      setContent(prev => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          [field]: imageRef,
        },
      }))

      // Save to Sanity immediately (auto-save)
      if (docId) {
        await writeClient.patch(docId).set({ [field]: imageRef }).commit()
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('❌ Error uploading image. Please check console.')
    }
  }

  // Keep handleImageUpload as alias for backward compatibility
  const handleImageUpload = handleImageChange

  const handleSave = async section => {
    const data = content[section]
    if (!data?._id) {
      // Create new document if it doesn't exist
      setSaving(true)
      try {
        const result = await writeClient.create({
          _type: section,
          ...data,
        })
        setContent(prev => ({
          ...prev,
          [section]: { ...data, _id: result._id },
        }))
        alert(`✅ ${section} created successfully!`)
      } catch (error) {
        console.error('Error creating:', error)
        alert(`❌ Error creating ${section}. Please check console.`)
      } finally {
        setSaving(false)
      }
      return
    }

    setSaving(true)
    try {
      await writeClient.patch(data._id).set(data).commit()
      alert(`✅ ${section} saved successfully!`)
    } catch (error) {
      console.error('Error saving:', error)
      alert(`❌ Error saving ${section}. Please check console.`)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Admin Panel</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left: Website Preview */}
      <div className="w-2/3 overflow-y-auto border-r border-gray-300 bg-white relative">
        <header className="flex items-center justify-between bg-gray-900 text-white px-6 py-3 sticky top-0 z-10">
          <h1 className="text-lg font-semibold">U.S. Mechanical Website Preview</h1>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm">{isDraftMode ? 'Draft Mode' : 'Live Mode'}</span>
              <div
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isDraftMode ? 'bg-blue-500' : 'bg-gray-500'
                }`}
                onClick={() => setIsDraftMode(!isDraftMode)}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isDraftMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Header */}
        <div
          onMouseEnter={() => setHoveredSection('headerSection')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('headerSection')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'headerSection'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'headerSection'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'headerSection' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: Header
            </div>
          )}
          <PreviewSection sectionName="Header">
            <Header />
          </PreviewSection>
        </div>

        {/* Hero */}
        <div
          onMouseEnter={() => setHoveredSection('heroSection')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('heroSection')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'heroSection'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'heroSection'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'heroSection' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: Hero Section
            </div>
          )}
          <PreviewSection sectionName="Hero Section">
            <HeroSection />
          </PreviewSection>
        </div>

        {/* About + Safety */}
        <div
          onMouseEnter={() => setHoveredSection('aboutAndSafety')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('aboutAndSafety')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'aboutAndSafety'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'aboutAndSafety'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'aboutAndSafety' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: About & Safety
            </div>
          )}
          <PreviewSection sectionName="About & Safety">
            <AboutAndSafety />
          </PreviewSection>
        </div>

        {/* Recognition */}
        <div
          onMouseEnter={() => setHoveredSection('recognitionProject')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('recognitionProject')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'recognitionProject'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'recognitionProject'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'recognitionProject' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: Recognition Projects
            </div>
          )}
          <PreviewSection sectionName="Recognition Projects">
            <RecognitionSection />
          </PreviewSection>
        </div>

        {/* Contact */}
        <div
          onMouseEnter={() => setHoveredSection('contactSection')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('contactSection')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'contactSection'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'contactSection'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'contactSection' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: Contact Section
            </div>
          )}
          <PreviewSection sectionName="Contact Section">
            <ContactSection />
          </PreviewSection>
        </div>

        {/* Footer */}
        <div
          onMouseEnter={() => setHoveredSection('companyInformation')}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => setActiveSection('companyInformation')}
          className={`relative cursor-pointer transition-all duration-200 ${
            hoveredSection === 'companyInformation'
              ? 'ring-4 ring-blue-400 ring-opacity-50'
              : activeSection === 'companyInformation'
              ? 'ring-4 ring-blue-600 ring-opacity-70'
              : ''
          }`}
        >
          {hoveredSection === 'companyInformation' && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-br-lg z-10">
              Click to edit: Footer Info
            </div>
          )}
          <PreviewSection sectionName="Footer">
            <Footer />
          </PreviewSection>
        </div>
      </div>

      {/* Right: Editor Controls */}
      <div className="w-1/3 overflow-y-auto p-6 bg-gray-50 relative z-20">
        {activeSection ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Editing: {sections.find(s => s.id === activeSection)?.title}
            </h2>

            {content[activeSection] ? (
              Object.keys(content[activeSection])
                .filter(
                  key =>
                    key !== '_id' &&
                    key !== '_type' &&
                    key !== '_rev' &&
                    key !== '_createdAt' &&
                    key !== '_updatedAt'
                )
                .map(field => {
                  const value = content[activeSection][field]
                  
                  // Handle array fields (like navLinks)
                  if (Array.isArray(value)) {
                    return (
                      <div key={field} className="mb-4">
                        <label className="block font-medium capitalize mb-2">{field}</label>
                        {value.map((item, index) => (
                          <div key={index} className="mb-3 p-3 border rounded bg-white">
                            {typeof item === 'object' && item !== null ? (
                              Object.keys(item).map(subField => (
                                <div key={subField} className="mb-2">
                                  <label className="block text-sm text-gray-600 mb-1 capitalize">
                                    {subField}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full border p-2 rounded text-sm"
                                    value={item[subField] || ''}
                                    onChange={e => {
                                      const newArray = [...value]
                                      newArray[index] = { ...item, [subField]: e.target.value }
                                      handleFieldChange(activeSection, field, newArray)
                                    }}
                                  />
                                </div>
                              ))
                            ) : (
                              <input
                                type="text"
                                className="w-full border p-2 rounded"
                                value={item || ''}
                                onChange={e => {
                                  const newArray = [...value]
                                  newArray[index] = e.target.value
                                  handleFieldChange(activeSection, field, newArray)
                                }}
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const newArray = value.filter((_, i) => i !== index)
                                handleFieldChange(activeSection, field, newArray)
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newArray = [...value, field === 'navLinks' ? { label: '', href: '' } : '']
                            handleFieldChange(activeSection, field, newArray)
                          }}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          + Add Item
                        </button>
                      </div>
                    )
                  }
                  
                  // Handle string fields
                  if (typeof value === 'string') {
                    return (
                      <div key={field} className="mb-4">
                        <label className="block font-medium capitalize mb-1">{field}</label>
                        <textarea
                          className="w-full border p-2 rounded"
                          rows={field.toLowerCase().includes('text') ? 6 : 3}
                          value={value}
                          onChange={e => handleFieldChange(activeSection, field, e.target.value)}
                        />
                      </div>
                    )
                  }
                  
                  // Handle image fields
                  if (value?._type === 'image') {
                    try {
                      return (
                        <div key={field} className="mb-4">
                          <label className="block font-medium capitalize mb-1">{field}</label>
                          <img
                            src={urlFor(value).width(300).url()}
                            alt={field}
                            className="rounded mb-2 w-full"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageChange(activeSection, field, e)}
                            className="text-sm"
                          />
                        </div>
                      )
                    } catch (error) {
                      console.error(`Error rendering image for ${field}:`, error)
                      return (
                        <div key={field} className="mb-4">
                          <label className="block font-medium capitalize mb-1">{field}</label>
                          <p className="text-sm text-red-600">Error loading image</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageChange(activeSection, field, e)}
                            className="text-sm"
                          />
                        </div>
                      )
                    }
                  }
                  
                  return null
                })
            ) : (
              <p className="text-gray-500">Loading content...</p>
            )}

            <button
              onClick={() => handleSave(activeSection)}
              disabled={saving}
              className={`mt-3 px-4 py-2 rounded text-white ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <p className="text-gray-600 mt-10 text-center">
            👈 Hover and click any section in the website preview to start editing
          </p>
        )}
      </div>
    </div>
  )
}
