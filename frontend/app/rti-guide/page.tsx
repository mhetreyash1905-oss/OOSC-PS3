import Link from 'next/link';

export default function RTIGuidePage() {
  const rtiSteps = [
    {
      step: 'Step 1',
      title: 'Identify the Public Authority & PIO',
      description: 'Determine which department holds the information (e.g. Municipal Corporation, Rent Controller, Public Works Department). Every department has a designated Public Information Officer (PIO).'
    },
    {
      step: 'Step 2',
      title: 'Draft Specific, Objective Questions',
      description: 'Under Section 6(1), request records, file notings, inspection of works, and certified copies. Do not ask "Why" or seek personal opinions.'
    },
    {
      step: 'Step 3',
      title: 'Pay the Nominal Application Fee',
      description: 'Central Government and most states charge ₹10 as application fee (via Postal Order, Court Fee stamp, or online payment gateway). Below Poverty Line (BPL) cardholders are exempt from all fees.'
    },
    {
      step: 'Step 4',
      title: 'Track the 30-Day Mandatory Window',
      description: 'Under Section 7(1), the PIO must respond within 30 calendar days. If no reply is given or information is refused, you can file a First Appeal under Section 19(1).'
    }
  ];

  const sections = [
    {
      sec: 'Section 6(1)',
      title: 'Request for Obtaining Information',
      desc: 'Allows any Indian citizen to submit a written request in English, Hindi, or the official language of the area specifying the particulars of the information sought.'
    },
    {
      sec: 'Section 7(1)',
      title: '30-Day Disposal of Request',
      desc: 'Mandates the PIO to provide the information or reject the request within 30 days of receipt. If life or liberty is involved, information must be provided in 48 hours.'
    },
    {
      sec: 'Section 19(1)',
      title: 'First Appeal',
      desc: 'If you do not receive a decision within 30 days or are aggrieved by the PIO’s response, you may appeal to the First Appellate Authority within 30 days.'
    },
    {
      sec: 'Section 20',
      title: 'Penalties for PIO Inaction',
      desc: 'Central or State Information Commissions can impose a penalty of ₹250 per day (up to ₹25,000) on PIOs who unreasonably refuse or delay information.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header Matching #14505b Dotted Pattern */}
      <section className="relative overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Right to Information Act 2005</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Complete Citizen’s Guide to Filing an RTI
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Learn how to use Section 6(1) to inspect government tenders, demand public accountability, and track statutory response timelines.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-[#0e6670] to-[#144d56] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Want to draft an RTI in seconds?</h2>
            <p className="text-sm text-[#d4eae6] leading-relaxed">
              CivicSaathi automatically identifies the correct PIO department and formulates statutory questions customized to your specific issue.
            </p>
          </div>
          <Link
            href="/platform"
            className="shrink-0 bg-[#e7b85b] hover:bg-[#f2c974] text-[#102a2e] font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all"
          >
            Auto-Draft RTI with CivicSaathi →
          </Link>
        </div>

        {/* 4 Steps */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              The 4-Step RTI Filing Process
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Follow these standard procedures for central and state public authorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rtiSteps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#201e1e] rounded-3xl p-7 border border-gray-200 dark:border-[#333] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] rounded-full inline-block mb-3">
                    {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Statutory Sections */}
        <div className="bg-white dark:bg-[#201e1e] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[#333] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Key Sections of RTI Act 2005 Every Citizen Should Know
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 dark:bg-[#292626] border border-gray-100 dark:border-[#3d3838]">
                <div className="text-sm font-black text-[#0e6670] dark:text-[#e7b85b] mb-1">{sec.sec}</div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{sec.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50/60 dark:bg-[#182c1f] rounded-3xl p-7 border border-green-200 dark:border-green-900/50">
            <h3 className="text-lg font-bold text-green-900 dark:text-green-300 mb-4 flex items-center gap-2">
              <span>✅</span> What You CAN Ask in an RTI
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-green-950 dark:text-green-200">
              <li>• Certified copies of government orders, notifications, and circulars.</li>
              <li>• Tenders, bids, contractor bills, and measurement book entries.</li>
              <li>• Status of citizen complaints, grievances, and file movement records.</li>
              <li>• Inspection of public works, roads, pipelines, and government records.</li>
            </ul>
          </div>

          <div className="bg-red-50/60 dark:bg-[#2c1818] rounded-3xl p-7 border border-red-200 dark:border-red-900/50">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-4 flex items-center gap-2">
              <span>❌</span> What You CANNOT Ask in an RTI
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-red-950 dark:text-red-200">
              <li>• Seeking personal opinions or explanations (e.g. "Why did you do this?").</li>
              <li>• Hypothetical or future-oriented questions.</li>
              <li>• Information exempt under Section 8 (national security, cabinet papers, trade secrets).</li>
              <li>• Creating new data that does not already exist in material records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
