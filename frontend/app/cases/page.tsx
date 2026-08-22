'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface CaseItem {
  session_id: string;
  title: string;
  category: string | null;
  status: string;
  created_at: string | null;
}

export default function CasesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadCases();
  }, [user, authLoading, router]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<{ sessions: CaseItem[] }>('/platform/sessions/history');
      setCases(data.sessions || []);
    } catch (e) {
      console.error('Failed to load cases', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'complete':
        return { label: 'RTI Ready & Drafted', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' };
      case 'drafting':
        return { label: 'Drafting Document', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' };
      case 'recommendation':
        return { label: 'Strategy Formed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
      case 'rights':
        return { label: 'Rights Explaining', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' };
      default:
        return { label: 'Active Assessment', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1919] text-gray-900 dark:text-gray-100 p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-[#333]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/platform" className="text-sm text-blue-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-medium">
                ← Back to CivicSaathi
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span>🗂️</span> My Cases & Inquiries
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Review and continue your ongoing civic issues and legal inquiries.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span>+</span> Start New Case
          </Link>
        </div>

        {loading || authLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-500 dark:border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your cases...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="bg-white dark:bg-[#252323] rounded-2xl p-12 text-center border border-gray-200 dark:border-[#333] shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-[#2d2a2a] text-blue-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🏠
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No active cases yet</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
              When you describe your legal or civic problem to CivicSaathi, your case will be tracked and saved here.
            </p>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Start Your First Case
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((c) => {
              const statusInfo = getStatusDisplay(c.status);
              return (
                <div
                  key={c.session_id}
                  className="bg-white dark:bg-[#252323] rounded-xl p-5 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {c.category && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {c.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Initiated: {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href="/platform"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white transition-colors"
                    >
                      Continue Case →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
