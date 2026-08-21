'use client';
import { useRouter } from 'next/navigation';

export default function CasesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-[#1a1919] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/platform')} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Navigator
        </button>
        <h1 className="text-3xl font-bold mb-8 border-b pb-4 dark:border-gray-800">My Cases</h1>
        <div className="bg-white dark:bg-[#2d2a2a] rounded-lg p-12 text-center shadow-sm border border-gray-200 dark:border-gray-800">
          <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          <h2 className="text-xl font-semibold mb-2">No active cases found.</h2>
          <p className="text-gray-500 dark:text-gray-400">Cases will appear here once you proceed further with legal actions.</p>
        </div>
      </div>
    </div>
  );
}
