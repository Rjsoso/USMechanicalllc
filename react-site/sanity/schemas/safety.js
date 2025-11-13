export default {
  name: 'safety',
  title: 'Safety Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 5,
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}

