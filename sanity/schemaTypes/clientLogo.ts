import { defineType } from 'sanity'

export default defineType({
  name: 'clientLogo',
  title: 'Client / Project Logo',
  type: 'document',
  description:
    'Logos of general contractors, owners, or institutions U.S. Mechanical has built for. Featured entries appear in the "Who we build for" bar on the home page.',
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      description: 'Displayed as alt text and on hover (e.g. "Jacobsen Construction")',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      description: 'Ideally an SVG or high-resolution PNG with a transparent background.',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Defaults to the client name if left blank.',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Optional. If present the logo becomes a link.',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General Contractor', value: 'gc' },
          { title: 'Owner / Developer', value: 'owner' },
          { title: 'Institution (healthcare, education, gov)', value: 'institution' },
          { title: 'Industrial / Manufacturing', value: 'industrial' },
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Other', value: 'other' },
        ],
      },
      description:
        'Used to group logos. Filtering by category is not exposed yet, but the field is forward-compatible.',
    },
    {
      name: 'featured',
      title: 'Feature on Home Page',
      type: 'boolean',
      initialValue: true,
      description: 'Only featured logos appear in the home-page "Who we build for" strip.',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave blank for alphabetical by name.',
      validation: (Rule) => Rule.min(0).integer(),
    },
  ],
  orderings: [
    {
      title: 'Manual Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', media: 'logo', subtitle: 'category', featured: 'featured' },
    prepare({ title, media, subtitle, featured }) {
      return {
        title: title || 'Untitled client',
        subtitle: `${subtitle || 'uncategorised'}${featured ? ' · featured' : ''}`,
        media,
      }
    },
  },
})
