import { defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'backgroundImage',
      title: 'Background Image',
      description: 'Single background image (used if no carousel images are provided)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'carouselImages',
      title: 'Carousel Images',
      description: 'Images that will cycle through as the hero background. If provided, these will be used instead of the background image.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              media: 'image',
            },
          },
        },
      ],
    },
    {
      name: 'logo',
      title: 'Logo Image',
      description: 'Company logo displayed above the headline',
      type: 'image',
      options: { hotspot: true },
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
})

