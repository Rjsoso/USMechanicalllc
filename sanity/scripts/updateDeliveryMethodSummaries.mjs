import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const updates = {
  'Plan Spec': {
    title: 'Plan & Spec',
    summary: 'Competitive bidding and expert installation based on completed construction documents.',
  },
  'Design- Assist': {
    title: 'Design-Assist',
    summary: 'Early collaboration that improves constructability, efficiency, and project value.',
  },
  'Design- Build': {
    title: 'Design-Build',
    summary: 'One team managing design, coordination, fabrication, and installation from start to finish.',
  },
  'Target Value Design': {
    title: 'Target Value Design',
    summary: 'Budget-driven design that maximizes performance while controlling project costs.',
  },
}

async function main() {
  const doc = await client.fetch(
    `*[_type == "ourServices"][0]{ _id, deliveryMethods }`
  )

  if (!doc?._id) {
    throw new Error('ourServices document not found')
  }

  const nextMethods = (doc.deliveryMethods || []).map((method) => {
    const update = updates[method.title]
    if (!update) {
      console.warn(`No update found for delivery method titled "${method.title}" — leaving unchanged.`)
      return method
    }
    return { ...method, title: update.title, summary: update.summary }
  })

  await client.patch(doc._id).set({ deliveryMethods: nextMethods }).commit()
  console.log(`✅ Updated ${nextMethods.length} delivery methods on document ${doc._id}`)
}

main().catch((err) => {
  console.error('❌ Update failed:', err.message)
  process.exit(1)
})
