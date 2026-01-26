import { defineType } from 'sanity'

export default defineType({
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main heading for the contact page (e.g. "Contact U.S. Mechanical")',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Intro text under the main heading',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Background image for the contact page. Will be displayed with a dark overlay for text readability.',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'offices',
      title: 'Office Locations',
      type: 'array',
      of: [{ type: 'office' }],
    },
    {
      name: 'affiliates',
      title: 'Affiliate Companies',
      type: 'array',
      of: [{ type: 'affiliate' }],
    },
    {
      name: 'formSettings',
      title: 'Contact Form Settings',
      type: 'formSettings',
    },
    {
      name: 'email',
      title: 'General Email',
      type: 'string',
      description: 'Main company email address (displayed in footer)',
    },
    {
      name: 'licenseInfo',
      title: 'License Information',
      type: 'string',
      description: 'License info displayed in footer (e.g., "Licensed in UT, NV, AZ")',
    },
    {
      name: 'footerCompanyDescription',
      title: 'Footer Company Description',
      type: 'text',
      description: 'Brief company description shown in footer Column 1',
    },
    {
      name: 'businessHours',
      title: 'Business Hours',
      type: 'object',
      description: 'Operating hours displayed in footer',
      fields: [
        {
          name: 'days',
          title: 'Days',
          type: 'string',
          description: 'e.g., "Monday - Friday"',
        },
        {
          name: 'hours',
          title: 'Hours',
          type: 'string',
          description: 'e.g., "8:00 AM - 5:00 PM"',
        },
      ],
    },
    {
      name: 'serviceArea',
      title: 'Service Area',
      type: 'string',
      description: 'Geographic area served (e.g., "Serving Northern Utah")',
    },
    {
      name: 'footerBadge',
      title: 'Footer Badge Text',
      type: 'string',
      description: 'Certification/licensing badge text (e.g., "Fully Licensed & Insured")',
    },
  ],
})

