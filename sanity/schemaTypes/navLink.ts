import { defineType } from 'sanity'

// Icon map for preview display
const iconMap = {
  about: '📋',
  safety: '🛡️',
  services: '🔧',
  projects: '🏢',
  contact: '📞'
}

export default defineType({
  name: 'navLink',
  title: 'Navigation Link',
  type: 'object',
  fields: [
    { 
      name: 'label', 
      title: 'Label', 
      type: 'string',
      description: 'The text that will appear in the navigation menu (e.g., "About", "Services")',
      validation: (Rule) => Rule.required().error('Label is required')
    },
    { 
      name: 'href', 
      title: 'Link Target', 
      type: 'string',
      description: 'Where this link goes. Use "#" + section ID for internal links (e.g., #about, #services, #contact)',
      placeholder: '#about',
      validation: (Rule) => Rule.required().error('Link target is required')
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'string',
      initialValue: 'about',
      description: 'Choose an icon that represents this navigation item. This will appear in the navigation dock.',
      options: {
        list: [
          { title: '📋 About - For company info and details', value: 'about' },
          { title: '🛡️ Safety - For safety information', value: 'safety' },
          { title: '🔧 Services - For services and offerings', value: 'services' },
          { title: '🏢 Projects - For portfolio and projects', value: 'projects' },
          { title: '📞 Contact - For contact information', value: 'contact' }
        ],
        layout: 'radio'
      },
      validation: (Rule) => Rule.required().error('Please select an icon')
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the position in the menu. Start with 0 for the first item, then 1, 2, 3, etc.',
      placeholder: 0,
      initialValue: 0,
      validation: (Rule) => Rule.required().min(0).error('Order must be 0 or greater')
    }
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
      order: 'order',
      icon: 'icon'
    },
    prepare({ title, subtitle, order, icon }) {
      const iconEmoji = iconMap[icon] || '📌'
      const orderDisplay = order !== undefined ? `#${order}` : '?'
      return {
        title: `${iconEmoji} ${orderDisplay} - ${title}`,
        subtitle: `Links to: ${subtitle || 'Not set'}`
      }
    }
  }
})

