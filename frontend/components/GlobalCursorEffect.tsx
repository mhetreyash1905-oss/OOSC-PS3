'use client';

import { useState, useEffect } from 'react';
import CursorParticleCanvas from './CursorParticleCanvas';

export default function GlobalCursorEffect() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      if (!isHovered) setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <>
      {/* Particle Attraction Constellation Canvas */}
      <CursorParticleCanvas />

      {/* Interactive Cursor Spotlight Light Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(14, 102, 112, 0.18), rgba(231, 184, 91, 0.08), transparent 80%)`
        }}
      />
    </>
  );
}
