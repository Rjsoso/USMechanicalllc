import { defineType } from 'sanity'

export default defineType({
  name: 'drawerSection',
  title: 'Drawer Section',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Section Label',
      type: 'string',
      description: 'The heading for this section (e.g., "Connect", "Company", "Services")',
      validation: (Rule) => Rule.required().error('Section label is required'),
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      description: 'The navigation links within this section',
      of: [{ type: 'drawerLink' }],
      validation: (Rule) => Rule.required().min(1).error('Add at least one link to this section'),
    },
  ],
  preview: {
    select: {
      title: 'label',
      links: 'links',
    },
    prepare({ title, links }) {
      const linkCount = links?.length || 0
      return {
        title: title || 'Untitled Section',
        subtitle: `${linkCount} link${linkCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
