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
      name: 'safetyLogos',
      title: 'Safety Certifications & Compliance Logos',
      description: 'Safety certifications, compliance logos, and accreditation images displayed in rotating loops in the Safety & Risk Management section. These are separate from partner logos (managed in Logo Loop section). Items cycle seamlessly between two horizontal loops.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              description: 'Upload an image/logo',
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
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              description: 'Optional: Icon name from react-icons (e.g., "SiReact", "SiNextdotjs"). Leave empty if using image.',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'Title/name for this logo/item',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'url',
              description: 'Optional: Link URL for this logo/item',
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(20),
    },
  ],
})

