import Link from 'next/link';

export default function AboutPage() {
  const architectures = [
    {
      step: '1. Multi-turn Intake Agent',
      model: 'gemini-3.6-flash',
      role: 'Triage & Fact Extraction',
      description: 'Converses with the citizen in Hindi, Hinglish, or English. Extracts structured facts: issue category, location, events, and desired outcome.'
    },
    {
      step: '2. Grounded Vector RAG Engine',
      model: 'Local ChromaDB + all-MiniLM-L6-v2',
      role: 'Statute Retrieval',
      description: 'Embeds structured facts to query indexed legal texts (Rent Control Acts, Consumer Protection Act 2019, RTI Act 2005, Municipal Redressal manuals) with zero cloud vector lock-in.'
    },
    {
      step: '3. Legal Rights Reasoning Agent',
      model: 'gemini-3.6-flash',
      role: 'Explanation & Inline Citations',
      description: 'Explains citizen rights in plain language, strictly bounded to retrieved statutory chunks. Mandates bracketed citations and confidence rating.'
    },
    {
      step: '4. Statutory RTI & Notice Drafter',
      model: 'gemini-3.6-flash + Custom PDF Engine',
      role: 'Official Document Generation',
      description: 'Maps the issue to the relevant Public Information Officer (PIO) and formats Section 6(1) RTI questions, rendered into downloadable submittable PDFs.'
    }
  ];

  const techStack = [
    { name: 'Gemini 3.6 Flash', role: 'State-of-the-Art Reasoning & Multilingual Natural Language Intake', icon: '🤖' },
    { name: 'FastAPI (Python)', role: 'High-Performance Async Backend & RAG Pipeline Execution', icon: '⚡' },
    { name: 'ChromaDB Vector Store', role: 'Local Embedded Vector Database for Zero-Latency Legal Chunk Retrieval', icon: '🔍' },
    { name: 'Next.js 16 (App Router)', role: 'Modern Server-Side Rendered React Frontend with Turbopack', icon: '🌐' },
    { name: 'MongoDB Atlas', role: 'Persistent User Profiles, Saved Cases & Application Document Storage', icon: '🍃' },
    { name: 'Tailwind CSS', role: 'Responsive Glassmorphic UI Design Primitives & Dark Mode Styling', icon: '🎨' }
  ];

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Header Matching #14505b Dotted Pattern */}
      <section className="relative overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>CivicSaathi Architecture & Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            Democratizing Legal Rights & Civic Action in India
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Bridging the gap between 1.4 billion citizens and complex bureaucratic systems through statutory-grounded Artificial Intelligence.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">

        {/* The Problem & The Solution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-red-100 dark:border-red-950/40 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mb-5">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">The Civic Problem</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Millions of citizens in India encounter administrative friction every day:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-extrabold">•</span>
                <span><strong>Opaque Tenancy Rules:</strong> Landlords withholding deposits or forcing sudden evictions due to lack of tenant legal awareness.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-extrabold">•</span>
                <span><strong>Unresponsive Municipalities:</strong> Persistent civic failures (water contamination, road craters) without clear escalation steps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-extrabold">•</span>
                <span><strong>RTI Drafting Barrier:</strong> RTI applications are often rejected because citizens don't know the exact wording or PIO authority.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 border border-green-100 dark:border-green-950/40 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl mb-5">
              💡
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Our AI Solution</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              CivicSaathi is engineered as a multi-agent civic rights platform:
            </p>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-extrabold">•</span>
                <span><strong>Plain Language Intake:</strong> Accepts vernacular and Hinglish descriptions (e.g. <em>"Mere landlord ne security deposit wapas nahi kiya"</em>).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-extrabold">•</span>
                <span><strong>Strict Statutory Grounding:</strong> Rights are explained ONLY from verified statutory legal texts with verified citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-extrabold">•</span>
                <span><strong>Actionable Automation:</strong> Automatically writes RTI requests and demand notices formatted for submission to Public Information Officers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b]">Engineered for Reliability</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              4-Stage Multi-Agent System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
              CivicSaathi decomposes legal reasoning into specialized micro-agents to eliminate hallucinations and enforce strict statutory boundary guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {architectures.map((arch, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#383535] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0e6670] dark:text-[#e7b85b]">{arch.step}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-[#333] text-blue-700 dark:text-gray-300">
                    {arch.model}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{arch.role}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  {arch.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CivicSaathi Guardrails vs Generic LLMs Comparison Matrix */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b]">Zero-Hallucination Matrix</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              Why Statutory RAG Grounding Matters
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
              How CivicSaathi compares against generic un-grounded chatbots like ChatGPT or standard LLMs when answering Indian legal queries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-medium border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-[#333] text-gray-400 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-[#0e6670] dark:text-[#e7b85b]">CivicSaathi RAG Engine</th>
                  <th className="py-3 px-4 text-gray-500">Generic Chatbots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#2a2828]">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">Statute Citation Guarantee</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">✓ Mandatory Exact Sections (e.g. Sec 6(1) RTI)</td>
                  <td className="py-3.5 px-4 text-rose-500 font-bold">✗ Often invents or fabricates legal sections</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">Multilingual Vernacular Triage</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">✓ Native Hindi / Hinglish / English Speech</td>
                  <td className="py-3.5 px-4 text-gray-500 font-medium">~ Basic English translation only</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">Document Generation</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">✓ PDF Ready for Submission to PIO</td>
                  <td className="py-3.5 px-4 text-rose-500 font-bold">✗ Generic unformatted text snippet</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">Response Deadline Deadlines</td>
                  <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 font-bold">✓ 30-Day RTI & 15-Day Demand Timelines</td>
                  <td className="py-3.5 px-4 text-rose-500 font-bold">✗ No statutory timeline tracking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-8 sm:p-10 border border-gray-200 dark:border-[#333] shadow-md space-y-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0e6670] dark:text-[#e7b85b]">Under the Hood</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              Technology Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50 dark:bg-[#252323] border border-gray-200/80 dark:border-[#383535] space-y-2">
                <div className="text-3xl mb-1">{tech.icon}</div>
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{tech.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Footer */}
        <div className="bg-gradient-to-r from-[#0b2b31] via-[#0e6670] to-[#124b55] rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl space-y-6">
          <h2 className="text-3xl font-black">Experience CivicSaathi Today</h2>
          <p className="text-sm text-[#d4eae6] max-w-xl mx-auto font-medium">
            Start your inquiry in plain Hindi or English. Obtain grounded rights explanations and submittable applications in seconds.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/platform"
              className="bg-gradient-to-r from-[#e7b85b] to-[#f3ca76] hover:from-[#f3ca76] hover:to-[#e7b85b] text-[#102a2e] font-black text-sm px-8 py-4 rounded-2xl shadow-xl transition-all"
            >
              Ask AI Assistant Now →
            </Link>
            <Link
              href="/rights-navigator"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-8 py-4 rounded-2xl border border-white/20 transition-all"
            >
              Explore Rights Navigator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
