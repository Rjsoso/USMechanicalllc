export default {
  name: 'recognition',
  title: 'Recognition Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'award',
      title: 'Award/Certification',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'award',
    },
  },
}

