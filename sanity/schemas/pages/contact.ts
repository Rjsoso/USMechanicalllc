import { defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the contact page (e.g. "Contact U.S. Mechanical")',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Intro text under the main heading',
    },
    {
      name: 'offices',
      title: 'Office Locations',
      type: 'array',
      of: [{ type: 'office' }],
    },
    {
      name: 'affiliates',
      title: 'Affiliate Companies',
      type: 'array',
      of: [{ type: 'affiliate' }],
    },
    {
      name: 'formSettings',
      title: 'Contact Form Settings',
      type: 'formSettings',
    },
  ],
})

