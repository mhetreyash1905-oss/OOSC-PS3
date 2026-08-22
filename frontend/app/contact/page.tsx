'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#151414] text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#252323] text-blue-700 dark:text-[#e7b85b] text-xs font-bold border border-blue-100 dark:border-[#383535] mb-4">
            <span>📬</span>
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Contact & Citizen Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about civic procedures, feedback on CivicSaathi, or want to report an issue? We're here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm">
              <span className="text-2xl block mb-2">🤖</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">Instant AI Assistant</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                For immediate analysis of tenant disputes or RTI queries, try our AI assistant.
              </p>
              <Link href="/platform" className="text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline">
                Open CivicSaathi →
              </Link>
            </div>

            <div className="bg-white dark:bg-[#201e1e] p-6 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm">
              <span className="text-2xl block mb-2">🇮🇳</span>
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">National Portals</h3>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 mt-2">
                <li>• <strong>RTI Online:</strong> rtionline.gov.in</li>
                <li>• <strong>CPGRAMS Grievances:</strong> pgportal.gov.in</li>
                <li>• <strong>Consumer Helpline:</strong> consumerhelpline.gov.in</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 bg-white dark:bg-[#201e1e] p-8 rounded-3xl border border-gray-200 dark:border-[#333] shadow-sm">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✓
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank you for your message!</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-6">
                  Your feedback helps us make CivicSaathi more accessible and accurate for Indian citizens.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670]"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Product Feedback & Suggestion</option>
                    <option value="legal">Statutory Accuracy or Legal Text Note</option>
                    <option value="partnership">Civic NGO / Legal Aid Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#282626] text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[#0e6670] resize-none"
                    placeholder="How can we assist you or how can we improve CivicSaathi?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0e6670] hover:bg-[#094d54] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md mt-2"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
