'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ActionStep {
  id: number;
  title: string;
  category: string;
  description: string;
  completed: boolean;
  timeframe: string;
  authority: string;
}

export default function ActionPlanPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>('tenancy');
  const [steps, setSteps] = useState<ActionStep[]>([
    {
      id: 1,
      title: 'Review Rental Agreement & Notice Clauses',
      category: 'Documentation',
      description: 'Check Section 24 & Section 55 clauses of Maharashtra Rent Control Act regarding deposit return timelines and lock-in period.',
      completed: true,
      timeframe: 'Day 1',
      authority: 'Self / Tenant Advocate'
    },
    {
      id: 2,
      title: 'Issue Formal Written Legal Demand Notice',
      category: 'Legal Notice',
      description: 'Send a formal 15-day demand notice via registered AD post requesting refund of security deposit with bank transfer details.',
      completed: false,
      timeframe: 'Day 2–3',
      authority: 'Landlord / Property Manager'
    },
    {
      id: 3,
      title: 'Preserve Handover & Payment Evidence',
      category: 'Evidence Collection',
      description: 'Compile UPI/NEFT transaction proofs, key handover receipts, and apartment inspection video/photos.',
      completed: false,
      timeframe: 'Day 4–5',
      authority: 'Tenant Records'
    },
    {
      id: 4,
      title: 'File RTI under Section 6(1) for Building Approval Status',
      category: 'Statutory Inquiry',
      description: 'Submit an RTI to the local Municipal Corporation to verify if the landlord operates an authorized residential premises.',
      completed: false,
      timeframe: 'Day 7–10',
      authority: 'Public Information Officer (PIO)'
    },
    {
      id: 5,
      title: 'Approach Small Causes Court or Consumer Forum',
      category: 'Formal Dispute',
      description: 'If landlord fails to refund within 15 days, lodge a summary suit for recovery of money or petition at Consumer Disputes Commission.',
      completed: false,
      timeframe: 'Day 20+',
      authority: 'Rent Controller / Consumer Commission'
    }
  ]);

  const toggleStep = (id: number) => {
    setSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  const topicPresets: Record<string, { name: string; icon: string; description: string; steps: ActionStep[] }> = {
    tenancy: {
      name: 'Tenant Deposit Recovery',
      icon: '🏠',
      description: 'Action plan for landlords withholding security deposits or demanding unfair painting/maintenance damages.',
      steps: [
        { id: 1, title: 'Review Rental Agreement & Notice Clauses', category: 'Documentation', description: 'Inspect agreement lock-in & deposit refund terms under Rent Control Act.', completed: true, timeframe: 'Day 1', authority: 'Tenant' },
        { id: 2, title: 'Send Written 15-Day Demand Notice', category: 'Legal Notice', description: 'Dispatch formal registered demand notice specifying bank refund deadline.', completed: false, timeframe: 'Day 2–3', authority: 'Landlord' },
        { id: 3, title: 'Gather Payment & Handover Proofs', category: 'Evidence', description: 'Compile transaction slips, photos, and key handover receipts.', completed: false, timeframe: 'Day 4', authority: 'Tenant Records' },
        { id: 4, title: 'Draft Summary Recovery Petition', category: 'Legal Filing', description: 'Prepare summary suit under Rent Control rules if deposit is unpaid after 15 days.', completed: false, timeframe: 'Day 16+', authority: 'Small Causes Court' }
      ]
    },
    consumer: {
      name: 'Consumer E-Commerce Refund',
      icon: '🛍️',
      description: 'Action plan for defective online orders (Flipkart, Amazon), refund refusals, and e-commerce disputes.',
      steps: [
        { id: 1, title: 'Preserve Invoice & Unboxing Media', category: 'Evidence', description: 'Save original invoice, delivery receipt, and photo/video of defective item.', completed: true, timeframe: 'Day 1', authority: 'Consumer' },
        { id: 2, title: 'Lodge Grievance with Platform Officer', category: 'Grievance', description: 'File ticket with Flipkart / Amazon Nodal Officer citing Consumer Protection Rules 2020.', completed: false, timeframe: 'Day 2', authority: 'E-Commerce Nodal' },
        { id: 3, title: 'Submit National Consumer Helpline Docket', category: 'Govt Portal', description: 'File grievance on consumerhelpline.gov.in (NCH Call 1915).', completed: false, timeframe: 'Day 4', authority: 'National Consumer Helpline' },
        { id: 4, title: 'Serve Statutory Legal Demand Notice', category: 'Legal Notice', description: 'Send 15-day notice demanding refund plus interest for deficient service.', completed: false, timeframe: 'Day 10', authority: 'District Consumer Forum' }
      ]
    },
    municipal: {
      name: 'Municipal Road & Water Grievance',
      icon: '🏙️',
      description: 'Structured roadmap for addressing broken roads, open drains, and contaminated civic water.',
      steps: [
        { id: 1, title: 'Lodge Complaint on Municipal Grievance Portal', category: 'Civic Complaint', description: 'Register ticket on municipal portal (e.g. CPGRAMS / BMC / BBMP).', completed: true, timeframe: 'Day 1', authority: 'Ward Officer' },
        { id: 2, title: 'Inspect Site & Record Geotagged Photos', category: 'Evidence', description: 'Capture timestamped photos of road hazards or water test reports.', completed: false, timeframe: 'Day 1', authority: 'Citizen' },
        { id: 3, title: 'Draft Section 6(1) RTI for Work Order & Tender', category: 'RTI Filing', description: 'Request contractor work order, completion timeline, and quality test reports.', completed: false, timeframe: 'Day 7', authority: 'Public Information Officer' },
        { id: 4, title: 'Escalate to Assistant Municipal Commissioner', category: 'Escalation', description: 'Submit formal petition citing civic duty under Municipal Corporation Act.', completed: false, timeframe: 'Day 15', authority: 'Zonal Commissioner' }
      ]
    },
    rti: {
      name: 'RTI Transparency Request',
      icon: '📜',
      description: 'Step-by-step workflow for filing Section 6(1) requests and Section 19 First Appeals.',
      steps: [
        { id: 1, title: 'Identify Department & Public Information Officer (PIO)', category: 'PIO Mapping', description: 'Determine designated PIO for the targeted state or central ministry.', completed: true, timeframe: 'Day 1', authority: 'PIO Directory' },
        { id: 2, title: 'Formulate Precise Questions & Document List', category: 'Drafting', description: 'Draft specific queries requesting certified copies of tenders, work orders, or files.', completed: false, timeframe: 'Day 2', authority: 'Citizen' },
        { id: 3, title: 'Attach ₹10 Application Fee & Submit Application', category: 'Filing', description: 'Pay fee via IPO / online portal and obtain receipt tracking code.', completed: false, timeframe: 'Day 3', authority: 'Post Office / Online RTI' },
        { id: 4, title: 'File Section 19(1) First Appeal if 30 Days Elapse', category: 'Appellate Action', description: 'If no reply within 30 days, submit First Appeal to designated Appellate Authority.', completed: false, timeframe: 'Day 31+', authority: 'First Appellate Authority' }
      ]
    },
    eviction: {
      name: 'Unlawful Eviction Defense',
      icon: '🛡️',
      description: 'Protection roadmap for tenants facing arbitrary eviction notices or landlord harassment.',
      steps: [
        { id: 1, title: 'Verify Statutory Notice Period & Grounds', category: 'Legal Review', description: 'Ensure landlord gave valid written statutory notice as mandated by Rent Control Act.', completed: true, timeframe: 'Day 1', authority: 'Rent Control Act' },
        { id: 2, title: 'Issue Written Reply Refuting Arbitrary Demands', category: 'Legal Reply', description: 'Send registered reply stating compliance with rent obligations and agreement terms.', completed: false, timeframe: 'Day 3', authority: 'Landlord / Advocate' },
        { id: 3, title: 'Lodge Police Complaint for Utility Disconnection', category: 'Protection', description: 'If landlord cuts water or electricity, file FIR under criminal intimidation & tenancy rules.', completed: false, timeframe: 'Immediate', authority: 'Local Police Station' },
        { id: 4, title: 'File Injunction Suit before Rent Controller', category: 'Court Order', description: 'Obtain temporary injunction order restraining landlord from illegal dispossessing.', completed: false, timeframe: 'Day 7', authority: 'Civil Court / Rent Controller' }
      ]
    },
    utility: {
      name: 'Electricity & Utility Overcharge',
      icon: '⚡',
      description: 'Resolution roadmap for inaccurate electricity meters, unjustified surge bills, and disconnections.',
      steps: [
        { id: 1, title: 'Submit Faulty Meter Testing Application', category: 'Inspection', description: 'Request official meter accuracy test by utility board engineers.', completed: true, timeframe: 'Day 1', authority: 'Electricity Board' },
        { id: 2, title: 'Pay Average Bill Under Formal Protest', category: 'Bill Payment', description: 'Deposit average historical consumption amount under written protest to avoid disconnection.', completed: false, timeframe: 'Day 3', authority: 'Utility Accounts Office' },
        { id: 3, title: 'Lodge Petition with Consumer Grievance Redressal Forum (CGRF)', category: 'Redressal', description: 'Approach statutory CGRF under Electricity Act 2003 for billing revision.', completed: false, timeframe: 'Day 10', authority: 'CGRF Forum' },
        { id: 4, title: 'Escalate to Electricity Ombudsman', category: 'Appellate Action', description: 'If CGRF does not resolve within 45 days, file appeal before Electricity Ombudsman.', completed: false, timeframe: 'Day 45+', authority: 'Electricity Ombudsman' }
      ]
    }
  };

  const handleSelectTopic = (key: string) => {
    setSelectedTopic(key);
    setSteps(topicPresets[key].steps);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0e6670]/10 dark:bg-[#e7b85b]/10 text-[#0e6670] dark:text-[#e7b85b] text-xs font-extrabold mb-3 border border-[#0e6670]/20 dark:border-[#e7b85b]/30">
              <span className="animate-pulse">⚡</span>
              <span>CivicSaathi Action Plan Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Action Plan & Legal Roadmap Builder
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium max-w-2xl">
              Transform complex legal disputes into structured, step-by-step action roadmaps with statutory deadlines, evidence checklists, and enforcement authorities.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <span>🤖 Custom-Generate via AI</span>
          </Link>
        </div>

        {/* Preset Selector Grid (6 Categories) */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Select Your Case Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(topicPresets).map(([key, topic]) => (
              <button
                key={key}
                onClick={() => handleSelectTopic(key)}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${
                  selectedTopic === key
                    ? 'bg-white dark:bg-[#1d1b1b] border-[#0e6670] dark:border-[#e7b85b] shadow-xl ring-2 ring-[#0e6670]/20 dark:ring-[#e7b85b]/30'
                    : 'bg-white/60 dark:bg-[#181616] border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#444]'
                }`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{topic.icon}</div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-base mb-1">{topic.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar & Ring Card */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Roadmap Progress</span>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                  {completedCount} of {steps.length} Actions Completed
                </h2>
              </div>
              <span className="text-3xl font-black text-[#0e6670] dark:text-[#e7b85b] font-mono">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-3.5 bg-gray-100 dark:bg-[#2c2929] rounded-full overflow-hidden p-0.5 border border-gray-200/50 dark:border-[#3a3737]">
              <div
                className="h-full bg-gradient-to-r from-[#0e6670] via-[#2b8d91] to-[#e7b85b] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Recommended Action Sequence</h2>

          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex items-start gap-4 shadow-sm hover:shadow-md ${
                step.completed
                  ? 'bg-green-50/50 dark:bg-[#17261c] border-green-200 dark:border-green-900/50'
                  : 'bg-white dark:bg-[#1d1b1b] border-gray-200 dark:border-[#333] hover:border-[#0e6670]/40'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  step.completed
                    ? 'bg-green-600 border-green-600 text-white shadow-sm scale-105'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#292626]'
                }`}
              >
                {step.completed && <span className="text-sm font-extrabold">✓</span>}
              </div>

              {/* Step Detail */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-gray-400">Action {idx + 1}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2a2727] text-blue-700 dark:text-[#e7b85b] font-extrabold border border-blue-100 dark:border-[#3d3a3a]">
                      {step.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-bold">
                    <span>⏱️ {step.timeframe}</span>
                    <span>🏛️ {step.authority}</span>
                  </div>
                </div>

                <h3 className={`text-base font-extrabold mb-1 ${step.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Extended Section 1: Statutory Timeline & Deadlines */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Statutory Enforcement Timeline Map</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Key legal milestones and statutory response deadlines defined under Indian laws.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-[#252323] border border-blue-100 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-blue-700 dark:text-[#e7b85b] uppercase">Phase 1 (Days 1–3)</span>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Notice & Evidence Preservation</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Issue 15-day written notice via Registered AD Post. Preserve payment slips & geotagged photos.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-[#252323] border border-amber-100 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-amber-700 dark:text-[#e7b85b] uppercase">Phase 2 (Days 4–15)</span>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Statutory Notice Period</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Allow 15 days for recipient to respond or comply. File parallel complaints on CPGRAMS or NCH 1915.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-[#252323] border border-purple-100 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-purple-700 dark:text-[#e7b85b] uppercase">Phase 3 (Days 16–30)</span>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">RTI & Commission Filing</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                File Section 6(1) RTI to inspect work orders. Lodge formal petition before Consumer Forum or Rent Controller.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-green-50/50 dark:bg-[#252323] border border-green-100 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-green-700 dark:text-green-300 uppercase">Phase 4 (Day 31+)</span>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Appellate Escalation</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                File Section 19(1) First Appeal if RTI unanswered. Seek court summons and summary monetary decree.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Section 2: Court Precedents & Legal Rights Guidance */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚖️</span>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Key Court Precedents & Citizen Rights</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Landmark Indian court rulings empowering citizens in tenancy and consumer disputes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#3a3737] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b]">Delhi High Court Ruling</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 dark:bg-[#333] rounded-full">Rent & Deposit</span>
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Landlords Cannot Retain Security Deposits Unilaterally</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Held that landlords must provide itemized receipts and bills for any painting or damage deductions within 14 days of key handover, failing which the full deposit must be refunded with interest.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#3a3737] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b]">Supreme Court of India</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 dark:bg-[#333] rounded-full">Consumer Rights</span>
              </div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">E-Commerce Marketplaces Liable for Defective Goods</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Ruled that under Consumer Protection Rules 2020, e-commerce platforms cannot hide behind seller indemnity clauses when delivered products are broken or non-functional.
              </p>
            </div>
          </div>
        </div>

        {/* Export / Document Action Bar */}
        <div className="bg-gradient-to-r from-[#0b2b31] via-[#0e6670] to-[#124b55] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-2">Ready to generate formal applications for this plan?</h3>
            <p className="text-xs sm:text-sm text-[#d4eae6] font-medium max-w-xl">
              CivicSaathi will automatically format your RTI application, Demand Notice, or Municipal Petition based on your active roadmap.
            </p>
          </div>
          <Link
            href="/application-generator"
            className="shrink-0 bg-gradient-to-r from-[#e7b85b] to-[#f3ca76] hover:from-[#f3ca76] hover:to-[#e7b85b] text-[#102a2e] font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all"
          >
            Generate Application Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
