import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'Civic Rights Navigator',
  description: 'Understand your rights. Take action.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
