#!/usr/bin/env node
// Export current Sanity content as fallback data for React components
// This ensures fallback values always match the production content

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Sanity client (read-only, no token needed)
const client = createClient({
  projectId: '3vpl3hho',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Get fresh data
})

console.log('\n🔍 Fetching current Sanity content...\n')

async function exportFallbacks() {
  try {
    // Fetch all content types that have fallbacks
    const [heroData, footerData, aboutData, drawerData, careersData] = await Promise.all([
      // 1. Hero Section
      client.fetch(`*[_type == "heroSection" && _id == "heroSection"][0]{
        headline,
        subtext,
        buttonText,
        buttonLink,
        secondButtonText,
        secondButtonLink
      }`),
      
      // 2. Footer/Contact Data
      client.fetch(`*[_type == "contact" && !(_id in path("drafts.**"))][0]{
        email,
        licenseInfo,
        footerCompanyDescription,
        businessHours {
          days,
          hours
        },
        serviceArea,
        footerBadge,
        offices[] {
          locationName,
          address,
          phone
        }
      }`),
      
      // 3. About and Safety
      client.fetch(`*[_type == "aboutAndSafety"] | order(_updatedAt desc)[0]{
        aboutTitle,
        aboutText,
        safetyTitle,
        safetyText
      }`),
      
      // 4. Header/Navigation
      client.fetch(`*[_type == "headerSection"][0]{
        sections[] {
          label,
          links[] {
            label,
            href,
            ariaLabel
          }
        }
      }`),
      
      // 5. Careers
      client.fetch(`*[_type == "careers"][0]{
        mainHeading,
        jobTitle,
        jobOverview,
        jobDescription,
        qualifications,
        benefits,
        indeedUrl,
        submissionEmail,
        submissionFax
      }`)
    ])

    // Generate formatted output
    const output = {
      generatedAt: new Date().toISOString(),
      note: 'This file contains current Sanity content to be used as fallback data in React components',
      
      hero: {
        headline: heroData?.headline || 'Trusted Mechanical Contractors Since 1963',
        subtext: heroData?.subtext || '',
        buttonText: heroData?.buttonText || '',
        buttonLink: heroData?.buttonLink || '#contact',
        secondButtonText: heroData?.secondButtonText || '',
        secondButtonLink: heroData?.secondButtonLink || '',
      },
      
      footer: {
        address: footerData?.offices?.[0]?.address || '472 South 640 West Pleasant Grove, UT 84062',
        phone: footerData?.offices?.[0]?.phone || '(801) 785-6028',
        email: footerData?.email || null,
        licenseInfo: footerData?.licenseInfo || null,
        footerCompanyDescription: footerData?.footerCompanyDescription || 'Providing exceptional mechanical contracting services with a commitment to quality, safety, and customer satisfaction throughout Utah.',
        businessHours: {
          days: footerData?.businessHours?.days || 'Monday - Friday',
          hours: footerData?.businessHours?.hours || '8:00 AM - 5:00 PM'
        },
        serviceArea: footerData?.serviceArea || 'Serving Northern Utah',
        footerBadge: footerData?.footerBadge || 'Fully Licensed & Insured'
      },
      
      about: {
        aboutTitle: aboutData?.aboutTitle || 'About U.S. Mechanical',
        aboutText: aboutData?.aboutText || `U.S. Mechanical's foundation was laid in 1963 with the organization of Bylund Plumbing and Heating. Since that time, the Bylund family has continuously been in the mechanical contracting industry. The U.S. Mechanical name was adopted 25 years ago and continues to represent our company owners and employees.

We pursue projects in the Intermountain and Southwest regions via hard bid, design build, CMAR, and cost plus. Our team includes journeyman and apprentice plumbers, sheet metal installers, pipefitters, welders, and administrative staff—all with unmatched experience.

We maintain offices in Pleasant Grove, Utah, and Las Vegas, Nevada, as well as Snyder Mechanical in Elko, Nevada, which serves the mining industry. U.S. Mechanical is fully licensed, bonded, and insured in Nevada, Utah, Arizona, California, and Wyoming.`,
        safetyTitle: aboutData?.safetyTitle || 'Safety & Risk Management',
        safetyText: aboutData?.safetyText || `U.S. Mechanical conducts all projects with safety as our top priority. We employ a company-wide safety program led by a full-time OSHA and MSHA accredited safety director. Our focus on safety ensures properly trained employees and a work environment that prioritizes everyone's well-being.

Our experience modification rate (EMR) remains below the national average, qualifying us for self-insured insurance programs that reduce risk management costs. These savings, combined with our dedication to safety, provide added value on every project.

Our goal is always simple: complete every project with zero safety issues.`
      },
      
      drawer: {
        sections: drawerData?.sections || [
          {
            label: 'Company',
            links: [
              { label: 'About Us', href: '/about', ariaLabel: 'Learn about us' },
              { label: 'Safety', href: '/about#safety', ariaLabel: 'Our safety practices' },
            ],
          },
          {
            label: 'Services',
            links: [
              { label: 'Our Services', href: '/#services', ariaLabel: 'View our services' },
              { label: 'Portfolio', href: '/portfolio', ariaLabel: 'View our portfolio' },
            ],
          },
          {
            label: 'Connect',
            links: [
              { label: 'Careers', href: '/careers', ariaLabel: 'View career opportunities' },
              { label: 'Contact', href: '/contact', ariaLabel: 'Contact us' },
            ],
          },
        ]
      },
      
      careers: {
        mainHeading: careersData?.mainHeading || 'Careers at U.S. Mechanical',
        jobTitle: careersData?.jobTitle || 'Now hiring Plumbing and HVAC Installers',
        jobOverview: careersData?.jobOverview || [
          'Full-time',
          'Entry- to mid-level experience',
          'Competitive pay and benefits',
        ],
        jobDescription: careersData?.jobDescription || 'Demolish and install plumbing and HVAC systems in new commercial and institutional construction throughout the Intermountain West including Utah, Nevada and Wyoming.',
        qualifications: careersData?.qualifications || [
          { item: '18 years or older (Required)', required: true },
          { item: 'US work authorization (Required)', required: true },
          { item: 'High school or equivalent (Preferred)', required: false },
          { item: 'Interest in plumbing, pipe fitting or sheet metal career (Preferred)', required: false },
          { item: 'OSHA 10/30 card holder', required: false },
        ],
        benefits: careersData?.benefits || [
          '$500 referral bonus',
          'Tuition reimbursement for apprentices',
          'Paid time off starts accruing after 90 days',
          'Free employee medical, dental, vision, and life insurance',
          'Up to 3.5% 401(k) match',
        ],
        indeedUrl: careersData?.indeedUrl || 'https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs',
        submissionEmail: careersData?.submissionEmail || 'admin@usmechanicalllc.com',
        submissionFax: careersData?.submissionFax || '(801) 785-6029',
      }
    }

    // Save to JSON file
    const outputPath = path.join(__dirname, 'fallbacks.json')
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
    
    console.log('✅ Successfully exported Sanity content to fallbacks.json\n')
    console.log('📋 Summary:')
    console.log(`   - Hero: ${output.hero.headline}`)
    console.log(`   - Footer: ${output.footer.phone}`)
    console.log(`   - About: ${output.about.aboutTitle}`)
    console.log(`   - Navigation: ${output.drawer.sections.length} sections`)
    console.log(`   - Careers: ${output.careers.jobTitle}`)
    console.log(`\n📄 Output saved to: ${outputPath}`)
    console.log('\n💡 Next step: Update component fallback values with this data\n')

    return output
  } catch (error) {
    console.error('❌ Error fetching Sanity data:', error)
    throw error
  }
}

// Run the export
exportFallbacks().catch(error => {
  console.error('Failed to export fallbacks:', error)
  process.exit(1)
})
