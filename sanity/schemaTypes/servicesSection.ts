import { defineType } from 'sanity'

export default defineType({
  name: 'servicesSection',
  title: 'Our Services Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Our Services',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'service' }],
    },
  ],
})

