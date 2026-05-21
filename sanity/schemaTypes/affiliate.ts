import { defineType } from 'sanity'

export default defineType({
  name: 'affiliate',
  title: 'Affiliate Company',
  type: 'object',
  fields: [
    { name: 'name', title: 'Company Name', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    {
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: 'Link to the affiliate company website (e.g. https://www.snydermechanical.com/)',
    },
    { name: 'description', title: 'Description', type: 'text' },
  ],
})

