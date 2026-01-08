import { defineType } from 'sanity'

export default defineType({
  name: 'stat',
  title: 'Statistic',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'value', title: 'Value', type: 'string' },
    {
      name: 'enableCustomStart',
      title: 'Enable Custom Start Value',
      type: 'boolean',
      description: 'Enable animation from a custom starting value instead of 0',
      initialValue: false,
    },
    {
      name: 'animateFromValue',
      title: 'Animate From Value',
      type: 'number',
      description: 'The starting value for animation (only used if custom start is enabled)',
      hidden: ({ parent }) => !parent?.enableCustomStart,
      validation: (Rule) => Rule.min(0),
    },
  ],
})

