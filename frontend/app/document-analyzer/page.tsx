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

  const handleAnalyze = async () => {
    if (!docText.trim() && !fileName) return;

    setAnalyzing(true);
    try {
      const { apiFetch } = await import('@/lib/api');
      
      const res: any = await apiFetch('/platform/analyze-document', {
        method: 'POST',
        body: { text: docText, filename: fileName || '' }
      });
      
      if (res?.error) throw new Error(res.error);
      setAnalysisResult(res);
    } catch (e) {
      console.error(e);
      alert('Failed to analyze document. Please ensure you are logged in and your connection is stable.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setFileName('Sample_Rent_Agreement.txt');
    setDocText(
      `LEAVE AND LICENSE AGREEMENT
This agreement made on 1st August 2025 between Landlord Mr. Suresh Mehta and Licensee Mr. Ramesh Kumar.
1. License Fee: ₹25,000 per month.
2. Security Deposit: ₹1,50,000 refundable upon expiration.
3. Lock-in Period: 12 Months. If Licensee vacates early, entire deposit shall be forfeited.
4. Maintenance: Licensee shall bear all painting, plumbing, and structural wear-and-tear repair costs.
5. Eviction: Landlord reserves right to terminate agreement with 3 days verbal notice without cause.`
    );
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl shadow-[#14505b]/30 border-b border-white/10">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>AI Legal Clause Risk & Unfair Contract Scanner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Document Risk & Agreement Analyzer
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Paste or upload rental agreements, employment contracts, or notice drafts. CivicSaathi scans for unfair clauses, unlawful forfeiture penalties, and illegal eviction traps.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Upload Container */}
        <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📄</span>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Upload or Paste Document Text</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Supports plain text, rental agreements, notices, and contract clauses.</p>
              </div>
            </div>
            <button
              onClick={handleLoadSample}
              className="text-xs font-extrabold px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#282525] text-[#0e6670] dark:text-[#e7b85b] border border-gray-200 dark:border-[#383535] hover:bg-gray-200 self-start sm:self-auto"
            >
              📋 Load Sample Agreement
            </button>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-[#3a3737] rounded-3xl p-6 text-center hover:border-[#0e6670] dark:hover:border-[#e7b85b] transition-colors bg-gray-50/50 dark:bg-[#232121]">
              <input
                type="file"
                accept=".txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="doc-upload"
              />
              <label htmlFor="doc-upload" className="cursor-pointer block space-y-2">
                <div className="text-3xl">📤</div>
                <p className="text-xs sm:text-sm font-extrabold text-gray-700 dark:text-gray-300">
                  {fileName ? `Attached File: ${fileName}` : 'Click to Upload Document File (.txt)'}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">Or paste the full agreement text in the box below</p>
              </label>
            </div>

            <textarea
              rows={8}
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste document text here..."
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#252323] text-gray-900 dark:text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#0e6670] font-mono leading-relaxed resize-none"
            />

            <button
              onClick={handleAnalyze}
              disabled={analyzing || (!docText.trim() && !fileName)}
              className="w-full bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold py-4 rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning Legal Clauses & Risk Flags...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Analyze Legal Document Risk</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white dark:bg-[#1d1b1b] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-[#2d2a2a] pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Scan Complete</span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">
                  Document Audit Report
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">Document Type: {analysisResult.documentType}</span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                    analysisResult.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : analysisResult.riskLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  ● {analysisResult.riskLevel} Risk Detected
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-[#252323] rounded-2xl border border-gray-100 dark:border-[#353232] space-y-1">
              <span className="text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b] uppercase">Executive Summary:</span>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{analysisResult.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Flags */}
              <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-[#291f21] border border-rose-100 dark:border-rose-950/60 space-y-3">
                <h4 className="text-xs font-extrabold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🚨</span> Unfair Clauses & Risk Flags
                </h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {analysisResult.riskFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500 font-extrabold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-[#1a2921] border border-emerald-100 dark:border-emerald-950/60 space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🛡️</span> Recommended Action & Protection
                </h4>
                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-extrabold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/application-generator"
                className="bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
              >
                Draft Legal Demand Notice for these Risk Flags →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
