import { defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      description: 'The testimonial quote from the client',
      validation: (Rule) => Rule.required().max(500),
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      description: 'Name of the person giving the testimonial',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role/Title',
      type: 'string',
      description: 'Job title or role of the person',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Company name (optional)',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which testimonials appear (lower numbers appear first)',
      initialValue: 0,
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Show this testimonial on the website',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'company',
      quote: 'quote',
    },
    prepare(selection) {
      const { title, subtitle, quote } = selection;
      return {
        title: title,
        subtitle: subtitle || 'No company specified',
        description: quote?.substring(0, 100) + '...',
      };
    },
  },
});

