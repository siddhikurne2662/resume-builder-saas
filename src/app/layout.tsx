// src/app/layout.tsx
import './globals.css';
import { Outfit, Inter } from 'next/font/google'; // Keep the fonts

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
  title: 'ResumeCraft - Build Your Professional Resume', // Updated title
  description: 'Our intuitive resume builder helps you create a professional resume that highlights your skills and experience, landing you the job you deserve.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Apply the font variables globally
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      {/* Set the default font for the body here based on the landing page's primary font */}
      <body className="font-inter antialiased"> {/* No text-gray-800 or bg-color here, as Stitch HTML controls it */}
        {children}
      </body>
    </html>
  );
}