import FadeInWhenVisible from './FadeInWhenVisible'

export default function Projects({ data }) {
  // Handle both old structure (with title) and new structure (direct array)
  const projectsData = data?.projects || (Array.isArray(data) ? data : [])
  const sectionTitle = data?.title || 'Project Recognition'

  // Default projects if no data provided
  const defaultProjects = [
    {
      title: 'Utah County Convention Center',
      award: 'LEED Silver Certification',
      image: '/proj1.jpg',
    },
    { title: 'Greenspun Hall - UNLV', award: 'LEED Gold Certification', image: '/proj2.jpg' },
    {
      title: 'Nevada State Museum',
      award: 'LEED Platinum Certification',
      image: '/proj3.jpg',
    },
    {
      title: 'Red Rock Canyon Visitor Center',
      award: 'LEED Gold Certification',
      image: '/proj4.jpg',
    },
    {
      title: 'Maple Mountain High School',
      award: 'Top Project Recognition',
      image: '/proj5.jpg',
    },
  ]

  const projects = projectsData.length > 0 ? projectsData : defaultProjects

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <FadeInWhenVisible>
          <h2 className="text-3xl font-bold mb-12">{sectionTitle}</h2>
        </FadeInWhenVisible>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((p, i) => {
            const title = p.title || p.projectName
            const award = p.award || p.certification
            const image = p.image || p.imageUrl

            return (
              <FadeInWhenVisible key={i} delay={i * 0.1}>
                <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
                  <img
                    src={image}
                    alt={title}
                    className="h-48 w-full object-cover rounded-lg mb-4"
                    loading="lazy"
                    onError={e => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80'
                    }}
                  />
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-blue-600">{award}</p>
                </div>
              </FadeInWhenVisible>
            )
          })}
        </div>
      </div>
    </section>
  )
}
