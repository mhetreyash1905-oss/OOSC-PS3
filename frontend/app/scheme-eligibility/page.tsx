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
      name: 'Pradhan Mantri Awas Yojana (PMAY-Urban / Gramin)',
      category: 'Housing Protection',
      benefits: 'Interest subsidy up to ₹2.67 Lakhs on housing loans for first-time home buyers.',
      eligibility: 'Families belonging to EWS / LIG income categories not owning a pucca house in India.',
      documents: ['Income Certificate', 'Aadhaar Card', 'Affidavit of No Property Ownership'],
      link: 'https://pmaymis.gov.in',
      matchScore: incomeTier === 'below_3L' || incomeTier === 'below_1L' ? 95 : 40
    },
    {
      id: 's3',
      name: 'Ayushman Bharat PM-JAY Health Assurance',
      category: 'Healthcare & Welfare',
      benefits: 'Cashless health insurance coverage up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization.',
      eligibility: 'Families listed in SECC 2011 database or holding BPL / Antyodaya cards.',
      documents: ['Ration Card / Ayushman Card', 'Aadhaar Card'],
      link: 'https://pmjay.gov.in',
      matchScore: category === 'bpl' || incomeTier === 'below_1L' ? 100 : 70
    },
    {
      id: 's4',
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
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>📋</span>
            <span>Government Scheme Eligibility Checker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Scheme Eligibility Finder
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Check your eligibility for RTI fee exemptions, housing subsidies, health coverage, and civic welfare schemes.
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-[#201e1e] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Annual Family Income Tier
            </label>
            <select
              value={incomeTier}
              onChange={(e) => setIncomeTier(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
            >
              <option value="below_1L">Below ₹1 Lakh (EWS / BPL)</option>
              <option value="below_3L">₹1 Lakh – ₹3 Lakhs (LIG)</option>
              <option value="below_6L">₹3 Lakhs – ₹6 Lakhs (MIG-I)</option>
              <option value="above_6L">Above ₹6 Lakhs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Special Category / Status
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
            >
              <option value="general">General Resident</option>
              <option value="bpl">Below Poverty Line (BPL Cardholder)</option>
              <option value="worker">Unorganized Sector Worker (Construction, Domestic, Driver)</option>
              <option value="senior">Senior Citizen (60+ Years)</option>
              <option value="disability">Person with Disability (RPwD)</option>
            </select>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Eligible Schemes & Entitlements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b]">
                      {scheme.category}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
                      {scheme.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{scheme.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                    <strong>Benefits:</strong> {scheme.benefits}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-[#2f2d2d] space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Required Documents:</span>
                    <div className="flex flex-wrap gap-1">
                      {scheme.documents.map((doc, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 dark:bg-[#2d2a2a] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full bg-[#0e6670] hover:bg-[#094d54] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <span>Apply on Official Portal</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
