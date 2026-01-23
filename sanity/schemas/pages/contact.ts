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
      name: 'footerLogo',
      title: 'Footer Logo',
      type: 'image',
      description: 'Logo displayed in the website footer next to copyright text. This can be different from the header logo (managed in Header Section). Recommended: square format, 512x512px.',
      options: { 
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette']
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
  ],
})

