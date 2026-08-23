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
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English (EN)');
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

  const languages = [
    { code: 'en', name: 'English (EN)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'hinglish', name: 'Hinglish' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0f2b2a]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-md transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Geometry Container */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#e7b85b] text-[#0f2b2a] flex items-center justify-center font-black text-lg shadow-md transition-transform group-hover:scale-105">
                ⚖️
              </div>
              <span className="font-black text-xl tracking-tight text-white font-sans">CivicSaathi</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-white font-bold bg-white/5 after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-[2px] after:bg-[#e7b85b] after:rounded-full'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
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
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <span>More Tools</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-[#0f2b2a]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block p-2.5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[10px] text-white/70 mt-0.5 font-medium">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {isAuth && (
                <Link
                  href="/platform"
                  className={`ml-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap ${
                    pathname === '/platform'
                      ? 'bg-[#e7b85b] text-[#0f2b2a]'
                      : 'bg-gradient-to-r from-[#e7b85b] to-[#f3ca76] text-[#0f2b2a] hover:brightness-105'
                  }`}
                >
                  <span className="animate-pulse">✨</span>
                  <span>AI Assistant</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Utility Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Accessibility Font Resizer Pill Container */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-bold gap-0.5">
              <button
                onClick={() => changeFontSize('sm')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-[#e7b85b] text-[#0f2b2a] font-black shadow-xs' : 'text-white/70 hover:text-white'}`}
                title="Small Font Size"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize('base')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${fontSize === 'base' ? 'bg-[#e7b85b] text-[#0f2b2a] font-black shadow-xs' : 'text-white/70 hover:text-white'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('lg')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-[#e7b85b] text-[#0f2b2a] font-black shadow-xs' : 'text-white/70 hover:text-white'}`}
                title="Large Font Size"
              >
                A+
              </button>
            </div>

            {/* Custom Dark Language Popover Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-white hover:bg-white/15 transition-colors"
              >
                <span>🌐</span>
                <span>{selectedLang}</span>
                <span className="text-[10px] opacity-70">▼</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-[#0f2b2a] backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/15 p-1.5 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang.name);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Google Translate Hidden Target */}
            <div id="google_translate_element" className="hidden" />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User Avatar with Matching 40x40 Geometry */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/cases"
                  className="w-10 h-10 rounded-xl bg-[#e7b85b] text-[#0f2b2a] flex items-center justify-center font-black text-sm shadow-md hover:scale-105 transition-transform"
                  title={email || 'User Profile'}
                >
                  {email ? email.charAt(0).toUpperCase() : 'D'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-rose-300 hover:text-rose-100 px-2 py-1 rounded-lg hover:bg-rose-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-black text-[#0f2b2a] bg-[#e7b85b] hover:bg-[#f3ca76] shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu burger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 text-white border border-white/15"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white hover:bg-white/10"
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

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0f2b2a] border-b border-white/15 px-4 pt-2 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#e7b85b] px-3.5 block">More Tools</span>
            {toolLinks.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            {isAuth ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-300"
              >
                Sign Out ({email})
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold bg-white/10 text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-xs font-black bg-[#e7b85b] text-[#0f2b2a]"
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
