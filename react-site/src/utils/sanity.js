import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: import.meta.env.DEV ? false : true, // Disable CDN in dev for fresh data
  // Add withCredentials for CORS support
  withCredentials: false,
  // Use apiVersion date to avoid deprecation warnings
  perspective: 'published', // Only fetch published documents
})

// Note: Write operations should be performed through Sanity Studio or backend APIs
// NEVER expose write tokens in client-side code

const builder = imageUrlBuilder(client)
export const urlFor = source => builder.image(source)

// Helper function to fetch content from Sanity
export async function fetchContent(query, params = {}) {
  try {
    const data = await client.fetch(query, params)
    return data
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return null
  }
}

// Queries for different sections
export const queries = {
  hero: `*[_type == "heroSection"][0]`,
  about: `*[_type == "aboutAndSafety"][0]`,
  safety: `*[_type == "aboutAndSafety"][0]`,
  contact: `*[_type == "contact"][0]`,
}
