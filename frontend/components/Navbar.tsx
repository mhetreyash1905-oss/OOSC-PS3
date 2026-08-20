'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated, getUserEmail, logout } from '@/lib/auth';

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
    setEmail(getUserEmail());
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11V7a4 4 0 018 0v4m0 4.5c.01.2.02.4.02.61m-6.6-4.5c-.244.2-.472.417-.687.649m4.936-2.27c.45-.632.78-1.353 1.05-2.126m0 0C15.82 8.784 16 7.915 16 7m0 0c0-1.871-.655-3.59-1.75-4.94M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
              </svg>
              <span className="font-bold text-xl text-blue-700">Civic Rights Navigator</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">About</Link>
              {isAuth && (
                <Link href="/platform" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">Platform</Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <>
                <span className="text-sm text-gray-600">{email}</span>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 border rounded-md border-gray-300">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-700 hover:text-blue-700 font-medium px-3 py-2">Login</Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
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
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</Link>
            {isAuth && (
                <Link href="/platform" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Platform</Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuth ? (
              <div className="px-5 space-y-3">
                <div className="text-base font-medium text-gray-800">{email}</div>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50">Logout</button>
              </div>
            ) : (
              <div className="px-5 space-y-3">
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Login</Link>
                <Link href="/register" className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
