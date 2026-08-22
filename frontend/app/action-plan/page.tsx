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
      description: 'Action plan for landlords withholding security deposits or demanding unfair damages.',
      steps: [
        { id: 1, title: 'Review Rental Agreement & Notice Clauses', category: 'Documentation', description: 'Inspect agreement lock-in & deposit refund terms under Rent Control Act.', completed: true, timeframe: 'Day 1', authority: 'Tenant' },
        { id: 2, title: 'Send Written 15-Day Demand Notice', category: 'Legal Notice', description: 'Dispatch formal registered demand notice specifying bank refund deadline.', completed: false, timeframe: 'Day 2–3', authority: 'Landlord' },
        { id: 3, title: 'Gather Payment & Handover Proofs', category: 'Evidence', description: 'Compile transaction slips, photos, and key handover receipts.', completed: false, timeframe: 'Day 4', authority: 'Tenant Records' },
        { id: 4, title: 'Draft Summary Recovery Petition', category: 'Legal Filing', description: 'Prepare summary suit under Rent Control rules if deposit is unpaid after 15 days.', completed: false, timeframe: 'Day 16+', authority: 'Small Causes Court' }
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
      name: 'RTI Transparency & Public Records',
      icon: '📜',
      description: 'Step-by-step workflow for filing Section 6(1) requests and Section 19 First Appeals.',
      steps: [
        { id: 1, title: 'Identify Department & Public Information Officer (PIO)', category: 'PIO Mapping', description: 'Determine designated PIO for the targeted state or central ministry.', completed: true, timeframe: 'Day 1', authority: 'PIO Directory' },
        { id: 2, title: 'Draft Specific Section 6(1) Questions', category: 'Drafting', description: 'Formulate objective questions seeking certified copies & file notings.', completed: false, timeframe: 'Day 2', authority: 'CivicSaathi Generator' },
        { id: 3, title: 'Pay ₹10 Application Fee & Submit Application', category: 'Submission', description: 'Submit online or via Court Fee stamp / Indian Postal Order.', completed: false, timeframe: 'Day 3', authority: 'RTI Portal / Post Office' },
        { id: 4, title: 'Track 30-Day Mandatory Response Window', category: 'Timeline Tracking', description: 'Monitor statutory 30-day window under Section 7(1) of RTI Act 2005.', completed: false, timeframe: 'Day 4–33', authority: 'PIO Department' },
        { id: 5, title: 'File First Appeal under Section 19(1) if Unanswered', category: 'Appellate Action', description: 'Submit appeal to First Appellate Authority if PIO fails to reply.', completed: false, timeframe: 'Day 34+', authority: 'First Appellate Authority' }
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
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#333] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold mb-2">
              <span>⚡</span>
              <span>CivicSaathi Action Plan Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Action Plan Builder
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Turn complex legal disputes into structured, step-by-step action roadmaps with statutory deadlines.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-[#0e6670] hover:bg-[#094d54] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <span>🤖 Ask Assistant to Custom-Generate</span>
          </Link>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(topicPresets).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => handleSelectTopic(key)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                selectedTopic === key
                  ? 'bg-blue-50/80 dark:bg-[#282626] border-[#0e6670] dark:border-[#e7b85b] shadow-md'
                  : 'bg-white dark:bg-[#201e1e] border-gray-200 dark:border-[#333] hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{topic.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{topic.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{topic.description}</p>
            </button>
          ))}
        </div>

        {/* Progress Bar Card */}
        <div className="bg-white dark:bg-[#201e1e] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Action Plan Progress</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                {completedCount} of {steps.length} Steps Executed ({progressPercent}%)
              </h2>
            </div>
            <span className="text-2xl font-black text-[#0e6670] dark:text-[#e7b85b] font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-3 bg-gray-100 dark:bg-[#2c2929] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0e6670] dark:bg-[#e7b85b] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Action Sequence</h2>

          {steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                step.completed
                  ? 'bg-green-50/40 dark:bg-[#1b2b20] border-green-200 dark:border-green-900/40'
                  : 'bg-white dark:bg-[#201e1e] border-gray-200 dark:border-[#333] hover:border-blue-300'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  step.completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#2d2a2a]'
                }`}
              >
                {step.completed && <span className="text-xs font-bold">✓</span>}
              </div>

              {/* Step Detail */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Step {idx + 1}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] font-semibold">
                      {step.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span>⏱️ {step.timeframe}</span>
                    <span>🏛️ {step.authority}</span>
                  </div>
                </div>

                <h3 className={`text-base font-bold mb-1 ${step.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Export / Document Action Bar */}
        <div className="bg-gradient-to-r from-[#0e6670] to-[#124b55] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-xl font-bold mb-1">Ready to generate formal applications for this plan?</h3>
            <p className="text-xs sm:text-sm text-[#d4eae6]">
              CivicSaathi will automatically format your RTI application or Demand Notice based on this active roadmap.
            </p>
          </div>
          <Link
            href="/application-generator"
            className="shrink-0 bg-[#e7b85b] hover:bg-[#f3ca76] text-[#102a2e] font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
          >
            Generate Application Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
