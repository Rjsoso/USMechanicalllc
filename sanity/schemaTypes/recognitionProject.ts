import { defineType } from 'sanity'

export default defineType({
  name: 'recognitionProject',
  title: 'Recognition Project',
  type: 'document',
  fields: [
    { name: 'projectName', title: 'Project Name', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Project Image', type: 'image' },
  ],
})

