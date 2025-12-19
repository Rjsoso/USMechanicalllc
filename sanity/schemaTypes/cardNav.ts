import { defineType } from 'sanity'

export default defineType({
  name: 'cardNav',
  title: 'Card Navigation',
  type: 'document',
  description: 'Navigation menu with expandable cards. Logo and sections are editable here. Colors are managed in code.',
  fields: [
    {
      name: 'logo',
      title: 'Logo Image',
      description: 'Company logo displayed in the center of the navigation bar',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'sections',
      title: 'Navigation Sections',
      description: 'Up to 3 sections with links. Hero section (#hero) should not be included.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Section Label',
              description: 'Label displayed on the navigation card (e.g., "About & Services")',
              type: 'string',
              validation: (Rule) => Rule.required().max(50),
            },
            {
              name: 'links',
              title: 'Links',
              description: 'Links within this section',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Link Label',
                      description: 'Text displayed for this link',
                      type: 'string',
                      validation: (Rule) => Rule.required().max(50),
                    },
                    {
                      name: 'href',
                      title: 'Section ID',
                      description: 'Section anchor ID (e.g., #about, #services, #portfolio, #careers, #contact). Do NOT use #hero.',
                      type: 'string',
                      validation: (Rule) => 
                        Rule.required()
                          .custom((href) => {
                            if (!href || href.trim() === '') {
                              return 'Section ID is required'
                            }
                            if (!href.startsWith('#')) {
                              return 'Must start with # (e.g., #about)'
                            }
                            if (href === '#hero') {
                              return 'Hero section should not be included in navigation'
                            }
                            return true
                          }),
                    },
                    {
                      name: 'ariaLabel',
                      title: 'ARIA Label (optional)',
                      description: 'Accessibility label for screen readers',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: {
                      title: 'label',
                      subtitle: 'href',
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.min(1).max(5).error('Each section must have at least 1 link and no more than 5 links'),
            },
          ],
          preview: {
            select: {
              title: 'label',
              links: 'links',
            },
            prepare({ title, links }) {
              const linkCount = links?.length || 0
              return {
                title: title || 'Untitled Section',
                subtitle: `${linkCount} link${linkCount !== 1 ? 's' : ''}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the CTA button (e.g., "Get Started", "Contact Us")',
      initialValue: 'Get Started',
      validation: (Rule) => Rule.required().max(50),
    },
  ],
  preview: {
    select: {
      buttonText: 'buttonText',
      sectionCount: 'sections',
    },
    prepare({ buttonText, sectionCount }) {
      const count = sectionCount?.length || 0
      return {
        title: 'Card Navigation',
        subtitle: `Button: ${buttonText || 'Get Started'} | ${count} section${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
