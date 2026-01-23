import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
})

async function checkHeroFields() {
  console.log('Checking Hero Section document for all fields...\n')

  try {
    const hero = await client.fetch(`*[_id == "heroSection"][0]`)
    
    if (!hero) {
      console.log('No heroSection document found')
      return
    }

    console.log('Hero Section Document Fields:')
    console.log('=====================================')
    console.log(JSON.stringify(hero, null, 2))
    console.log('\n\nField Summary:')
    console.log('=====================================')
    Object.keys(hero).forEach(key => {
      console.log(`- ${key}: ${typeof hero[key]}`)
    })

  } catch (error) {
    console.error('Error:', error)
  }
}

checkHeroFields()
