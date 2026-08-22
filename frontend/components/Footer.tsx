import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#102a2e] text-gray-300 border-t border-[#1e484e] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1e484e]">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#e7b85b] text-[#102a2e] flex items-center justify-center font-bold text-lg shadow-sm">
                ⚖️
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CivicSaathi</span>
            </div>
            <p className="text-sm text-[#b2cbc6] leading-relaxed">
              AI-powered civic rights navigator and legal drafting assistant helping Indian citizens understand their statutory protections and take effective action.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#e7b85b]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Grounded in official Indian statutory frameworks</span>
            </div>
          </div>

          {/* Col 2: Legal Tools */}
          <div>
            <h4 className="text-xs font-semibold text-[#e7b85b] uppercase tracking-wider mb-4">
              Civic & Legal Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/platform" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🤖</span> AI Civic Assistant
                </Link>
              </li>
              <li>
                <Link href="/rti-guide" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>📜</span> RTI Drafting Guide
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>📚</span> Civic Resources Library
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>🗂️</span> Case Tracker
                </Link>
              </li>
              <li>
                <Link href="/saved-documents" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>📁</span> Saved Documents & Drafts
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Knowledge & Guides */}
          <div>
            <h4 className="text-xs font-semibold text-[#e7b85b] uppercase tracking-wider mb-4">
              Knowledge Base
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About CivicSaathi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Tenancy Rights Manual
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Municipal Grievance Escalation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact & Citizen Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Statutory Focus */}
          <div>
            <h4 className="text-xs font-semibold text-[#e7b85b] uppercase tracking-wider mb-4">
              Supported Acts
            </h4>
            <ul className="space-y-2 text-xs text-[#a2beb9]">
              <li className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Right to Information Act 2005</span>
                <span>Section 6(1) drafting & PIO appeals</span>
              </li>
              <li className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Rent Control & Tenancy Acts</span>
                <span>Deposit recovery, statutory eviction protections</span>
              </li>
              <li className="p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-white block">Municipal Grievance Redressal</span>
                <span>Water, sanitation, roads & civil utilities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#87a5a0]">
          <p>
            © {new Date().getFullYear()} Civic Rights Navigator (CivicSaathi). All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl">
            <strong className="text-gray-300">Disclaimer:</strong> CivicSaathi provides general legal and civic information grounded in Indian statutes. It is not a substitute for professional legal counsel.
          </p>
        </div>
      </div>
    </footer>
  );
}
