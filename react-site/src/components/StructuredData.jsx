import { useEffect } from 'react'

/**
 * StructuredData Component
 *
 * Adds Schema.org JSON-LD structured data to the page for better SEO
 * and rich snippets in search results.
 */
const StructuredData = () => {
  useEffect(() => {
    // LocalBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://usmechanicalllc.com/#organization',
      name: 'U.S. Mechanical LLC',
      alternateName: 'US Mechanical',
      description:
        'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond. Specializing in HVAC, Plumbing, and Process Piping.',
      url: 'https://usmechanicalllc.com',
      telephone: '+1-801-785-6028',
      email: 'info@usmechanicalllc.com',
      foundingDate: '1963',
      priceRange: '$$',
      image: 'https://usmechanicalllc.com/logo.png',
      logo: {
        '@type': 'ImageObject',
        url: 'https://usmechanicalllc.com/logo.png',
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
      url: 'https://usmechanicalllc.com',
      logo: 'https://usmechanicalllc.com/logo.png',
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
      url: 'https://usmechanicalllc.com',
      description: 'Trusted mechanical contracting since 1963, serving Utah, Nevada, and beyond.',
      publisher: {
        '@type': 'Organization',
        name: 'U.S. Mechanical LLC',
        logo: {
          '@type': 'ImageObject',
          url: 'https://usmechanicalllc.com/logo.png',
        },
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://usmechanicalllc.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // BreadcrumbList Schema (for homepage)
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://usmechanicalllc.com',
        },
      ],
    }

    // Create script elements for each schema
    const schemas = [localBusinessSchema, organizationSchema, websiteSchema, breadcrumbSchema]

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
  }, [])

  return null // This component doesn't render anything visible
}

export default StructuredData
