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
  const { theme, toggleTheme } = useTheme();

  const isAuth = user !== null;
  const email = user?.email ?? null;

  const handleLogout = () => { logout(); };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/action-plan', label: 'Action Plan' },
    { href: '/application-generator', label: 'Application Generator' },
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
    <nav className="sticky top-0 z-50 bg-[#fbfcf9]/95 dark:bg-[#1a1919]/95 backdrop-blur border-b border-[#dce3df] dark:border-[#333] shadow-[0_4px_20px_rgba(24,37,43,0.05)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#0e6670] dark:bg-[#78c4c2] text-white dark:text-[#102a2e] flex items-center justify-center font-bold text-base shadow-sm transition-transform group-hover:scale-105">
                ⚖️
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#0e6670] dark:text-[#78c4c2]">CivicSaathi</span>
            </Link>

            <div className="hidden lg:ml-8 lg:flex lg:items-center lg:gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#0e6670] bg-[#dcefeb] dark:text-[#78c4c2] dark:bg-[#2c3d3e]'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#0e6670] hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a]'
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
                  className="px-3 py-2 rounded-lg text-xs xl:text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#0e6670] hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a] flex items-center gap-1"
                >
                  <span>More Tools</span>
                  <span className="text-xs">▾</span>
                </button>
                <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-[#201e1e] rounded-2xl shadow-xl border border-gray-100 dark:border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  {toolLinks.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="block p-2.5 rounded-xl hover:bg-blue-50/60 dark:hover:bg-[#2d2a2a] transition-colors"
                    >
                      <div className="text-xs font-bold text-gray-900 dark:text-white">{t.label}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>

              {isAuth && (
                <Link
                  href="/platform"
                  className={`ml-2 px-3.5 py-2 rounded-lg text-xs xl:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    pathname === '/platform'
                      ? 'text-white bg-[#0e6670] shadow-sm'
                      : 'text-[#0e6670] dark:text-[#e7b85b] bg-[#e7f4f1] dark:bg-[#2d2a2a] hover:bg-[#0e6670] hover:text-white'
                  }`}
                >
                  <span>🤖</span>
                  <span>AI Assistant</span>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-[#eef4f1] dark:hover:bg-[#2d2a2a] transition-colors"
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
                <button className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {email ? email.charAt(0).toUpperCase() : 'U'}
                </button>
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#2d2a2a] rounded-xl shadow-lg border border-gray-100 dark:border-[#444] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-[#444]">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Signed In</p>
                    <p className="text-sm leading-5 text-gray-900 dark:text-gray-200 font-medium truncate">{email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/platform" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">AI Civic Assistant</Link>
                    <Link href="/cases" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">My Cases</Link>
                    <Link href="/saved-documents" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">Saved Documents</Link>
                    <Link href="/applications" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">Applications</Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3d3a3a]">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-semibold px-3 py-2">Login</Link>
                <Link href="/register" className="bg-[#0e6670] hover:bg-[#094d54] dark:bg-[#78c4c2] dark:hover:bg-[#68b3b1] dark:text-[#102a2e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile header controls */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2a2a]"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2d2a2a] focus:outline-none"
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
        <div className="lg:hidden bg-white dark:bg-[#1a1919] border-t border-gray-200 dark:border-[#333] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]"
            >
              {link.label}
            </Link>
          ))}
          {toolLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2a2a]"
            >
              {tool.label}
            </Link>
          ))}
          {isAuth && (
            <Link
              href="/platform"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-bold text-[#0e6670] dark:text-[#e7b85b] bg-[#eef4f1] dark:bg-[#2d2a2a]"
            >
              🤖 AI Civic Assistant
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
