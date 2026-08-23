'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CursorParticleCanvas from '@/components/CursorParticleCanvas';

export default function Home() {
  const [activeDemo, setActiveDemo] = useState<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!isHovered) setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  const demoExamples = [
    {
      userQuery: '"Maine flipkart se 15000 ka laptop mangaya and wo broken tha, refund initiate nhi ho raha."',
      category: '🛍️ Consumer & E-Commerce Dispute',
      explanation: 'Under Consumer Protection Act 2019 & E-Commerce Rules 2020, platforms cannot refuse refund or replacement for defective products.',
      actions: [
        'Preserve invoice & unboxing photos/videos',
        'Lodge formal complaint with Flipkart Grievance Officer',
        'File grievance on National Consumer Helpline (1915 / consumerhelpline.gov.in)',
        'Draft statutory Legal Notice for refund & compensation'
      ],
      actBadge: 'Consumer Protection Act 2019'
    },
    {
      userQuery: '"Mere landlord ne security deposit wapas nahi kiya."',
      category: '🏠 Tenant–Landlord Dispute',
      explanation: 'Under Rent Control Acts, landlords cannot withhold security deposits without valid, itemized damage claims upon vacant possession.',
      actions: [
        'Check rental agreement lock-in & refund clauses',
        'Send a formal written 15-day demand notice',
        'Preserve payment records & key handover receipts',
        'Approach Rent Controller or Small Causes Court'
      ],
      actBadge: 'Rent Control Act'
    },
    {
      userQuery: '"Municipal corporation is not repairing broken road and open drainage in our colony."',
      category: '🏛️ Municipal Civic Grievance',
      explanation: 'Municipal bodies have a statutory obligation under Municipal Corporation Acts to maintain public roads, sanitation, and drinking water safety.',
      actions: [
        'Lodge ticket on municipal portal (CPGRAMS / local ward office)',
        'Capture geotagged photos of road hazard',
        'Draft Section 6(1) RTI to inspect contractor work order & quality test reports',
        'Escalate to Assistant Municipal Commissioner'
      ],
      actBadge: 'Municipal Corporation Act'
    },
    {
      userQuery: '"How can I inspect government expenditure on local road project?"',
      category: '📜 Right to Information (RTI)',
      explanation: 'Under Section 6(1) of RTI Act 2005, citizens have the right to request certified copies of public tenders, work orders, and measurement books.',
      actions: [
        'Identify designated Public Information Officer (PIO)',
        'Formulate specific Section 6(1) queries asking for certified records',
        'Attach ₹10 application fee (or BPL card for fee exemption)',
        'Track 30-day statutory response timeline under Section 7(1)'
      ],
      actBadge: 'RTI Act 2005'
    }
  ];

  const problems = [
    {
      icon: '🛍️',
      title: 'Consumer & E-Commerce Disputes',
      example: '"Flipkart delivered a broken laptop and refund is refused."',
      description: 'Defective products, platform refund refusals, delivery failures, and unfair trade practices under Consumer Protection Act 2019.',
      badge: 'Consumer Protection'
    },
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
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe in Simple Language',
      desc: 'Speak or type your problem in Hindi, Hinglish, or English. No complex legal jargon needed.',
      icon: '🗣️'
    },
    {
      number: '02',
      title: 'Instant Triage & Action Checklist',
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
      title: 'Draft & Export Official Documents',
      desc: 'Generate submittable RTI applications or legal demand notices, rendered into high-quality PDFs in one click.',
      icon: '📄'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200 relative">
      {/* Interactive Cursor Spotlight Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(14, 102, 112, 0.18), rgba(231, 184, 91, 0.08), transparent 80%)`
        }}
      />

      {/* Custom Glowing Cursor Tracker Ring */}
      <div
        className="pointer-events-none fixed z-50 rounded-full border-2 border-[#e7b85b] shadow-[0_0_20px_rgba(231,184,91,0.6)] transition-transform duration-75 ease-out hidden md:block -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          width: '36px',
          height: '36px',
          opacity: isHovered ? 1 : 0
        }}
      >
        <div className="w-2 h-2 bg-[#e7b85b] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75"></div>
        <div className="w-1.5 h-1.5 bg-[#e7b85b] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:28px_28px]"></div>
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#e7b85b]/10 rounded-full blur-3xl pointer-events-none animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs sm:text-sm font-extrabold mb-8 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span>AI Civic Rights & Legal Drafting Assistant for India</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6 font-sans">
            Understand Your Rights. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#e7b85b] via-amber-200 to-[#e7b85b] bg-clip-text text-transparent">
              Take Confident Action.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#d4eae6] max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            From consumer e-commerce refund refusals and withheld tenant deposits to municipal road repairs and Section 6(1) RTIs — CivicSaathi transforms plain-language citizen complaints into grounded legal rights and submittable official documents.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/platform"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#e7b85b] to-[#f3ca76] hover:from-[#f3ca76] hover:to-[#e7b85b] text-[#102a2e] font-extrabold px-8 py-4 rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
            >
              <span>✨</span>
              <span>Ask CivicSaathi Now</span>
              <span>→</span>
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-7 py-4 rounded-2xl text-base backdrop-blur-md transition-all"
            >
              <span>Learn How It Works</span>
            </Link>
          </div>

          {/* Interactive Assistant Simulator */}
          <div className="max-w-3xl mx-auto bg-white/95 dark:bg-[#1d1b1b]/95 text-gray-900 dark:text-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-left backdrop-blur-xl">
            {/* Demo Tabs */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#333] pb-4 mb-5 overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                {demoExamples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDemo(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeDemo === idx
                        ? 'bg-[#0e6670] text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-[#2c2929] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {ex.actBadge.split(' ')[0]}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 shrink-0">
                ● Live AI Simulation
              </span>
            </div>

            {/* Simulated User Message */}
            <div className="flex justify-end mb-4">
              <div className="bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white px-4 py-3 rounded-2xl rounded-tr-sm text-xs sm:text-sm font-semibold shadow-sm max-w-[90%]">
                {demoExamples[activeDemo].userQuery}
              </div>
            </div>

            {/* Simulated AI Response */}
            <div className="bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#3d3838] rounded-2xl p-5 text-xs sm:text-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <span className="font-extrabold text-[#0e6670] dark:text-[#e7b85b]">CivicSaathi AI</span>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#2d2a2a] text-blue-700 dark:text-[#e7b85b] border border-blue-100 dark:border-[#383535]">
                  {demoExamples[activeDemo].actBadge}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {demoExamples[activeDemo].explanation}
              </p>

              <div className="p-3.5 bg-blue-50/80 dark:bg-[#2d2929] rounded-xl border border-blue-100 dark:border-[#3d3a3a]">
                <span className="text-[10px] font-extrabold text-blue-800 dark:text-orange-300 uppercase tracking-wider block mb-1">
                  Issue Detected:
                </span>
                <div className="font-extrabold text-gray-900 dark:text-white text-sm">
                  {demoExamples[activeDemo].category}
                </div>
              </div>

              <div className="space-y-1.5 text-gray-600 dark:text-gray-300 text-xs">
                <p className="font-extrabold text-gray-800 dark:text-gray-200">You may want to:</p>
                {demoExamples[activeDemo].actions.map((act, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-[#0e6670] dark:text-[#e7b85b] font-bold">•</span>
                    <span>{act}</span>
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-200/60 dark:border-[#333] flex justify-end">
                <Link
                  href="/platform"
                  className="inline-flex items-center gap-1.5 font-extrabold text-[#0e6670] dark:text-[#e7b85b] hover:underline text-xs"
                >
                  Create Action Plan with this Query →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b] mb-2">
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
              className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl p-3.5 bg-blue-50 dark:bg-[#282525] rounded-2xl group-hover:scale-110 transition-transform">
                    {prob.icon}
                  </span>
                  <span className="text-xs font-extrabold px-3.5 py-1 bg-gray-100 dark:bg-[#282525] text-gray-700 dark:text-gray-300 rounded-full border border-gray-200 dark:border-[#3a3737]">
                    {prob.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {prob.title}
                </h3>
                <div className="p-3 bg-gray-50 dark:bg-[#262424] rounded-xl text-xs italic text-gray-600 dark:text-gray-400 mb-4 border border-gray-100 dark:border-[#333]">
                  {prob.example}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {prob.description}
                </p>
              </div>

              <Link
                href="/platform"
                className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0e6670] dark:text-[#e7b85b] group-hover:underline"
              >
                <span>Get Help with this Issue</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#eef4f1] dark:bg-[#171616] border-y border-[#dce3df] dark:border-[#2f2d2d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b] mb-2">
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
                className="bg-white dark:bg-[#201e1e] rounded-3xl p-6 border border-gray-200 dark:border-[#333] shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-2xl font-black text-[#0e6670]/20 dark:text-[#e7b85b]/20 font-mono">
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
        <div className="bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-extrabold px-3.5 py-1 rounded-full bg-[#e7b85b] text-[#102a2e] mb-4 inline-block shadow-sm">
              Zero-Hallucination Guardrails
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              AI Powered by Real Statutes, Not Speculation.
            </h2>
            <p className="text-base text-[#d4eae6] leading-relaxed mb-8">
              Generic chatbots often invent legal outcomes or state non-existent laws. CivicSaathi is architected with strict Retrieval-Augmented Generation (RAG) that restricts answers to verified legal statutes and forces inline citations for every right explained.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/20">
              <div>
                <div className="text-3xl font-black text-[#e7b85b] font-mono">100%</div>
                <div className="text-xs text-[#d4eae6] font-semibold mt-1">Statute Grounded</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#e7b85b] font-mono">Section 6(1)</div>
                <div className="text-xs text-[#d4eae6] font-semibold mt-1">RTI Act Formatted</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#e7b85b] font-mono">Hindi/English</div>
                <div className="text-xs text-[#d4eae6] font-semibold mt-1">Multilingual Voice Input</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-[#f6edcf] dark:bg-[#1a2325] border-t border-[#e7d9af] dark:border-[#334244]">
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
              className="bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold py-4 px-9 rounded-2xl transition-all shadow-xl text-base"
            >
              Start Your Inquiry with CivicSaathi →
            </Link>
            <Link
              href="/faq"
              className="bg-white dark:bg-[#252323] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#444] font-bold py-4 px-9 rounded-2xl transition-all text-base shadow-sm"
            >
              Read Common FAQs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
