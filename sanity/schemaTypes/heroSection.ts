import { defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'backgroundImage',
      title: 'Background Image',
      description: 'Hero section background image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('Background image is required'),
    },
    {
      name: 'headline',
      title: 'Headline',
      description: 'Main heading text displayed prominently',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'subtext',
      title: 'Subtext',
      description: 'Supporting text displayed below the headline',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      description: 'Text displayed on the call-to-action button',
      type: 'string',
      initialValue: 'Request a Quote',
      validation: (Rule) => Rule.required().max(50),
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      description: 'URL or anchor link (e.g., #contact or /contact)',
      type: 'string',
      initialValue: '#contact',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'headline',
      media: 'backgroundImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Hero Section',
        subtitle: media ? 'Background image set' : 'Missing background image',
        media,
      }
    },
  },
})

