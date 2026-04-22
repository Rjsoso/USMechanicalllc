import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { getSiteUrl, getSiteUrlSlash } from '../utils/siteUrl'

/**
 * SEO Component
 *
 * Dynamic SEO component that allows each page to set custom meta tags
 * for better search engine optimization and social media sharing.
 *
 * Usage:
 * <SEO
 *   title="Custom Page Title"
 *   description="Custom page description"
 *   keywords="keyword1, keyword2, keyword3"
 *   ogImage="https://example.com/custom-image.jpg"
 *   url="https://example.com/page"
 * />
 */
const SEO = ({
  title = 'US Mechanical | Plumbing & HVAC Experts | Since 1963',
  description = 'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Plumbing, HVAC, and design-build specialists.',
  keywords = 'mechanical contractors, HVAC contractors, plumbing contractors, commercial HVAC, industrial plumbing, Utah contractors, Nevada contractors',
  ogImage = `${getSiteUrl()}/og-image.png`,
  url = getSiteUrlSlash(),
  type = 'website',
  author = 'U.S. Mechanical LLC',
  noindex = false,
  prerenderStatusCode = null,
}) => {
  useEffect(() => {
    document.title = title

    const updateMetaTag = (attr, attrValue, content) => {
      let element = document.querySelector(`meta[${attr}="${attrValue}"]`)
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        element.setAttribute(attr, attrValue)
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }

    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)
    updateMetaTag('name', 'author', author)
    updateMetaTag(
      'name',
      'robots',
      noindex ? 'noindex, follow' : 'index, follow'
    )

    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:url', url)
    updateMetaTag('property', 'og:type', type)

    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', ogImage)
    updateMetaTag('name', 'twitter:url', url)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', url)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', url)
      document.head.appendChild(canonical)
    }

    // Hint to crawlers that support it (e.g. Googlebot's dynamic renderer)
    // that this SPA response should be treated as the given HTTP status.
    const existingStatus = document.querySelector(
      'meta[name="prerender-status-code"]'
    )
    if (prerenderStatusCode) {
      if (existingStatus) {
        existingStatus.setAttribute('content', String(prerenderStatusCode))
      } else {
        const el = document.createElement('meta')
        el.setAttribute('name', 'prerender-status-code')
        el.setAttribute('content', String(prerenderStatusCode))
        document.head.appendChild(el)
      }
    } else if (existingStatus) {
      existingStatus.remove()
    }
  }, [title, description, keywords, ogImage, url, type, author, noindex, prerenderStatusCode])

  return null
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
  noindex: PropTypes.bool,
  prerenderStatusCode: PropTypes.number,
}

export default SEO
