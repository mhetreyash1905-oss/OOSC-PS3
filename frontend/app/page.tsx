import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Understand Your Rights. Take Action.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Navigate complex legal and civic processes with AI-powered guidance grounded in actual Indian law.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-white text-blue-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors text-lg">
              Get Started
            </Link>
            <Link href="/about" className="bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Describe Your Situation</h3>
              <p className="text-gray-600">Explain your issue in simple terms. No legal jargon required.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Understand Your Rights</h3>
              <p className="text-gray-600">Get clear explanations grounded directly in relevant Indian legal statutes.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Take Action</h3>
              <p className="text-gray-600">Generate actionable documents, like auto-formatted RTI applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
           <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Feature Highlights</h2>
           <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold mb-3">Grounded in Real Law</h3>
                <p className="text-gray-600">Every explanation cites actual legal provisions, preventing AI assumptions and providing reliable, statutory backing.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-3">RTI Application Drafting</h3>
                <p className="text-gray-600">Auto-generate properly formatted, submittable Right to Information applications tailored to your specific query.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-3">Tenant Rights</h3>
                <p className="text-gray-600">Understand your rights and protections under the Maharashtra Rent Control Act and related tenancy laws.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-3xl mb-4">🏙️</div>
                <h3 className="text-xl font-semibold mb-3">Civic Service Issues</h3>
                <p className="text-gray-600">Hold municipal bodies accountable for service failures with clear pathways for grievance redressal.</p>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-50 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Ready to understand your rights?</h2>
          <p className="text-lg text-blue-700 mb-8">Join Civic Rights Navigator today and take the first step towards civic empowerment.</p>
          <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg transition-colors text-lg shadow-md">
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
