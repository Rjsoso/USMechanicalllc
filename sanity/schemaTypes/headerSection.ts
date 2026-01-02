import { defineType } from 'sanity'

export default defineType({
  name: 'headerSection',
  title: 'Header & Navigation',
  type: 'document',
  description: 'Configure your website header, logo, and all navigation menus (icon dock + expandable card menu)',
  fields: [
    {
      name: 'logo',
      title: 'Logo Image',
      type: 'image',
      description: 'Upload your company logo. This appears in the header and navigation bar.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('Logo is required'),
    },
    {
      name: 'navLinks',
      title: 'Icon Navigation (Dock)',
      type: 'array',
      description: 'Icon-based navigation for the floating dock menu. Each item needs a label, icon, link target, and display order.',
      of: [{ type: 'navLink' }],
      validation: (Rule) => Rule.required().min(1).error('Add at least one navigation link'),
    },
    {
      name: 'sections',
      title: 'Card Navigation Sections',
      type: 'array',
      description: 'Expandable card navigation menu sections (up to 3). Hero section (#hero) should not be included.',
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
      name: 'ctaButtonText',
      title: 'CTA Button Text',
      type: 'string',
      description: 'Text displayed on the call-to-action button in the card navigation (e.g., "Get Started", "Contact Us")',
      placeholder: 'Get Started',
      initialValue: 'Get Started',
      validation: (Rule) => Rule.required().max(50),
    },
  ],
  preview: {
    select: {
      navCount: 'navLinks.length',
      sectionCount: 'sections.length',
      ctaText: 'ctaButtonText',
    },
    prepare({ navCount, sectionCount, ctaText }) {
      const navItems = navCount || 0
      const sections = sectionCount || 0
      return {
        title: 'Header & Navigation',
        subtitle: `${navItems} dock items, ${sections} card sections, CTA: ${ctaText || 'Get Started'}`,
      }
    }
  }
})

