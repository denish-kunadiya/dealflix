import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ui/toastify/toast-provider';

import { cn } from '@/utils/cn';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PDC',
  description: 'Property Data Collector',
  icons: {
    icon: '/images/logo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
      suppressHydrationWarning
    >
      <body
        className={cn(
          'bg-background h-full min-h-screen bg-slate-50 font-sans text-slate-900 antialiased',
          fontSans.variable,
        )}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
