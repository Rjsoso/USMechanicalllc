import { defineType } from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'carouselImages',
      title: 'Carousel Images',
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
            },
            {
              name: 'title',
              title: 'Title (optional)',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description (optional)',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'subtext',
      title: 'Subtext',
      type: 'text',
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      initialValue: 'Request a Quote',
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
      initialValue: '#contact',
    },
  ],
})

