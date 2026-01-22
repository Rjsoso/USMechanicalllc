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
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context?.document as any
          const carouselCount = Array.isArray(doc?.carouselImages) ? doc.carouselImages.length : 0
          if (!value && carouselCount === 0) {
            return 'Provide a Background Image or at least one Carousel Image.'
          }
          return true
        }),
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
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context?.document as any
          const hasBackground = Boolean(doc?.backgroundImage)
          const count = Array.isArray(value) ? value.length : 0
          if (!hasBackground && count === 0) {
            return 'Provide at least one Carousel Image or set a Background Image.'
          }
          return true
        }),
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
      backgroundImage: 'backgroundImage',
      firstCarouselImage: 'carouselImages.0.image',
    },
    prepare({ title, backgroundImage, firstCarouselImage }) {
      const usesCarousel = Boolean(firstCarouselImage)
      const usesBackground = Boolean(backgroundImage)

      return {
        title: title || 'Hero Section',
        subtitle: usesCarousel
          ? 'Website uses: Carousel Images (first image shown as preview)'
          : usesBackground
            ? 'Website uses: Background Image'
            : 'Missing: set Background Image or Carousel Images',
        media: firstCarouselImage || backgroundImage,
      }
    },
  },
})

