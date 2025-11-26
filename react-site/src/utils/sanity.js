import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Unified Sanity client configuration
const SANITY_CONFIG = {
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
}

// Read-only client for public site
// Disable CDN to ensure fresh content after updates
export const client = createClient({
  ...SANITY_CONFIG,
  useCdn: false, // Disable CDN to bypass cache and see updates immediately
  perspective: 'published', // Only fetch published content
  apiVersion: '2023-05-03',
  withCredentials: false,
})

// Write-capable client for admin operations (uses token)
export const writeClient = createClient({
  ...SANITY_CONFIG,
  useCdn: false, // don't use CDN for writes
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN, // Read from environment variable
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => {
  if (!source) return null
  try {
    return builder.image(source)
  } catch (error) {
    console.error('Error building image URL:', error)
    return null
  }
}

// Helper to add cache-busting to image URLs
export const urlForWithCacheBust = (source) => {
  if (!source) return null
  try {
    const imageBuilder = builder.image(source)
    const url = imageBuilder.url()
    return url ? `${url}?t=${Date.now()}` : null
  } catch (error) {
    console.error('Error building image URL:', error)
    return null
  }
}

// Helper function to fetch content from Sanity with cache-busting
export async function fetchContent(query, params = {}) {
  try {
    // Add cache-busting timestamp to ensure fresh data
    const cacheBust = `?t=${Date.now()}`
    const data = await client.fetch(query, {
      ...params,
      // Force fresh fetch by including timestamp in query
      _cacheBust: Date.now(),
    })
    return data
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return null
  }
}

// Helper function to create/update content in Sanity
export async function createOrUpdateDocument(doc) {
  try {
    if (!import.meta.env.VITE_SANITY_WRITE_TOKEN) {
      console.error('Write token not configured. Cannot save to Sanity.')
      return null
    }
    
    // If document has _id, update it; otherwise create new
    if (doc._id) {
      return await writeClient.createOrReplace(doc)
    } else {
      return await writeClient.create(doc)
    }
  } catch (error) {
    console.error('Error saving to Sanity:', error)
    return null
  }
}

// Queries for different sections matching content.json structure
export const queries = {
  hero: `*[_type == "heroSection"][0]`,
  about: `*[_type == "aboutAndSafety"][0]`,
  safety: `*[_type == "aboutAndSafety"][0]`,
  recognition: `*[_type == "recognitionProject"] | order(_createdAt asc)`,
  companyInfo: `*[_type == "companyInfo"][0]`, // Fixed: Changed from "companyInformation" to "companyInfo"
}

