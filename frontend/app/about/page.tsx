import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">About Civic Rights Navigator</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10 border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-2xl font-bold leading-6 text-blue-900">The Problem</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-gray-700 space-y-4">
          <p>
            Indian citizens often face complex bureaucratic and legal processes. Whether it's dealing with confusing tenancy laws, unresponsive municipal bodies, or opaque government processes, most people don't know their rights or how to exercise them.
          </p>
          <p>
            Furthermore, legal consultations are often expensive and inaccessible to the common citizen, leaving many vulnerable to exploitation or administrative apathy.
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10 border border-gray-200">
        <div className="px-4 py-5 sm:px-6 bg-green-50">
          <h2 className="text-2xl font-bold leading-6 text-green-900">Our Solution</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-gray-700 space-y-4">
          <p>
            Civic Rights Navigator is an AI-powered system designed to bridge this gap. You can describe your complaints in plain language, and our system explains your rights grounded in actual legal text with proper citations.
          </p>
          <p>
            Currently, our platform specializes in:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Tenant Disputes:</strong> Navigating rights under the Maharashtra Rent Control Act.</li>
            <li><strong>Civic Service Failures:</strong> Addressing municipal apathy and procedural roadblocks.</li>
            <li><strong>RTI Generation:</strong> Automatically drafting real, submittable Right to Information (RTI) applications based on your unique scenario.</li>
          </ul>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200 gap-4 text-center">
          <div className="flex-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">1</div>
            <h3 className="font-semibold text-gray-900">Describe</h3>
            <p className="text-sm text-gray-500 mt-1">State your issue naturally</p>
          </div>
          <div className="hidden md:block text-gray-400">→</div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">2</div>
            <h3 className="font-semibold text-gray-900">Retrieve</h3>
            <p className="text-sm text-gray-500 mt-1">System finds exact laws via RAG</p>
          </div>
          <div className="hidden md:block text-gray-400">→</div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">3</div>
            <h3 className="font-semibold text-gray-900">Explain</h3>
            <p className="text-sm text-gray-500 mt-1">Plain-english breakdown with citations</p>
          </div>
          <div className="hidden md:block text-gray-400">→</div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-xl">4</div>
            <h3 className="font-semibold text-gray-900">Act</h3>
            <p className="text-sm text-gray-500 mt-1">Draft RTIs or formal complaints</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-10 shadow-sm">
        <h3 className="text-lg font-bold text-amber-800 mb-2 flex items-center gap-2">
          <span>⚠️</span> Important Legal Disclaimer
        </h3>
        <p className="text-amber-800 text-sm">
          This tool provides general information about legal rights based on Indian statutes including the RTI Act 2005 and Maharashtra Rent Control Act 1999. It is NOT a substitute for professional legal advice from a qualified lawyer. The information provided should not be construed as legal advice, and no attorney-client relationship is created by using this tool. For specific legal situations, please consult a licensed legal professional.
        </p>
      </div>

      <div className="text-center bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Hackathon Prototype</h3>
        <p className="text-gray-600 text-sm mb-4">
          Built as a prototype to demonstrate how technology and AI can make legal rights accessible to everyone.
        </p>
        <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
          Try the Platform
        </Link>
      </div>
    </div>
  );
}
