'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getIdToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

interface SavedDoc {
  id: string;
  session_id: string;
  title: string;
  type: string;
  category: string;
  department: string;
  created_at: string | null;
  download_url: string;
}

export default function SavedDocumentsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<SavedDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    loadDocuments();
  }, [user, authLoading, router]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<{ documents: SavedDoc[] }>('/platform/documents');
      setDocuments(data.documents || []);
    } catch (e) {
      console.error('Failed to load documents', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (sessionId: string) => {
    try {
      setDownloadingId(sessionId);
      const token = await getIdToken();
      const response = await fetch(`http://localhost:8000/platform/download-rti/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RTI_Application_${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error', error);
      alert('Could not download document. Please try again.');
    } finally {
      setDownloadingId(null);
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
              <span>📁</span> Saved Documents & Drafts
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Access your drafted RTI applications, demand notices, and legal briefs.
            </p>
          </div>
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <span>+</span> Draft New Document
          </Link>
        </div>

        {loading || authLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-500 dark:border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your legal documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="bg-white dark:bg-[#252323] rounded-2xl p-12 text-center border border-gray-200 dark:border-[#333] shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-[#2d2a2a] text-blue-600 dark:text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📄
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No saved documents yet</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
              When you ask CivicSaathi to draft an RTI application or legal demand notice, your downloadable files will be saved here.
            </p>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Ask CivicSaathi to Draft an RTI
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-[#252323] rounded-2xl p-6 border border-gray-200 dark:border-[#333] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      <span>📜</span> {doc.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Authority:</span> {doc.department}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-[#333] flex items-center justify-between gap-3">
                  <Link
                    href={`/platform`}
                    className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-orange-400"
                  >
                    View in Chat →
                  </Link>
                  <button
                    onClick={() => handleDownload(doc.session_id)}
                    disabled={downloadingId === doc.session_id}
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <span>⬇️</span> {downloadingId === doc.session_id ? 'Generating...' : 'Download PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
