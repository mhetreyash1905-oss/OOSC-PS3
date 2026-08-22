import Link from 'next/link';

export default function Home() {
  const problems = [
    {
      icon: '🏠',
      title: 'Tenant–Landlord Disputes',
      example: '"Mere landlord ne security deposit wapas nahi kiya."',
      description: 'Security deposit withholding, sudden eviction notices, unlawful rent hikes, and repair responsibilities under state Rent Control Acts.',
      badge: 'Rent Control Act'
    },
    {
      icon: '🏛️',
      title: 'Municipal & Civic Grievances',
      example: '"Road broken and open drainage causing hazards for 6 months."',
      description: 'Pothole repairs, contaminated water supply, garbage accumulation, defunct streetlights, and municipal corporation accountability.',
      badge: 'Municipal Acts'
    },
    {
      icon: '📜',
      title: 'Right to Information (RTI)',
      example: '"How to inspect government expenditure on local road project?"',
      description: 'Drafting Section 6(1) RTI applications, identifying Public Information Officers (PIOs), and filing First Appeals within 30-day timelines.',
      badge: 'RTI Act 2005'
    },
    {
      icon: '⚖️',
      title: 'Consumer & Public Utility Issues',
      example: '"Unjustified high electricity bill and faulty meter not replaced."',
      description: 'Unfair utility charges, deficient civic services, consumer forum escalation, and formal statutory legal demand notices.',
      badge: 'Consumer Protection'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe in Simple Language',
      desc: 'Speak or type your problem in Hindi, Hinglish, or English. No legal terminology needed.',
      icon: '🗣️'
    },
    {
      number: '02',
      title: 'Instant Issue Detection & Checklist',
      desc: 'CivicSaathi classifies your case and provides an immediate actionable checklist under "You may want to:".',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Grounded Statutory Analysis',
      desc: 'Get rights explanations backed strictly by official legal chunks and statutory provisions with inline citations.',
      icon: '⚖️'
    },
    {
      number: '04',
      title: 'Draft & Download Official Documents',
      desc: 'Generate submittable RTI applications or legal demand notices, rendered into high-quality PDFs in one click.',
      icon: '📄'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0e3b43] via-[#124b55] to-[#1a5f6c] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span>🇮🇳</span>
            <span>AI Civic Rights & Legal Drafting Assistant for India</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Understand Your Rights. <br className="hidden sm:inline" />
            <span className="text-[#e7b85b]">Take Confident Action.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#d4eae6] max-w-3xl mx-auto leading-relaxed mb-10">
            From withheld tenant security deposits to municipal road repairs and RTI filings — CivicSaathi transforms plain-language citizen complaints into grounded legal rights and submittable official documents.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/platform"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#e7b85b] hover:bg-[#f3ca76] text-[#102a2e] font-bold px-8 py-4 rounded-xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              <span>🤖</span>
              <span>Ask CivicSaathi Now</span>
              <span>→</span>
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-4 rounded-xl text-base backdrop-blur-sm transition-all"
            >
              <span>Learn How It Works</span>
            </Link>
          </div>

          {/* Interactive Chat Simulation Card */}
          <div className="max-w-2xl mx-auto bg-white/95 dark:bg-[#201e1e]/95 text-gray-900 dark:text-gray-100 rounded-3xl p-6 shadow-2xl border border-white/20 text-left backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#333] pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-2">Live Assistant Demo</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-bold">
                Online
              </span>
            </div>

            {/* User Message */}
            <div className="flex justify-end mb-4">
              <div className="bg-[#0e6670] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm font-medium shadow-sm">
                "Mere landlord ne security deposit wapas nahi kiya."
              </div>
            </div>

            {/* AI Message */}
            <div className="bg-gray-50 dark:bg-[#2b2828] border border-gray-200 dark:border-[#3d3838] rounded-2xl p-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">🤖</span>
                <span className="font-bold text-[#0e6670] dark:text-[#e7b85b]">CivicSaathi</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                I understand your situation. Under standard tenancy frameworks, landlords cannot withhold security deposits without valid, itemized damage claims.
              </p>
              <div className="p-3 bg-blue-50/80 dark:bg-[#343030] rounded-xl border border-blue-100 dark:border-[#444] mb-3">
                <span className="text-[11px] font-bold text-blue-800 dark:text-orange-300 uppercase block mb-1">Issue detected:</span>
                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
                  <span>🏠</span> Tenant–Landlord Dispute
                </div>
              </div>
              <div className="space-y-1 text-gray-600 dark:text-gray-300 text-xs mb-3">
                <p className="font-semibold text-gray-700 dark:text-gray-200">You may want to:</p>
                <p>• Check your rental agreement for notice & refund clauses</p>
                <p>• Send a written demand notice</p>
                <p>• Preserve payment records & handover receipts</p>
              </div>
              <Link
                href="/platform"
                className="inline-flex items-center gap-1.5 font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline text-xs"
              >
                Create Action Plan & Draft Notice →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b] mb-2">
            Coverage & Specializations
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            What Civic & Legal Problems Can We Help You Solve?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-3 text-base">
            Specialized legal reasoning agents tuned specifically for everyday challenges Indian citizens face.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((prob, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#201e1e] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3 bg-blue-50 dark:bg-[#2c2929] rounded-2xl">
                    {prob.icon}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 bg-gray-100 dark:bg-[#2c2929] text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-[#3d3a3a]">
                    {prob.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {prob.title}
                </h3>
                <div className="p-3 bg-gray-50 dark:bg-[#282525] rounded-xl text-xs italic text-gray-600 dark:text-gray-400 mb-4 border border-gray-100 dark:border-[#363333]">
                  {prob.example}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {prob.description}
                </p>
              </div>

              <Link
                href="/platform"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
              >
                <span>Get Help with this Issue</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#eef4f1] dark:bg-[#1b1919] border-y border-[#dce3df] dark:border-[#2f2d2d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b] mb-2">
              Step-by-Step Clarity
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              From Citizen Complaint to Submittable Document
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mt-3 text-base">
              A transparent, 4-stage pipeline combining conversational triage with local vector retrieval and statutory drafting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#232121] rounded-3xl p-6 border border-gray-200 dark:border-[#353232] shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-2xl font-black text-[#0e6670]/20 dark:text-[#e7b85b]/20">
                      {s.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardrails / Grounding Guarantee */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#0e3b43] to-[#124b55] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e7b85b] text-[#102a2e] mb-4 inline-block">
              Zero-Hallucination Guardrails
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              AI Powered by Real Statutes, Not Speculation.
            </h2>
            <p className="text-base text-[#d4eae6] leading-relaxed mb-8">
              Generic chatbots often invent legal outcomes or state non-existent laws. CivicSaathi is architected with strict Retrieval-Augmented Generation (RAG) that restricts answers to verified legal statutes and forces inline citations for every right explained.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div>
                <div className="text-2xl font-black text-[#e7b85b]">100%</div>
                <div className="text-xs text-[#d4eae6]">Statute Grounded</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#e7b85b]">Section 6(1)</div>
                <div className="text-xs text-[#d4eae6]">RTI Act Formatted</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#e7b85b]">Hindi/English</div>
                <div className="text-xs text-[#d4eae6]">Multilingual Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-[#f6edcf] dark:bg-[#1f2628] border-t border-[#e7d9af] dark:border-[#334244]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#183338] dark:text-white mb-4">
            Ready to resolve your civic or legal issue?
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-8">
            Experience CivicSaathi today. No legal fees, no complicated jargon — just actionable guidance and formatted applications.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/platform"
              className="bg-[#0e6670] hover:bg-[#094d54] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg text-base"
            >
              Start Your Inquiry with CivicSaathi →
            </Link>
            <Link
              href="/faq"
              className="bg-white dark:bg-[#2d2a2a] hover:bg-gray-50 dark:hover:bg-[#3d3a3a] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#444] font-semibold py-3.5 px-8 rounded-xl transition-all text-base shadow-sm"
            >
              Read Common FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
