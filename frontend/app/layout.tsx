import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ConditionalFooter from '@/components/ConditionalFooter';
import LoadingScreen from '@/components/LoadingScreen';
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
        <LoadingScreen />
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <ConditionalFooter />
          </AuthProvider>
        </ThemeProvider>
        
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `
        }} />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </body>
    </html>
  );
}
