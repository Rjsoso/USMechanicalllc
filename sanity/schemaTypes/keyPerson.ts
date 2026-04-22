import { defineType } from 'sanity'

export default defineType({
  name: 'keyPerson',
  title: 'Key Personnel',
  type: 'document',
  description:
    'Senior team members highlighted on the Qualifications page for pre-qualification and bid responses. Credentials matter more than fluffy bios.',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'title',
      title: 'Title / Role',
      type: 'string',
      description: 'e.g. "President", "Director of Preconstruction", "Safety Manager"',
      validation: (Rule) => Rule.required().max(160),
    },
    {
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Head-and-shoulders photograph (recommended: square, 800×800 minimum).',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Defaults to "{Name}, {Title}" if left blank.',
        },
      ],
    },
    {
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
      description:
        'Two or three professional sentences. Lead with years of industry experience, then notable project/market focus. Prospects skim this in 10 seconds.',
      validation: (Rule) => Rule.max(800),
    },
    {
      name: 'certifications',
      title: 'Certifications & Credentials',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Short tags shown next to the photo (e.g. "PE", "CM-Lean", "OSHA 30", "PMP", "MSHA"). One per line.',
      options: { layout: 'tags' },
    },
    {
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(75).integer(),
    },
    {
      name: 'email',
      title: 'Direct Email',
      type: 'string',
      description:
        'Optional. Include only if this person should be the direct point of contact for prequalification / bid requests.',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          return ok || 'Enter a valid email address, or leave blank.'
        }),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (Rule) => Rule.min(0).integer(),
    },
    {
      name: 'featured',
      title: 'Show on Qualifications Page',
      type: 'boolean',
      initialValue: true,
      description:
        'Only featured personnel appear on the public Qualifications page. Uncheck to hide without deleting.',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' },
        { field: 'name', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'photo', order: 'order' },
    prepare({ title, subtitle, media, order }) {
      return {
        title: title || 'Unnamed team member',
        subtitle: `${subtitle || ''}${order != null ? ` · #${order}` : ''}`,
        media,
      }
    },
  },
})
