import Link from 'next/link';

export default function AboutPage() {
  const architectures = [
    {
      step: '1. Multi-turn Intake Agent',
      model: 'gemini-2.5-flash',
      role: 'Triage & Fact Extraction',
      description: 'Converses with the citizen in Hindi, Hinglish, or English. Extracts structured facts: issue category, location, events, and desired outcome.'
    },
    {
      step: '2. Grounded Vector RAG',
      model: 'Local ChromaDB + all-MiniLM-L6-v2',
      role: 'Statute Retrieval',
      description: 'Embeds structured facts to query indexed legal texts (Rent Control Acts, RTI Act 2005, Municipal Redressal manuals) with zero cloud vector lock-in.'
    },
    {
      step: '3. Legal Rights Reasoning',
      model: 'gemini-2.5-flash',
      role: 'Explanation & Inline Citations',
      description: 'Explains citizen rights in plain language, strictly bounded to retrieved statutory chunks. Mandates bracketed citations and confidence rating.'
    },
    {
      step: '4. RTI & Notice Drafter',
      model: 'gemini-2.5-flash + ReportLab',
      role: 'Official Document Generation',
      description: 'Maps the issue to the relevant Public Information Officer (PIO) and formats Section 6(1) RTI questions, rendered into downloadable submittable PDFs.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535]">
            <span>⚖️</span>
            <span>Civic Rights Navigator Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Democratizing Legal Rights & Civic Action in India
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between 1.4 billion citizens and complex bureaucratic systems through statutory-grounded Artificial Intelligence.
          </p>
        </div>

        {/* The Problem & The Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#201e1e] rounded-3xl p-8 border border-red-100 dark:border-red-950/40 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mb-5">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">The Civic Problem</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
              Millions of citizens in India encounter administrative friction every day:
            </p>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Opaque Tenancy Rules:</strong> Landlords withholding deposits or forcing sudden evictions due to lack of tenant awareness.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Unresponsive Municipalities:</strong> Persistent civic failures (water contamination, road craters) without clear escalation steps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>RTI Drafting Barrier:</strong> RTI applications are often rejected because citizens don't know the exact wording or PIO authority.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#201e1e] rounded-3xl p-8 border border-green-100 dark:border-green-950/40 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl mb-5">
              💡
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Our AI Solution</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
              CivicSaathi is engineered as a multi-agent civic rights platform:
            </p>
            <ul className="mt-4 space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>Plain Language Intake:</strong> Accepts vernacular and Hinglish descriptions (e.g. <em>"Mere landlord ne security deposit wapas nahi kiya"</em>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>Strict Statutory Grounding:</strong> Rights are explained ONLY from verified statutory legal texts with verified citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span><strong>Actionable Automation:</strong> Automatically writes RTI requests and demand notices formatted for submission to Public Information Officers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white dark:bg-[#201e1e] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[#333] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Multi-Agent Architecture & Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              How CivicSaathi safely processes unstructured complaints into grounded legal action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {architectures.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 dark:bg-[#292626] border border-gray-200 dark:border-[#3a3737]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] uppercase tracking-wider">
                    {item.role}
                  </span>
                  <span className="text-[11px] font-mono bg-white dark:bg-[#1a1919] px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-[#444]">
                    {item.model}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.step}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ethical Safety Guardrails */}
        <div className="bg-amber-50/80 dark:bg-[#29221b] border-l-4 border-amber-500 rounded-r-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🛡️</span>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">
              Ethical Guardrails & AI Safety Rules
            </h3>
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed mb-4">
            CivicSaathi enforces strict architectural guardrails to protect citizens from inaccurate advice:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl">
              <strong>1. No Outcome Prediction:</strong> CivicSaathi is strictly prohibited from predicting if a citizen will "win" or "lose" a court dispute.
            </div>
            <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl">
              <strong>2. Mandatory Inline Citations:</strong> Every factual right must cite the exact retrieved statutory chunk.
            </div>
            <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl">
              <strong>3. Low Confidence Fallback:</strong> If knowledge base chunks do not cover the specific topic, the model explicitly admits lack of coverage.
            </div>
            <div className="p-3 bg-white/60 dark:bg-black/20 rounded-xl">
              <strong>4. Not Legal Counsel:</strong> Always includes the statutory disclaimer that this is educational information, not a replacement for a licensed advocate.
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Experience CivicSaathi</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Test the AI Civic Assistant with your own civic or legal questions today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/platform"
              className="bg-[#0e6670] hover:bg-[#094d54] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Open AI Civic Assistant →
            </Link>
            <Link
              href="/rti-guide"
              className="bg-white dark:bg-[#252323] hover:bg-gray-50 dark:hover:bg-[#353232] text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-[#444] font-semibold px-6 py-3.5 rounded-xl shadow-sm text-sm"
            >
              Explore RTI Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
