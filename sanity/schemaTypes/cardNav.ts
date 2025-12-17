import { defineType } from 'sanity'

export default defineType({
  name: 'cardNav',
  title: 'Card Navigation',
  type: 'document',
  description: 'Navigation menu with expandable cards. Sections are automatically generated from website sections (About, Services, Portfolio, Careers, Contact).',
  fields: [
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the CTA button (e.g., "Get Started", "Contact Us")',
      initialValue: 'Get Started',
    },
  ],
  preview: {
    select: {
      buttonText: 'buttonText',
    },
    prepare({ buttonText }) {
      return {
        title: 'Card Navigation',
        subtitle: `Button: ${buttonText || 'Get Started'}`,
      }
    },
  },
})
