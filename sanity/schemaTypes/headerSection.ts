import { defineType } from 'sanity'

export default defineType({
  name: 'headerSection',
  title: 'Header & Navigation',
  type: 'document',
  description: 'Configure your website header with logo and drawer menu navigation',
  fields: [
    {
      name: 'logo',
      title: 'Header Logo',
      type: 'image',
      description: 'Main site logo that appears in the header navigation bar. This is different from the footer logo, which can be managed in the Contact Page section.',
      options: { 
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette']
      },
      validation: (Rule) => Rule.required().error('Logo is required'),
    },
    {
      name: 'sections',
      title: 'Drawer Menu Sections',
      type: 'array',
      description: 'Sections for the mobile drawer menu. Each section has a heading (e.g., "Connect", "Company") and contains multiple navigation links.',
      of: [{ type: 'drawerSection' }],
      validation: (Rule) => Rule.required().min(1).error('Add at least one section'),
    },
  ],
  preview: {
    select: {
      sectionCount: 'sections.length',
    },
    prepare({ sectionCount }) {
      const sections = sectionCount || 0
      return {
        title: 'Header & Navigation',
        subtitle: `Logo + ${sections} drawer menu section${sections !== 1 ? 's' : ''}`,
      }
    }
  }
})

