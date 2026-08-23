'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = true }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1d1b1b] rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-[#333] shadow-md ${
        hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
