import { defineType } from 'sanity'

export default defineType({
  name: 'cardNav',
  title: 'Card Navigation',
  type: 'document',
  description: 'Navigation menu with expandable cards. Maximum 3 sections.',
  fields: [
    {
      name: 'sections',
      title: 'Navigation Sections',
      type: 'array',
      description: 'Add up to 3 navigation sections. Each section appears as a card when the menu expands.',
      validation: (Rule) => Rule.max(3).error('Maximum 3 sections allowed'),
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Section Label',
              type: 'string',
              description: 'The title displayed on the navigation card',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              description: 'Links that appear in this navigation card',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      title: 'Link Label',
                      type: 'string',
                      description: 'Text displayed for the link',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'href',
                      title: 'Link Target',
                      type: 'string',
                      description: 'Target section (e.g., #about, #services, #contact)',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'ariaLabel',
                      title: 'Accessibility Label',
                      type: 'string',
                      description: 'Screen reader text for accessibility',
                    },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'label',
            },
          },
        },
      ],
    },
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text displayed on the CTA button (e.g., "Get Started", "Contact Us")',
      initialValue: 'Get Started',
    },
  ],
  preview: {
    select: {
      sections: 'sections',
    },
    prepare({ sections }) {
      const sectionCount = sections?.length || 0
      return {
        title: 'Card Navigation',
        subtitle: `${sectionCount} section${sectionCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
