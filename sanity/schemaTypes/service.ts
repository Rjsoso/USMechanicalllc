import { defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'object',
  fields: [
    { name: 'name', title: 'Service Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'icon', title: 'Icon Image', type: 'image' },
  ],
})

