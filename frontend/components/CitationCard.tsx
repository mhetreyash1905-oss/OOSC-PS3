'use client';
import { useState } from 'react';

interface CitationCardProps {
  id: number;
  document: string;
  section: string;
  snippet: string;
  fullText?: string;
}

export default function CitationCard({ id, document, section, snippet, fullText }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
            Source {id}
          </span>
          <h4 className="font-semibold text-gray-800 text-sm">
            {document} - {section}
          </h4>
        </div>
        {fullText && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-xs hover:underline focus:outline-none"
          >
            {isExpanded ? 'Hide Full Text' : 'View Full Text'}
          </button>
        )}
      </div>
      
      <div className="text-gray-600 text-sm italic border-l-4 border-blue-300 pl-3 py-1 bg-blue-50/50">
        "{snippet}"
      </div>
      
      {isExpanded && fullText && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 whitespace-pre-line">
          <strong>Full Legal Text:</strong>
          <p className="mt-1">{fullText}</p>
        </div>
      )}
    </div>
  );
}
