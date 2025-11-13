import { defineType } from 'sanity'

export default defineType({
  name: 'serviceItem',
  title: 'Service Item',
  type: 'object',
  fields: [
    { name: 'title', title: 'Service Title', type: 'string' },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      description: 'Displayed on the service card',
    },
    {
      name: 'fullDescription',
      title: 'Full Description',
      type: 'text',
      description: 'Optional long description for detail pages or modals',
    },
    {
      name: 'icon',
      title: 'Icon/Image',
      type: 'image',
      description: 'Upload a small image representing the service',
    },
    {
      name: 'showMore',
      title: 'Show Learn More Section',
      type: 'boolean',
      initialValue: false,
    },
  ],
})

