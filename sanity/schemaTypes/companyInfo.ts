export default {
  name: 'companyInfo',
  title: 'Company Information',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'offices',
      title: 'Office Locations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of office locations (e.g., "Provo, UT", "Las Vegas, NV")',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Main Address',
      type: 'text',
      rows: 2,
    },
    {
      name: 'licenseInfo',
      title: 'License Information',
      type: 'string',
      description: 'License info displayed in footer (e.g., "Licensed in UT, NV, AZ")',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
}

