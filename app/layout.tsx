import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Talons Agent',
  description: 'AI-powered crypto market analysis dashboard built with Next.js and OpenAI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-hero-grid">
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </div>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
