import { defineType } from 'sanity'

export default defineType({
  name: 'servicesSection',
  title: 'Services Section',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'serviceBoxes',
      title: 'Service Boxes (Left Side)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'icon',
              type: 'image',
              title: 'Icon (optional)',
            },
          ],
        },
      ],
    },
    {
      name: 'gallery',
      title: 'CardSwap Image Gallery (Right Side)',
      type: 'array',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
        },
      ],
    },
  ],
})
