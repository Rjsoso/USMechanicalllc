import { defineType } from 'sanity'

export default defineType({
  name: 'serviceItemWithImage',
  title: 'Service Item',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Service Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
    },
    {
      name: 'detailedDescription',
      title: 'Detailed Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Service Image',
      type: 'image',
      options: { hotspot: true },
    },
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
})

