'use client';
import CitationCard from './CitationCard';
import React from 'react';

interface Citation {
  id: number;
  document: string;
  section: string;
  text: string;
  full_chunk_text?: string;
}

interface RightsExplanationProps {
  explanation: string;
  citations: Citation[];
  confidence: string;
  contradictionWarning?: string;
}

export default function RightsExplanation({ explanation, citations, confidence, contradictionWarning }: RightsExplanationProps) {
  
  // A helper to render the explanation text, replacing "[Source: X]" with styled tags
  const renderExplanationWithCitations = (text: string) => {
    // Split text by the exact [Source: X] pattern
    const regex = /\[Source:\s*(\d+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add the text before the citation
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      
      // Add the styled citation bubble
      const sourceId = match[1];
      parts.push(
        <span key={`cite-${match.index}`} className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-[10px] font-bold h-4 min-w-4 px-1 rounded mx-1 align-middle relative -top-1">
          {sourceId}
        </span>
      );
      
      lastIndex = regex.lastIndex;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {confidence === 'low' && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Limited Coverage</h3>
              <p className="text-sm text-amber-700 mt-1">
                The provided legal knowledge base may not fully cover your specific situation. 
                The explanation below is based on the closest available provisions.
              </p>
            </div>
          </div>
        </div>
      )}

      {contradictionWarning && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 mb-4">
          <div className="flex">
            <div className="text-rose-500 font-bold text-xl">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-rose-800">Conflicting Laws Detected</h3>
              <p className="text-sm text-rose-700 mt-1 font-medium">
                {contradictionWarning}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Column: Explanation */}
        <div className="w-full md:w-3/5">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Legal Rights</h2>
          <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {renderExplanationWithCitations(explanation)}
          </div>
        </div>

        {/* Right Column: Citations */}
        <div className="w-full md:w-2/5 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 Legal Sources
          </h3>
          <div className="space-y-4">
            {citations.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No specific legal sources were cited.</p>
            ) : (
              citations.map((cite) => (
                <CitationCard
                  key={cite.id}
                  id={cite.id}
                  document={cite.document}
                  section={cite.section}
                  snippet={cite.text}
                  fullText={cite.full_chunk_text}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
