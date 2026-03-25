import { defineType } from 'sanity'

export default defineType({
  name: 'whyUs',
  title: 'Why US Mechanical',
  type: 'document',
  description: 'Value proposition cards displayed on the home page between Portfolio and About sections.',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the section (e.g., "Why US Mechanical")',
      initialValue: 'Why US Mechanical',
    },
    {
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      description: 'Supporting text below the heading',
      initialValue: 'The strength, experience, and commitment behind every project.',
    },
    {
      name: 'items',
      title: 'Value Propositions',
      type: 'array',
      description: 'Cards highlighting key differentiators (recommended: 3 or 6 for grid alignment)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Short description (1-2 sentences)',
              validation: (Rule) => Rule.required().max(200),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon identifier for the card',
              options: {
                list: [
                  { title: 'Clock (time/experience)', value: 'clock' },
                  { title: 'Shield (safety/protection)', value: 'shield' },
                  { title: 'Map Pin (locations/coverage)', value: 'map' },
                  { title: 'Dollar (financial/bonding)', value: 'dollar' },
                  { title: 'Wrench (services/expertise)', value: 'tool' },
                  { title: 'Building (offices/facilities)', value: 'building' },
                ],
              },
              initialValue: 'tool',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              icon: 'icon',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled item',
                subtitle: subtitle || '',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      itemCount: 'items.length',
    },
    prepare({ title, itemCount }) {
      return {
        title: title || 'Why US Mechanical',
        subtitle: `${itemCount || 0} value propositions`,
      }
    },
  },
})
