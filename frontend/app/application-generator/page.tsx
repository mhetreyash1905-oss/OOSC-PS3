'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getIdToken } from '@/lib/auth';

function ApplicationGeneratorContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  
  // AI Drafting State
  const [issueDescription, setIssueDescription] = useState(() => searchParams.get('issue') || '');
  const [isDraftingAI, setIsDraftingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [docType, setDocType] = useState<'rti' | 'landlord_notice' | 'municipal' | 'consumer' | 'utility' | 'eviction'>('rti');
  
  // Form State
  const [applicantName, setApplicantName] = useState('Ramesh Kumar');
  const [address, setAddress] = useState('Flat 402, Sunshine Apartments, MG Road, Mumbai, Maharashtra 400001');
  const [authority, setAuthority] = useState('Public Information Officer, Brihanmumbai Municipal Corporation (BMC)');
  const [subject, setSubject] = useState('Application under Section 6(1) of RTI Act 2005 regarding Road Tender Expenditure');
  const [particulars, setParticulars] = useState('1. Certified copy of work order for road repair on MG Road.\n2. Certified copy of quality test report for asphalt thickness.\n3. Total expenditure incurred and contractor details.');

  const [generating, setGenerating] = useState(false);

  const handleApplyPreset = (type: 'rti' | 'landlord_notice' | 'municipal' | 'consumer' | 'utility' | 'eviction') => {
    setDocType(type);
    if (type === 'rti') {
      setAuthority('Public Information Officer, Brihanmumbai Municipal Corporation (BMC)');
      setSubject('Application under Section 6(1) of RTI Act 2005 regarding Road Repair & Tender Expenditure');
      setParticulars('1. Certified copy of work order & sanctioned budget for MG Road repair.\n2. Copy of quality inspection certificate.\n3. Defect liability period and contractor warranty details.');
    } else if (type === 'landlord_notice') {
      setAuthority('To Landlord: Mr. Suresh Mehta, Flat 101, Bandra West, Mumbai');
      setSubject('Legal Demand Notice for Refund of Security Deposit under Rent Control Act');
      setParticulars('I hereby demand refund of my security deposit of ₹75,000 within 15 days of receipt of this notice. The lease ended on 31st July 2026 and premises were handed over in good condition.');
    } else if (type === 'municipal') {
      setAuthority('To: Executive Engineer / Ward Officer, Ward H-West, Municipal Corporation');
      setSubject('Formal Complaint & Notice regarding Contaminated Water Supply & Sewage Line Leakage');
      setParticulars('We write to bring to your urgent attention severe sewage contamination in municipal drinking water pipeline causing public health hazards. Immediate site inspection and pipe repair required within 7 days.');
    } else if (type === 'consumer') {
      setAuthority('To: Nodal Grievance Officer, Flipkart Internet Private Limited / Seller');
      setSubject('Statutory Demand Notice for Refund & Compensation under Consumer Protection Act 2019');
      setParticulars('Defective laptop delivered under Order ID #OD3094829104. Refund wrongfully refused. You are called upon to refund ₹15,000 plus ₹5,000 compensation for mental harassment within 15 days.');
    } else if (type === 'utility') {
      setAuthority('To: Executive Engineer (Testing), State Electricity Distribution Co. Ltd.');
      setSubject('Application for High-Accuracy Meter Testing & Disputed Consumption Billing Revision');
      setParticulars('Re: Consumer Account #90382910. Current bill shows 4x average consumption due to faulty electronic meter. Requesting official lab testing under Section 56 of Electricity Act 2003.');
    } else if (type === 'eviction') {
      setAuthority('To: Landlord / Property Owner, House #45, Civil Lines');
      setSubject('Legal Reply to Unlawful Eviction Verbal Threat under State Rent Control Act');
      setParticulars('In response to your verbal demand to vacate within 7 days, please note that under Section 16 of Rent Control Act, tenant cannot be dispossessed without 90 days statutory notice or court decree.');
    }
  };

  const handleDraftWithAI = async () => {
    if (!issueDescription.trim()) return;
    setIsDraftingAI(true);
    setErrorMsg(null);
    try {
      const token = await getIdToken();
      if (!token) throw new Error("Please log in to use AI generation.");
      
      const res: any = await fetch('http://localhost:8000/platform/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ issue_description: issueDescription })
      });
      if (!res.ok) {
        let errStr = "Failed to generate document";
        try {
          const errData = await res.json();
          if (errData.detail) errStr = errData.detail;
        } catch(e) {}
        throw new Error(errStr);
      }
      const data = await res.json();
      
      setDocType(data.doc_type);
      setAuthority(data.authority);
      setSubject(data.subject);
      setParticulars(data.particulars);
      
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred.");
    } finally {
      setIsDraftingAI(false);
    }
  };

  const handleDownloadPDF = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header Matching #14505b Dotted Pattern */}
      <section className="relative overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Official Statutory Document Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Application & Statutory Document Generator
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Explain your issue below. Our AI will analyze the facts and format a statutory Section 6(1) RTI, Demand Notice, or Municipal Petition ready for submission.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Preset Selector Ribbon */}
        <div className="bg-white dark:bg-[#1d1b1b] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Select Template Preset</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <button
              onClick={() => handleApplyPreset('rti')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'rti' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              📜 Section 6(1) RTI
            </button>
            <button
              onClick={() => handleApplyPreset('landlord_notice')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'landlord_notice' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              🏠 Deposit Demand
            </button>
            <button
              onClick={() => handleApplyPreset('municipal')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'municipal' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              🏛️ Civic Petition
            </button>
            <button
              onClick={() => handleApplyPreset('consumer')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'consumer' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              🛍️ Consumer Complaint
            </button>
            <button
              onClick={() => handleApplyPreset('utility')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'utility' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              ⚡ Electricity Meter
            </button>
            <button
              onClick={() => handleApplyPreset('eviction')}
              className={`p-3 rounded-2xl text-xs font-extrabold text-left transition-all ${docType === 'eviction' ? 'bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white shadow-md' : 'bg-gray-50 dark:bg-[#252323] text-gray-700 dark:text-gray-300 hover:bg-gray-100'}`}
            >
              🛡️ Eviction Reply
            </button>
          </div>
        </div>

        {/* AI Input Section */}
        <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>🤖</span> Step 1: Explain Your Issue for AI Custom Drafting
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium">
            Briefly describe your problem (e.g., "The streetlights in my area have been broken for 3 months despite complaints" or "Flipkart delivered a broken phone and refused refund").
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <textarea
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Explain your situation here..."
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] resize-none"
            />
            <button
              onClick={handleDraftWithAI}
              disabled={isDraftingAI || !issueDescription.trim()}
              className="whitespace-nowrap bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold px-7 py-3 rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 self-start sm:self-stretch"
            >
              {isDraftingAI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Draft Application</span>
                </>
              )}
            </button>
          </div>
          {errorMsg && <p className="text-rose-500 text-xs font-semibold mt-2">{errorMsg}</p>}
        </div>

        {/* Generator Main Grid: Form Left, Preview Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Side */}
          <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-5">
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>✍️</span> Step 2: Review & Edit Details
            </h2>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => handleApplyPreset(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              >
                <option value="rti">RTI Application (Section 6(1) RTI Act 2005)</option>
                <option value="landlord_notice">Landlord Security Deposit Demand Notice</option>
                <option value="municipal">Municipal Civic Grievance Petition</option>
                <option value="consumer">Consumer E-Commerce Refund Demand</option>
                <option value="utility">Electricity Board Meter Testing Request</option>
                <option value="eviction">Unlawful Eviction Legal Reply</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Applicant Name
              </label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Applicant Address & Contact
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Target Authority / Addressee
              </label>
              <input
                type="text"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Subject Heading
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-700 dark:text-gray-300 mb-1">
                Particulars / Information Sought / Demand Clause
              </label>
              <textarea
                rows={5}
                value={particulars}
                onChange={(e) => setParticulars(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#262424] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
              />
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="w-full bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              <span>{generating ? 'Generating Official PDF...' : 'Download / Print Official Document'}</span>
            </button>
          </div>

          {/* Live Document Canvas Side */}
          <div className="bg-gray-100 dark:bg-[#181616] p-6 rounded-3xl border border-gray-200 dark:border-[#333] flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Official Document Canvas</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 font-extrabold">
                Statutory Ready
              </span>
            </div>

            {/* Simulated High-Res Paper Canvas */}
            <div className="bg-white text-gray-900 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-300 font-serif text-sm leading-relaxed space-y-4 flex-1 relative overflow-hidden">
              <div className="absolute top-10 right-10 opacity-10 font-sans font-black text-6xl text-gray-400 rotate-[30deg] pointer-events-none select-none">
                CIVIC SAATHI
              </div>

              <div className="text-center font-bold uppercase text-base border-b-2 border-gray-900 pb-3 tracking-wide font-sans">
                {docType === 'rti' ? 'FORMAL APPLICATION UNDER RIGHT TO INFORMATION ACT 2005' : docType === 'landlord_notice' ? 'LEGAL DEMAND NOTICE FOR SECURITY DEPOSIT REFUND' : docType === 'municipal' ? 'MUNICIPAL CIVIC PETITION' : docType === 'consumer' ? 'CONSUMER PROTECTION DEMAND NOTICE' : 'STATUTORY LEGAL APPLICATION'}
              </div>

              <div className="text-xs space-y-1 font-sans">
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>From:</strong> {applicantName}</p>
                <p><strong>Address:</strong> {address}</p>
              </div>

              <div className="text-xs pt-2 font-sans">
                <p><strong>To:</strong></p>
                <p className="font-bold">{authority}</p>
              </div>

              <div className="text-xs font-bold pt-2 border-t border-b py-2 font-sans bg-gray-50 p-2">
                SUBJECT: {subject}
              </div>

              <div className="text-xs space-y-2 pt-2">
                <p>Respected Authority / Sir,</p>
                <p>I am a citizen of India and hereby request the following information / action under the statutory provisions applicable:</p>
                <div className="bg-gray-50 p-3 rounded-lg border font-mono text-[11px] whitespace-pre-wrap leading-normal">
                  {particulars}
                </div>
              </div>

              <div className="text-xs pt-6 flex justify-between items-end font-sans">
                <div>
                  <p><strong>Application Fee:</strong> ₹10 Paid</p>
                  <p><strong>Mode:</strong> IPO / Court Fee Stamp</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{applicantName}</p>
                  <p className="text-[10px] text-gray-500">(Signature of Applicant)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Section 1: Submission Guide & Fee Structure */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📮</span>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Submission Instructions & Fee Guide</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">How to dispatch your document to ensure legally binding receipt.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-[#0e6670] dark:text-[#e7b85b] uppercase">Step 1: Application Fee</span>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Attach Statutory Fee</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                For RTI Section 6(1), attach a ₹10 Indian Postal Order (IPO), Court Fee Stamp, or Demand Draft payable to the PIO. BPL cardholders are 100% fee-exempt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-[#0e6670] dark:text-[#e7b85b] uppercase">Step 2: Dispatch Mode</span>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Registered AD / Speed Post</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Always send notices or RTI petitions via Registered Post with Acknowledgment Due (AD) or Speed Post. Retain postal receipts for court evidence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#383535] space-y-2">
              <span className="text-xs font-black text-[#0e6670] dark:text-[#e7b85b] uppercase">Step 3: Timeline Clock</span>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Track Statutory Deadline</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                RTI responses are due within 30 days of delivery. Legal demand notices allow 15 days for compliance before filing court petitions.
              </p>
            </div>
          </div>
        </div>

        {/* Extended Section 2: Recommended Evidence Attachments */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📎</span>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Recommended Annexures & Attachments Checklist</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Strengthen your application by attaching supporting evidence copies.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#252323] border border-blue-100 dark:border-[#383535]">
              <span className="text-xs font-extrabold text-blue-700 dark:text-[#e7b85b]">RTI Applications</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">₹10 IPO Slip + Photo ID Proof Copy + BPL Card (if fee exempt)</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#252323] border border-blue-100 dark:border-[#383535]">
              <span className="text-xs font-extrabold text-blue-700 dark:text-[#e7b85b]">Landlord Notices</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">Rent Agreement Copy + Deposit Bank Slip + Key Handover Receipt</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#252323] border border-blue-100 dark:border-[#383535]">
              <span className="text-xs font-extrabold text-blue-700 dark:text-[#e7b85b]">Consumer Complaints</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">E-Commerce Invoice + Unboxing Video/Photos + Chat Support Logs</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#252323] border border-blue-100 dark:border-[#383535]">
              <span className="text-xs font-extrabold text-blue-700 dark:text-[#e7b85b]">Municipal Petitions</span>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-medium">Geotagged Hazard Photos + Online Complaint Docket Number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0e6670] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ApplicationGeneratorContent />
    </Suspense>
  );
}
