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
        return { label: 'RTI Ready & Drafted', color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300' };
      case 'drafting':
        return { label: 'Drafting Document', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' };
      case 'recommendation':
        return { label: 'Strategy Formed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
      case 'rights':
        return { label: 'Rights Explaining', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      default:
        return { label: 'Active Assessment', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcf9] dark:bg-[#121111] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b2b31] via-[#0e6670] to-[#124b55] text-white py-16 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative max-w-5xl mx-auto text-center z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Citizen Case Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            My Cases & Saved Assessments
          </h1>
          <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium">
            Access your ongoing statutory consultations, generated RTI applications, demand notices, and case histories.
          </p>
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Active Case File Directory</h2>
          <Link
            href="/platform"
            className="bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>New Consultation</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-white dark:bg-[#1d1b1b] rounded-3xl border border-gray-200 dark:border-[#333]">
            <div className="w-8 h-8 border-4 border-[#0e6670] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-gray-500">Loading your saved cases...</p>
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#1d1b1b] rounded-3xl border border-gray-200 dark:border-[#333] space-y-4">
            <div className="text-4xl">📂</div>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">No Saved Cases Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto font-medium">
              You have not started any civic consultations yet. Start an inquiry with CivicSaathi to create your first case file.
            </p>
            <Link
              href="/platform"
              className="inline-block bg-[#0e6670] text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md"
            >
              Start AI Consultation Now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((c) => {
              const statusDisplay = getStatusDisplay(c.status);
              return (
                <div
                  key={c.session_id}
                  className="bg-white dark:bg-[#1d1b1b] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-[#333] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-[#2c2929] pb-3">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 dark:bg-[#2c2929] text-blue-700 dark:text-[#e7b85b] border border-blue-100 dark:border-[#3d3a3a]">
                        {c.category || 'General Consultation'}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${statusDisplay.color}`}>
                        {statusDisplay.label}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Created: {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-[#2c2929] flex justify-end">
                    <Link
                      href={`/platform?session_id=${c.session_id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0e6670] dark:text-[#e7b85b] hover:underline"
                    >
                      <span>Open Case Workspace</span>
                      <span>→</span>
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
