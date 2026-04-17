import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import getSiteUrl from '../utils/siteUrl'

/**
 * StructuredData Component
 *
 * Adds Schema.org JSON-LD structured data to the page for better SEO
 * and rich snippets in search results.
 */
const StructuredData = () => {
  const location = useLocation()
  
  useEffect(() => {
    const baseUrl = getSiteUrl()
    // LocalBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: 'U.S. Mechanical LLC',
      alternateName: 'US Mechanical',
      description:
        'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Specializing in HVAC, Plumbing, and Process Piping.',
      url: baseUrl,
      telephone: '+1-801-785-6028',
      email: 'info@usmechanicalllc.com',
      foundingDate: '1963',
      priceRange: '$$',
      image: `${baseUrl}/logo.svg`,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.svg`,
        width: '192',
        height: '192',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '472 South 640 West',
        addressLocality: 'Pleasant Grove',
        addressRegion: 'UT',
        postalCode: '84062',
        addressCountry: 'US',
      },
      areaServed: [
        {
          '@type': 'State',
          name: 'Utah',
        },
        {
          '@type': 'State',
          name: 'Nevada',
        },
        {
          '@type': 'State',
          name: 'Arizona',
        },
        {
          '@type': 'State',
          name: 'California',
        },
        {
          '@type': 'State',
          name: 'Wyoming',
        },
      ],
      serviceArea: [
        {
          '@type': 'City',
          name: 'Pleasant Grove',
          containedIn: {
            '@type': 'State',
            name: 'Utah',
          },
        },
        {
          '@type': 'City',
          name: 'Las Vegas',
          containedIn: {
            '@type': 'State',
            name: 'Nevada',
          },
        },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Mechanical Contracting Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'HVAC Services',
              description:
                'Heating, ventilation, and air conditioning services for commercial and industrial projects.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Plumbing Services',
              description:
                'Complete plumbing solutions including installation, maintenance, and repair services.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Process Piping',
              description:
                'Specialized process piping systems for industrial and manufacturing facilities.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Design-Build Services',
              description: 'Comprehensive design-build solutions for mechanical systems.',
            },
          },
        ],
      },
      sameAs: [
        // Add social media profiles here when available
        // "https://www.facebook.com/usmechanical",
        // "https://www.linkedin.com/company/usmechanical"
      ],
    }

    // Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'U.S. Mechanical LLC',
      url: baseUrl,
      logo: `${baseUrl}/logo.svg`,
      foundingDate: '1963',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-801-785-6028',
        contactType: 'customer service',
        email: 'info@usmechanicalllc.com',
        areaServed: ['US'],
        availableLanguage: ['English'],
      },
    }

    // WebSite Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'U.S. Mechanical LLC',
      url: baseUrl,
      description: 'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond.',
      publisher: {
        '@type': 'Organization',
        name: 'U.S. Mechanical LLC',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.svg`,
        },
      },
    }

    // BreadcrumbList Schema (dynamic based on current page)
    const getBreadcrumbSchema = () => {
      const breadcrumbs = [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
      ]

      const path = location.pathname
      if (path === '/about') {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: 2,
          name: 'About Us',
          item: `${baseUrl}/about`,
        })
      } else if (path === '/careers') {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: 2,
          name: 'Careers',
          item: `${baseUrl}/careers`,
        })
      } else if (path === '/portfolio') {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: 2,
          name: 'Portfolio',
          item: `${baseUrl}/portfolio`,
        })
      } else if (path === '/contact') {
        breadcrumbs.push({
          '@type': 'ListItem',
          position: 2,
          name: 'Contact',
          item: `${baseUrl}/contact`,
        })
      }

      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs,
      }
    }

    // SiteNavigationElement Schema - helps Google understand main navigation
    const siteNavigationSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Main Navigation',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Home',
          url: baseUrl,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'About Us',
          url: `${baseUrl}/about`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Services',
          url: `${baseUrl}/#services`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Portfolio',
          url: `${baseUrl}/portfolio`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Careers',
          url: `${baseUrl}/careers`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'Contact',
          url: `${baseUrl}/contact`,
        },
      ],
    }

    // WebPage Schema - specific to current page
    const getWebPageSchema = () => {
      const baseSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${baseUrl}${location.pathname}`,
        url: `${baseUrl}${location.pathname}`,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: 'en-US',
      }

      const path = location.pathname
      if (path === '/') {
        return {
          ...baseSchema,
          '@type': 'WebPage',
          name: 'US Mechanical - Plumbing & HVAC Experts Since 1963',
          description:
            'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Plumbing, HVAC, and design-build specialists.',
        }
      } else if (path === '/about') {
        return {
          ...baseSchema,
          '@type': 'AboutPage',
          name: 'About Us - Company Background',
          description:
            "Learn about U.S. Mechanical's history since 1963, our team, offices, and commitment to safety.",
        }
      } else if (path === '/careers') {
        return {
          ...baseSchema,
          '@type': 'WebPage',
          name: 'Careers - Join Our Team',
          description:
            'Join the U.S. Mechanical team. Competitive pay, great benefits, and career growth opportunities.',
        }
      } else if (path === '/portfolio') {
        return {
          ...baseSchema,
          '@type': 'CollectionPage',
          name: 'Portfolio - Our Projects',
          description:
            'Explore our portfolio of completed commercial and industrial projects including manufacturing, healthcare, education, and more.',
        }
      } else if (path === '/contact') {
        return {
          ...baseSchema,
          '@type': 'ContactPage',
          name: 'Contact Us - Get a Quote',
          description:
            'Contact US Mechanical for plumbing, HVAC, and mechanical contracting services. Get a free quote today.',
        }
      }

      return baseSchema
    }

    // Create script elements for each schema
    const schemas = [
      localBusinessSchema,
      organizationSchema,
      websiteSchema,
      getBreadcrumbSchema(),
      siteNavigationSchema,
      getWebPageSchema(),
    ]

    const scriptElements = schemas.map((schema, index) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      script.id = `structured-data-${index}`
      return script
    })

    // Add all scripts to head
    scriptElements.forEach(script => {
      document.head.appendChild(script)
    })

    // Cleanup function
    return () => {
      scriptElements.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      })
    }
  }, [location.pathname])

  return null // This component doesn't render anything visible
}

export default StructuredData
