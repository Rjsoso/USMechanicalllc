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
      name: 'descriptionText',
      title: 'Description Text',
      type: 'text',
      description: 'The large description text that appears at the top left, above the service boxes.',
    },
    {
      name: 'servicesInfo',
      title: 'Service Info Boxes',
      type: 'array',
      description: 'Add 3 service boxes (HVAC, Plumbing, Process Piping). Each box opens a modal with description when clicked.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'The title shown on the box (e.g., "HVAC", "Plumbing", "Process Piping")',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Description',
              description: 'The detailed description shown in the modal when the box is clicked',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3).error('Maximum 3 service boxes allowed'),
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
