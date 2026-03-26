/**
 * Single source of truth for the site's base URL.
 * Set VITE_SITE_URL in .env / Vercel for production (no trailing slash).
 */
const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://www.usmechanicalllc.com'

/** Base URL without trailing slash */
export const getSiteUrl = () => SITE_URL.replace(/\/$/, '')

/** Base URL with trailing slash (for canonical, og:url, etc.) */
export const getSiteUrlSlash = () => {
  const base = getSiteUrl()
  return base + '/'
}

export default getSiteUrl
