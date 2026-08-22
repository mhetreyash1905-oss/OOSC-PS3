"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on the AI assistant page and its sub-routes
  if (pathname?.startsWith('/platform')) {
    return null;
  }
  
  return <Footer />;
}
