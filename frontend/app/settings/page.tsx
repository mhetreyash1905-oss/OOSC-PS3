'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/theme';
import { apiFetch } from '@/lib/api';
import {
  User,
  Settings,
  Palette,
  Shield,
  Bell,
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Trash2,
  Save,
  CreditCard,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Globe,
  AlertTriangle,
  Check,
  Menu,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabId = 'general' | 'account' | 'appearance' | 'security' | 'notifications' | 'privacy';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Navigation items                                                   */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  { id: 'general',       label: 'General',       icon: Settings, description: 'Basic profile information' },
  { id: 'account',       label: 'Account',       icon: User,     description: 'Plan, password & danger zone' },
  { id: 'appearance',    label: 'Appearance',     icon: Palette,  description: 'Theme & accent colors' },
  { id: 'security',      label: 'Security',       icon: Shield,   description: '2FA & session history' },
  { id: 'notifications', label: 'Notifications',  icon: Bell,     description: 'Email & push preferences' },
  { id: 'privacy',       label: 'Privacy',        icon: Lock,     description: 'Visibility & data controls' },
];

/* ------------------------------------------------------------------ */
/*  Reusable small components                                          */
/* ------------------------------------------------------------------ */

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
      {children}
    </label>
  );
}

function Input({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 outline-none transition-all duration-200"
    />
  );
}

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger:  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab panels                                                         */
/* ------------------------------------------------------------------ */

function GeneralTab() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [gender, setGender]       = useState('prefer-not-to-say');
  const [bio, setBio]             = useState('Full-stack developer passionate about civic tech and open-source projects.');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch<any>('/auth/me');
        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || '');
          setGender(data.gender || 'prefer-not-to-say');
          setBio(data.bio || '');
          if (data.avatar) setAvatarPreview(data.avatar);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // Here you would also upload the file to your backend API
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await apiFetch('/auth/me', {
        method: 'PUT',
        body: {
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          bio: bio,
          avatar: avatarPreview
        }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <>
      <SectionHeading title="General" subtitle="Manage your personal information and public profile." />

      <Card>
        {/* Avatar upload */}
        <div className="flex items-center gap-5 mb-8">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              (firstName[0] || 'U') + (lastName[0] || '')
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Profile Photo</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2 MB.</p>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Change avatar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={setFirstName} placeholder="First name" />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={setLastName} placeholder="Last name" />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
            >
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself…"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 outline-none transition-all duration-200 resize-none"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-200 shadow-sm"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */

function AccountTab() {
  const [currentPassword, setCurrentPassword]  = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);

  return (
    <>
      <SectionHeading title="Account" subtitle="Manage your subscription, password, and account settings." />

      {/* Current Plan */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Current Plan</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="success">Free</Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">·  Basic features included</span>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-5 py-2.5 text-sm transition-colors duration-200">
            Upgrade to Pro
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Change Password</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPwd">Current Password</Label>
            <div className="relative">
              <Input id="currentPwd" type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="newPwd">New Password</Label>
              <div className="relative">
                <Input id="newPwd" type={showNew ? 'text' : 'password'} value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPwd">Confirm Password</Label>
              <div className="relative">
                <Input id="confirmPwd" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-200 shadow-sm">
            Update Password
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800/50">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-red-700 dark:text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Once you delete your account, all of your data will be permanently removed. This action cannot be undone.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium px-5 py-2.5 text-sm transition-colors duration-200 shadow-sm">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */

function AppearanceTab() {
  const { theme, toggleTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(theme === 'dark' ? 'dark' : 'light');
  const [accentColor, setAccentColor]     = useState('blue');

  const ACCENT_COLORS = [
    { name: 'Blue',    value: 'blue',    swatch: 'bg-blue-500' },
    { name: 'Purple',  value: 'purple',  swatch: 'bg-purple-500' },
    { name: 'Green',   value: 'green',   swatch: 'bg-green-500' },
    { name: 'Rose',    value: 'rose',    swatch: 'bg-rose-500' },
    { name: 'Amber',   value: 'amber',   swatch: 'bg-amber-500' },
    { name: 'Teal',    value: 'teal',    swatch: 'bg-teal-500' },
  ];

  const themes = [
    { id: 'light'  as const, label: 'Light',  icon: Sun,     desc: 'Clean & bright interface' },
    { id: 'dark'   as const, label: 'Dark',   icon: Moon,    desc: 'Easy on the eyes' },
    { id: 'system' as const, label: 'System', icon: Monitor, desc: 'Follow OS preference' },
  ];

  const handleThemeSelect = (id: 'light' | 'dark' | 'system') => {
    setSelectedTheme(id);
    if (id === 'light' && theme === 'dark') toggleTheme();
    if (id === 'dark' && theme === 'light') toggleTheme();
    if (id === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark && theme === 'light') toggleTheme();
      if (!prefersDark && theme === 'dark') toggleTheme();
    }
  };

  return (
    <>
      <SectionHeading title="Appearance" subtitle="Customize how the dashboard looks and feels." />

      {/* Theme Selector */}
      <Card className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Theme</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => {
            const active = selectedTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all duration-200 cursor-pointer ${
                  active
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50 hover:shadow-sm'
                }`}
              >
                {active && (
                  <span className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                )}
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${active ? 'bg-blue-100 dark:bg-blue-800/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <t.icon className={`h-6 w-6 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <div className="text-center">
                  <p className={`font-medium text-sm ${active ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>{t.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Accent Color */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Accent Color</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setAccentColor(c.value)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200 ${
                accentColor === c.value
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className={`h-5 w-5 rounded-full ${c.swatch} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${
                accentColor === c.value ? 'ring-blue-500' : 'ring-transparent'
              }`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.name}</span>
            </button>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false);

  const sessions = [
    { device: 'MacBook Pro',      icon: Laptop,     location: 'San Francisco, US', ip: '192.168.1.42',  date: 'Aug 21, 2026 — 10:32 AM', current: true },
    { device: 'iPhone 16 Pro',    icon: Smartphone, location: 'San Francisco, US', ip: '192.168.1.87',  date: 'Aug 20, 2026 — 08:15 PM', current: false },
    { device: 'Windows Desktop',  icon: Monitor,    location: 'New York, US',      ip: '203.0.113.55',  date: 'Aug 18, 2026 — 02:44 PM', current: false },
    { device: 'Chrome on Linux',  icon: Globe,      location: 'London, UK',        ip: '198.51.100.23', date: 'Aug 15, 2026 — 11:20 AM', current: false },
  ];

  return (
    <>
      <SectionHeading title="Security" subtitle="Protect your account with 2FA and monitor active sessions." />

      {/* Two-Factor Authentication */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${twoFA ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Shield className={`h-5 w-5 ${twoFA ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {twoFA ? 'Your account is secured with 2FA.' : 'Add an extra layer of security to your account.'}
              </p>
            </div>
          </div>
          <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} label="Toggle 2FA" />
        </div>
        {twoFA && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
            <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4" /> Two-factor authentication is enabled via authenticator app.
            </p>
          </div>
        )}
      </Card>

      {/* Recent Sessions */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Recent Sessions</h3>

        <div className="space-y-4">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {s.device}
                    {s.current && <Badge variant="success">Current</Badge>}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {s.location} · <span className="font-mono">{s.ip}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:ml-auto">
                <span className="text-xs text-gray-400 dark:text-gray-500">{s.date}</span>
                {!s.current && (
                  <button className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */

function NotificationsTab() {
  const [emailNotifs, setEmailNotifs]     = useState(true);
  const [pushNotifs, setPushNotifs]       = useState(false);
  const [weeklyDigest, setWeeklyDigest]   = useState(true);
  const [caseUpdates, setCaseUpdates]     = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [marketing, setMarketing]         = useState(false);

  const groups = [
    {
      title: 'Communication Channels',
      items: [
        { label: 'Email Notifications',   desc: 'Receive notifications via email.',             enabled: emailNotifs,     toggle: () => setEmailNotifs(!emailNotifs) },
        { label: 'Push Notifications',     desc: 'Receive push notifications on your devices.', enabled: pushNotifs,      toggle: () => setPushNotifs(!pushNotifs) },
      ],
    },
    {
      title: 'Notification Types',
      items: [
        { label: 'Weekly Digest',          desc: 'Summary of activity every Monday.',            enabled: weeklyDigest,    toggle: () => setWeeklyDigest(!weeklyDigest) },
        { label: 'Case Updates',           desc: 'Updates on cases you are following.',          enabled: caseUpdates,     toggle: () => setCaseUpdates(!caseUpdates) },
        { label: 'Security Alerts',        desc: 'Alerts for suspicious login activity.',        enabled: securityAlerts,  toggle: () => setSecurityAlerts(!securityAlerts) },
        { label: 'Marketing & Promotions', desc: 'Occasional product news and offers.',          enabled: marketing,       toggle: () => setMarketing(!marketing) },
      ],
    },
  ];

  return (
    <>
      <SectionHeading title="Notifications" subtitle="Choose what you want to be notified about." />

      {groups.map((g) => (
        <Card key={g.title} className="mb-6 last:mb-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">{g.title}</h3>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {g.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <Toggle enabled={item.enabled} onToggle={item.toggle} label={`Toggle ${item.label}`} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */

function PrivacyTab() {
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [activityStatus, setActivityStatus]       = useState(true);
  const [searchEngineIndex, setSearchEngineIndex] = useState(false);
  const [dataSharingConsent, setDataSharingConsent] = useState(false);

  return (
    <>
      <SectionHeading title="Privacy" subtitle="Control who can see your information and how your data is used." />

      {/* Profile Visibility */}
      <Card className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          {(['public', 'members', 'private'] as const).map((option) => {
            const labels = { public: 'Public', members: 'Members Only', private: 'Private' };
            const descs  = {
              public:  'Anyone on the internet can see your profile.',
              members: 'Only registered members can view your profile.',
              private: 'Only you can see your profile.',
            };
            return (
              <label
                key={option}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  profileVisibility === option
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={profileVisibility === option}
                  onChange={() => setProfileVisibility(option)}
                  className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{labels[option]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{descs[option]}</p>
                </div>
              </label>
            );
          })}
        </div>
      </Card>

      {/* Data & Privacy Toggles */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-5">Data & Privacy</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {[
            { label: 'Show Activity Status',          desc: 'Let others see when you are online.',                  enabled: activityStatus,     toggle: () => setActivityStatus(!activityStatus) },
            { label: 'Search Engine Indexing',         desc: 'Allow search engines to index your public profile.',   enabled: searchEngineIndex,  toggle: () => setSearchEngineIndex(!searchEngineIndex) },
            { label: 'Data Sharing for Improvements',  desc: 'Help us improve by sharing anonymous usage data.',    enabled: dataSharingConsent, toggle: () => setDataSharingConsent(!dataSharingConsent) },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <Toggle enabled={item.enabled} onToggle={item.toggle} label={`Toggle ${item.label}`} />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Download My Data
          </button>
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function SettingsPage() {
  const [activeTab, setActiveTab]       = useState<TabId>('general');
  const [sidebarOpen, setSidebarOpen]   = useState(false);

  const tabPanels: Record<TabId, React.ReactNode> = {
    general:       <GeneralTab />,
    account:       <AccountTab />,
    appearance:    <AppearanceTab />,
    security:      <SecurityTab />,
    notifications: <NotificationsTab />,
    privacy:       <PrivacyTab />,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your account settings and preferences.
            </p>
          </div>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle navigation"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* =================== SIDEBAR =================== */}
          <aside
            className={`lg:block lg:w-64 shrink-0 ${sidebarOpen ? 'block' : 'hidden'}`}
          >
            <nav className="sticky top-8 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 space-y-1 shadow-sm">
              {NAV_ITEMS.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-3 text-left transition-all duration-200 group ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <item.icon
                      className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                        active
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="block text-sm leading-tight">{item.label}</span>
                      <span className={`block text-[11px] leading-tight mt-0.5 ${active ? 'text-blue-500/70 dark:text-blue-400/60' : 'text-gray-400 dark:text-gray-500'}`}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* =================== MAIN CONTENT =================== */}
          <main className="flex-1 min-w-0">
            {tabPanels[activeTab]}
          </main>
        </div>
      </div>
    </div>
  );
}
