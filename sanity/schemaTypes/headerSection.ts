import { defineType } from 'sanity'

export default defineType({
  name: 'headerSection',
  title: 'Header & Navigation',
  type: 'document',
  description: 'Configure your website header with logo and icon-based dock navigation',
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
      name: 'navLinks',
      title: 'Icon Navigation (Dock)',
      type: 'array',
      description: 'Icon-based navigation for the floating dock menu. Each item needs a label, icon, link target, and display order.',
      of: [{ type: 'navLink' }],
      validation: (Rule) => Rule.required().min(1).error('Add at least one navigation link'),
    },
  ],
  preview: {
    select: {
      navCount: 'navLinks.length',
    },
    prepare({ navCount }) {
      const navItems = navCount || 0
      return {
        title: 'Header & Navigation',
        subtitle: `Logo + ${navItems} icon dock item${navItems !== 1 ? 's' : ''}`,
      }
    }
  }
})

