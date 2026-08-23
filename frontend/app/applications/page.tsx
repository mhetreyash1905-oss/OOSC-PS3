'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface ApplicationItem {
  id: string;
  session_id: string;
  title: string;
  category: string;
  issue_detected: string;
  status: string;
  action_type: string;
  created_at: string | null;
  has_download: boolean;
}

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadApplications();
  }, [user, authLoading, router]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<{ applications: ApplicationItem[] }>('/platform/applications');
      setApplications(data.applications || []);
    } catch (e) {
      console.error('Failed to load applications', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready to File':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'Strategy Formed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Rights Analyzed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1919] text-gray-900 dark:text-gray-100 p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-[#333]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/platform" className="text-sm text-blue-600 dark:text-[#e7b85b] hover:underline flex items-center gap-1 font-medium">
                ← Back to CivicSaathi
              </Link>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span>📋</span> Applications & Grievances
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track RTI filings, municipal complaints, and formal grievance submissions.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#0e6670] dark:hover:bg-[#094d54] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span>+</span> Start New Application
          </Link>
        </div>

        {loading || authLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-500 dark:border-[#e7b85b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-[#252323] rounded-2xl p-12 text-center border border-gray-200 dark:border-[#333] shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-[#2d2a2a] text-blue-600 dark:text-[#e7b85b] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📝
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No active applications</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
              Start a session with CivicSaathi to draft and track RTI applications or municipal grievance petitions.
            </p>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#0e6670] dark:hover:bg-[#094d54] text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Start an Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-[#252323] rounded-xl p-5 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Category: {app.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                    {app.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created on {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/platform"
                    className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] text-gray-800 dark:text-gray-200 transition-colors"
                  >
                    Open in Assistant →
                  </Link>
                  {app.has_download && (
                    <Link
                      href="/saved-documents"
                      className="text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-[#0e6670] dark:hover:bg-[#094d54] text-white transition-colors"
                    >
                      View PDF 📄
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
