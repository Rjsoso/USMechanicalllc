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
      name: 'aboutPhotos',
      title: 'About Photos',
      description: 'Multiple photos displayed in a carousel with the About section',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
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
      validation: (Rule) => Rule.min(1).max(10),
    },
    {
      name: 'photo1',
      title: 'About Photo (Legacy)',
      type: 'image',
      options: { hotspot: true },
      description: 'Legacy single photo field. Use About Photos array instead.',
      hidden: true,
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
      description: 'First photo displayed with the Safety & Risk Management section',
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
    {
      name: 'safetyImage2',
      title: 'Safety Photo 2',
      type: 'image',
      options: { hotspot: true },
      description: 'Second photo displayed below the first Safety photo',
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

