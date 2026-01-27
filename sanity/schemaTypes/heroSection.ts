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
      description: 'Optional call-to-action button text. Leave empty to hide the button.',
      type: 'string',
      validation: (Rule) => Rule.max(50),
    },
    {
      name: 'buttonLink',
      title: 'Button Link',
      description: 'URL or anchor link (e.g., #contact or /contact). Only used if button text is provided.',
      type: 'string',
      initialValue: '#contact',
      validation: (Rule) => Rule.custom((value, context) => {
        const doc = context?.document as any
        const hasButtonText = doc?.buttonText && doc.buttonText.trim() !== ''
        if (hasButtonText && !value) {
          return 'Button link is required when button text is provided'
        }
        return true
      }),
    },
    {
      name: 'secondButtonText',
      title: 'Second Button Text',
      description: 'Optional second call-to-action button text (e.g., "Apply"). Leave empty to hide the second button.',
      type: 'string',
      validation: (Rule) => Rule.max(50),
    },
    {
      name: 'secondButtonLink',
      title: 'Second Button Link',
      description: 'URL or anchor link for the second button (e.g., /careers or #careers). Only used if second button text is provided.',
      type: 'string',
      validation: (Rule) => Rule.custom((value, context) => {
        const doc = context?.document as any
        const hasSecondButtonText = doc?.secondButtonText && doc.secondButtonText.trim() !== ''
        if (hasSecondButtonText && !value) {
          return 'Second button link is required when second button text is provided'
        }
        return true
      }),
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

