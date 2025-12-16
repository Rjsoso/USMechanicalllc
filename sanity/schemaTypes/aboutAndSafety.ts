import { defineType } from 'sanity'

export default defineType({
  name: 'aboutAndSafety',
  title: 'About & Safety Section',
  type: 'document',
  fields: [
    {
      name: 'aboutTitle',
      title: 'About Title',
      type: 'string',
      description: 'Title for the About section',
    },
    {
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
      description: 'Text content for the About section',
    },
    {
      name: 'photo1',
      title: 'About Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo displayed with the About section',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility',
        },
      ],
    },
    {
      name: 'safetyTitle',
      title: 'Safety Title',
      type: 'string',
      description: 'Title for the Safety & Risk Management section',
    },
    {
      name: 'safetyText',
      title: 'Safety Text',
      type: 'text',
      description: 'Text content for the Safety & Risk Management section',
    },
    {
      name: 'safetyImage',
      title: 'Safety Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo displayed with the Safety & Risk Management section',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility. Describe what is shown in the image.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption for the image',
        },
      ],
    },
  ],
})

