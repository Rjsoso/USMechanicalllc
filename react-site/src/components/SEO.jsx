import { useEffect } from 'react'
import PropTypes from 'prop-types'

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
  ogImage = 'https://usmechanical.com/og-image.png',
  url = 'https://usmechanical.com/',
  type = 'website',
  author = 'U.S. Mechanical LLC',
}) => {
  useEffect(() => {
    // Update document title
    document.title = title

    // Function to update or create meta tag
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

    // Update standard meta tags
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)
    updateMetaTag('name', 'author', author)

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:url', url)
    updateMetaTag('property', 'og:type', type)

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:title', title)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', ogImage)
    updateMetaTag('name', 'twitter:url', url)

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) {
      canonical.setAttribute('href', url)
    } else {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      canonical.setAttribute('href', url)
      document.head.appendChild(canonical)
    }
  }, [title, description, keywords, ogImage, url, type, author])

  return null // This component doesn't render anything visible
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogImage: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  author: PropTypes.string,
}

export default SEO
