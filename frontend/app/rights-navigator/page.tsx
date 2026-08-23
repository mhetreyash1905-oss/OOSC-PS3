'use client';

import { useState } from 'react';
import Link from 'next/link';

interface RightItem {
  id: string;
  act: string;
  section: string;
  category: string;
  title: string;
  summary: string;
  enforcement: string;
  punishment?: string;
}

export default function RightsNavigatorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const rightsList: RightItem[] = [
    {
      id: 'r1',
      act: 'Consumer Protection Act 2019',
      section: 'Section 2(42) & E-Commerce Rules 2020',
      category: 'Consumer',
      title: 'E-Commerce Refund & Replacement Rights',
      summary: 'E-commerce platforms (e.g. Flipkart, Amazon) and third-party sellers cannot refuse refund or replacement for defective products or deficient services. False advertising and no-return traps on defective goods are illegal.',
      enforcement: 'Lodge grievance on National Consumer Helpline (1915 / consumerhelpline.gov.in). Serve 15-day statutory demand notice and petition District Consumer Commission.',
      punishment: 'Refund of product cost plus compensation for mental harassment & litigation expenses.'
    },
    {
      id: 'r2',
      act: 'Maharashtra Rent Control Act 1999',
      section: 'Section 24 & Section 55',
      category: 'Tenancy',
      title: 'Mandatory Deposit Return & Written Agreement Registration',
      summary: 'Landlords are legally bound to return security deposits upon lease expiry after deducting valid itemized repair costs. Mandatory registration of tenancy agreements under Section 55 is the landlord’s statutory responsibility.',
      enforcement: 'Serve a formal 15-day written demand notice. If unpaid, approach the Competent Authority or Small Causes Court for summary recovery.',
      punishment: 'Landlord liable for interest up to 18% p.a. on delayed deposit refund.'
    },
    {
      id: 'r3',
      act: 'Maharashtra Rent Control Act 1999',
      section: 'Section 16 & Section 29',
      category: 'Tenancy',
      title: 'Statutory Eviction Protection & Utility Safeguards',
      summary: 'A tenant cannot be forcibly evicted without a court decree or statutory notice. Landlords are strictly barred from cutting electricity, water supply, or changing door locks to force eviction.',
      enforcement: 'Challenge arbitrary eviction notices before the local Rent Controller. File police complaint under Section 29 if utilities are cut.',
      punishment: 'Fine up to ₹3,000 or imprisonment up to 3 months for utility disconnection.'
    },
    {
      id: 'r4',
      act: 'Right to Information Act 2005',
      section: 'Section 6(1), Section 7(1) & Section 19',
      category: 'RTI',
      title: '30-Day Information Access Guarantee & Life/Liberty 48-Hour Deadline',
      summary: 'Every Indian citizen has the statutory right to request government records, inspection of public works, certified document copies, and tender files. Information concerning life or liberty must be provided within 48 hours.',
      enforcement: 'File an RTI application with ₹10 fee. If unanswered in 30 days, file First Appeal under Section 19(1).',
      punishment: 'Penalty of ₹250 per day up to maximum ₹25,000 on defaulting PIO under Section 20(1).'
    },
    {
      id: 'r5',
      act: 'Municipal Corporation Acts',
      section: 'Section 63 & Civic Obligation Rules',
      category: 'Municipal',
      title: 'Right to Potable Water & Safe Road Infrastructure',
      summary: 'Municipal corporations are statutory guardians of public health, drainage, streetlights, and road maintenance. Citizens have the right to demand repair of hazards within reasonable timelines.',
      enforcement: 'File a formal grievance petition with the Ward Officer and use Section 6(1) RTI to inspect contractor tenders.',
      punishment: 'Compensation claims under tort law for injuries caused by open potholes or contaminated water.'
    },
    {
      id: 'r6',
      act: 'Real Estate (Regulation and Development) Act 2016 (RERA)',
      section: 'Section 18 & Section 31',
      category: 'Real Estate',
      title: 'Homebuyer Refund & Delay Penalty Rights',
      summary: 'Builders and developers must hand over possession within the sanctioned agreement deadline. Delay in possession entitles homebuyers to full refund with SBI MCLR + 2% interest.',
      enforcement: 'File online complaint on State RERA Portal (e.g. MahaRERA / UP-RERA) for compensation and execution orders.',
      punishment: 'Penalty up to 10% of estimated project cost or imprisonment up to 3 years.'
    },
    {
      id: 'r7',
      act: 'Electricity Act 2003',
      section: 'Section 56 & Section 126',
      category: 'Utilities',
      title: 'Protection Against Arbitrary Disconnection & Overcharging',
      summary: 'Utility distribution companies cannot disconnect electricity supply without serving 15 clear days written notice. Meter testing rights apply for inflated or faulty bill complaints.',
      enforcement: 'Pay average historical bill under formal written protest and lodge petition with Consumer Grievance Redressal Forum (CGRF).',
      punishment: 'Mandatory refund of overcharged amount plus interest by distribution licensee.'
    },
    {
      id: 'r8',
      act: 'Rights of Persons with Disabilities Act 2016',
      section: 'Section 3 & Section 21',
      category: 'Disability Rights',
      title: 'Accessibility Mandate in Public Buildings & Transport',
      summary: 'Mandates equal access, barrier-free infrastructure, tactile paving, ramps, accessible websites, and non-discrimination in public services and public transport for disabled citizens.',
      enforcement: 'File a complaint with the State Commissioner for Persons with Disabilities or District Court.',
      punishment: 'Fine up to ₹10,000 for first offense and up to ₹5 Lakh for subsequent offenses.'
    },
    {
      id: 'r9',
      act: 'Food Safety and Standards Act 2006',
      section: 'Section 54 & Section 59',
      category: 'Consumer',
      title: 'Adulterated Food & Hygiene Liability',
      summary: 'Restaurants, cloud kitchens, and food delivery services are strictly liable for adulterated, contaminated, or unsafe food products causing food poisoning or health hazards.',
      enforcement: 'Submit sample report to Food Safety Officer (FSSAI) and file claim at District Consumer Forum.',
      punishment: 'Imprisonment up to 6 years and fine up to ₹5 Lakh for selling unsafe food.'
    },
    {
      id: 'r10',
      act: 'Motor Vehicles (Amendment) Act 2019',
      section: 'Section 134A & Good Samaritan Rules',
      category: 'Civic',
      title: 'Good Samaritan Rights in Road Accidents',
      summary: 'A Good Samaritan who assists a road accident victim is not liable for any civil or criminal action. Police or hospital authorities cannot force the helper to disclose identity or pay admission fees.',
      enforcement: 'Cite Supreme Court guidelines in *SaveLIFE Foundation v. Union of India (2016)*.',
      punishment: 'Departmental proceedings against police officers or hospital staff harassing Good Samaritans.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Rights' },
    { id: 'Consumer', label: '🛍️ Consumer' },
    { id: 'Tenancy', label: '🏠 Tenancy' },
    { id: 'RTI', label: '📜 RTI Act 2005' },
    { id: 'Municipal', label: '🏛️ Municipal' },
    { id: 'Real Estate', label: '🏢 Real Estate (RERA)' },
    { id: 'Utilities', label: '⚡ Electricity & Utilities' },
    { id: 'Disability Rights', label: '♿ Disability Rights' }
  ];

  const filteredRights = rightsList.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.act.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header Matching #14505b Dotted Pattern */}
      <section className="relative overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl shadow-[#14505b]/30 border-b border-white/10">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Statutory Knowledge & Enforcement Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Rights Navigator & Legal Statutes Directory
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Search verified Indian statutory acts, exact section numbers, statutory response deadlines, and step-by-step legal enforcement rights for Indian citizens.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Search Bar & Categories */}
        <div className="space-y-4">
          <div className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, section, or act (e.g. 'deposit', 'Section 6(1)', 'RERA', 'Flipkart', 'eviction')..."
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1d1b1b] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] shadow-md transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-extrabold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md'
                    : 'bg-white dark:bg-[#1d1b1b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333] hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rights List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRights.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1d1b1b] rounded-3xl border border-gray-200 dark:border-[#333]">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No statutory rights found matching your search query.</p>
            </div>
          ) : (
            filteredRights.map((right) => (
              <div
                key={right.id}
                className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-md hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[#2f2d2d] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] text-xs font-extrabold border border-blue-100 dark:border-[#3a3737]">
                      {right.section}
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {right.act}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-400">
                    Domain: {right.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">{right.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-4">
                    {right.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-gray-50 dark:bg-[#252323] rounded-2xl border border-gray-100 dark:border-[#363333] space-y-1">
                    <span className="text-[11px] font-extrabold text-[#0e6670] dark:text-[#e7b85b] uppercase tracking-wider block">
                      Statutory Enforcement Pathway:
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{right.enforcement}</p>
                  </div>

                  {right.punishment && (
                    <div className="p-4 bg-amber-50/60 dark:bg-[#272424] rounded-2xl border border-amber-100 dark:border-[#383535] space-y-1">
                      <span className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                        Statutory Liability & Penalty:
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{right.punishment}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href="/application-generator"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
                  >
                    Draft Application or Notice for this Right →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Extended Section: How to Cite Statutes in Formal Complaints */}
        <div className="bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4">
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#e7b85b] text-[#102a2e] inline-block">
            Pro-Tip for Citizens
          </span>
          <h2 className="text-2xl font-black">How Statutory Citations Accelerate Relief</h2>
          <p className="text-xs sm:text-sm text-[#d4eae6] leading-relaxed font-medium">
            When filing grievances with government offices, consumer helplines, or landlords, explicitly naming the exact Act and Section (e.g. <em>"Section 6(1) of RTI Act 2005"</em> or <em>"Consumer Protection Rules 2020"</em>) shifts your complaint from an informal request to a formal legal obligation. CivicSaathi automatically inserts these citations in all generated documents.
          </p>
        </div>
      </div>
    </div>
  );
}
