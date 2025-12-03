import { defineType } from 'sanity'

export default defineType({
  name: 'portfolioCategory',
  title: 'Portfolio Category',
  type: 'document',
  description: 'Create categories for types of buildings or projects (e.g., Office Buildings, Hospitals, Schools). Click on a category in the portfolio section to see all projects in that category.',
  fields: [
    {
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'Name of the category (e.g., "Office Buildings", "Hospitals", "Schools", "Retail Spaces")',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Category Description',
      type: 'text',
      description: 'Brief description explaining what types of projects are in this category. This appears on the category card.',
    },
    {
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main image representing this category. This is the featured image shown on the category card.',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
        },
      ],
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order categories appear on the website. Lower numbers appear first. Leave blank or use 0 for default order.',
      validation: (Rule) => Rule.min(0).integer(),
    },
    {
      name: 'projects',
      title: 'Projects in this Category',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'portfolioProject' }],
        },
      ],
      description: 'Add projects to this category. You can create projects first, then add them here, or add them here and edit the project to set its category.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title: title || 'Untitled Category',
        subtitle: `Order: ${order || 0}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})

