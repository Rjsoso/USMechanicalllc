import { defineType } from 'sanity'

export default defineType({
  name: 'affiliate',
  title: 'Affiliate Company',
  type: 'object',
  fields: [
    { name: 'name', title: 'Company Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'description', title: 'Description', type: 'text' },
  ],
})

