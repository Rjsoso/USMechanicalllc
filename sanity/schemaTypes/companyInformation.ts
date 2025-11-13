import { defineType } from 'sanity'

export default defineType({
  name: 'companyInformation',
  title: 'Company Information',
  type: 'document',
  fields: [
    { name: 'address', title: 'Address', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'licenseInfo', title: 'License Info', type: 'string' },
  ],
})

