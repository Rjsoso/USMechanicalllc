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
    {
      name: 'firstBoxContent',
      title: 'First Box Content',
      type: 'text',
      description: 'The content for the first large box on the left side (optional). If empty, the first service will be used.',
    },
    {
      name: 'expandableBoxes',
      title: 'Expandable Service Boxes',
      type: 'array',
      description: 'Add exactly 3 expandable service boxes that appear underneath the first box. Each box has a title and expandable description.',
      of: [{ type: 'expandableServiceBox' }],
      validation: (Rule) => Rule.max(3).error('Maximum 3 expandable boxes allowed'),
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
