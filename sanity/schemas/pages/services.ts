import { defineType } from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the Services page',
    },
    {
      name: 'introductionText',
      title: 'Introduction Text',
      type: 'text',
      description: 'Short intro paragraph under the title',
    },
    {
      name: 'servicesOffered',
      title: 'Services Offered',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          title: 'Service Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'shortDescription',
              title: 'Short Description',
              type: 'text',
            },
            {
              name: 'detailedDescription',
              title: 'Detailed Description (rich text)',
              type: 'array',
              of: [{ type: 'block' }, { type: 'image' }],
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
              subtitle: 'shortDescription',
            },
          },
        },
      ],
    },
  ],
})

