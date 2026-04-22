import { defineType } from 'sanity'

/**
 * Singleton document (id: "companyCredentials"). Stores the hard-number facts
 * that general contractors, owners, and surety agents look for on a
 * bid-ready site: state licensing, bonding capacity, EMR, insurance summary,
 * and who to contact for prequalification.
 */
export default defineType({
  name: 'companyCredentials',
  title: 'Company Credentials',
  type: 'document',
  description:
    'Pre-qualification data shown on the /qualifications page. Only one of these documents should exist (singleton).',
  fields: [
    // --- Headline / copy ---
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Qualifications & Credentials',
      description: 'H1 on the /qualifications page.',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Everything a general contractor, owner, or surety agent needs to pre-qualify U.S. Mechanical for your next project.',
      validation: (Rule) => Rule.max(400),
    },

    // --- Licensing ---
    {
      name: 'stateLicenses',
      title: 'State Licenses',
      type: 'array',
      description:
        'One entry per state U.S. Mechanical is licensed in. Shown as a table.',
      of: [
        {
          type: 'object',
          name: 'stateLicense',
          title: 'State License',
          fields: [
            {
              name: 'state',
              title: 'State',
              type: 'string',
              description: 'Two-letter state code (e.g. "UT")',
              validation: (Rule) => Rule.required().max(40),
            },
            {
              name: 'stateFullName',
              title: 'State Full Name',
              type: 'string',
              description: 'e.g. "Utah". Optional — falls back to the state code.',
            },
            {
              name: 'licenseNumber',
              title: 'License Number',
              type: 'string',
              validation: (Rule) => Rule.max(80),
            },
            {
              name: 'classification',
              title: 'Classification',
              type: 'string',
              description: 'e.g. "Mechanical, S350", "C-36 Plumbing". Optional.',
            },
          ],
          preview: {
            select: {
              state: 'state',
              stateFullName: 'stateFullName',
              licenseNumber: 'licenseNumber',
            },
            prepare({ state, stateFullName, licenseNumber }) {
              return {
                title: stateFullName || state || 'Unnamed state',
                subtitle: licenseNumber || 'No license number yet',
              }
            },
          },
        },
      ],
    },

    // --- Bonding ---
    {
      name: 'bondingSinglePerProject',
      title: 'Bonding — Single Project Capacity',
      type: 'string',
      description: 'e.g. "$35 Million"',
      initialValue: '$35 Million',
    },
    {
      name: 'bondingAggregate',
      title: 'Bonding — Aggregate Capacity',
      type: 'string',
      description: 'e.g. "$150 Million"',
      initialValue: '$150 Million',
    },
    {
      name: 'suretyCompany',
      title: 'Surety Company',
      type: 'string',
      description: 'Name of the surety underwriting the bonds. Optional.',
    },
    {
      name: 'suretyAgent',
      title: 'Surety Agent / Contact',
      type: 'text',
      rows: 3,
      description:
        'Optional. Name, agency, phone, email — shown on the Qualifications page so GCs can verify bond capacity directly.',
    },

    // --- Safety ---
    {
      name: 'emr',
      title: 'Experience Modification Rate (EMR)',
      type: 'string',
      description:
        'Latest EMR (e.g. "0.72"). Leave blank to hide. This is a key pre-qualification metric.',
    },
    {
      name: 'emrYear',
      title: 'EMR Effective Year',
      type: 'string',
      description: 'e.g. "2024"',
    },
    {
      name: 'safetyNarrative',
      title: 'Safety Program Summary',
      type: 'text',
      rows: 4,
      description:
        'One or two sentences about the safety program (full-time safety manager, OSHA 10/30 program-wide, weekly toolbox talks, etc.).',
    },

    // --- Insurance ---
    {
      name: 'insuranceSummary',
      title: 'Insurance Summary',
      type: 'array',
      description:
        'Bullet list of coverage amounts (General Liability, Auto, Workers Comp, Umbrella, etc.)',
      of: [
        {
          type: 'object',
          name: 'coverage',
          fields: [
            {
              name: 'label',
              title: 'Coverage Type',
              type: 'string',
              description: 'e.g. "General Liability", "Umbrella"',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'limit',
              title: 'Limit',
              type: 'string',
              description: 'e.g. "$2M per occurrence / $4M aggregate"',
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'limit' },
          },
        },
      ],
    },

    // --- Prequal contact ---
    {
      name: 'prequalContactName',
      title: 'Prequalification Contact — Name',
      type: 'string',
    },
    {
      name: 'prequalContactTitle',
      title: 'Prequalification Contact — Title',
      type: 'string',
    },
    {
      name: 'prequalContactEmail',
      title: 'Prequalification Contact — Email',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          return ok || 'Enter a valid email address, or leave blank.'
        }),
    },
    {
      name: 'prequalContactPhone',
      title: 'Prequalification Contact — Phone',
      type: 'string',
    },
    {
      name: 'prequalNotes',
      title: 'Prequalification Notes',
      type: 'text',
      rows: 3,
      description:
        'Optional. Guidance for bidders (how to submit RFPs, typical response time, etc.).',
    },
  ],
  preview: {
    select: { title: 'pageTitle' },
    prepare({ title }) {
      return {
        title: title || 'Company Credentials',
        subtitle: 'Singleton — edit in place; do not duplicate',
      }
    },
  },
})
