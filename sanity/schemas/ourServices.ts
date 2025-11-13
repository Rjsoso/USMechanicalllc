import { defineType } from 'sanity'

export default defineType({
  name: 'ourServices',
  title: 'Our Services Section',
  type: 'document',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'The title that appears above all the services.',
    },
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'serviceItemWithImage' }],
    },
  ],
})
