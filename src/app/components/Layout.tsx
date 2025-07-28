// src/app/components/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white p-4 shadow-md"> {/* Used variables here */}
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-outfit font-semibold"> {/* Applied Outfit font */}
            <a href="/" className="hover:text-blue-200 transition-colors">
              ResumeFlow Pro 🚀
            </a>
          </h1>
          {/* Navigation / Auth Buttons - will add later */}
          <nav>
            {/* Placeholder for future links like Dashboard, Login/Signup */}
            {/* <a href="/dashboard" className="mr-4 hover:text-blue-200">Dashboard</a> */}
            {/* <a href="/login" className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-600">Login</a> */}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      {/* Removed the background here, as it's set on the <html> in globals.css */}
      <main className="flex-grow container mx-auto p-4 lg:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm mt-8">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} ResumeFlow Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}