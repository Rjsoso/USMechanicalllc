import { defineType } from 'sanity'

export default defineType({
  name: 'portfolioSection',
  title: 'Portfolio Section',
  type: 'document',
  description: 'Edit the heading and description for the Portfolio section on the homepage',
  fields: [
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      description: 'Main heading for the portfolio section (e.g., "Our Projects")',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'sectionDescription',
      title: 'Section Description',
      type: 'text',
      description: 'Brief description that appears below the title',
      validation: (Rule) => Rule.max(300),
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'Portfolio Section',
        subtitle: 'Homepage Portfolio Section Settings',
      }
    },
  },
})

