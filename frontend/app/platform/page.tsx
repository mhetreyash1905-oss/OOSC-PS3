'use client';
import { useState, useEffect, useRef } from 'react';
import { getIdToken } from '@/lib/auth';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import RightsExplanation from '@/components/RightsExplanation';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'agent';
  content: string;
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
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Data States
  const [rightsData, setRightsData] = useState<any>(null);
  const [recommendationData, setRecommendationData] = useState<any>(null);
  const [rtiData, setRtiData] = useState<any>(null);

  // Loading States
  const [isGeneratingRights, setIsGeneratingRights] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [isDraftingRTI, setIsDraftingRTI] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for Firebase to resolve persisted session
    if (!user) {
      router.push('/login');
      return;
    }
    setLoadingAuth(false);
    loadHistory();
    startSession();
  }, [authLoading, user, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (step === 2 && sessionId && !rightsData) {
      fetchRights(sessionId);
    } else if (step === 3 && sessionId && !recommendationData) {
      fetchRecommendation(sessionId);
    } else if (step === 4 && sessionId && !rtiData) {
      draftRTI(sessionId);
    }
  }, [step, sessionId]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await apiFetch<{sessions: SessionHistory[]}>('/platform/sessions/history');
      setHistory(data.sessions);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoadingHistory(false);
    }
  }

  const startSession = async () => {
    try {
      const data = await apiFetch<{session_id: string}>('/platform/session/start', { method: 'POST' });
      setSessionId(data.session_id);
    } catch (error) {
      setErrorMsg("Failed to start session. Network error.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, presetMessage?: string) => {
    if (e) e.preventDefault();
    const userMsg = presetMessage || inputText.trim();
    if (!userMsg || !sessionId || isTyping) return;
    
    setErrorMsg(null);
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const data = await apiFetch<any>('/platform/intake/message', {
        method: 'POST',
        body: { session_id: sessionId, message: userMsg }
      });

      if (data.status === 'in_progress') {
        setMessages(prev => [...prev, { role: 'agent', content: data.agent_message }]);
      } else if (data.status === 'complete') {
        setMessages(prev => [...prev, { 
          role: 'agent', 
          content: "Thank you. I have collected enough information. Analyzing your rights based on the law..." 
        }]);
        setStep(2);
        // Refresh history to show the new chat title
        loadHistory();
      }
    } catch (error) {
      setErrorMsg("Error communicating with AI. Please try again.");
      setMessages(prev => [...prev, { role: 'agent', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const fetchRights = async (sid: string) => {
    setIsGeneratingRights(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<any>('/platform/rights', { method: 'POST', body: { session_id: sid } });
      setRightsData(data);
    } catch (error) {
      setErrorMsg("Failed to fetch rights explanation.");
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
      setErrorMsg("Failed to generate recommendation.");
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
      setErrorMsg("Failed to draft RTI document.");
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
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Download failed");
      
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
      setErrorMsg("Failed to download PDF.");
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
      console.error("Failed to load session", e);
      setErrorMsg("Failed to load session history.");
    }
  }

  if (loadingAuth) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#1a1919] text-gray-800 dark:text-gray-300">Loading...</div>;
  }

  const isLandingView = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-[#1e1c1c] text-gray-900 dark:text-[#e0e0e0] font-sans overflow-hidden transition-colors duration-200">
      
      {/* Toast Error Message */}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-200 px-4 py-3 rounded shadow-md flex justify-between gap-4">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold hover:text-red-900 dark:hover:text-white">&times;</button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-in-out bg-gray-50 dark:bg-[#1a1919] border-r border-gray-200 dark:border-[#333131] flex flex-col shrink-0 overflow-hidden`}>
        <div className="p-4 flex gap-2">
          <button 
            onClick={() => { setMessages([]); setStep(1); setRightsData(null); setRecommendationData(null); setRtiData(null); startSession(); }}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-[#2d2a2a] hover:bg-gray-300 dark:hover:bg-[#3d3a3a] text-gray-800 dark:text-white py-2 px-3 rounded-md transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Chat
          </button>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-[#2d2a2a]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {/* Features Section */}
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Features</h3>
            <ul className="space-y-1">
              <li>
                <button onClick={() => router.push('/cases')} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2a2a] rounded-md flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                  My Cases
                </button>
              </li>
              <li>
                <button onClick={() => router.push('/resources')} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2a2a] rounded-md flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                  Civic Resources
                </button>
              </li>
            </ul>
          </div>

          {/* History Section */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Chats and tasks</h3>
            {loadingHistory ? (
              <div className="px-3 text-sm text-gray-400">Loading...</div>
            ) : history.length === 0 ? (
              <div className="px-3 text-sm text-gray-400">No previous chats.</div>
            ) : (
              <ul className="space-y-1">
                {history.map(session => (
                  <li key={session.session_id}>
                    <button onClick={() => loadPastSession(session.session_id)} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2d2a2a] rounded-md truncate">
                      {session.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative transition-colors duration-200">
        
        {/* Toggle Sidebar Button (when sidebar is closed) */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-md hover:bg-gray-200 dark:hover:bg-[#2d2a2a] border border-gray-200 dark:border-[#333]"
            title="Open Sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
          </button>
        )}

        {isLandingView ? (
          // Landing View
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-800 dark:text-[#d8d4cf] mb-12 flex items-center gap-4 transition-colors">
              <svg className="w-10 h-10 text-blue-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 8L22 9L17 14L18 21L12 17.5L6 21L7 14L2 9L9 8L12 2Z"></path></svg>
              Civic Rights Navigator?
            </h1>
            
            <div className="w-full max-w-3xl bg-white dark:bg-[#2d2a2a] rounded-2xl border border-gray-300 dark:border-[#3d3a3a] p-4 shadow-lg transition-colors duration-200">
              <form onSubmit={handleSendMessage} className="flex flex-col">
                <input 
                  type="text" 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  placeholder="How can I help you today?" 
                  className="w-full bg-transparent text-gray-900 dark:text-[#e0e0e0] placeholder-gray-400 dark:placeholder-gray-500 outline-none text-lg py-3 px-2 mb-4"
                />
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-[#3d3a3a] pt-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleSendMessage(undefined, "I need help filing an RTI.")} type="button" className="text-xs bg-gray-100 dark:bg-[#3d3a3a] hover:bg-gray-200 dark:hover:bg-[#4d4a4a] text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      File an RTI
                    </button>
                    <button onClick={() => handleSendMessage(undefined, "I want to learn about my legal rights.")} type="button" className="text-xs bg-gray-100 dark:bg-[#3d3a3a] hover:bg-gray-200 dark:hover:bg-[#4d4a4a] text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md flex items-center gap-1">
                      Learn Rights
                    </button>
                  </div>
                  <button type="submit" disabled={!inputText.trim()} className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-50 text-white rounded-md p-2 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Suggestions */}
            <div className="flex gap-3 mt-8 flex-wrap justify-center">
              <button onClick={() => handleSendMessage(undefined, "I want to file a complaint against my landlord for sudden eviction.")} className="px-4 py-2 bg-white dark:bg-[#2d2a2a] hover:bg-gray-50 dark:hover:bg-[#3d3a3a] border border-gray-200 dark:border-[#3d3a3a] rounded-full text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                Write an eviction response
              </button>
              <button onClick={() => handleSendMessage(undefined, "What are my rights regarding erratic municipal water supply?")} className="px-4 py-2 bg-white dark:bg-[#2d2a2a] hover:bg-gray-50 dark:hover:bg-[#3d3a3a] border border-gray-200 dark:border-[#3d3a3a] rounded-full text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 shadow-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Learn municipal rights
              </button>
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-blue-600 dark:bg-[#3d3a3a] text-white' : 'bg-gray-100 dark:bg-transparent text-gray-800 dark:text-gray-200'}`}>
                      {msg.role === 'agent' && <div className="font-bold text-blue-700 dark:text-orange-400 mb-1 text-sm">Navigator</div>}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="text-gray-500 dark:text-gray-400 italic px-5 py-3 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
                
                {/* Embedded steps after chat is done */}
                {step > 1 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-[#3d3a3a]">
                    
                    {step === 2 && (
                      <div className="bg-white dark:bg-[#2d2a2a] rounded-xl p-6 border border-gray-200 dark:border-[#3d3a3a] shadow-sm">
                        {isGeneratingRights || !rightsData ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-blue-500 dark:border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Analyzing legal knowledge base...</p>
                          </div>
                        ) : (
                          <>
                            <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                              <RightsExplanation explanation={rightsData.explanation} citations={rightsData.citations} confidence={rightsData.confidence} />
                            </div>
                            <div className="mt-6 flex justify-end">
                              <button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">View Recommended Action →</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {step === 3 && (
                      <div className="bg-white dark:bg-[#2d2a2a] rounded-xl p-6 border border-gray-200 dark:border-[#3d3a3a] shadow-sm">
                        {isGeneratingRecommendation || !recommendationData ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Drafting strategy...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended Action</h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">{recommendationData.recommendation_text}</p>
                            
                            {recommendationData.action_type === 'file_rti' && (
                              <div className="bg-blue-50 dark:bg-[#3d3a3a] border border-blue-200 dark:border-[#4d4a4a] rounded-lg p-4 mb-6 text-left">
                                <h3 className="font-bold text-blue-900 dark:text-gray-200 mb-2">Why an RTI?</h3>
                                <p className="text-blue-800 dark:text-gray-400 text-sm">{recommendationData.rti_info_requested}</p>
                              </div>
                            )}

                            <div className="flex justify-center gap-4">
                              <button onClick={() => setStep(2)} className="px-4 py-2 border border-gray-300 dark:border-[#4d4a4a] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3d3a3a] rounded-md transition-colors">Back</button>
                              {recommendationData.action_type === 'file_rti' && (
                                <button onClick={() => setStep(4)} className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">Draft RTI →</button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {step === 4 && (
                      <div className="bg-white dark:bg-[#2d2a2a] rounded-xl p-6 border border-gray-200 dark:border-[#3d3a3a] shadow-sm">
                        {isDraftingRTI || !rtiData ? (
                          <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400">Drafting official document...</p>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">Your RTI is Ready</h3>
                            <button 
                              onClick={downloadPDF}
                              disabled={isDownloading}
                              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors mb-4 flex items-center justify-center"
                            >
                              {isDownloading ? 'Generating...' : 'Download PDF'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area (Only show if still chatting) */}
            {step === 1 && (
              <div className="p-4 bg-white dark:bg-[#1e1c1c] transition-colors">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSendMessage} className="flex bg-gray-50 dark:bg-[#2d2a2a] border border-gray-300 dark:border-[#3d3a3a] rounded-xl overflow-hidden p-1 shadow-sm focus-within:ring-1 focus-within:ring-blue-500 dark:focus-within:ring-[#4d4a4a] transition-all">
                    <input 
                      type="text" 
                      value={inputText} 
                      onChange={(e) => setInputText(e.target.value)} 
                      disabled={isTyping} 
                      placeholder="Reply to Navigator..." 
                      className="flex-1 bg-transparent text-gray-900 dark:text-[#e0e0e0] placeholder-gray-500 outline-none px-4 py-3"
                    />
                    <button type="submit" disabled={isTyping || !inputText.trim()} className="bg-blue-600 dark:bg-[#3d3a3a] hover:bg-blue-700 dark:hover:bg-[#4d4a4a] disabled:opacity-50 text-white px-4 m-1 rounded-lg transition-colors">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
