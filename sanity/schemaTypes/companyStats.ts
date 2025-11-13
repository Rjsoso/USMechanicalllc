import { defineType } from 'sanity'

export default defineType({
  name: 'companyStats',
  title: 'Company Stats',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
    },
    {
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [{ type: 'stat' }],
    },
  ],
})

