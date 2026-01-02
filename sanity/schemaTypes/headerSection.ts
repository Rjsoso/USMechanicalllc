import { defineType } from 'sanity'

export default defineType({
  name: 'headerSection',
  title: 'Header Section',
  type: 'document',
  description: 'Configure your website header including the logo and navigation menu',
  fields: [
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload your company logo. This appears in the header of your website.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('Logo is required'),
    },
    {
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      description: 'Add navigation items to your menu. Each item needs a label, icon, link target, and display order.',
      of: [{ type: 'navLink' }],
      validation: (Rule) => Rule.required().min(1).error('Add at least one navigation link'),
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Optional: Text for a call-to-action button in the header',
      placeholder: 'Get Started',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      description: 'Optional: Where the button should link to (e.g., #contact or /contact)',
      placeholder: '#contact',
      hidden: ({ parent }) => !parent?.buttonText,
    },
  ],
  preview: {
    select: {
      title: 'logo',
      navCount: 'navLinks.length',
    },
    prepare({ navCount }) {
      return {
        title: 'Header & Navigation',
        subtitle: navCount ? `${navCount} navigation items` : 'No navigation items yet',
      }
    }
  }
})

