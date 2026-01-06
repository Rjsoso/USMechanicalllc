import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
  apiVersion: '2023-05-03',
})

async function createPortfolioSection() {
  const portfolioSection = {
    _type: 'portfolioSection',
    sectionTitle: 'Our Projects',
    sectionDescription: 'Explore our completed projects by category',
  }

  try {
    // Check if portfolio section already exists
    const existing = await client.fetch(`*[_type == "portfolioSection"][0]`)
    
    if (existing) {
      console.log('Portfolio section already exists:', existing._id)
      return
    }

    const result = await client.create(portfolioSection)
    console.log('✅ Portfolio section created successfully:', result._id)
  } catch (error) {
    console.error('❌ Error creating portfolio section:', error)
  }
}

createPortfolioSection()

