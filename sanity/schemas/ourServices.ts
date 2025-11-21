import { defineType } from 'sanity'

export default defineType({
  name: 'ourServices',
  title: 'Our Services Section (CardSwap)',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The title that appears above all the services (e.g., "Our Services").',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'services',
      title: 'Services (for CardSwap Animation)',
      type: 'array',
      description: 'Add at least 2 services with images for the CardSwap animation to work. Each service will appear as a card that cycles through automatically.',
      of: [{ type: 'serviceItemWithImage' }],
      validation: (Rule) => Rule.min(1).error('At least 1 service is required'),
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      services: 'services',
    },
    prepare({ title, services }) {
      const count = services?.length || 0
      return {
        title: title || 'Our Services Section',
        subtitle: `${count} service${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
