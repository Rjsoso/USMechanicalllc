import { defineType } from 'sanity'

export default defineType({
  name: 'expandableServiceBox',
  title: 'Expandable Service Box',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Box Title',
      type: 'string',
      description: 'The title displayed on the front of the box',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'The detailed description that appears when the box is expanded',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})

