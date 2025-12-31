export default function Careers() {
  return (
    <section id="careers" className="py-24 bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="section-title text-5xl md:text-6xl text-white mb-6">Careers at U.S. Mechanical</h2>
        <p className="text-lg md:text-xl text-white mb-10">
          At U.S. Mechanical, we believe in building more than projects — we build careers.
          Our team is our greatest asset, and we're always looking for skilled and dedicated
          individuals to join us.
        </p>

        <div className="space-y-4 text-left">
          <p className="text-lg md:text-xl text-white">
            • Competitive pay and benefits for all positions.
          </p>
          <p className="text-lg md:text-xl text-white">
            • Opportunities for apprenticeships and journeyman training.
          </p>
          <p className="text-lg md:text-xl text-white">
            • Safety-first work environment with OSHA and MSHA certified leadership.
          </p>
          <p className="text-lg md:text-xl text-white">
            • Positions available in Utah and Nevada offices.
          </p>
        </div>

        <a
          href="mailto:info@usmechanicalllc.com"
          className="inline-block mt-10 bg-[#003A70] hover:bg-[#002a52] text-white px-8 py-3 rounded-lg text-lg md:text-xl font-semibold shadow-md transition-all"
        >
          Apply Now
        </a>
      </div>
    </section>
  );
}
