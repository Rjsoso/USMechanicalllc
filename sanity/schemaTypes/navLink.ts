import { defineType } from 'sanity'

export default defineType({
  name: 'navLink',
  title: 'Navigation Link',
  type: 'object',
  fields: [
    { 
      name: 'label', 
      title: 'Label', 
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    { 
      name: 'href', 
      title: 'Link Target', 
      type: 'string',
      description: 'Use # for sections (e.g., #about, #services, #contact)',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Icon identifier for the navigation item',
      options: {
        list: [
          { title: 'About', value: 'about' },
          { title: 'Safety', value: 'safety' },
          { title: 'Services', value: 'services' },
          { title: 'Projects', value: 'projects' },
          { title: 'Contact', value: 'contact' }
        ]
      },
      validation: (Rule) => Rule.required()
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this item appears (lower numbers first)',
      validation: (Rule) => Rule.required().min(0)
    }
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
      order: 'order'
    },
    prepare({ title, subtitle, order }) {
      return {
        title: `${order + 1}. ${title}`,
        subtitle: subtitle
      }
    }
  }
})

