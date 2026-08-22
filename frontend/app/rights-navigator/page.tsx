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
}

export default function RightsNavigatorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const rightsList: RightItem[] = [
    {
      id: 'r1',
      act: 'Maharashtra Rent Control Act 1999',
      section: 'Section 24 & Section 55',
      category: 'Tenancy',
      title: 'Mandatory Deposit Return & Registration',
      summary: 'Landlords are legally bound to return security deposits upon lease expiry after deducting valid itemized repair costs. Registration of tenancy agreements under Section 55 is the landlord’s statutory responsibility.',
      enforcement: 'Serve a formal 15-day written demand notice. If unpaid, approach the Competent Authority or Small Causes Court.'
    },
    {
      id: 'r2',
      act: 'Maharashtra Rent Control Act 1999',
      section: 'Section 16',
      category: 'Tenancy',
      title: 'Statutory Eviction Protection',
      summary: 'A tenant cannot be forcibly evicted without a court decree or statutory notice. Eviction can only occur on specific grounds such as non-payment of rent for 90 days or structural damage.',
      enforcement: 'Challenge arbitrary eviction notices before the local Rent Controller.'
    },
    {
      id: 'r3',
      act: 'Right to Information Act 2005',
      section: 'Section 6(1) & Section 7(1)',
      category: 'RTI',
      title: '30-Day Information Access Guarantee',
      summary: 'Every Indian citizen has the statutory right to request government records, inspection of public works, certified document copies, and tender files. Information must be provided within 30 calendar days.',
      enforcement: 'File an RTI application with ₹10 fee. If unanswered in 30 days, file a First Appeal under Section 19(1).'
    },
    {
      id: 'r4',
      act: 'Municipal Corporation Acts',
      section: 'Section 63 & Civic Duty Provisions',
      category: 'Municipal',
      title: 'Right to Potable Water & Safe Road Infrastructure',
      summary: 'Municipal corporations are statutory guardians of public health, drainage, streetlights, and road maintenance. Citizens have the right to demand repair of hazards within reasonable timelines.',
      enforcement: 'File a formal grievance petition with the Ward Officer and use Section 6(1) RTI to inspect contractor tenders.'
    },
    {
      id: 'r5',
      act: 'Consumer Protection Act 2019',
      section: 'Section 2(42) & Section 35',
      category: 'Consumer',
      title: 'Protection against Deficient Utility Services',
      summary: 'Consumers are protected against unfair trade practices, inflated utility bills, and deficient public or private service delivery.',
      enforcement: 'Lodge a complaint on the National Consumer Helpline or file a petition at District Consumer Disputes Redressal Commission.'
    },
    {
      id: 'r6',
      act: 'Rights of Persons with Disabilities Act 2016',
      section: 'Section 3 & Section 21',
      category: 'Disability Rights',
      title: 'Accessibility Mandate in Public Buildings',
      summary: 'Mandates equal access, barrier-free infrastructure, ramps, accessible websites, and non-discrimination in public services and public transport for disabled citizens.',
      enforcement: 'File a complaint with the State Commissioner for Persons with Disabilities.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Rights' },
    { id: 'Tenancy', label: '🏠 Tenancy' },
    { id: 'RTI', label: '📜 RTI Act 2005' },
    { id: 'Municipal', label: '🏛️ Municipal' },
    { id: 'Consumer', label: '⚖️ Consumer' },
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
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>⚖️</span>
            <span>Statutory Knowledge Search</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Rights Navigator
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Search verified Indian statutory acts, exact section numbers, and step-by-step legal enforcement rights.
          </p>
        </div>

        {/* Search Bar & Categories */}
        <div className="space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, section, or act (e.g. 'deposit', 'Section 6(1)', 'eviction')..."
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#201e1e] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold"
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
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0e6670] text-white shadow-sm'
                    : 'bg-white dark:bg-[#201e1e] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333] hover:bg-gray-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rights Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredRights.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#201e1e] rounded-3xl border border-gray-200 dark:border-[#333]">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No statutory rights found matching your search term.</p>
            </div>
          ) : (
            filteredRights.map((right) => (
              <div
                key={right.id}
                className="bg-white dark:bg-[#201e1e] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[#2f2d2d] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] text-xs font-bold">
                      {right.section}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {right.act}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">
                    Domain: {right.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{right.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {right.summary}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#272525] rounded-2xl border border-gray-100 dark:border-[#363333] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#0e6670] dark:text-[#e7b85b] uppercase block">
                      Enforcement Pathway:
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{right.enforcement}</p>
                  </div>
                  <Link
                    href="/application-generator"
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
                  >
                    Draft Enforcement Document →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
