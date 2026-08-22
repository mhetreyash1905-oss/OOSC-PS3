import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'CivicSaathi — AI Civic & Legal Rights Navigator',
  description: 'Understand your rights under Indian law. File RTIs, resolve tenancy disputes, and address municipal service grievances with AI-powered assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#fbfcf9] dark:bg-[#1a1919] text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
