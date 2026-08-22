'use client';

import Link from 'next/link';

export default function ResourcesPage() {
  const resourceCategories = [
    {
      title: 'Tenancy & Rental Law Resources',
      items: [
        {
          name: 'Maharashtra Rent Control Act 1999',
          desc: 'Full statutory guide on standard rent, security deposits, eviction grounds, and Section 55 agreement registration.',
          type: 'Statutory Manual'
        },
        {
          name: 'Model Tenant Security Deposit Demand Notice',
          desc: 'Standardized legal draft to send landlords who refuse to return security deposits after lease termination.',
          type: 'Legal Draft Template'
        },
        {
          name: 'Rent Agreement Checklist for Tenants',
          desc: '10 essential clauses to include before signing a lease in India (lock-in period, notice, maintenance, utilities).',
          type: 'Checklist Guide'
        }
      ]
    },
    {
      title: 'RTI (Right to Information) Resources',
      items: [
        {
          name: 'RTI Act 2005 Official Citizen Handbook',
          desc: 'Comprehensive handbook covering Section 6(1) filing, timelines, fee structures, and BPL fee exemptions.',
          type: 'Handbook'
        },
        {
          name: 'First Appeal Template under Section 19(1)',
          desc: 'Formatted appeal petition for cases where the PIO fails to reply within 30 statutory days.',
          type: 'Statutory Petition'
        },
        {
          name: 'Municipal Road & Public Work RTI Questionnaire',
          desc: 'Model questions to inspect contractor work orders, quality test certificates, and road expenditure.',
          type: 'Questionnaire'
        }
      ]
    },
    {
      title: 'Municipal & Grievance Redressal',
      items: [
        {
          name: 'Municipal Corporation Grievance Escalation Matrix',
          desc: 'Step-by-step hierarchy from Ward Junior Engineer to Assistant Commissioner and State Lokayukta.',
          type: 'Escalation Flowchart'
        },
        {
          name: 'Potable Water & Drainage Failure Notice',
          desc: 'Formal grievance petition addressing contaminated municipal water supply and civic hazards.',
          type: 'Petition Draft'
        }
      ]
    },
    {
      title: 'Consumer & Digital Rights',
      items: [
        {
          name: 'Consumer Protection Act 2019',
          desc: 'Covers e-commerce fraud, unfair trade practices, and district commission grievances (Sections 2(7), 2(47), 39).',
          type: 'Statutory Act'
        },
        {
          name: 'DPDP Act 2023 & IT Act',
          desc: 'Guidelines for data deletion, opt-out demands, spam callers, and unauthorized data brokers.',
          type: 'Statutory Act'
        },
        {
          name: 'Motor Vehicles Amendment Act',
          desc: 'Grievance protocols for unfair e-challans, towing disputes, and third-party insurance claims.',
          type: 'Statutory Act'
        }
      ]
    },
    {
      title: 'Labor, Healthcare & Education',
      items: [
        {
          name: 'Labour & Employment Laws',
          desc: 'Industrial Disputes Act (retrenchment) and Maternity Benefit Act guidelines for gig workers and employees.',
          type: 'Statutory Act'
        },
        {
          name: 'Charter of Patient Rights (MoHFW)',
          desc: 'Medical negligence rights, emergency care, and rules against withholding bodies for unpaid bills.',
          type: 'Statutory Act'
        },
        {
          name: 'RTE Act 2009',
          desc: 'Right to Education Act covering mandatory 25% EWS quota and protection against capitation fees.',
          type: 'Statutory Act'
        }
      ]
    },
    {
      title: 'Social Welfare & Public Services',
      items: [
        {
          name: 'Right to Public Services Legislation',
          desc: 'Penalty structures and time-bound delivery guarantees for essential documents across major Indian states.',
          type: 'Statutory Act'
        },
        {
          name: 'NFSA & RPwD Acts',
          desc: 'Food Security (Ration/PDS grievances) and Rights of Persons with Disabilities (Accessibility standards).',
          type: 'Statutory Act'
        },
        {
          name: 'Environmental & Nuisance Laws',
          desc: 'BNS/IPC and Air/Water Act remedies for illegal dust, noise pollution, and chemical dumping.',
          type: 'Statutory Act'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>Civic Knowledge Library</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Civic Resources & Legal Templates
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Free educational handbooks, statutory summaries, and standardized petition drafts for Indian citizens.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {resourceCategories.map((cat, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{cat.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cat.items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] mb-3 inline-block">
                        {item.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{item.desc}</p>
                    </div>
                    <Link
                      href="/platform"
                      className="text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline flex items-center gap-1"
                    >
                      Use with CivicSaathi →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-[#0e6670] to-[#124b55] rounded-3xl p-8 text-white text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Need a custom notice or RTI application?</h3>
          <p className="text-sm text-[#d4eae6] mb-6 max-w-xl mx-auto">
            Instead of manually editing templates, let CivicSaathi tailor the exact legal wording to your situation.
          </p>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-[#e7b85b] hover:bg-[#f3ca76] text-[#102a2e] font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Open CivicSaathi Assistant →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
