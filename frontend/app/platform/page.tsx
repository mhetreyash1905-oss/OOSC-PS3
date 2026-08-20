'use client';
import { useState, useEffect, useRef } from 'react';
import { isAuthenticated } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import RightsExplanation from '@/components/RightsExplanation';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

export default function PlatformPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', content: "Hello! I'm the Civic Rights Navigator. Could you briefly describe the legal or civic issue you're facing?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setLoadingAuth(false);
      startSession();
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Triggers for transitions
  useEffect(() => {
    if (step === 2 && sessionId && !rightsData) {
      fetchRights(sessionId);
    } else if (step === 3 && sessionId && !recommendationData) {
      fetchRecommendation(sessionId);
    } else if (step === 4 && sessionId && !rtiData) {
      draftRTI(sessionId);
    }
  }, [step, sessionId]);

  const startSession = async () => {
    try {
      const data = await apiFetch<{session_id: string}>('/platform/session/start', { method: 'POST' });
      setSessionId(data.session_id);
    } catch (error) {
      setErrorMsg("Failed to start session. Network error.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId || isTyping) return;
    setErrorMsg(null);
    const userMsg = inputText.trim();
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
      const token = localStorage.getItem('token');
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

  if (loadingAuth) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col md:flex-row gap-6 relative">
      
      {/* Toast Error Message */}
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex justify-between gap-4">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold">&times;</button>
        </div>
      )}

      {/* Sidebar - Journey Progress */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit shrink-0">
        <h2 className="font-bold text-lg mb-6 text-gray-800">Your Journey</h2>
        <ul className="space-y-4">
          <li className={`flex items-center gap-3 ${step >= 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>1</div>
            Describe Issue
          </li>
          <li className={`flex items-center gap-3 ${step >= 2 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>2</div>
            Understand Rights
          </li>
          <li className={`flex items-center gap-3 ${step >= 3 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>3</div>
            Take Action
          </li>
          <li className={`flex items-center gap-3 ${step >= 4 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-blue-100' : 'bg-gray-100'}`}>4</div>
            Download RTI
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[600px] md:h-auto relative">
        
        {step === 1 && (
          <>
            <div className="bg-gray-50 p-4 border-b border-gray-200 shrink-0">
              <h1 className="font-bold text-xl text-gray-800">Intake & Triage</h1>
              <p className="text-sm text-gray-500">Explain your issue naturally. We'll ask a few clarifying questions.</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-agent'}>{msg.content}</div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start"><div className="chat-bubble-agent animate-pulse">Typing...</div></div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isTyping || step > 1} placeholder="Type your message..." className="input-field flex-1" />
                <button type="submit" disabled={isTyping || !inputText.trim() || step > 1} className="btn-primary">Send</button>
              </form>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col h-full">
            {isGeneratingRights || !rightsData ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Analyzing Your Rights</h3>
                <p className="text-gray-600 max-w-md mt-2">Searching the legal knowledge base and extracting verified provisions...</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-hidden">
                  <RightsExplanation explanation={rightsData.explanation} citations={rightsData.citations} confidence={rightsData.confidence} />
                </div>
                <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex justify-end">
                  <button onClick={() => setStep(3)} className="btn-primary">View Recommended Action →</button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col h-full">
            {isGeneratingRecommendation || !recommendationData ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Generating Strategy</h3>
                <p className="text-gray-600 max-w-md mt-2">Determining the best legal/civic action based on your rights...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Recommended Action</h2>
                  
                  <div className="text-gray-700 text-lg leading-relaxed text-center mb-8">
                    {recommendationData.recommendation_text}
                  </div>
                  
                  {recommendationData.action_type === 'file_rti' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                      <h3 className="font-bold text-blue-900 mb-2">Why an RTI?</h3>
                      <p className="text-blue-800 text-sm">{recommendationData.rti_info_requested}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <button onClick={() => setStep(2)} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Back to Rights</button>
                    {recommendationData.action_type === 'file_rti' ? (
                      <button onClick={() => setStep(4)} className="btn-primary">Draft RTI Document →</button>
                    ) : (
                      <button onClick={() => alert("Other actions not implemented in this prototype.")} className="btn-primary">Finish</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col h-full">
            {isDraftingRTI || !rtiData ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Drafting RTI Application</h3>
                <p className="text-gray-600 max-w-md mt-2">Writing specific clauses and formatting your legal document...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col md:flex-row h-full">
                {/* RTI Preview Data */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-gray-50 border-r border-gray-200">
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 font-serif text-sm text-gray-800">
                    <p className="text-center font-bold mb-6 text-base">Application under Section 6(1) of the RTI Act, 2005</p>
                    <p>To,<br/>{rtiData.pio_designation}<br/>{rtiData.pio_department}<br/>{rtiData.pio_address}</p>
                    <p className="mt-6">1. Name of Applicant: {rtiData.applicant_name}<br/>2. Email: {rtiData.applicant_email}</p>
                    <p className="mt-6 font-bold underline">Subject: {rtiData.subject}</p>
                    <p className="mt-4 mb-2">Please provide the following information:</p>
                    <ul className="list-decimal pl-5 space-y-2">
                      {rtiData.information_requested.map((req: string, idx: number) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                    <p className="mt-8 italic text-gray-500">*This is a preview. The PDF will be fully formatted.*</p>
                  </div>
                </div>
                
                {/* Download Actions */}
                <div className="w-full md:w-1/3 p-6 flex flex-col justify-center items-center bg-white">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900">Your RTI is Ready</h3>
                    <p className="text-gray-600 text-sm mt-2">We have drafted the precise clauses needed to get your information.</p>
                  </div>
                  
                  <button 
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                  </button>
                  <button onClick={() => setStep(3)} className="text-gray-500 text-sm hover:underline">Back to Recommendation</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
