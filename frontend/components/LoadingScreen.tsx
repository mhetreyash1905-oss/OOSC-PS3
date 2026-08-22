'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    let current = 1;
    // Total duration ~3.8 seconds for smooth 1% to 100% progression
    const totalSteps = 99;
    const intervalTime = 38; // 38ms * 100 steps ≈ 3.8 seconds

    const timer = setInterval(() => {
      current += 1;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(timer);

        // When reaching 100%, hold briefly then open the website with a smooth fade
        setTimeout(() => {
          setIsFading(true);
        }, 300);

        // Complete transition and hide loading screen
        setTimeout(() => {
          setIsVisible(false);
        }, 800);
      } else {
        setProgress(current);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#3b82f6] text-black transition-opacity duration-500 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-6xl px-6 sm:px-12 md:px-16 flex flex-col justify-center">
        {/* Top Percentage & Line Container */}
        <div className="w-full relative mb-4">
          <div className="flex justify-end mb-2">
            <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tighter text-black font-mono">
              {progress}%
            </span>
          </div>

          {/* Line Track */}
          <div className="w-full h-[4px] bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Large Bold Brand Title */}
        <div className="w-full">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tighter text-black leading-none select-none font-sans">
            CIVIC SAATHI
          </h1>
        </div>
      </div>
    </div>
  );
}
