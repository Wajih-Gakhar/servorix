import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://servorix.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Servorix - Ultimate Business & Appointment SaaS',
    template: '%s | Servorix',
  },
  description:
    'Supercharge your business with Servorix. Real-time appointment booking, automated scheduling, customer retention, and AI-powered intelligence.',
  keywords: [
    'Servorix',
    'Appointment Booking',
    'SaaS',
    'Salon Booking',
    'Gym Scheduling',
    'Business Management',
    'AI Concierge',
    'Automated Booking',
  ],
  authors: [{ name: 'Muhammad Wajih Ul Hassan', url: 'https://servorix.com' }],
  creator: 'Muhammad Wajih Ul Hassan',
  applicationName: 'Servorix',
  icons: {
    icon: '/servorixIcon.svg',
    shortcut: '/servorixIcon.svg',
    apple: '/servorixIcon.svg',
  },
  openGraph: {
    title: 'Servorix - Ultimate Business & Appointment SaaS',
    description:
      'Supercharge your business with Servorix. Real-time appointment booking, automated scheduling, customer retention, and AI-powered intelligence.',
    siteName: 'Servorix',
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    images: [
      {
        url: '/servorixLogoAnimated.svg',
        width: 1200,
        height: 630,
        alt: 'Servorix SaaS Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servorix - Ultimate Business & Appointment SaaS',
    description:
      'Supercharge your business with Servorix. Real-time appointment booking, automated scheduling, customer retention, and AI-powered intelligence.',
    images: ['/servorixLogoAnimated.svg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar session={session} />
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
