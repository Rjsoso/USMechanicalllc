import { defineType } from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Display title (e.g., "Privacy Policy" or "Terms of Service")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
      description: 'Optional. Shown as "Last updated" on the page. Leave empty to use the document update time.',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Full page content. If empty, the website will show default content until you publish your own.',
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title || 'Legal Page',
      }
    },
  },
})
