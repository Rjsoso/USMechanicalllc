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

// Live client for real-time listeners and fresh re-fetches (bypasses CDN)
export const liveClient = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  perspective: 'published',
})

// Note: Write operations should be performed through Sanity Studio or backend APIs
// NEVER expose write tokens in client-side code

const builder = imageUrlBuilder(client)
export const urlFor = source => builder.image(source)

/**
 * Build a responsive srcSet string for a Sanity CDN image URL.
 * Sanity's CDN accepts ?w=N to resize on the fly, so we can safely append
 * widths without hitting the underlying bucket more than once per size.
 *
 * @param {string} baseUrl - Sanity asset URL (without query params).
 * @param {number[]} widths - Widths in px to include (e.g. [400, 640, 800, 1200]).
 * @param {object} [opts]
 * @param {number} [opts.quality=75] - JPEG quality.
 * @param {string} [opts.format='format'] - Sanity auto format hint.
 * @returns {string} Comma-separated srcSet string.
 */
export function buildSanitySrcSet(baseUrl, widths, { quality = 75, format = 'format' } = {}) {
  if (!baseUrl) return ''
  // Strip any existing query to avoid duplicate params.
  const clean = baseUrl.split('?')[0]
  return widths
    .map((w) => `${clean}?w=${w}&q=${quality}&auto=${format} ${w}w`)
    .join(', ')
}

/** About/home carousel: logical desktop slot ~900px — need ≥2× width for crisp Retina */
export const ABOUT_CAROUSEL_SRC_WIDTHS = [480, 720, 960, 1280, 1600, 1920]
export const ABOUT_CAROUSEL_FALLBACK_W = 1280
export const ABOUT_CAROUSEL_QUALITY = 82

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
