// Default content structure
const defaultContent = {
  hero: {
    headline: 'Over 55 Years of Trusted Mechanical Contracting Excellence',
    subtext: 'Providing top-quality plumbing, HVAC, and mechanical services across the Intermountain and Southwest regions.',
    buttonText: 'Request a Quote',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
  },
  about: {
    title: 'Our History',
    text: "U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry.",
  },
  recognition: [],
  testimonials: { testimonials: [] },
  contact: {},
  companyInfo: {
    name: 'U.S. Mechanical, LLC',
    offices: ['Provo, UT', 'Las Vegas, NV'],
  },
}

// Get content from localStorage if admin has made changes, otherwise use default
export function getContent() {
  try {
    const saved = localStorage.getItem('usMechanicalContent')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge with defaults to ensure all required keys exist
      return { ...defaultContent, ...parsed }
    }
  } catch (error) {
    console.error('Error parsing saved content:', error)
  }
  return defaultContent
}

// Save content to localStorage
export function saveContent(content) {
  localStorage.setItem('usMechanicalContent', JSON.stringify(content))
  return true
}

