import { defineType } from 'sanity'

export default defineType({
  name: 'drawerLink',
  title: 'Drawer Link',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text that appears for this link (e.g., "Contact", "About Us", "Careers at US Mechanical")',
      validation: (Rule) => Rule.required().error('Label is required'),
    },
    {
      name: 'href',
      title: 'Link Target',
      type: 'string',
      description: 'Where this link goes. Use "#" + section ID for internal links (e.g., #contact, #about, #careers)',
      placeholder: '#contact',
      validation: (Rule) => Rule.required().error('Link target is required'),
    },
    {
      name: 'ariaLabel',
      title: 'Accessibility Label',
      type: 'string',
      description: 'Optional label for screen readers (e.g., "Contact us", "View career opportunities")',
      placeholder: 'Contact us',
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled Link',
        subtitle: `Links to: ${subtitle || 'Not set'}`,
      }
    },
  },
})
