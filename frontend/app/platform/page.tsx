'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getIdToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import RightsExplanation from '@/components/RightsExplanation';
import Link from 'next/link';

interface Message {
  role: 'user' | 'agent';
  content: string;
  issue_detected?: string;
  issue_icon?: string;
  suggested_actions?: string[];
  attached_file?: string;
  is_complete?: boolean;
}

interface SessionHistory {
  session_id: string;
  title: string;
  category: string | null;
  status: string;
  created_at: string | null;
}

export default function PlatformPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);

  // Sidebar & History State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  // Document Upload State
  const [attachedFile, setAttachedFile] = useState<{ name: string; content?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Legal & RTI Pipeline Data States
  const [rightsData, setRightsData] = useState<any>(null);
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const [rtiData, setRtiData] = useState<any>(null);

  // Loading States for Stages
  const [isGeneratingRights, setIsGeneratingRights] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [isDraftingRTI, setIsDraftingRTI] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
    } else {
      loadHistory();
      startSession();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, step]);

  useEffect(() => {
    if (step === 2 && sessionId && !rightsData) {
      fetchRights(sessionId);
    } else if (step === 3 && sessionId && !recommendationData) {
      fetchRecommendation(sessionId);
    } else if (step === 4 && sessionId && !rtiData) {
      draftRTI(sessionId);
    }
  }, [step, sessionId]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = voiceLang;

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptChunk;
            } else {
              interimTranscript += transcriptChunk;
            }
          }

          const currentSpeech = (finalTranscript || interimTranscript).trim();
          if (currentSpeech) {
            const base = baseTextRef.current.trim();
            setInputText(base ? `${base} ${currentSpeech}` : currentSpeech);
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [voiceLang]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        baseTextRef.current = inputText;
        recognitionRef.current.lang = voiceLang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Voice start error', e);
        setIsListening(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      setAttachedFile({
        name: file.name,
        content: content.slice(0, 3000)
      });
    };
    reader.readAsText(file);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await apiFetch<{ sessions: SessionHistory[] }>('/platform/sessions/history');
      setHistory(data.sessions || []);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startSession = async () => {
    try {
      const data = await apiFetch<{ session_id: string }>('/platform/session/start', { method: 'POST' });
      setSessionId(data.session_id);
    } catch (error) {
      setErrorMsg('Failed to start session. Please check your network connection.');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep(1);
    setRightsData(null);
    setRecommendationData(null);
    setRtiData(null);
    setAttachedFile(null);
    setInputText('');
    startSession();
  };

  const handleSendMessage = async (e?: React.FormEvent, presetMessage?: string) => {
    if (e) e.preventDefault();
    let userMsg = presetMessage || inputText.trim();
    if (!userMsg || !sessionId || isTyping) return;

    if (attachedFile) {
      userMsg += `\n[Attached Document: ${attachedFile.name}]`;
    }

    setErrorMsg(null);
    setInputText('');
    const currentAttachedName = attachedFile?.name;
    setAttachedFile(null);

    setMessages(prev => [...prev, { role: 'user', content: userMsg, attached_file: currentAttachedName }]);
    setIsTyping(true);

    try {
      const data = await apiFetch<any>('/platform/intake/message', {
        method: 'POST',
        body: { session_id: sessionId, message: userMsg }
      });

      const agentMsgObj: Message = {
        role: 'agent',
        content: data.agent_message || 'I understand your situation.',
        issue_detected: data.issue_detected,
        issue_icon: data.issue_icon || '🏠',
        suggested_actions: data.suggested_actions || [],
        is_complete: data.status === 'complete' || data.is_complete
      };

      setMessages(prev => [...prev, agentMsgObj]);
      loadHistory();
    } catch (error) {
      console.error('Intake message error', error);
      setErrorMsg('Error communicating with CivicSaathi. Please try again.');
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          content: 'I understand your situation. Let us look into your legal rights and options.',
          issue_detected: 'Tenant–Landlord Dispute',
          issue_icon: '🏠',
          suggested_actions: [
            'Check your rental agreement',
            'Send a written demand notice',
            'Preserve payment records & receipts',
            'Approach the appropriate grievance/legal forum if unresolved'
          ],
          is_complete: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateActionPlan = () => {
    setStep(2);
  };

  const fetchRights = async (sid: string) => {
    setIsGeneratingRights(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any>('/platform/rights', { method: 'POST', body: { session_id: sid } });
      setRightsData(data);
    } catch (error) {
      setErrorMsg('Failed to fetch legal rights analysis.');
    } finally {
      setIsGeneratingRights(false);
    }
  };

  const fetchRecommendation = async (sid: string) => {
    setIsGeneratingRecommendation(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any>('/platform/recommend', { method: 'POST', body: { session_id: sid } });
      setRecommendationData(data);
    } catch (error) {
      setErrorMsg('Failed to generate action recommendation.');
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  const draftRTI = async (sid: string) => {
    setIsDraftingRTI(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any>('/platform/draft-rti', { method: 'POST', body: { session_id: sid } });
      setRtiData(data);
    } catch (error) {
      setErrorMsg('Failed to draft RTI document.');
    } finally {
      setIsDraftingRTI(false);
    }
  };

  const downloadPDF = async () => {
    if (!sessionId) return;
    setIsDownloading(true);
    setErrorMsg(null);
    try {
      const token = await getIdToken();
      const response = await fetch(`http://localhost:8000/platform/download-rti/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
      setErrorMsg('Failed to download PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const loadPastSession = async (sid: string) => {
    try {
      const session = await apiFetch<any>(`/platform/sessions/${sid}`);
      setSessionId(session.session_id);

      if (session.intake_history) {
        setMessages(session.intake_history);
      } else {
        setMessages([]);
      }

      let currentStep = 1;
      if (session.status === 'rights' || session.rights_explanation) currentStep = 2;
      if (session.status === 'recommendation' || session.recommendation) currentStep = 3;
      if (session.status === 'drafting' || session.status === 'complete' || session.rti_document) currentStep = 4;

      setStep(currentStep);
      setRightsData(session.rights_explanation || null);
      setRecommendationData(session.recommendation || null);
      setRtiData(session.rti_document || null);
    } catch (e) {
      console.error('Failed to load session', e);
      setErrorMsg('Failed to load session history.');
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#1a1919] text-gray-800 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium text-sm">Loading CivicSaathi...</span>
        </div>
      </div>
    );
  }

  const isLandingView = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#fcfcfd] dark:bg-[#171616] text-gray-900 dark:text-[#ececec] font-sans overflow-hidden transition-colors duration-200">
      {/* Toast Error Message */}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur">
          <span className="text-sm">{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold text-red-600 hover:text-red-900 dark:hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64 sm:w-72' : 'w-0'
        } transition-all duration-300 ease-in-out bg-white dark:bg-[#1f1d1d] border-r border-gray-200 dark:border-[#2f2d2d] flex flex-col shrink-0 overflow-hidden shadow-sm z-20`}
      >
        {/* New Conversation Button */}
        <div className="p-4 flex gap-2 border-b border-gray-100 dark:border-[#2b2929]">
          <button
            onClick={resetChat}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2.5 px-3.5 rounded-xl transition-all shadow-sm text-sm font-semibold group"
          >
            <span className="text-lg leading-none font-light group-hover:rotate-90 transition-transform">+</span>
            New conversation
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2b2929] transition-colors"
            title="Collapse Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main Civic Hub Links */}
          <div>
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
              Civic Hub
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => router.push('/cases')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-[#2c2a2a] hover:text-blue-700 dark:hover:text-orange-400 flex items-center gap-3 transition-colors group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">🗂️</span>
                  <span>My Cases</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/saved-documents')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-[#2c2a2a] hover:text-blue-700 dark:hover:text-orange-400 flex items-center gap-3 transition-colors group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">📁</span>
                  <span>Saved Documents</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/applications')}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-[#2c2a2a] hover:text-blue-700 dark:hover:text-orange-400 flex items-center gap-3 transition-colors group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">📋</span>
                  <span>Applications</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Past Conversations / Chat History */}
          <div>
            <div className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center justify-between">
              <span>Recent Chats</span>
              {history.length > 0 && (
                <span className="text-[10px] bg-gray-100 dark:bg-[#2d2a2a] px-1.5 py-0.5 rounded text-gray-500">
                  {history.length}
                </span>
              )}
            </div>
            {loadingHistory ? (
              <div className="px-3 py-2 text-xs text-gray-400 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="px-3 py-3 text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-[#1a1919] rounded-xl text-center">
                No previous conversations yet.
              </div>
            ) : (
              <ul className="space-y-1">
                {history.map(session => (
                  <li key={session.session_id}>
                    <button
                      onClick={() => loadPastSession(session.session_id)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl truncate transition-colors flex items-center gap-2 ${
                        sessionId === session.session_id
                          ? 'bg-blue-50 dark:bg-[#2f2c2c] text-blue-700 dark:text-orange-300 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2b2929] hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      <span className="text-gray-400 dark:text-gray-500 shrink-0">💬</span>
                      <span className="truncate">{session.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-3 border-t border-gray-100 dark:border-[#2b2929] bg-gray-50/50 dark:bg-[#1a1919]/50">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-orange-950 flex items-center justify-center text-xs text-blue-700 dark:text-orange-300 font-bold">
              CS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">CivicSaathi AI</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">Civic & Legal Rights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-transparent">
        {/* Toggle Sidebar Button when closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-20 p-2.5 bg-white dark:bg-[#242222] text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-xl shadow-md border border-gray-200 dark:border-[#333] transition-transform hover:scale-105"
            title="Open Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        )}

        {/* Persistent Escalate to Human / Legal Aid Pathway */}
        <div className="absolute top-4 right-4 z-20">
          <a
            href="https://nalsa.gov.in/lsams/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#232121] text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all hover:scale-105"
            title="National Legal Services Authority Helpline - For Low Confidence or Out-of-Scope cases"
          >
            <span className="text-base">🧑‍⚖️</span>
            <span className="hidden sm:inline">Connect with Legal Aid (DLSA)</span>
            <span className="sm:hidden">Legal Aid</span>
          </a>
        </div>

        {isLandingView ? (
          /* Landing / Hero State (ChatGPT style) */
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 overflow-y-auto">
            <div className="w-full max-w-3xl text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-[#0e6670]/10 to-[#e7b85b]/10 dark:bg-[#252323] text-[#0e6670] dark:text-[#e7b85b] text-xs font-bold mb-5 border border-[#0e6670]/20 dark:border-[#e7b85b]/30 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>✨ Gemini 3.6 Statutory RAG Engine • Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3 font-sans">
                👋 Hi! What civic or legal problem can I help you with?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Describe your problem in simple language, Hindi, or Hinglish. CivicSaathi will identify your rights, provide immediate actionable steps, and help you draft official notices and RTIs.
              </p>
            </div>

            {/* Central Input Box */}
            <div className="w-full max-w-3xl bg-white dark:bg-[#232121] rounded-3xl border border-gray-200 dark:border-[#383535] p-3 shadow-xl hover:shadow-2xl transition-all duration-200">
              <form onSubmit={handleSendMessage} className="flex flex-col">
                {/* Document Attached Preview Chip */}
                {attachedFile && (
                  <div className="mb-2 mx-2 p-2 bg-blue-50 dark:bg-[#2d2a2a] rounded-xl flex items-center justify-between text-xs text-blue-800 dark:text-orange-300 border border-blue-100 dark:border-[#3d3a3a]">
                    <div className="flex items-center gap-2 truncate">
                      <span>📎</span>
                      <span className="font-semibold truncate">{attachedFile.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="text-gray-400 hover:text-red-500 font-bold ml-2 px-1"
                    >
                      &times;
                    </button>
                  </div>
                )}

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={3}
                  placeholder="Describe your problem in simple language... (e.g. Mere landlord ne security deposit wapas nahi kiya)"
                  className="w-full bg-transparent text-gray-900 dark:text-[#f0f0f0] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-base p-3 resize-none"
                />

                {/* Input Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#302e2e] px-2">
                  <div className="flex items-center gap-2">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                      className="hidden"
                    />

                    {/* Voice Input Button */}
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-200'
                          : 'bg-gray-100 dark:bg-[#2f2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3a3a] text-gray-700 dark:text-gray-300'
                      }`}
                      title={isListening ? 'Listening... click to stop' : 'Click to speak via voice'}
                    >
                      <span>🎤</span>
                      <span>{isListening ? 'Listening...' : 'Voice input'}</span>
                    </button>

                    {/* Voice Language Switcher */}
                    <button
                      type="button"
                      onClick={() => setVoiceLang(prev => prev === 'en-IN' ? 'hi-IN' : 'en-IN')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-[#2f2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3a3a] text-gray-700 dark:text-gray-300 transition-colors"
                      title="Switch voice recognition language (English / Hindi)"
                    >
                      <span>🌐</span>
                      <span>{voiceLang === 'en-IN' ? 'EN' : 'HI'}</span>
                    </button>

                    {/* Upload Document Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-[#2f2d2d] hover:bg-gray-200 dark:hover:bg-[#3d3a3a] text-gray-700 dark:text-gray-300 transition-colors"
                      title="Upload lease agreement, notice, or receipt"
                    >
                      <span>📎</span>
                      <span>Upload document</span>
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && !attachedFile}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-40 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <span>Ask CivicSaathi</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Prompt Suggestion Cards */}
            <div className="w-full max-w-3xl mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center mb-3">
                Try an example query
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSendMessage(undefined, 'Mere landlord ne security deposit wapas nahi kiya.')}
                  className="p-3.5 bg-white dark:bg-[#232121] hover:bg-blue-50/50 dark:hover:bg-[#2d2a2a] border border-gray-200 dark:border-[#333] rounded-2xl text-left transition-all hover:border-blue-300 dark:hover:border-orange-500/50 flex items-start gap-3 shadow-sm group"
                >
                  <span className="text-xl p-1.5 bg-blue-50 dark:bg-[#2d2a2a] rounded-xl group-hover:scale-110 transition-transform">
                    🏠
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-orange-400">
                      "Mere landlord ne security deposit wapas nahi kiya."
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Tenant dispute & deposit recovery guidelines
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage(undefined, 'The municipal corporation has not repaired broken water pipeline and road in our area.')}
                  className="p-3.5 bg-white dark:bg-[#232121] hover:bg-blue-50/50 dark:hover:bg-[#2d2a2a] border border-gray-200 dark:border-[#333] rounded-2xl text-left transition-all hover:border-blue-300 dark:hover:border-orange-500/50 flex items-start gap-3 shadow-sm group"
                >
                  <span className="text-xl p-1.5 bg-blue-50 dark:bg-[#2d2a2a] rounded-xl group-hover:scale-110 transition-transform">
                    🏛️
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-orange-400">
                      "Municipal corporation not repairing road & water pipeline."
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Civic grievance redressal & municipal notices
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage(undefined, 'How can I file an RTI application to inspect public road tender and work completion records?')}
                  className="p-3.5 bg-white dark:bg-[#232121] hover:bg-blue-50/50 dark:hover:bg-[#2d2a2a] border border-gray-200 dark:border-[#333] rounded-2xl text-left transition-all hover:border-blue-300 dark:hover:border-orange-500/50 flex items-start gap-3 shadow-sm group"
                >
                  <span className="text-xl p-1.5 bg-blue-50 dark:bg-[#2d2a2a] rounded-xl group-hover:scale-110 transition-transform">
                    📜
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-orange-400">
                      "How do I file an RTI for road tender and expenditure?"
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      RTI Act 2005 queries & draft generation
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleSendMessage(undefined, 'Landlord gave me sudden eviction notice without 30 days notice period.')}
                  className="p-3.5 bg-white dark:bg-[#232121] hover:bg-blue-50/50 dark:hover:bg-[#2d2a2a] border border-gray-200 dark:border-[#333] rounded-2xl text-left transition-all hover:border-blue-300 dark:hover:border-orange-500/50 flex items-start gap-3 shadow-sm group"
                >
                  <span className="text-xl p-1.5 bg-blue-50 dark:bg-[#2d2a2a] rounded-xl group-hover:scale-110 transition-transform">
                    ⚖️
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-orange-400">
                      "Landlord gave sudden eviction notice without 30 days notice."
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Statutory eviction protections & legal rights
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat View */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'user' ? (
                      /* User Message Bubble */
                      <div className="max-w-[85%] sm:max-w-[75%] rounded-3xl rounded-tr-sm px-5 py-3.5 bg-blue-600 dark:bg-[#343131] text-white shadow-sm">
                        {msg.attached_file && (
                          <div className="text-xs bg-white/20 px-2.5 py-1 rounded-lg mb-2 inline-flex items-center gap-1.5">
                            <span>📎</span> {msg.attached_file}
                          </div>
                        )}
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      /* CivicSaathi AI Response Bubble */
                      <div className="max-w-[95%] sm:max-w-[85%] rounded-3xl rounded-tl-sm p-6 bg-white dark:bg-[#232121] border border-gray-200 dark:border-[#343131] shadow-md">
                        {/* Header with Avatar */}
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                            🤖
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">CivicSaathi</h3>
                            <p className="text-[10px] text-gray-400">AI Civic & Legal Assistant</p>
                          </div>
                        </div>

                        {/* Empathetic acknowledgment */}
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                          {msg.content}
                        </p>

                        {/* Issue Detected Card */}
                        {msg.issue_detected && (
                          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#2a2828] dark:to-[#302c2c] border border-blue-100 dark:border-[#3d3838]">
                            <span className="text-xs uppercase font-semibold text-blue-700 dark:text-orange-400 tracking-wider block mb-1">
                              Issue detected:
                            </span>
                            <div className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white">
                              <span className="text-xl">{msg.issue_icon || '🏠'}</span>
                              <span>{msg.issue_detected}</span>
                            </div>
                          </div>
                        )}

                        {/* Actionable Checklist: "You may want to:" */}
                        {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                          <div className="mb-5 bg-gray-50 dark:bg-[#1d1b1b] rounded-2xl p-4 border border-gray-100 dark:border-[#2f2c2c]">
                            <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider block mb-2.5">
                              You may want to:
                            </span>
                            <ul className="space-y-2">
                              {msg.suggested_actions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                  <span className="text-blue-600 dark:text-orange-400 font-bold shrink-0 mt-0.5">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Create Action Plan Button (triggers step 2) */}
                        {step === 1 && (
                          <div className="pt-2 flex flex-wrap justify-start gap-3 mt-1">
                            <button
                              onClick={handleCreateActionPlan}
                              className="inline-flex items-center gap-2 bg-[#0e6670] hover:bg-[#084951] dark:bg-[#78c4c2] dark:hover:bg-[#5bb2b0] dark:text-[#102a2e] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all hover:translate-x-0.5"
                            >
                              <span>Create Action Plan</span>
                              <span>→</span>
                            </button>
                            
                            {/* Escalate to Human Pathway */}
                            <a
                              href="https://nalsa.gov.in/lsams/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-gray-50 dark:bg-[#2d2a2a] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-gray-700 dark:text-gray-300 hover:text-rose-700 dark:hover:text-rose-400 border border-gray-200 dark:border-[#444] hover:border-rose-300 dark:hover:border-rose-900/60 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
                              title="District Legal Services Authority / NALSA Helpline"
                            >
                              <span>🧑‍⚖️ Connect with Legal Aid (DLSA)</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* AI Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-[#232121] border border-gray-200 dark:border-[#333] rounded-2xl px-5 py-3.5 shadow-sm flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 dark:bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">
                        🤖
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-blue-500 dark:bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 dark:bg-orange-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 dark:bg-orange-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <span className="text-xs text-gray-400 ml-1">CivicSaathi is analyzing...</span>
                    </div>
                  </div>
                )}

                {/* Multi-step Pipeline Stages */}
                {step > 1 && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#333] space-y-6">
                    {/* Pipeline Progress Breadcrumb */}
                    <div className="flex items-center justify-between bg-white dark:bg-[#232121] p-3 rounded-2xl border border-gray-200 dark:border-[#333] text-xs font-medium text-gray-500">
                      <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600 dark:text-orange-400 font-bold' : ''}`}>
                        <span>1. Issue Assessment</span>
                      </div>
                      <span>→</span>
                      <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600 dark:text-orange-400 font-bold' : ''}`}>
                        <span>2. Legal Rights</span>
                      </div>
                      <span>→</span>
                      <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600 dark:text-orange-400 font-bold' : ''}`}>
                        <span>3. Strategy</span>
                      </div>
                      <span>→</span>
                      <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-blue-600 dark:text-orange-400 font-bold' : ''}`}>
                        <span>4. Official RTI Draft</span>
                      </div>
                    </div>

                    {/* Step 2: Legal Rights Explanation */}
                    {step === 2 && (
                      <div className="bg-white dark:bg-[#232121] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#333] shadow-lg">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-[#333]">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">⚖️</span>
                            <div>
                              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Legal Rights & Relevant Statutes</h2>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Grounded analysis with official legal citations</p>
                            </div>
                          </div>
                          {rightsData?.confidence && (
                            <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-full">
                              Confidence: {rightsData.confidence.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {isGeneratingRights || !rightsData ? (
                          <div className="py-12 text-center">
                            <div className="w-10 h-10 border-4 border-blue-500 dark:border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              Retrieving statutory sections & case law from knowledge base...
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                              <RightsExplanation
                                explanation={rightsData.explanation}
                                citations={rightsData.citations}
                                confidence={rightsData.confidence}
                              />
                            </div>
                            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-[#333] flex justify-between items-center">
                              <button
                                onClick={() => setStep(1)}
                                className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                              >
                                ← Back to Chat
                              </button>
                              <button
                                onClick={() => setStep(3)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                              >
                                <span>View Recommended Legal Action</span>
                                <span>→</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Step 3: Recommended Action */}
                    {step === 3 && (
                      <div className="bg-white dark:bg-[#232121] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#333] shadow-lg">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-[#333]">
                          <span className="text-2xl">🎯</span>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recommended Course of Action</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tailored strategy based on your facts & rights</p>
                          </div>
                        </div>

                        {isGeneratingRecommendation || !recommendationData ? (
                          <div className="py-12 text-center">
                            <div className="w-10 h-10 border-4 border-blue-500 dark:border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              Formulating recommended grievance and legal strategy...
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="bg-blue-50/70 dark:bg-[#2c2929] rounded-2xl p-5 border border-blue-100 dark:border-[#3d3a3a] mb-6">
                              <h3 className="text-sm font-bold text-blue-900 dark:text-orange-300 mb-2">Strategy Breakdown</h3>
                              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                {recommendationData.recommendation_text}
                              </p>
                            </div>

                            {recommendationData.action_type === 'file_rti' && (
                              <div className="bg-amber-50 dark:bg-[#302a24] rounded-2xl p-5 border border-amber-200 dark:border-[#4d3a24] mb-6">
                                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-2">
                                  <span>📜</span> RTI Application Recommended
                                </h3>
                                <p className="text-xs text-amber-800 dark:text-amber-200">
                                  {recommendationData.rti_info_requested || 'Filing an RTI will compel the concerned public authority to produce official records within 30 statutory days.'}
                                </p>
                              </div>
                            )}

                            <div className="pt-4 border-t border-gray-100 dark:border-[#333] flex justify-between items-center">
                              <button
                                onClick={() => setStep(2)}
                                className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2828]"
                              >
                                ← Back to Rights
                              </button>
                              <button
                                onClick={() => setStep(4)}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all"
                              >
                                <span>Generate Official RTI Application</span>
                                <span>→</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: RTI Drafting & PDF Generation */}
                    {step === 4 && (
                      <div className="bg-white dark:bg-[#232121] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#333] shadow-lg">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-[#333]">
                          <span className="text-2xl">📄</span>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Official RTI Application Form</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Formatted under Section 6(1) of the Right to Information Act 2005</p>
                          </div>
                        </div>

                        {isDraftingRTI || !rtiData ? (
                          <div className="py-12 text-center">
                            <div className="w-10 h-10 border-4 border-blue-500 dark:border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                              Drafting official questions and identifying Public Information Officer (PIO)...
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="bg-gray-50 dark:bg-[#1d1b1b] rounded-2xl p-5 border border-gray-200 dark:border-[#333] mb-6 space-y-4 text-xs sm:text-sm">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-[#333]">
                                <div>
                                  <span className="font-semibold text-gray-500 uppercase text-[10px]">Addressed To:</span>
                                  <p className="font-bold text-gray-900 dark:text-white">{rtiData.pio_designation || 'Public Information Officer (PIO)'}</p>
                                  <p className="text-gray-600 dark:text-gray-400">{rtiData.pio_department}</p>
                                  <p className="text-gray-500">{rtiData.pio_address}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-500 uppercase text-[10px]">Applicant:</span>
                                  <p className="font-bold text-gray-900 dark:text-white">{rtiData.applicant_name || 'Concerned Citizen'}</p>
                                  <p className="text-gray-600 dark:text-gray-400">{rtiData.applicant_email}</p>
                                </div>
                              </div>

                              <div>
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Subject:</span>
                                <p className="font-bold text-gray-900 dark:text-white mt-0.5">{rtiData.subject}</p>
                              </div>

                              <div>
                                <span className="font-semibold text-gray-500 uppercase text-[10px]">Information Requested:</span>
                                <ol className="list-decimal list-inside space-y-1.5 mt-2 text-gray-800 dark:text-gray-200">
                                  {rtiData.information_requested?.map((pt: string, idx: number) => (
                                    <li key={idx} className="leading-relaxed">{pt}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                              <button
                                onClick={() => setStep(3)}
                                className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a2828]"
                              >
                                ← Back to Strategy
                              </button>
                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Link
                                  href="/saved-documents"
                                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:underline px-3 py-2"
                                >
                                  View in Saved Documents
                                </Link>
                                <button
                                  onClick={downloadPDF}
                                  disabled={isDownloading}
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                  <span>⬇️</span>
                                  <span>{isDownloading ? 'Generating PDF...' : 'Download Formatted PDF'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Input Area */}
            <div className="p-4 bg-white/90 dark:bg-[#1a1919]/90 backdrop-blur border-t border-gray-200 dark:border-[#2b2929]">
              <div className="max-w-3xl mx-auto">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center bg-gray-50 dark:bg-[#252323] border border-gray-200 dark:border-[#363333] rounded-2xl overflow-hidden p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-orange-500 transition-all"
                >
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors ${
                      isListening ? 'text-red-500 animate-pulse bg-red-50 dark:bg-red-950/50' : ''
                    }`}
                    title="Voice input"
                  >
                    🎤
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isTyping}
                    placeholder="Ask follow-up or describe details in English / Hindi / Hinglish..."
                    className="flex-1 bg-transparent text-gray-900 dark:text-[#f0f0f0] placeholder-gray-400 dark:placeholder-gray-500 outline-none px-3 py-2 text-sm"
                  />

                  <button
                    type="submit"
                    disabled={isTyping || !inputText.trim()}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Ask CivicSaathi</span>
                    <span>→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
