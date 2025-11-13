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
    {
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      description: 'Message shown after successful form submission',
      initialValue: 'Thank you! We\'ll get back to you soon.',
    },
    {
      name: 'email',
      title: 'Notification Email',
      type: 'string',
      description: 'Email address to receive form submissions',
    },
  ],
})

