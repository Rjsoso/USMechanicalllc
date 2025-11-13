import { defineType } from 'sanity'

export default defineType({
  name: 'office',
  title: 'Office Location',
  type: 'object',
  fields: [
    { name: 'locationName', title: 'Location Name', type: 'string' },
    { name: 'address', title: 'Address', type: 'text' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'fax', title: 'Fax', type: 'string' },
  ],
})

