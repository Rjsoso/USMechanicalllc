import { useEffect, useState } from 'react';
import { client } from '../utils/sanity';

export default function Careers() {
  const [careersData, setCareersData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(`*[_type == "careers"][0]{
        mainHeading,
        jobTitle,
        jobOverview,
        jobDescription,
        qualifications,
        benefits,
        indeedUrl,
        "applicationPdfUrl": applicationPdf.asset->url,
        submissionEmail,
        submissionFax
      }`)
      .then((data) => {
        setCareersData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching careers data:', error);
        setLoading(false);
      });
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="careers" className="pt-0 pb-24 bg-white text-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-black">Loading careers...</div>
        </div>
      </section>
    );
  }

  // Fallback content if no data from Sanity
  const heading = careersData?.mainHeading || 'Careers at U.S. Mechanical';
  const jobTitle = careersData?.jobTitle || 'Now hiring Plumbing and HVAC Installers';
  const jobOverview = careersData?.jobOverview || ['Full-time', 'Entry- to mid-level experience', 'Competitive pay and benefits'];
  const jobDescription = careersData?.jobDescription || 'Demolish and install plumbing and HVAC systems in new commercial and institutional construction throughout the Intermountain West including Utah, Nevada and Wyoming.';
  const qualifications = careersData?.qualifications || [
    { item: '18 years or older (Required)', required: true },
    { item: 'US work authorization (Required)', required: true },
    { item: 'High school or equivalent (Preferred)', required: false },
    { item: 'Interest in plumbing, pipe fitting or sheet metal career (Preferred)', required: false },
    { item: 'OSHA 10/30 card holder', required: false },
  ];
  const benefits = careersData?.benefits || [
    '$500 referral bonus',
    'Tuition reimbursement for apprentices',
    'Paid time off starts accruing after 90 days',
    'Free employee medical, dental, vision, and life insurance',
    'Up to 3.5% 401(k) match',
  ];
  const indeedUrl = careersData?.indeedUrl || 'https://www.indeed.com/cmp/U.s.-Mechanical,-LLC/jobs';
  const pdfUrl = careersData?.applicationPdfUrl || '/application.pdf';
  const submissionEmail = careersData?.submissionEmail || 'admin@usmechanicalllc.com';
  const submissionFax = careersData?.submissionFax || '(801) 785-6029';

  return (
    <section id="careers" className="pt-0 pb-24 bg-white text-black">
      <div className="max-w-5xl mx-auto px-6">
        {/* Main Heading */}
        <h2 className="section-title text-5xl md:text-6xl text-black mb-4 text-center">
          {heading}
        </h2>
        
        {/* Subheading */}
        <h3 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">
          {jobTitle}
        </h3>
        
        {/* Job Overview Bullets */}
        <div className="mb-8 text-center">
          <ul className="inline-block text-left space-y-2 text-lg">
            {jobOverview.map((item, idx) => (
              <li key={idx}>• {item}</li>
            ))}
          </ul>
        </div>
        
        {/* Job Description */}
        <p className="text-lg text-black mb-10 text-center max-w-3xl mx-auto leading-relaxed">
          {jobDescription}
        </p>
        
        {/* Qualifications & Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
          <div>
            <h4 className="text-xl font-bold mb-4 text-black">Qualifications:</h4>
            <ul className="space-y-2 text-lg">
              {qualifications.map((qual, idx) => (
                <li key={idx}>
                  • {qual.item} {qual.required ? '(Required)' : '(Preferred)'}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4 text-black">Benefits:</h4>
            <ul className="space-y-2 text-lg">
              {benefits.map((benefit, idx) => (
                <li key={idx}>• {benefit}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          {indeedUrl && (
            <a
              href={indeedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-button-3d inline-block bg-black hover:bg-zinc-800 text-white font-semibold px-8 py-3"
            >
              Apply on Indeed
            </a>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download
              className="hero-button-3d inline-block bg-black hover:bg-zinc-800 text-white font-semibold px-8 py-3"
            >
              Download Fillable PDF
            </a>
          )}
        </div>
        
        {/* Submission Instructions */}
        {(submissionEmail || submissionFax) && (
          <p className="text-sm text-gray-600 text-center">
            {submissionEmail && `Email to ${submissionEmail}`}
            {submissionEmail && submissionFax && ' or '}
            {submissionFax && `fax to ${submissionFax}`}
          </p>
        )}
      </div>
    </section>
  );
}
