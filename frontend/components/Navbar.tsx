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
    <nav className="sticky top-0 z-50 bg-[#14505b]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-lg transition-colors duration-200">
      {/* Background Radial Dotted Grid Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e7b85b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#e7b85b] text-[#102a2e] flex items-center justify-center font-bold text-base shadow-md transition-transform group-hover:scale-105">
                ⚖️
              </div>
              <span className="font-black text-xl tracking-tight text-white font-sans">CivicSaathi</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-[#e7b85b] bg-white/10 border border-[#e7b85b]/40 shadow-sm font-extrabold'
                        : 'text-[#d4eae6] hover:text-white hover:bg-white/10'
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
                  className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-extrabold text-[#d4eae6] hover:text-white hover:bg-white/10 flex items-center gap-1 transition-all whitespace-nowrap"
                >
                  <span>More Tools</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-[#14505b]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block p-2.5 rounded-xl hover:bg-white/15 transition-colors"
                    >
                      <div className="text-xs font-bold text-white">{t.label}</div>
                      <div className="text-[10px] text-[#d4eae6] mt-0.5 font-medium">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {isAuth && (
                <Link
                  href="/platform"
                  className={`ml-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-black transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap ${
                    pathname === '/platform'
                      ? 'bg-gradient-to-r from-[#e7b85b] to-[#f3ca76] text-[#102a2e]'
                      : 'bg-white/10 hover:bg-white/20 text-[#e7b85b] border border-[#e7b85b]/40'
                  }`}
                >
                  <span className="animate-pulse">✨</span>
                  <span>AI Assistant</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Accessibility / Font Controls */}
            <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs font-bold">
              <button
                onClick={() => changeFontSize('sm')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'sm' ? 'bg-[#e7b85b] text-[#102a2e] font-black' : 'text-[#d4eae6] hover:text-white'}`}
                title="Small Text Size"
              >
                A-
              </button>
              <button
                onClick={() => changeFontSize('base')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'base' ? 'bg-[#e7b85b] text-[#102a2e] font-black' : 'text-[#d4eae6] hover:text-white'}`}
                title="Normal Text Size"
              >
                A
              </button>
              <button
                onClick={() => changeFontSize('lg')}
                className={`px-2 py-1 rounded-lg transition-colors ${fontSize === 'lg' ? 'bg-[#e7b85b] text-[#102a2e] font-black' : 'text-[#d4eae6] hover:text-white'}`}
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
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User Profile / Auth State */}
            {isAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/cases"
                  className="w-9 h-9 rounded-full bg-[#e7b85b] text-[#102a2e] flex items-center justify-center font-black text-sm shadow-md hover:scale-105 transition-transform"
                  title={email || 'User Profile'}
                >
                  {email ? email.charAt(0).toUpperCase() : 'U'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-extrabold text-rose-300 hover:text-rose-100 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-black text-[#102a2e] bg-[#e7b85b] hover:bg-[#f3ca76] shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/10 text-white border border-white/20"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10"
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
        <div className="lg:hidden bg-[#14505b] border-b border-white/20 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-white hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <span className="text-xs font-bold text-[#e7b85b] px-3 block">Tools & Resources</span>
            {toolLinks.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-medium text-[#d4eae6] hover:bg-white/10"
              >
                {t.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10">
            {isAuth ? (
              <button
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-rose-300"
              >
                Sign Out ({email})
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-white/10 text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-[#e7b85b] text-[#102a2e]"
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
