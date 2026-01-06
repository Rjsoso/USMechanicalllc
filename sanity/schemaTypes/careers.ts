import { defineType } from 'sanity'

export default defineType({
  name: 'careers',
  title: 'Careers Page',
  type: 'document',
  description: 'Manage job postings, qualifications, benefits, and application links for the Careers section',
  fields: [
    {
      name: 'mainHeading',
      title: 'Main Heading',
      type: 'string',
      description: 'Main page heading (e.g., "Careers at U.S. Mechanical")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'jobTitle',
      title: 'Job Title / Subheading',
      type: 'string',
      description: 'Current job opening (e.g., "Now hiring Plumbing and HVAC Installers")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'jobOverview',
      title: 'Job Overview',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Quick facts about the position (e.g., "Full-time", "Entry- to mid-level experience", "Competitive pay and benefits")',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'jobDescription',
      title: 'Job Description',
      type: 'text',
      rows: 3,
      description: 'Detailed description of the job responsibilities and work locations',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'item',
              type: 'string',
              title: 'Qualification',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'required',
              type: 'boolean',
              title: 'Required?',
              description: 'Check if required, uncheck if preferred',
              initialValue: true,
            },
          ],
          preview: {
            select: {
              item: 'item',
              required: 'required',
            },
            prepare({ item, required }) {
              return {
                title: item,
                subtitle: required ? 'Required' : 'Preferred',
              }
            },
          },
        },
      ],
      description: 'List of qualifications with required/preferred designation',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of employee benefits (e.g., "$500 referral bonus", "Tuition reimbursement")',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'indeedUrl',
      title: 'Indeed Job Posting URL',
      type: 'url',
      description: 'Link to the Indeed job posting page',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'applicationPdf',
      title: 'Application PDF',
      type: 'file',
      description: 'Upload fillable PDF application form. NOTE: Save the document first before uploading files.',
      options: {
        accept: '.pdf',
      },
    },
    {
      name: 'submissionEmail',
      title: 'Submission Email',
      type: 'string',
      description: 'Email address for application submissions',
      validation: (Rule) => Rule.email(),
    },
    {
      name: 'submissionFax',
      title: 'Submission Fax',
      type: 'string',
      description: 'Fax number for application submissions (e.g., "(801) 785-6029")',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Optional background image for the careers section. Will be displayed with a semi-transparent overlay for text readability.',
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'mainHeading',
      subtitle: 'jobTitle',
      media: 'backgroundImage',
    },
  },
})

