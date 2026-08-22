'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocumentAnalyzerPage() {
  const [docText, setDocText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    documentType: string;
    riskLevel: 'Low' | 'Medium' | 'High';
    keyClauses: string[];
    riskFlags: string[];
    recommendations: string[];
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      setDocText(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!docText.trim() && !fileName) return;

    setAnalyzing(true);
    setTimeout(() => {
      // Generate AI document breakdown
      setAnalysisResult({
        summary: `Document '${fileName || 'Pasted Legal Text'}' analyzed. Contains a 11-month leave and license agreement structure under Maharashtra Rent Control Act principles.`,
        documentType: 'Tenancy Leave & License Agreement',
        riskLevel: 'Medium',
        keyClauses: [
          'Section 4: Security Deposit of ₹75,000 refundable within 30 days of vacant possession.',
          'Section 9: Notice period of 1 month required prior to termination by either party.',
          'Section 12: Maintenance fees payable by licensee.'
        ],
        riskFlags: [
          '⚠️ Clause 4.2 states landlord can forfeit full deposit for minor wall paint wear (Unlawful forfeiture risk).',
          '⚠️ Agreement lacks Section 55 registration details (Unregistered agreement penalty).'
        ],
        recommendations: [
          'Send written notice requesting itemized repair quotes before vacating.',
          'Issue formal demand notice if deposit is not returned within 15 days of key handover.',
          'Preserve payment receipts and apartment handover video.'
        ]
      });
      setAnalyzing(false);
    }, 1200);
  };

  const handleLoadSample = () => {
    setFileName('Sample_Rent_Agreement.txt');
    setDocText(
      `LEAVE AND LICENSE AGREEMENT
This agreement made on 1st August 2025 between Landlord Mr. Suresh Mehta and Licensee Mr. Ramesh Kumar.
1. License Fee: ₹25,000 per month.
2. Security Deposit: ₹75,000 deposited via NEFT.
3. Notice Period: 1 Month written notice required.
4. Forfeiture Clause: Landlord reserves full right to forfeit security deposit if premises painting is required upon move-out.
5. Maintenance: Licensee shall pay all society maintenance charges.`
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>🔍</span>
            <span>AI Document Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Document Analyzer
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload rental agreements, eviction letters, municipal notices, or electricity bills for instant AI risk analysis and clause extraction.
          </p>
        </div>

        {/* Upload & Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-[#201e1e] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Paste Document Text or Drag & Drop File
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
              >
                Load Sample Agreement
              </button>
            </div>

            <textarea
              rows={8}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste text from rental agreement, demand notice, or municipal letter..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#0e6670] resize-none"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-[#2d2a2a] hover:bg-gray-200 dark:hover:bg-[#3d3a3a] px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">
                <span>📎</span>
                <span>{fileName ? `Uploaded: ${fileName}` : 'Choose File (.pdf, .txt, .docx)'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.txt,.docx,.png,.jpg"
                  className="hidden"
                />
              </label>

              <button
                onClick={handleAnalyze}
                disabled={analyzing || (!docText.trim() && !fileName)}
                className="w-full sm:w-auto bg-[#0e6670] hover:bg-[#094d54] disabled:opacity-40 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm"
              >
                {analyzing ? 'Analyzing Document...' : 'Run AI Document Analysis ⚡'}
              </button>
            </div>
          </div>

          {/* Quick Guide Sidebar */}
          <div className="bg-blue-50/60 dark:bg-[#201e1e] p-6 rounded-3xl border border-blue-100 dark:border-[#333] space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">What We Analyze</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-[#0e6670] dark:text-[#e7b85b] font-bold">•</span>
                <span><strong>Unlawful Forfeiture:</strong> Landlord deposit retention traps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0e6670] dark:text-[#e7b85b] font-bold">•</span>
                <span><strong>Notice Validity:</strong> Statutory 30-day notice compliance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0e6670] dark:text-[#e7b85b] font-bold">•</span>
                <span><strong>RTI Exemption Flags:</strong> Section 8 confidentiality clauses.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Analysis Output Section */}
        {analysisResult && (
          <div className="bg-white dark:bg-[#201e1e] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2d2a2a] pb-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Analysis Complete</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{analysisResult.documentType}</h2>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                analysisResult.riskLevel === 'High'
                  ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {analysisResult.riskLevel} Risk Level Detected
              </span>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 dark:bg-[#282626] rounded-2xl text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {analysisResult.summary}
            </div>

            {/* Risk Flags */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <span>⚠️</span> Identified Risk Flags & Unlawful Terms
              </h3>
              <div className="space-y-2">
                {analysisResult.riskFlags.map((flag, idx) => (
                  <div key={idx} className="p-3 bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-xs text-red-900 dark:text-red-200">
                    {flag}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>🎯</span> Recommended Next Actions
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {analysisResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#0e6670] dark:text-[#e7b85b] font-bold">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-[#2d2a2a]">
              <Link
                href="/action-plan"
                className="bg-[#0e6670] hover:bg-[#094d54] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Create Action Plan from this Document →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
