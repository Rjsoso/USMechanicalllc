export default function Careers() {
  return (
    <section id="careers" className="pt-4 pb-24 bg-black text-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Main Heading */}
        <h2 className="section-title text-5xl md:text-6xl text-white mb-4 text-center">
          Careers at U.S. Mechanical
        </h2>
        
        {/* Subheading */}
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          Now hiring Plumbing and HVAC Installers
        </h3>
        
        {/* Job Overview Bullets */}
        <div className="mb-8 text-center">
          <ul className="inline-block text-left space-y-2 text-lg">
            <li>• Full-time</li>
            <li>• Entry- to mid-level experience</li>
            <li>• Competitive pay and benefits</li>
          </ul>
        </div>
        
        {/* Job Description */}
        <p className="text-lg text-white mb-10 text-center max-w-3xl mx-auto leading-relaxed">
          Demolish and install plumbing and HVAC systems in new commercial and institutional construction throughout the Intermountain West including Utah, Nevada and Wyoming.
        </p>
        
        {/* Qualifications & Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">Qualifications:</h4>
            <ul className="space-y-2 text-lg">
              <li>• 18 years or older (Required)</li>
              <li>• US work authorization (Required)</li>
              <li>• High school or equivalent (Preferred)</li>
              <li>• Interest in plumbing, pipe fitting or sheet metal career (Preferred)</li>
              <li>• OSHA 10/30 card holder</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">Benefits:</h4>
            <ul className="space-y-2 text-lg">
              <li>• $500 referral bonus</li>
              <li>• Tuition reimbursement for apprentices</li>
              <li>• Paid time off starts accruing after 90 days</li>
              <li>• Free employee medical, dental, vision, and life insurance</li>
              <li>• Up to 3.5% 401(k) match</li>
            </ul>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a
            href="https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#003A70] hover:bg-[#002a52] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-all text-center"
          >
            Apply on Indeed
          </a>
          <a
            href="/application.pdf"
            download
            className="inline-block bg-[#003A70] hover:bg-[#002a52] text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition-all text-center"
          >
            Download Fillable PDF
          </a>
        </div>
        
        {/* Submission Instructions */}
        <p className="text-sm text-gray-400 text-center">
          Email to admin@usmechanicalllc.com or fax to (801) 785-6029
        </p>
      </div>
    </section>
  );
}
