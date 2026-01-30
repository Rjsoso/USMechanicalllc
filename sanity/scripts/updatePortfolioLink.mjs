#!/usr/bin/env node
// Revert Portfolio link in navigation drawer from /portfolio back to #portfolio
// This restores the portfolio as a home page section instead of a separate page

import { getCliClient } from 'sanity/cli'

// Get Sanity client with CLI authentication (uses --with-user-token)
const client = getCliClient()

console.log('\n🔧 Reverting Portfolio link in navigation drawer...\n')

async function updatePortfolioLink() {
  try {
    // 1. Fetch current headerSection document
    console.log('📥 Fetching current headerSection data...')
    const headerData = await client.fetch(`*[_type == "headerSection"][0]{
      _id,
      _rev,
      sections[] {
        label,
        links[] {
          label,
          href,
          ariaLabel
        }
      }
    }`)

    if (!headerData) {
      console.error('❌ No headerSection document found!')
      process.exit(1)
    }

    console.log('✓ Found headerSection document')

    // 2. Find and revert Portfolio link
    let updated = false
    const updatedSections = headerData.sections.map(section => {
      if (section.label === 'SERVICES') {
        const updatedLinks = section.links.map(link => {
          if (link.label === 'Portfolio' && link.href === '/portfolio') {
            console.log(`\n📝 Reverting Portfolio link:`)
            console.log(`   From: ${link.href}`)
            console.log(`   To:   #portfolio`)
            updated = true
            return { ...link, href: '#portfolio' }
          }
          return link
        })
        return { ...section, links: updatedLinks }
      }
      return section
    })

    if (!updated) {
      console.log('\n⚠️  Portfolio link already reverted or not found with href="/portfolio"')
      console.log('Current sections:', JSON.stringify(headerData.sections, null, 2))
      process.exit(0)
    }

    // 3. Patch the document
    console.log('\n💾 Updating Sanity document...')
    await client
      .patch(headerData._id)
      .set({ sections: updatedSections })
      .commit()

    console.log('✅ Successfully reverted Portfolio link in Sanity CMS!\n')
    console.log('🎉 Navigation drawer will now scroll to #portfolio section on home page\n')

    // 4. Verify the update
    console.log('🔍 Verifying update...')
    const verifyData = await client.fetch(`*[_type == "headerSection"][0]{
      sections[] {
        label,
        links[] {
          label,
          href
        }
      }
    }`)

    const servicesSection = verifyData.sections.find(s => s.label === 'SERVICES')
    const portfolioLink = servicesSection?.links.find(l => l.label === 'Portfolio')

    if (portfolioLink?.href === '#portfolio') {
      console.log('✓ Verification passed: Portfolio link is now #portfolio\n')
    } else {
      console.log('⚠️  Verification failed: Portfolio link may not have reverted correctly')
      console.log('Current value:', portfolioLink?.href)
    }

  } catch (error) {
    console.error('❌ Error updating Portfolio link:', error)
    throw error
  }
}

// Run the update
updatePortfolioLink().catch(error => {
  console.error('Failed to update Portfolio link:', error)
  process.exit(1)
})
