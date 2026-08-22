'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'sm' | 'base' | 'lg';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: FontSize;
  changeFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light', 
  toggleTheme: () => {},
  fontSize: 'base',
  changeFontSize: () => {}
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('base');

  useEffect(() => {
    const storedTheme = localStorage.getItem('crn_theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
    
    const storedFontSize = localStorage.getItem('crn_fontsize') as FontSize | null;
    if (storedFontSize) {
      setFontSize(storedFontSize);
      applyFontSize(storedFontSize);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('crn_theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const applyFontSize = (size: FontSize) => {
    // Tailwind uses rems globally. Modifying html font-size scales the entire UI.
    const root = document.documentElement;
    if (size === 'sm') root.style.fontSize = '14px';
    else if (size === 'lg') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  };

  const changeFontSize = (size: FontSize) => {
    setFontSize(size);
    localStorage.setItem('crn_fontsize', size);
    applyFontSize(size);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, fontSize, changeFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
