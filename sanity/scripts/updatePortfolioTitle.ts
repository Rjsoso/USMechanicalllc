import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || '',
  apiVersion: '2023-05-03',
})

async function updatePortfolioTitle() {
  try {
    // Fetch the existing portfolio section
    const existing = await client.fetch(`*[_type == "portfolioSection"][0]`)
    
    if (!existing) {
      console.log('❌ No portfolio section found')
      return
    }

    console.log('Current title:', existing.sectionTitle)

    // Update the title to "Portfolio"
    const result = await client
      .patch(existing._id)
      .set({ sectionTitle: 'Portfolio' })
      .commit()

    console.log('✅ Portfolio section title updated successfully!')
    console.log('New title:', result.sectionTitle)
  } catch (error) {
    console.error('❌ Error updating portfolio section:', error)
  }
}

updatePortfolioTitle()
