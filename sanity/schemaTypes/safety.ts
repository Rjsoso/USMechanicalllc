import { defineType } from 'sanity'

export default defineType({
  name: 'safety',
  title: 'Safety Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'images',
      title: 'Safety Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      validation: Rule => Rule.max(3), // limit to 3 total (1 original + 2 new)
    },
  ],
})

