'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function PlatformPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Civic Rights Navigator</h1>
        <p className="mt-2 text-lg text-gray-600">
          Describe your legal or civic issue in plain language, and we'll help you understand your rights and take action.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Sidebar Journey Tracker */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
            <h3 className="font-semibold text-gray-900 mb-6 uppercase tracking-wider text-sm">Your Journey</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {/* Step 1 */}
              <div className="relative flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md z-10 shrink-0 font-bold text-sm">
                  1
                </div>
                <div className="font-medium text-blue-700">Describe Issue</div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-400 flex items-center justify-center z-10 shrink-0 font-bold text-sm">
                  2
                </div>
                <div className="font-medium text-gray-500">Understand Rights</div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-400 flex items-center justify-center z-10 shrink-0 font-bold text-sm">
                  3
                </div>
                <div className="font-medium text-gray-500">Take Action</div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 text-gray-400 flex items-center justify-center z-10 shrink-0 font-bold text-sm">
                  4
                </div>
                <div className="font-medium text-gray-500">Download Documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface Area */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 text-center italic">
              Your conversation will appear here...
            </p>
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Describe your issue here..."
                className="input-field pr-16 bg-gray-50"
              />
              <div className="absolute right-2" title="Coming soon">
                <button
                  disabled
                  className="bg-blue-600 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Our AI is here to help you understand your legal standing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
