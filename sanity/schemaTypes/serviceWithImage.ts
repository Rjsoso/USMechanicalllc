import { defineType } from 'sanity'

export default defineType({
  name: 'serviceWithImage',
  title: 'Service with Image',
  type: 'object',
  fields: [
    { name: 'name', title: 'Service Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
  ],
})

