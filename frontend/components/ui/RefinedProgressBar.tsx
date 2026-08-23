'use client';

import React from 'react';

export interface RefinedProgressBarProps {
  completed: number;
  total: number;
}

export function RefinedProgressBar({ completed, total }: RefinedProgressBarProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
        <span>Progress: {completed} of {total} Milestones Cleared</span>
        <span className="font-mono text-[#0e6670] dark:text-[#e7b85b] font-extrabold">{percent}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200/80 dark:bg-white/10 rounded-full overflow-hidden p-0.5 backdrop-blur-md">
        <div
          className="h-full bg-gradient-to-r from-[#0e6670] via-[#124b55] to-[#e7b85b] rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default RefinedProgressBar;
