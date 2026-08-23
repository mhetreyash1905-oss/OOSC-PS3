'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Scheme {
  id: string;
  name: string;
  category: string;
  benefits: string;
  eligibility: string;
  documents: string[];
  link: string;
  matchScore: number;
}

export default function SchemeEligibilityPage() {
  const [incomeTier, setIncomeTier] = useState<string>('below_3L');
  const [category, setCategory] = useState<string>('general');

  const schemes: Scheme[] = [
    {
      id: 's1',
      name: 'RTI Fee Exemption under Section 7(5)',
      category: 'Civic & Transparency',
      benefits: '100% Waiver of RTI application fee (₹10) and document copying charges.',
      eligibility: 'Citizens holding a Below Poverty Line (BPL) ration card issued by State/Central government.',
      documents: ['BPL Ration Card', 'Valid Govt Photo ID (Aadhaar / Voter ID)'],
      link: 'https://rtionline.gov.in',
      matchScore: incomeTier === 'below_1L' || category === 'bpl' ? 100 : 60
    },
    {
      id: 's2',
      name: 'NALSA Free Legal Aid under Section 12 of Legal Services Authorities Act',
      category: 'Legal Welfare',
      benefits: 'Free advocate appointment, court fee waiver, and complete legal representation in court.',
      eligibility: 'Women, children, SC/ST members, industrial workmen, or annual income below statutory state limits (₹3 Lakhs).',
      documents: ['Income Certificate', 'Aadhaar Card', 'Court Case Petition Papers'],
      link: 'https://nalsa.gov.in',
      matchScore: incomeTier === 'below_3L' || incomeTier === 'below_1L' ? 100 : 80
    },
    {
      id: 's3',
      name: 'Pradhan Mantri Awas Yojana (PMAY-Urban / Gramin)',
      category: 'Housing Rights',
      benefits: 'Interest subsidy up to ₹2.67 Lakhs on housing loans for first-time home buyers.',
      eligibility: 'Families belonging to EWS / LIG income categories not owning a pucca house in India.',
      documents: ['Income Certificate', 'Aadhaar Card', 'Affidavit of No Property Ownership'],
      link: 'https://pmaymis.gov.in',
      matchScore: incomeTier === 'below_3L' || incomeTier === 'below_1L' ? 95 : 40
    },
    {
      id: 's4',
      name: 'Ayushman Bharat PM-JAY Health Assurance',
      category: 'Healthcare & Welfare',
      benefits: 'Cashless health insurance coverage up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.',
      eligibility: 'Families listed in SECC 2011 database or holding BPL / Antyodaya cards.',
      documents: ['Ration Card / Ayushman Card', 'Aadhaar Card'],
      link: 'https://pmjay.gov.in',
      matchScore: category === 'bpl' || incomeTier === 'below_1L' ? 100 : 70
    },
    {
      id: 's5',
      name: 'PM SVANidhi Micro-Credit Scheme for Street Vendors',
      category: 'Urban Livelihood',
      benefits: 'Collateral-free working capital loan up to ₹50,000 with 7% interest subsidy and cashback incentive.',
      eligibility: 'Street vendors engaged in vending in urban areas on or before March 24, 2020.',
      documents: ['Certificate of Vending / ID Card', 'Aadhaar Card', 'Bank Account Passbook'],
      link: 'https://pmsvanidhi.mohua.gov.in',
      matchScore: category === 'worker' ? 100 : 75
    },
    {
      id: 's6',
      name: 'e-Shram Social Security for Unorganized Workers',
      category: 'Labour Welfare',
      benefits: 'Universal Account Number (UAN), ₹2 Lakh accidental death insurance, and eligibility for state welfare pensions.',
      eligibility: 'Unorganized workers aged 16-59 (construction workers, domestic help, street vendors, drivers).',
      documents: ['Aadhaar linked Mobile Number', 'Bank Account Passbook'],
      link: 'https://eshram.gov.in',
      matchScore: category === 'worker' ? 100 : 80
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Hero Banner Matching Home Page */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Government Welfare & Civic Exemption Navigator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Scheme Eligibility & Free Legal Aid Finder
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Instantly evaluate your eligibility for 100% RTI fee exemptions, free NALSA court advocates, PMAY housing subsidies, and PM-JAY health assurance.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Questionnaire Form Card */}
        <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎛️</span>
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">Enter Citizen Profile Details</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Filter schemes customized to your income bracket and socio-economic category.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">
                Annual Household Income Bracket
              </label>
              <select
                value={incomeTier}
                onChange={(e) => setIncomeTier(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-medium"
              >
                <option value="below_1L">Below ₹1 Lakh per year (EWS / BPL)</option>
                <option value="below_3L">₹1 Lakh to ₹3 Lakhs per year (LIG)</option>
                <option value="below_6L">₹3 Lakhs to ₹6 Lakhs per year (MIG-I)</option>
                <option value="above_6L">Above ₹6 Lakhs per year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-2">
                Category & Special Status
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-medium"
              >
                <option value="general">General Citizen</option>
                <option value="bpl">BPL / Antyodaya Ration Card Holder</option>
                <option value="worker">Unorganized Worker / Street Vendor / Driver</option>
                <option value="disabled">Person with Disability (Divyangjan)</option>
                <option value="senior">Senior Citizen (60+ Years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scheme Match Results Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Matching Welfare Schemes</h2>
            <span className="text-xs font-extrabold px-3 py-1 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full">
              {schemes.length} Schemes Evaluated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-[#2d2a2a] pb-3 mb-3">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2c2929] text-blue-700 dark:text-[#e7b85b] border border-blue-100 dark:border-[#3d3a3a]">
                      {scheme.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b] font-mono">
                        {scheme.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">{scheme.name}</h3>
                  
                  <div className="p-3 bg-gray-50 dark:bg-[#252323] rounded-2xl border border-gray-100 dark:border-[#353232] text-xs space-y-1 mb-3">
                    <span className="font-extrabold text-[#0e6670] dark:text-[#e7b85b] block">Benefits:</span>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{scheme.benefits}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      <strong>Eligibility Criterion:</strong> {scheme.eligibility}
                    </p>
                    <div className="pt-1">
                      <span className="font-extrabold text-gray-700 dark:text-gray-300 block mb-1">Required Documents:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.documents.map((doc, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-[#292626] text-gray-700 dark:text-gray-300 text-[11px] font-semibold">
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-[#2d2a2a] flex items-center justify-between">
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
                  >
                    <span>Visit Official Portal</span>
                    <span>↗</span>
                  </a>
                  <Link
                    href="/application-generator"
                    className="text-xs font-extrabold text-blue-600 dark:text-orange-400 hover:underline"
                  >
                    Draft Exemption Letter →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
