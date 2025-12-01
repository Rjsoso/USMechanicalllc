export default function Careers() {
  return (
    <section id="careers" className="py-24" style={{ backgroundColor: '#003A70' }}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Careers at U.S. Mechanical</h2>
        <p className="text-gray-200 mb-10">
          At U.S. Mechanical, we believe in building more than projects — we build careers.
          Our team is our greatest asset, and we're always looking for skilled and dedicated
          individuals to join us.
        </p>

        <div className="space-y-4 text-left">
          <p className="text-gray-200">
            • Competitive pay and benefits for all positions.
          </p>
          <p className="text-gray-200">
            • Opportunities for apprenticeships and journeyman training.
          </p>
          <p className="text-gray-200">
            • Safety-first work environment with OSHA and MSHA certified leadership.
          </p>
          <p className="text-gray-200">
            • Positions available in Utah and Nevada offices.
          </p>
        </div>

        <a
          href="mailto:info@usmechanicalllc.com"
          className="inline-block mt-10 bg-white hover:bg-gray-100 text-[#003A70] px-8 py-3 rounded-lg font-semibold shadow-md transition-all"
        >
          Apply Now
        </a>
      </div>
    </section>
  )
}
