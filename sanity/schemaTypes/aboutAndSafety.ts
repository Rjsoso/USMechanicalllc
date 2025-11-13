import { defineType } from 'sanity'

export default defineType({
  name: 'aboutAndSafety',
  title: 'About & Safety Section',
  type: 'document',
  fields: [
    {
      name: 'aboutTitle',
      title: 'About Title',
      type: 'string',
    },
    {
      name: 'aboutText',
      title: 'About Text',
      type: 'text',
    },
    {
      name: 'safetyTitle',
      title: 'Safety Title',
      type: 'string',
    },
    {
      name: 'safetyText',
      title: 'Safety Text',
      type: 'text',
    },
    {
      name: 'photo1',
      title: 'Photo 1',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'photo2',
      title: 'Photo 2',
      type: 'image',
      options: { hotspot: true },
    },
  ],
})

