'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logout } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/components/AuthProvider';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { theme, toggleTheme, fontSize, changeFontSize } = useTheme();

  const isAuth = user !== null;
  const email = user?.email ?? null;

  const handleLogout = () => { logout(); };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/action-plan', label: 'Action Plan' },
    { href: '/application-generator', label: 'App Generator' },
    { href: '/rights-navigator', label: 'Rights Navigator' },
    { href: '/about', label: 'About' },
  ];

  const toolLinks = [
    { href: '/document-analyzer', label: '🔍 Document Analyzer', desc: 'AI Risk & Clause Extraction' },
    { href: '/scheme-eligibility', label: '📋 Scheme Eligibility', desc: 'Check PMAY, Ayushman & RTI' },
    { href: '/authority-finder', label: '🏛️ Authority Finder', desc: 'Locate PIO & Ward Officers' },
    { href: '/rti-guide', label: '📜 RTI Guide', desc: 'Section 6(1) Citizen Manual' },
    { href: '/resources', label: '📚 Civic Resources', desc: 'Templates & Manuals' },
    { href: '/faq', label: '❓ FAQ', desc: 'Frequently Asked Questions' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#121111]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e6670] to-[#124b55] dark:from-[#78c4c2] dark:to-[#4aa3a1] text-white dark:text-[#102a2e] flex items-center justify-center font-bold text-base shadow-md transition-transform group-hover:scale-105">
                ⚖️
              </div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#0e6670] dark:text-[#78c4c2] font-sans">CivicSaathi</span>
            </Link>

            <div className="hidden lg:ml-6 lg:flex lg:items-center lg:gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-[#0e6670] bg-[#eef4f1] dark:text-[#e7b85b] dark:bg-[#252323] shadow-sm font-bold border border-[#0e6670]/20 dark:border-[#e7b85b]/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#0e6670] dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#252323]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Tools Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="px-3 py-2 rounded-xl text-xs xl:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#0e6670] dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#252323] flex items-center gap-1 transition-all"
                >
                  <span>More Tools</span>
                  <span className="text-[10px] opacity-60">▼</span>
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-white/95 dark:bg-[#1d1b1b]/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/70 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-[#2d2a2a] transition-colors"
                    >
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {isAuth && (
                <Link
                  href="/platform"
                  className={`ml-2 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                    pathname === '/platform'
                      ? 'text-white bg-gradient-to-r from-[#0e6670] to-[#124b55]'
                      : 'text-[#0e6670] dark:text-[#e7b85b] bg-[#eef4f1] dark:bg-[#252323] hover:bg-[#0e6670] hover:text-white border border-[#0e6670]/20 dark:border-[#e7b85b]/30'
                  }`}
                >
                  <span className="animate-pulse">✨</span>
                  <span>AI Assistant</span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {/* Accessibility / Font Controls */}
            <div className="flex items-center bg-gray-100 dark:bg-[#222] p-1 rounded-xl border border-gray-200 dark:border-[#333] text-xs font-bold">
              <button
                onClick={() => changeFontSize('sm')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                title="Small Text Size"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize('base')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'base' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('lg')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
                title="Large Text Size"
              >
                A+
              </button>
            </div>

            {/* Translate Dropdown */}
            <div id="google_translate_element" className="h-9 flex items-center"></div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252323] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#333]"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>

            {isAuth ? (
              <div className="relative group">
                <button className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#0e6670] to-[#124b55] text-white rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6670] shadow-sm">
                  {email ? email.charAt(0).toUpperCase() : 'U'}
                </button>
                <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-[#1d1b1b]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#333]">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Citizen Account</p>
                    <p className="text-sm leading-5 text-gray-900 dark:text-gray-200 font-semibold truncate">{email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/platform" className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]">✨ AI Assistant</Link>
                    <Link href="/cases" className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]">🗂️ My Cases</Link>
                    <Link href="/saved-documents" className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]">📁 Saved Documents</Link>
                    <Link href="/applications" className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]">📋 Applications</Link>
                    <Link href="/settings" className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]">⚙️ Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40">🚪 Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-[#0e6670] dark:hover:text-[#e7b85b] px-3 py-2">Login</Link>
                <Link href="/register" className="bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile header controls */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252323]"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#252323] focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-[#121111]/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252323]"
            >
              {link.label}
            </Link>
          ))}
          {toolLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252323]"
            >
              {tool.label}
            </Link>
          ))}
          {isAuth && (
            <Link
              href="/platform"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-extrabold text-white bg-gradient-to-r from-[#0e6670] to-[#124b55]"
            >
              ✨ AI Civic Assistant
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
