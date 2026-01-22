/**
 * Print published Hero + Header values (production dataset)
 *
 * Run:
 *   cd sanity
 *   npx ts-node scripts/printHeroAndHeader.ts
 *
 * This is a *read-only* script. It helps confirm what the website should be seeing.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
})

async function main() {
  const hero = await client.fetch(
    `*[_id=="heroSection"][0]{
      _id,
      _updatedAt,
      headline,
      subtext,
      buttonText,
      buttonLink,
      "backgroundUrl": backgroundImage.asset->url,
      "carouselUrls": carouselImages[].image.asset->url
    }`
  )

  const header = await client.fetch(
    `*[_id=="headerSection"][0]{
      _id,
      _updatedAt,
      "headerLogoUrl": logo.asset->url,
      "navLinksCount": count(navLinks)
    }`
  )

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ hero, header }, null, 2))
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exitCode = 1
})

