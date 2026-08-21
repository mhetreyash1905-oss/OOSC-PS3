'use client';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-[#1a1919] text-gray-900 dark:text-gray-200 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/platform')} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Navigator
        </button>
        <h1 className="text-3xl font-bold mb-8 border-b pb-4 dark:border-gray-800">Civic Resources</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#2d2a2a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-2">Know Your Rights Manual</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">A comprehensive guide on fundamental rights and duties.</p>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">Read Online →</button>
          </div>
          <div className="bg-white dark:bg-[#2d2a2a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-2">RTI Guidelines</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Step-by-step instructions on filing an RTI application.</p>
            <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold">View Guide →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
