import { defineType } from 'sanity'

export default defineType({
  name: 'logoLoop',
  title: 'Logo Loop',
  type: 'document',
  description: 'Partner and vendor logos displayed in an animated carousel on the website. This is separate from the Safety logos (managed in About & Safety Section) and company logos (managed in Header Section and Contact Page).',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Internal title for reference (e.g., "Partner Logos")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'enabled',
      title: 'Enable Logo Loop',
      type: 'boolean',
      description: 'Toggle to show/hide the logo loop on the website',
      initialValue: true,
    },
    {
      name: 'logos',
      title: 'Partner & Vendor Logos',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'companyName',
              title: 'Company Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'logo',
              title: 'Logo Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  description: 'Alternative text for accessibility',
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'url',
              title: 'Company URL',
              type: 'url',
              description: 'Optional link to company website (include https://)',
            },
            {
              name: 'order',
              title: 'Display Order',
              type: 'number',
              description: 'Order in which the logo appears (lower numbers first)',
              validation: (Rule) => Rule.required().min(0),
            },
          ],
          preview: {
            select: {
              title: 'companyName',
              media: 'logo',
              order: 'order',
            },
            prepare({ title, media, order }) {
              return {
                title: title || 'Untitled Logo',
                subtitle: `Order: ${order ?? 'Not set'}`,
                media: media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: 'title',
      enabled: 'enabled',
      logoCount: 'logos.length',
    },
    prepare({ title, enabled, logoCount }) {
      return {
        title: title || 'Logo Loop',
        subtitle: `${enabled ? 'Enabled' : 'Disabled'} - ${logoCount || 0} logos`,
      }
    },
  },
})

