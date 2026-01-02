import { defineType } from 'sanity'

export default defineType({
  name: 'headerSection',
  title: 'Header & Navigation',
  type: 'document',
  description: 'Configure your website header with logo and icon-based dock navigation',
  fields: [
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload your company logo. This appears in the header.',
      options: { hotspot: true },
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

