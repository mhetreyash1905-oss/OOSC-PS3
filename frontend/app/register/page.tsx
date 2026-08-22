'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerWithEmail, loginWithGoogle } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('prefer-not-to-say');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect already-authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push('/platform');
    }
  }, [loading, user, router]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function mapFirebaseError(code: string, message?: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked by your browser. Please allow popups for this site.';
      default:
        return message || 'Registration failed. Please try again.';
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError('Please fill in all fields'); return;
    }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    setSubmitting(true);
    setError('');
    try {
      // Step 1 — Firebase creates the account
      await registerWithEmail(email, password);

      // Step 2 — save profile to MongoDB (apiFetch auto-attaches Firebase ID token)
      await apiFetch('/auth/register', {
        method: 'POST',
        body: { first_name: firstName, last_name: lastName, gender },
      });

      router.push('/platform');
    } catch (err: unknown) {
      const fe = err as { code?: string; message?: string };
      setError(mapFirebaseError(fe.code || '', fe.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const user = await loginWithGoogle();

      // Parse Google display name into first / last
      const parts = (user.displayName || '').trim().split(' ');
      const first_name = parts[0] || undefined;
      const last_name = parts.slice(1).join(' ') || undefined;

      // Create (or return existing) MongoDB profile
      await apiFetch('/auth/register', {
        method: 'POST',
        body: { first_name, last_name },
      });

      router.push('/platform');
    } catch (err: unknown) {
      const fe = err as { code?: string; message?: string };
      setError(mapFirebaseError(fe.code || '', fe.message));
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-[#0e6670] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#1e1e1e] p-10 rounded-xl shadow-lg border border-gray-100 dark:border-[#333]">
        {/* Header */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join Civic Rights Navigator today
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading || submitting}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-[#444] rounded-lg bg-white dark:bg-[#2d2a2a] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3d3a3a] font-medium text-sm transition-colors disabled:opacity-60"
        >
          {googleLoading ? (
            <div className="h-5 w-5 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Creating account...' : 'Sign up with Google'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-[#444]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-[#1e1e1e] text-gray-500 dark:text-gray-400">or sign up with email</span>
          </div>
        </div>

        {/* Email form */}
        <form className="space-y-4" onSubmit={handleEmailRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-field"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="gender" className="sr-only">Gender</label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-field bg-white dark:bg-[#2d2a2a]"
            >
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password (min 6 characters)"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm Password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting || googleLoading}
            className="w-full flex justify-center btn-primary disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
