import { defineType } from 'sanity'

export default defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  type: 'document',
  description: 'Create individual projects that will appear within categories. Each project can have multiple photos, descriptions, and details.',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'Name of the project (e.g., "Downtown Office Complex", "Regional Hospital Expansion")',
      validation: (Rule) => Rule.required().max(150),
    },
    {
      name: 'description',
      title: 'Project Description',
      type: 'text',
      description: 'Detailed description of the project. Explain what was done, key features, challenges overcome, etc. This appears in the project modal.',
    },
    {
      name: 'images',
      title: 'Project Images',
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
              description: 'Important for accessibility and SEO. Describe what is shown in the image.',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption that appears with the image',
            },
          ],
        },
      ],
      description: 'Add multiple photos of this project. You can upload multiple images. The first image will be used as the thumbnail. Drag to reorder.',
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'portfolioCategory' }],
      description: 'Select the category this project belongs to. This helps organize projects by building type.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Project location (e.g., "Salt Lake City, UT", "Phoenix, AZ")',
    },
    {
      name: 'year',
      title: 'Year Completed',
      type: 'string',
      description: 'Year the project was completed (e.g., "2023", "2022-2023")',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order this project appears within its category. Lower numbers appear first. Leave blank or use 0 for default order.',
      validation: (Rule) => Rule.min(0).integer(),
    },
    {
      name: 'client',
      title: 'Client Name',
      type: 'string',
      description: 'Optional: Name of the client or company',
    },
    {
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      description: 'Optional: More specific type of project (e.g., "New Construction", "Renovation", "HVAC Upgrade")',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      category: 'category.title',
      order: 'order',
    },
    prepare({ title, media, category, order }) {
      return {
        title: title || 'Untitled Project',
        subtitle: category ? `${category} • Order: ${order || 0}` : `Order: ${order || 0}`,
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

