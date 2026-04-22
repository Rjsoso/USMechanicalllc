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

    // --- Bid-relevant facts (shown on the project detail page) ---
    {
      name: 'projectValue',
      title: 'Project Value',
      type: 'string',
      description:
        'Optional. Dollar value of the mechanical scope (e.g., "$12.4M"). Displayed as a project-facts stat.',
    },
    {
      name: 'squareFootage',
      title: 'Square Footage',
      type: 'string',
      description:
        'Optional. Size of the facility serviced (e.g., "325,000 sq ft", "180k sf").',
    },
    {
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description:
        'Optional. How long the work took (e.g., "18 months", "Jan 2022 – Apr 2023").',
    },
    {
      name: 'deliveryMethod',
      title: 'Delivery Method',
      type: 'string',
      description:
        'Optional. How the project was procured (e.g., "Design-Build", "CM/GC", "Lump-Sum Bid", "IPD").',
      options: {
        list: [
          { title: 'Design-Build', value: 'Design-Build' },
          { title: 'CM/GC (Construction Manager / General Contractor)', value: 'CM/GC' },
          { title: 'Lump-Sum Bid', value: 'Lump-Sum Bid' },
          { title: 'Design-Bid-Build', value: 'Design-Bid-Build' },
          { title: 'IPD (Integrated Project Delivery)', value: 'IPD' },
          { title: 'Negotiated', value: 'Negotiated' },
          { title: 'Cost-Plus', value: 'Cost-Plus' },
          { title: 'Other', value: 'Other' },
        ],
      },
    },
    {
      name: 'generalContractor',
      title: 'General Contractor',
      type: 'string',
      description: 'Optional. Name of the GC (e.g., "Jacobsen Construction").',
    },
    {
      name: 'owner',
      title: 'Owner',
      type: 'string',
      description:
        'Optional. The ultimate owner / developer the facility was built for.',
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

