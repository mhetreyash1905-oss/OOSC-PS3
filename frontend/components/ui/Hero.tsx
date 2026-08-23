'use client';

import React from 'react';

export interface HeroProps {
  badgeText: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function Hero({ badgeText, title, description, children }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#14505b] text-white py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl shadow-[#14505b]/30 border-b border-white/10">
      {/* Background Dotted Radial Grid */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10 space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e7b85b] text-xs font-extrabold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>{badgeText}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
          {title}
        </h1>

        <p className="text-sm sm:text-base text-[#d4eae6] max-w-2xl mx-auto font-medium leading-relaxed">
          {description}
        </p>

        {children && <div className="pt-2 flex flex-wrap items-center justify-center gap-4">{children}</div>}
      </div>
    </section>
  );
}

export default Hero;
