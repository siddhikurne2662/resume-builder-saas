// src/app/components/Header.tsx
'use client'; // Client component for interactivity

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link
import { Download, LayoutTemplate, User, Menu, X, ZoomIn, ZoomOut } from 'lucide-react'; // Icons

interface HeaderProps {
  onDownloadPdf: () => void;
  onSelectTemplate: (template: string) => void;
  onZoomChange: (scale: number) => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
  activeTemplate: string;
}

export default function Header({
  onDownloadPdf,
  onSelectTemplate,
  onZoomChange,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  activeTemplate,
}: HeaderProps) {
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // For future auth
  const [currentZoom, setCurrentZoom] = useState(100);

  const templates = [
    { name: 'Modern Minimal', value: 'modern-minimal' },
    { name: 'Classic Professional', value: 'classic-pro' },
    { name: 'Creative Bold', value: 'creative-bold' },
  ];

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 10, 150));
    onZoomChange(Math.min(currentZoom + 10, 150) / 100);
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 10, 50));
    onZoomChange(Math.max(currentZoom - 10, 50) / 100);
  };

  const handleResetZoom = () => {
    setCurrentZoom(100);
    onZoomChange(1);
  };

  return (
    <header className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white p-4 shadow-lg z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-outfit font-semibold">
          <Link href="/" className="hover:text-blue-200 transition-colors"> {/* Use Link here */}
            ResumeFlow Pro 🚀
          </Link>
        </h1>

        {/* Desktop Navigation / Actions */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Template Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
              className="flex items-center px-4 py-2 bg-blue-700 bg-opacity-50 rounded-md hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <LayoutTemplate className="mr-2 h-5 w-5" />
              Templates ({templates.find(t => t.value === activeTemplate)?.name || 'Select'})
            </button>
            {isTemplateDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => {
                      onSelectTemplate(template.value);
                      setIsTemplateDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${activeTemplate === template.value ? 'bg-blue-100 font-medium' : ''}`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2 bg-blue-700 bg-opacity-50 rounded-md p-1">
            <button onClick={handleZoomOut} className="p-1 rounded-md hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium">{currentZoom}%</span>
            <button onClick={handleZoomIn} className="p-1 rounded-md hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
              <ZoomIn className="h-5 w-5" />
            </button>
            <button onClick={handleResetZoom} className="text-sm px-2 py-1 rounded-md hover:bg-opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300">
              Reset
            </button>
          </div>


          {/* Download Button */}
          <button
            onClick={onDownloadPdf}
            className="btn-secondary !bg-white !text-[var(--color-primary-dark)] hover:!bg-gray-100 flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </button>

          {/* User Avatar/Profile (Placeholder for Auth) */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              U
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 text-red-600">Logout</a>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={onToggleMobileSidebar}
            className="p-2 rounded-md hover:bg-blue-700 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}