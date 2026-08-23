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
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#121111]/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 shadow-sm transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e6670] to-[#124b55] text-white flex items-center justify-center font-bold text-base shadow-md transition-transform group-hover:scale-105">
                ⚖️
              </div>
              <span className="font-black text-xl tracking-tight text-[#0e6670] dark:text-white font-sans">CivicSaathi</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-[#0e6670] bg-[#0e6670]/10 dark:text-[#e7b85b] dark:bg-[#e7b85b]/10 font-extrabold'
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
                  className="px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#0e6670] dark:hover:text-white hover:bg-gray-100/60 dark:hover:bg-[#252323] flex items-center gap-1 transition-all whitespace-nowrap"
                >
                  <span>More Tools</span>
                  <span className="text-[10px] opacity-60">▼</span>
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-white/95 dark:bg-[#1d1b1b]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/70 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block p-2.5 rounded-xl hover:bg-blue-50/70 dark:hover:bg-[#2d2a2a] transition-colors"
                    >
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {isAuth && (
                <Link
                  href="/platform"
                  className="ml-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-white bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] whitespace-nowrap"
                >
                  <span>✨</span>
                  <span>AI Assistant</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Accessibility / Font Controls */}
            <div className="flex items-center bg-gray-100 dark:bg-[#222] p-1 rounded-xl border border-gray-200 dark:border-[#333] text-xs font-bold">
              <button
                onClick={() => changeFontSize('sm')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm font-extrabold' : 'text-gray-500'}`}
                title="Small Text Size"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize('base')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'base' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm font-extrabold' : 'text-gray-500'}`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('lg')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-white dark:bg-[#333] text-gray-900 dark:text-white shadow-sm font-extrabold' : 'text-gray-500'}`}
                title="Large Text Size"
              >
                A+
              </button>
            </div>

            {/* Translate Dropdown */}
            <div id="google_translate_element" className="shrink-0" />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-300 hover:text-[#0e6670] dark:hover:text-[#e7b85b] transition-colors border border-gray-200 dark:border-[#333]"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User Profile / Auth State */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/cases"
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#0e6670] to-[#124b55] text-white flex items-center justify-center font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
                  title={email || 'User Profile'}
                >
                  {email ? email.charAt(0).toUpperCase() : 'U'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252323] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#0e6670] to-[#124b55] hover:from-[#094d54] hover:to-[#0e3b43] shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-300"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252323]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#121111] border-b border-gray-200 dark:border-[#333] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#222]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-[#222] space-y-1">
            <span className="text-xs font-bold text-gray-400 px-3 block">Tools & Resources</span>
            {toolLinks.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#222]"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-[#222]">
            {isAuth ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400"
              >
                Sign Out ({email})
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-[#0e6670] text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
