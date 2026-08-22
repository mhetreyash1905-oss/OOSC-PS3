'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated, getUserEmail, logout } from '@/lib/auth';
import { useTheme } from '@/lib/theme';

import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setEmail(getUserEmail());
  }, [pathname]);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fbfcf9]/95 dark:bg-[#1a1919]/95 backdrop-blur border-b border-[#dce3df] dark:border-[#333] shadow-[0_4px_20px_rgba(24,37,43,0.05)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg className="w-8 h-8 text-[#0e6670] dark:text-[#78c4c2] transition-transform group-hover:-rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11V7a4 4 0 018 0v4m0 4.5c.01.2.02.4.02.61m-6.6-4.5c-.244.2-.472.417-.687.649m4.936-2.27c.45-.632.78-1.353 1.05-2.126m0 0C15.82 8.784 16 7.915 16 7m0 0c0-1.871-.655-3.59-1.75-4.94M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
              </svg>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-[#0e6670] dark:text-[#78c4c2]">Civic Rights Navigator</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:items-center md:gap-2">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${pathname === '/' ? 'text-[#0e6670] bg-[#dcefeb]' : 'text-gray-600 dark:text-gray-300 hover:text-[#0e6670] hover:bg-[#eef4f1]'}`}>Home</Link>
              <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${pathname === '/about' ? 'text-[#0e6670] bg-[#dcefeb]' : 'text-gray-600 dark:text-gray-300 hover:text-[#0e6670] hover:bg-[#eef4f1]'}`}>About</Link>
              {isAuth && (
                <Link href="/platform" className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${pathname === '/platform' ? 'text-[#0e6670] bg-[#dcefeb]' : 'text-gray-600 dark:text-gray-300 hover:text-[#0e6670] hover:bg-[#eef4f1]'}`}>Platform</Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
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
              <>
                <div className="relative group">
                  <button className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {email ? email.charAt(0).toUpperCase() : 'U'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2d2a2a] rounded-md shadow-lg border border-gray-100 dark:border-[#444] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-[#444]">
                      <p className="text-sm leading-5 text-gray-900 dark:text-gray-200 font-medium truncate">{email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#eef4f1] dark:hover:bg-[#3d3a3a]">Settings</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#3d3a3a]">Logout</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 font-medium px-3 py-2">Login</Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden gap-2">
            {/* Mobile Theme Toggle */}
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
        <div className="md:hidden bg-white dark:bg-[#1a1919]">
          <div className="pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">About</Link>
            {isAuth && (
                <Link href="/platform" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">Platform</Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-[#333]">
            {isAuth ? (
              <div className="px-5 space-y-3">
                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{email}</div>
                <Link href="/settings" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">Logout</button>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-[#2d2a2a]">Login</Link>
                <Link href="/register" className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
