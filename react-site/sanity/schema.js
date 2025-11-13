// Sanity schema definitions
// Install Sanity CLI: npm install -g @sanity/cli
// Run: sanity init
// Then add these schemas to your schemas folder

export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  fields: [
    {
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
    },
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'ctaPrimary',
      title: 'Primary CTA Text',
      type: 'string',
    },
    {
      name: 'ctaSecondary',
      title: 'Secondary CTA Text',
      type: 'string',
    },
  ],
}

// Additional schemas: navigation, service, about, recognition, contact
// Similar structure for each section

