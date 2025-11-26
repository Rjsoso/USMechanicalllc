// Sync all current website content to Sanity
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env file
const envPath = join(process.cwd(), '.env')
let token = process.env.VITE_SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!token) {
  try {
    const envFile = readFileSync(envPath, 'utf-8')
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        if (key.trim() === 'VITE_SANITY_WRITE_TOKEN' || key.trim() === 'SANITY_API_TOKEN') {
          token = value
        }
      }
    })
  } catch (err) {
    console.log('No .env file found, checking environment variables...')
  }
}

if (!token) {
  console.error('❌ Error: VITE_SANITY_WRITE_TOKEN or SANITY_API_TOKEN not found!')
  console.log('💡 Get your token from: https://www.sanity.io/manage/personal/project/3vpl3hho/api/tokens')
  console.log('💡 Add it to react-site/.env file as: VITE_SANITY_WRITE_TOKEN=your-token-here')
  process.exit(1)
}

const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: token,
})

const documents = [
  {
    _id: 'heroSection',
    _type: 'heroSection',
    headline: 'Building the Future of Mechanical Contracting',
    subtext: 'Excellence in Plumbing, HVAC, and Mechanical Systems since 1963.',
    buttonText: 'Request a Quote',
    buttonLink: '#contact',
  },
  {
    _id: 'aboutAndSafety',
    _type: 'aboutAndSafety',
    aboutTitle: 'About U.S. Mechanical',
    aboutText: `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.`,
  },
  {
    _id: 'safety',
    _type: 'safety',
    title: 'Safety & Risk Management',
    content: `U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.`,
  },
  {
    _id: 'ourServices',
    _type: 'ourServices',
    sectionTitle: 'Our Services',
    descriptionText: '',
    servicesInfo: [
      {
        _key: 'hvac',
        title: 'HVAC',
        description: 'Heating, ventilation, and air conditioning services for commercial and industrial projects.',
      },
      {
        _key: 'plumbing',
        title: 'Plumbing',
        description: 'Complete plumbing solutions including installation, maintenance, and repair services.',
      },
      {
        _key: 'process',
        title: 'Process Piping',
        description: 'Specialized process piping systems for industrial and manufacturing facilities.',
      },
    ],
    services: [],
  },
  {
    _id: 'companyStats',
    _type: 'companyStats',
    stats: [
      {
        _key: 'years',
        label: 'Years of Experience',
        value: '62',
      },
      {
        _key: 'projects',
        label: 'Projects Completed',
        value: '1500+',
      },
      {
        _key: 'employees',
        label: 'Team Members',
        value: '150+',
      },
    ],
  },
  {
    _id: 'companyInfo',
    _type: 'companyInfo',
    name: 'U.S. Mechanical LLC',
    address: 'Pleasant Grove, UT & Las Vegas, NV',
    email: 'info@usmechanicalllc.com',
    phone: '(801) 555-0123',
    licenseInfo: 'Licensed, Bonded & Insured in NV, UT, AZ, CA, WY',
  },
  {
    _id: 'contact',
    _type: 'contact',
    title: 'Get in Touch',
    description: 'Ready to start your next project? Contact us today for a quote.',
  },
  {
    _id: 'formSettings',
    _type: 'formSettings',
  },
]

async function syncContent() {
  console.log('\n🔄 Syncing website content to Sanity...\n')

  for (const doc of documents) {
    try {
      const existing = await client.fetch(`*[_id == "${doc._id}"][0]`)
      
      if (existing) {
        console.log(`📝 Updating ${doc._type}...`)
        await client.createOrReplace({
          ...doc,
          _rev: existing._rev,
        })
        console.log(`✅ Updated ${doc._type}`)
      } else {
        console.log(`➕ Creating ${doc._type}...`)
        await client.create(doc)
        console.log(`✅ Created ${doc._type}`)
      }
    } catch (error) {
      console.error(`❌ Error with ${doc._type}:`, error.message)
      if (error.message.includes('token') || error.message.includes('unauthorized')) {
        console.error('💡 Make sure your token has write permissions')
      }
    }
  }

  console.log('\n✨ Sync complete!')
  console.log('📋 Now go to Sanity Studio and you should see all the content sections.')
  console.log('💡 Make sure to PUBLISH each document after reviewing it.\n')
}

syncContent().catch(console.error)

