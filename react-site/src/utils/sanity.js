import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,             // Faster for public website
})

// Write-capable client for admin operations (uses token)
export const writeClient = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // don't use CDN for writes
  token: import.meta.env.VITE_SANITY_WRITE_TOKEN, // Read from environment variable
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

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

// Queries for different sections matching content.json structure
export const queries = {
  hero: `*[_type == "heroSection"][0]`,
  about: `*[_type == "aboutAndSafety"][0]`,
  safety: `*[_type == "aboutAndSafety"][0]`,
  recognition: `*[_type == "recognitionProject"] | order(_createdAt asc)`,
  companyInfo: `*[_type == "companyInfo"][0]`,
}
