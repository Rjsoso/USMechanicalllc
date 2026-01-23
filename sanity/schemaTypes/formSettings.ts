import { defineType } from 'sanity'

export default defineType({
  name: 'formSettings',
  title: 'Contact Form Settings',
  type: 'object',
  fields: [
    {
      name: 'headline',
      title: 'Form Headline',
      type: 'string',
      description: 'Heading above the form (e.g., "Send us a message")',
    },
  ],
})

