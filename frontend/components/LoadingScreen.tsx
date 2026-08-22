'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let current = 1;
    // Total duration ~1.8 - 2.0 seconds for smooth 1% to 100% progression
    const intervalTime = 18; // 18ms * 100 steps ≈ 1.8s

    const timer = setInterval(() => {
      current += 1;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(timer);

        // Hold briefly at 100% then fade out smoothly
        setTimeout(() => {
          setIsFading(true);
        }, 150);

        // Remove from DOM after fade animation completes
        setTimeout(() => {
          setIsVisible(false);
        }, 650);
      } else {
        setProgress(current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#14505b] text-white transition-opacity duration-500 ease-in-out bg-[radial-gradient(rgba(255,255,255,0.18)_1.5px,transparent_1.5px)] [background-size:32px_32px] ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-6xl px-6 sm:px-12 md:px-16 flex flex-col justify-center">
        {/* Top Percentage & Line Container */}
        <div className="w-full relative mb-4">
          <div className="flex justify-end mb-2">
            <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tighter text-[#e7b85b] font-mono">
              {progress}%
            </span>
          </div>

          {/* Line Track */}
          <div className="w-full h-[4px] bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e7b85b] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Large Bold Brand Title */}
        <div className="w-full">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter text-white leading-none select-none font-sans drop-shadow-sm">
            CIVIC SAATHI
          </h1>
        </div>
      </div>
    </div>
  );
}
