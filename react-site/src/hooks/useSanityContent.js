import { useState, useEffect } from 'react'
import { fetchContent, queries } from '../utils/sanity'
import defaultData from '../data/content.json'

/**
 * Custom hook to fetch content from Sanity CMS
 * Falls back to local content.json if Sanity is not configured
 */
export function useSanityContent() {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadContent = async () => {
      // Check if Sanity is configured
      const projectId = import.meta.env.VITE_SANITY_PROJECT_ID

      if (!projectId || projectId === 'your-project-id' || projectId === '') {
        // Use local data or localStorage
        const savedData = localStorage.getItem('usMechanicalContent')
        if (savedData) {
          try {
            setData(JSON.parse(savedData))
          } catch (err) {
            console.error('Error loading saved data:', err)
            setData(defaultData)
          }
        } else {
          setData(defaultData)
        }
        setLoading(false)
        return
      }

      // Fetch from Sanity
      try {
        setLoading(true)
        const [hero, about, safety, recognition, companyInfo] = await Promise.all([
          fetchContent(queries.hero),
          fetchContent(queries.about),
          fetchContent(queries.safety),
          fetchContent(queries.recognition),
          fetchContent(queries.companyInfo),
        ])

        // Transform Sanity data to match our structure
        const sanityData = {
          hero: hero
            ? {
                headline: hero.headline || defaultData.hero.headline,
                subtext: hero.subtext || defaultData.hero.subtext,
                buttonText: hero.buttonText || defaultData.hero.buttonText,
                backgroundImage: hero.backgroundImage
                  ? hero.backgroundImage.asset?.url || hero.backgroundImage
                  : defaultData.hero.backgroundImage,
              }
            : defaultData.hero,
          about: about
            ? {
                title: about.title || defaultData.about.title,
                text: about.text || defaultData.about.text,
              }
            : defaultData.about,
          safety: safety
            ? {
                title: safety.title || defaultData.safety.title,
                text: safety.text || defaultData.safety.text,
              }
            : defaultData.safety,
          recognition:
            recognition && recognition.length > 0
              ? recognition.map(rec => ({
                  title: rec.title || '',
                  award: rec.award || '',
                }))
              : defaultData.recognition,
          companyInfo: companyInfo || defaultData.companyInfo,
        }

        setData(sanityData)
      } catch (err) {
        console.error('Error fetching from Sanity:', err)
        setError(err)
        // Fallback to default data
        setData(defaultData)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return { data, loading, error }
}
