// src/app/layout.tsx
import './globals.css';
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'ResumeCraft - Build Your Professional Resume',
  description: 'Our intuitive resume builder helps you create a professional resume that highlights your skills and experience, landing you the job you deserve.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add data-scroll-behavior="smooth" here
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}