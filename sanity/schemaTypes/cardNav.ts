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
              name: 'bgColor',
              title: 'Background Color',
              type: 'string',
              description: 'Hex color code for the card background (e.g., #0D0716)',
              validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
                name: 'hex color',
                invert: false,
              }).error('Must be a valid hex color code (e.g., #0D0716)'),
            },
            {
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'Hex color code for the card text (e.g., #fff)',
              validation: (Rule) => Rule.required().regex(/^#[0-9A-Fa-f]{6}$/, {
                name: 'hex color',
                invert: false,
              }).error('Must be a valid hex color code (e.g., #fff)'),
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
              subtitle: 'bgColor',
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
    {
      name: 'buttonBgColor',
      title: 'Button Background Color',
      type: 'string',
      description: 'Hex color code for button background',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false,
      }).error('Must be a valid hex color code'),
      initialValue: '#111',
    },
    {
      name: 'buttonTextColor',
      title: 'Button Text Color',
      type: 'string',
      description: 'Hex color code for button text',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false,
      }).error('Must be a valid hex color code'),
      initialValue: '#fff',
    },
    {
      name: 'baseColor',
      title: 'Navigation Bar Base Color',
      type: 'string',
      description: 'Hex color code for the navigation bar background',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false,
      }).error('Must be a valid hex color code'),
      initialValue: '#fff',
    },
    {
      name: 'menuColor',
      title: 'Hamburger Icon Color',
      type: 'string',
      description: 'Hex color code for the hamburger menu icon',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/, {
        name: 'hex color',
        invert: false,
      }).error('Must be a valid hex color code'),
      initialValue: '#000',
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
