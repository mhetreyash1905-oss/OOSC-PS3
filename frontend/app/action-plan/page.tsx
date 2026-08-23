'use client';

import { useState } from 'react';
import Link from 'next/link';
import RefinedProgressBar from '@/components/ui/RefinedProgressBar';
import Hero from '@/components/ui/Hero';
import Footer from '@/components/Footer';

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
      description: 'Inspect Section 24 & Section 55 clauses of Maharashtra Rent Control Act regarding deposit return timelines and lock-in period.',
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
        { id: 1, title: 'Review Rental Agreement & Notice Clauses', category: 'Documentation', description: 'Inspect agreement lock-in & deposit refund terms under Rent Control Act.', completed: true, timeframe: 'Day 1', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'Send Written 15-Day Demand Notice', category: 'Legal Notice', description: 'Dispatch formal registered demand notice specifying bank refund deadline.', completed: false, timeframe: 'Day 2–3', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'Gather Payment & Handover Proofs', category: 'Evidence Collection', description: 'Compile transaction slips, photos, and key handover receipts.', completed: false, timeframe: 'Day 4', authority: 'Self / Tenant Advocate' },
        { id: 4, title: 'Draft Summary Recovery Petition', category: 'Formal Dispute', description: 'Prepare summary suit under Rent Control rules if deposit is unpaid after 15 days.', completed: false, timeframe: 'Day 16+', authority: 'Self / Tenant Advocate' }
      ]
    },
    consumer: {
      name: 'Consumer E-Commerce Refund',
      icon: '🛍️',
      description: 'Action plan for defective online orders (Flipkart, Amazon), refund refusals, and e-commerce disputes.',
      steps: [
        { id: 1, title: 'Preserve Invoice & Unboxing Media', category: 'Evidence Collection', description: 'Save original invoice, delivery receipt, and photo/video of defective item.', completed: true, timeframe: 'Day 1', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'Lodge Grievance with Platform Officer', category: 'Documentation', description: 'File ticket with Flipkart / Amazon Nodal Officer citing Consumer Protection Rules 2020.', completed: false, timeframe: 'Day 2', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'Submit National Consumer Helpline Docket', category: 'Statutory Inquiry', description: 'File grievance on consumerhelpline.gov.in (NCH Call 1915).', completed: false, timeframe: 'Day 4', authority: 'Self / Tenant Advocate' },
        { id: 4, title: 'Serve Statutory Legal Demand Notice', category: 'Legal Notice', description: 'Send 15-day notice demanding refund plus interest for deficient service.', completed: false, timeframe: 'Day 10', authority: 'Self / Tenant Advocate' }
      ]
    },
    municipal: {
      name: 'Municipal Road & Water Grievance',
      icon: '🏙️',
      description: 'Structured roadmap for addressing broken roads, open drains, and contaminated civic water.',
      steps: [
        { id: 1, title: 'Lodge Complaint on Municipal Grievance Portal', category: 'Documentation', description: 'Register ticket on municipal portal (e.g. CPGRAMS / BMC / BBMP).', completed: true, timeframe: 'Day 1', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'File Section 6(1) RTI for Tender Inspection', category: 'Statutory Inquiry', description: 'Request certified copies of contractor work orders and quality test certificates.', completed: false, timeframe: 'Day 3', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'Submit Petition to Ward Executive Engineer', category: 'Legal Notice', description: 'Deliver physical petition signed by local residents detailing public hazards.', completed: false, timeframe: 'Day 7', authority: 'Self / Tenant Advocate' }
      ]
    },
    rti: {
      name: 'RTI Delay & First Appeal Escalation',
      icon: '📜',
      description: 'Step-by-step procedure when a Public Information Officer (PIO) fails to respond within 30 days.',
      steps: [
        { id: 1, title: 'Calculate 30-Day Expiry Window', category: 'Documentation', description: 'Verify speed post tracking receipt date and calculate Section 7(1) deadline.', completed: true, timeframe: 'Day 31', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'Draft First Appeal under Section 19(1)', category: 'Formal Dispute', description: 'Address First Appellate Authority citing deeming refusal by PIO.', completed: false, timeframe: 'Day 35', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'Petition State Information Commission', category: 'Statutory Inquiry', description: 'File Second Appeal seeking Section 20 daily penalty against errant officer.', completed: false, timeframe: 'Day 70+', authority: 'Self / Tenant Advocate' }
      ]
    },
    eviction: {
      name: 'Unlawful Eviction Defense',
      icon: '🛡️',
      description: 'Emergency protection roadmap when a landlord threatens illegal locks, water cutoff, or 3-day eviction.',
      steps: [
        { id: 1, title: 'Document Intimidation & Utility Cutoffs', category: 'Evidence Collection', description: 'Record video proof and file complaint at local police station (BNS / IPC provisions).', completed: true, timeframe: 'Day 1', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'Issue Urgent Advocate Response Notice', category: 'Legal Notice', description: 'Cite Rent Control Act protection prohibiting landlord self-help evictions.', completed: false, timeframe: 'Day 2', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'File Temporary Injunction at Rent Tribunal', category: 'Formal Dispute', description: 'Seek court order restraining landlord from interfering with peaceful possession.', completed: false, timeframe: 'Day 3–5', authority: 'Self / Tenant Advocate' }
      ]
    },
    electricity: {
      name: 'Electricity & Utility Overcharging',
      icon: '⚡',
      description: 'Enforcement roadmap against landlords or builders charging commercial rates for domestic electricity.',
      steps: [
        { id: 1, title: 'Audit Sub-Meter & Utility Bills', category: 'Documentation', description: 'Compare landlord bill demand against state electricity distribution tariff slabs.', completed: true, timeframe: 'Day 1', authority: 'Self / Tenant Advocate' },
        { id: 2, title: 'Serve Written Objection & Tarriff Notice', category: 'Legal Notice', description: 'Demand direct electricity provider billing under Electricity Act 2003.', completed: false, timeframe: 'Day 3', authority: 'Self / Tenant Advocate' },
        { id: 3, title: 'Lodge Grievance with Electricity Ombudsman', category: 'Statutory Inquiry', description: 'File complaint with Consumer Grievance Redressal Forum (CGRF).', completed: false, timeframe: 'Day 10', authority: 'Self / Tenant Advocate' }
      ]
    }
  };

  const handleSelectTopic = (key: string) => {
    setSelectedTopic(key);
    if (topicPresets[key]) {
      setSteps(topicPresets[key].steps);
    }
  };

  const completedCount = steps.filter(s => s.completed).length;
  const currentTopic = topicPresets[selectedTopic] || topicPresets.tenancy;

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col justify-between">
      <div>
        {/* Modern Hero Section */}
        <Hero
          badgeText="CivicSaathi Action Plan Engine"
          title="Legal Action Plan & Enforcement Roadmap Builder"
          description="Transform complex legal disputes into structured, step-by-step action roadmaps with statutory deadlines and enforcement authority guidance."
        >
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-[#e7b85b] text-[#0f2b2a] hover:bg-[#f3ca76] font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-105"
          >
            <span>🤖 Custom AI Roadmap Generator</span>
          </Link>
        </Hero>

        {/* Main Content Workspace */}
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section 2: Case Category Carousel Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b]">
                  Interactive Presets
                </span>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Select Dispute Category</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Scroll to explore categories →</span>
            </div>

            {/* Horizontal Scroll Carousel for Categories */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
              {Object.entries(topicPresets).map(([key, topic]) => {
                const isSelected = selectedTopic === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectTopic(key)}
                    className={`snap-start shrink-0 px-5 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all duration-200 whitespace-nowrap shadow-sm ${
                      isSelected
                        ? 'bg-[#0f2b2a] text-[#e7b85b] border-2 border-[#e7b85b] shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-[#1d1b1b] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#333] hover:border-gray-400'
                    }`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center text-sm shadow-xs">
                      {topic.icon}
                    </span>
                    <span>{topic.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Highlighted Category Feature Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#0f2b2a] to-[#124b55] text-white p-8 rounded-3xl border border-[#e7b85b]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#e7b85b] text-xs font-extrabold">
                  <span>Selected Category Roadmap</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">{currentTopic.name}</h3>
                <p className="text-xs sm:text-sm text-[#d4eae6] font-medium leading-relaxed">
                  {currentTopic.description}
                </p>
              </div>

              <div className="text-7xl opacity-20 pointer-events-none select-none hidden md:block">
                {currentTopic.icon}
              </div>
            </div>
          </div>

          {/* Progress & Milestone Overview */}
          <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-4">
            <RefinedProgressBar completed={completedCount} total={steps.length} />
          </div>

          {/* Action Sequence Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Sequential Enforcement Milestones</h3>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`cursor-pointer p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex items-start gap-4 ${
                    step.completed
                      ? 'bg-emerald-50/60 dark:bg-[#1a2921] border-emerald-200 dark:border-emerald-900/60 shadow-sm'
                      : 'bg-[#fdfbf7] dark:bg-[#1d1b1b] border-gray-200 dark:border-[#333] hover:shadow-lg'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-colors ${
                        step.completed
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-gray-300 dark:border-[#444] text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4
                        className={`text-base font-extrabold ${
                          step.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {index + 1}. {step.title}
                      </h4>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-gray-100 dark:bg-[#2a2727] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#3a3737]">
                          ⏱️ {step.timeframe}
                        </span>
                        <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] border border-blue-100 dark:border-[#383535]">
                          ⚖️ {step.authority}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Court Precedents */}
          <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-4">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">Landmark Court Precedents & Citations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#353232] space-y-1.5">
                <span className="text-[11px] font-extrabold text-[#0e6670] dark:text-[#e7b85b]">Supreme Court of India</span>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">V. Dhanapal Chettiar v. Yesodai Ammal (1979)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Established statutory protection against landlord self-help eviction without formal tribunal orders.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#353232] space-y-1.5">
                <span className="text-[11px] font-extrabold text-[#0e6670] dark:text-[#e7b85b]">Central Information Commission</span>
                <h4 className="text-xs font-extrabold text-gray-900 dark:text-white">Section 20 Penalty Ruling (2021)</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Imposed ₹25,000 statutory penalty on Public Information Officer for withholding public works records.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Integrated Page Footer */}
      <Footer />
    </div>
  );
}
