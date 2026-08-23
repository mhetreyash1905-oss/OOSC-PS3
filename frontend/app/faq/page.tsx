'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'tenant', label: '🏠 Tenancy & Landlord' },
    { id: 'rti', label: '📜 RTI (Right to Information)' },
    { id: 'civic', label: '🏛️ Municipal & Grievances' },
    { id: 'ai', label: '🤖 CivicSaathi AI' },
  ];

  const faqs: FAQItem[] = [
    {
      category: 'tenant',
      question: 'What can I do if my landlord refuses to return my security deposit?',
      answer: 'Under Indian tenancy practices and Rent Control Acts (such as the Maharashtra Rent Control Act 1999), security deposits must be returned upon vacating after deducting legitimate, itemized damages or unpaid utility bills. You can: (1) Check your rental agreement clauses, (2) Send a formal written demand notice stating a 7–15 day repayment deadline, (3) Preserve bank transaction proofs and handover photos, and (4) If unresolved, approach the local Rent Controller, Small Causes Court, or Consumer Disputes Redressal Commission.'
    },
    {
      category: 'tenant',
      question: 'Can a landlord evict a tenant immediately without notice?',
      answer: 'No. Arbitrary or forcible eviction without statutory notice is strictly prohibited under Indian tenancy laws. Landlords are required to serve a formal written notice (typically 30 days, or as specified in your agreement) detailing legal grounds such as non-payment of rent or bona fide personal requirement.'
    },
    {
      category: 'tenant',
      question: 'Is a registered rent agreement mandatory in India?',
      answer: 'Yes, in most states like Maharashtra (under Section 55 of the Maharashtra Rent Control Act 1999), registering the leave and license / tenancy agreement is the landlord’s legal responsibility. Failure to register can attract statutory penalties for the landlord.'
    },
    {
      category: 'rti',
      question: 'What is the Right to Information (RTI) Act 2005?',
      answer: 'The RTI Act 2005 is a landmark Indian statute empowering citizens to request official records, inspecting public works, obtaining certified copies of government files, and querying the status of public tenders from any public authority.'
    },
    {
      category: 'rti',
      question: 'How long does a government department have to reply to an RTI?',
      answer: 'Under Section 7(1) of the RTI Act, the Public Information Officer (PIO) must provide the requested information within 30 statutory days from the date of receipt. If the information concerns the life or liberty of a person, it must be provided within 48 hours.'
    },
    {
      category: 'rti',
      question: 'What happens if a PIO does not reply within 30 days?',
      answer: 'If the PIO fails to respond within 30 days or provides incomplete information, you have the statutory right under Section 19(1) to file a "First Appeal" before the designated First Appellate Authority within 30 days. No government fee is required for the first appeal in most jurisdictions.'
    },
    {
      category: 'civic',
      question: 'How do I hold my local municipal corporation accountable for broken roads or contaminated water?',
      answer: 'You can: (1) Lodge a formal complaint on the municipal corporation’s grievance portal (e.g. BMC, BBMP, MCD, PMC), (2) Submit a written petition to the Ward Officer/Municipal Commissioner, and (3) If unresolved, file an RTI application under Section 6(1) to inspect tender documents, contractor details, completion certificates, and expenditure allocated for that specific road or water line.'
    },
    {
      category: 'civic',
      question: 'What information can I request regarding local road construction?',
      answer: 'You can ask for: (1) Name of the contractor and work order number, (2) Total budgeted and sanctioned amount, (3) Guarantee / defect-liability period for the road, (4) Certified copy of the quality inspection test report, and (5) Name and designation of the supervisory junior engineer.'
    },
    {
      category: 'ai',
      question: 'How does CivicSaathi guarantee legal accuracy without hallucinations?',
      answer: 'CivicSaathi uses a Retrieval-Augmented Generation (RAG) architecture. When you describe your problem, our system searches a verified vector database of Indian statutes. The reasoning model is strictly restricted to use only the retrieved legal text and must provide inline bracketed citations [Source: X].'
    },
    {
      category: 'ai',
      question: 'Can I speak to CivicSaathi in Hindi or Hinglish?',
      answer: 'Yes! CivicSaathi natively understands Hindi, Hinglish (e.g. "Mere landlord ne security deposit wapas nahi kiya"), and English. You can also use the Voice Input microphone 🎤 to speak your problem naturally.'
    },
    {
      category: 'ai',
      question: 'Does CivicSaathi replace a licensed lawyer?',
      answer: 'No. CivicSaathi provides educational civic and statutory explanations and drafts initial RTI petitions and demand notices. It is designed to assist and inform citizens, but it is not a substitute for formal legal representation in a court of law.'
    }
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header Matching #14505b Dotted Pattern */}
      <section className="relative overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl shadow-[#14505b]/30 border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Citizen Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Everything you need to know about tenancy laws, RTI filing, municipal grievance redressal, and CivicSaathi.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0e6670] text-white shadow-md'
                  : 'bg-white dark:bg-[#222] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2c2a2a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-[#201e1e] rounded-2xl border border-gray-200 dark:border-[#333] shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-gray-900 dark:text-white text-base sm:text-lg hover:text-[#0e6670] dark:hover:text-[#e7b85b] transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className={`text-xl transform transition-transform text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-[#2a2828]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-[#0e6670]/10 to-blue-50 dark:from-[#252323] dark:to-[#201e1e] border border-[#0e6670]/20 dark:border-[#383535] text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Have a Specific Problem?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            You don't need to read all laws. Ask CivicSaathi in plain language and receive personalized rights analysis and an action plan.
          </p>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-[#0e6670] hover:bg-[#094d54] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Ask CivicSaathi Assistant →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
