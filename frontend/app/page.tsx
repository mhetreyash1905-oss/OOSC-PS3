import Link from 'next/link';

export default function Home() {
  return (
    <div className="page-shell">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#123d43] text-white py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(120deg,transparent_0%,rgba(231,184,91,0.8)_48%,transparent_49%,transparent_100%)] bg-[length:18rem_18rem]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="eyebrow mb-5 text-[#e7b85b]">Civic Rights Navigator</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-[1.05]">
            Understand Your Rights. Take Action.
          </h1>
          <p className="text-lg md:text-xl mb-10 text-[#d6e8e4] max-w-3xl mx-auto leading-relaxed">
            Navigate complex legal and civic processes with AI-powered guidance grounded in actual Indian law.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-[#e7b85b] text-[#183338] hover:bg-[#f0ca7a] font-semibold py-3 px-8 rounded-lg transition-all text-lg shadow-lg shadow-black/10">
              Get Started
            </Link>
            <Link href="/about" className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-all text-lg backdrop-blur-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#fbfcf9] dark:bg-[#172d30]">
        <div className="max-w-7xl mx-auto">
          <p className="eyebrow text-center mb-3">A clear path forward</p>
          <h2 className="text-3xl font-bold text-center text-[#18252b] dark:text-[#e8efec] mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#dcefeb] text-[#0e6670] rounded-2xl rotate-3 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">1. Describe Your Situation</h3>
              <p className="text-gray-600 dark:text-[#b8c9c5]">Explain your issue in simple terms. No legal jargon required.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#f9e5d5] text-[#c26534] rounded-2xl -rotate-3 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">2. Understand Your Rights</h3>
              <p className="text-gray-600 dark:text-[#b8c9c5]">Get clear explanations grounded directly in relevant Indian legal statutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#f6edcf] text-[#a87816] rounded-2xl rotate-3 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">3. Take Action</h3>
              <p className="text-gray-600 dark:text-[#b8c9c5]">Generate actionable documents, like auto-formatted RTI applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#eef4f1] dark:bg-[#122125] border-t border-[#dce3df] dark:border-[#294447]">
        <div className="max-w-7xl mx-auto">
           <p className="eyebrow text-center mb-3">Built for action</p>
           <h2 className="text-3xl font-bold text-center text-[#18252b] dark:text-[#e8efec] mb-16">Feature Highlights</h2>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#fbfcf9] dark:bg-[#1c3739] p-8 rounded-lg shadow-sm border border-[#dce3df] dark:border-[#315255]">
                <div className="text-3xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">Grounded in Real Law</h3>
                <p className="text-gray-600 dark:text-[#b8c9c5]">Every explanation cites actual legal provisions, preventing AI assumptions and providing reliable, statutory backing.</p>
              </div>
              <div className="bg-[#fbfcf9] dark:bg-[#1c3739] p-8 rounded-lg shadow-sm border border-[#dce3df] dark:border-[#315255]">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">RTI Application Drafting</h3>
                <p className="text-gray-600 dark:text-[#b8c9c5]">Auto-generate properly formatted, submittable Right to Information applications tailored to your specific query.</p>
              </div>
              <div className="bg-[#fbfcf9] dark:bg-[#1c3739] p-8 rounded-lg shadow-sm border border-[#dce3df] dark:border-[#315255]">
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">Tenant Rights</h3>
                <p className="text-gray-600 dark:text-[#b8c9c5]">Understand your rights and protections under the Maharashtra Rent Control Act and related tenancy laws.</p>
              </div>
              <div className="bg-[#fbfcf9] dark:bg-[#1c3739] p-8 rounded-lg shadow-sm border border-[#dce3df] dark:border-[#315255]">
                <div className="text-3xl mb-4">🏙️</div>
                <h3 className="text-xl font-semibold mb-3 dark:text-[#e8efec]">Civic Service Issues</h3>
                <p className="text-gray-600 dark:text-[#b8c9c5]">Hold municipal bodies accountable for service failures with clear pathways for grievance redressal.</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#f6edcf] dark:bg-[#263f3d] text-center border-t border-[#e7d9af] dark:border-[#3d5b52]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#183338] dark:text-[#f1f5ee] mb-6">Ready to understand your rights?</h2>
          <p className="text-lg text-[#53676a] dark:text-[#c8d8d0] mb-8">Join Civic Rights Navigator today and take the first step towards civic empowerment.</p>
          <Link href="/register" className="inline-block bg-[#0e6670] hover:bg-[#084951] text-white font-bold py-3 px-10 rounded-lg transition-all text-lg shadow-md">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
