// src/app/components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, LayoutTemplate, Menu, X, ZoomIn, ZoomOut, UserCheck, Settings, Save } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { initializeFirebase, auth } from '@/lib/firebase';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onDownloadPdf?: () => void;
  onSelectTemplate?: (template: string) => void;
  onZoomChange?: (scale: number) => void;
  onToggleMobileSidebar?: () => void;
  onSaveResume?: () => void;
  isMobileSidebarOpen?: boolean;
  activeTemplate?: string;
  showBuilderActions?: boolean;
  userProfileImageUrl: string;
  userName: string;
}

export default function Header({
  onDownloadPdf,
  onSelectTemplate,
  onZoomChange,
  onToggleMobileSidebar,
  onSaveResume,
  isMobileSidebarOpen,
  activeTemplate,
  showBuilderActions = false,
}: HeaderProps) {
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(100);
  const [user, setUser] = useState<any>(null); // State to hold the current user
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Firebase on the client side
    initializeFirebase();

    // Set up auth listener once Firebase is initialized
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });
      return () => unsubscribe();
    }
  }, []);

  const templates = [
    { name: 'Sleek Software Design', value: 'software-engineering-lead' },
    { name: 'E-Commerce CFO', value: 'e-commerce-cfo' },
    { name: 'Classic Professional', value: 'classic-pro-template' },
    { name: 'Big Data Engineer', value: 'big-data-engineer-template' },
    { name: 'Data Analyst', value: 'data-analyst-template' },
    { name: 'Product Manager', value: 'product-manager-template' },
    { name: 'Freelancer', value: 'freelancer-template' },
  ];

  const handleZoomIn = () => {
    setCurrentZoom(prev => Math.min(prev + 10, 150));
    onZoomChange?.(Math.min(currentZoom + 10, 150) / 100);
  };

  const handleZoomOut = () => {
    setCurrentZoom(prev => Math.max(prev - 10, 50));
    onZoomChange?.(Math.max(currentZoom - 10, 50) / 100);
  };

  const handleResetZoom = () => {
    setCurrentZoom(100);
    onZoomChange?.(1);
  };

  const handleLogout = async () => {
    if (!auth) {
      toast.error("Authentication not initialized.");
      return;
    }
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      if (pathname === '/dashboard' || pathname === '/settings') {
        window.location.href = '/auth/login'; // Force a full page reload for protected routes
      }
    } catch (error: unknown) {
      console.error("Sign out error:", error);
      let errorMessage = "Logout failed.";
      if (error instanceof Error) {
        errorMessage = `Logout failed: ${error.message}`;
      }
      toast.error(errorMessage);
    }
  };

  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const userProfileImageUrl = user?.photoURL;
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-dark-bg-main border-b border-dark-border-medium text-white px-6 py-3 sm:px-10 z-50 sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-outfit font-semibold">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            ResumeCraft
          </Link>
        </h1>

        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 lg:gap-9">
            <Link href={user ? "/dashboard" : "/auth/login"} className="text-white text-sm font-medium hover:text-dark-text-light transition-colors font-inter">
              Dashboard
            </Link>
            <Link href={user ? "/templates" : "/auth/login"} className="text-white text-sm font-medium hover:text-dark-text-light transition-colors font-inter">
              Templates
            </Link>
            <Link href={user ? "/settings" : "/auth/login"} className="text-white text-sm font-medium hover:text-dark-text-light transition-colors font-inter">
              Settings
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {showBuilderActions && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                    className="flex items-center px-3 py-2 bg-dark-bg-card rounded-md hover:bg-dark-border-light transition-all focus:outline-none focus:ring-2 focus:ring-dark-text-blue text-dark-text-light"
                  >
                    <LayoutTemplate className="mr-2 h-4 w-4 text-light-accent-button" />
                    Templates
                  </button>
                  {isTemplateDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-dark-bg-main rounded-md shadow-lg py-1 z-10">
                      {templates.map((template) => (
                        <button
                          key={template.value}
                          onClick={() => {
                            onSelectTemplate && onSelectTemplate(template.value);
                            setIsTemplateDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${activeTemplate === template.value ? 'bg-gray-100 font-medium' : ''}`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1 bg-dark-bg-card rounded-md p-1 text-light-accent-button">
                  <button onClick={handleZoomOut} className="p-1 rounded-md hover:bg-dark-border-light transition-all focus:outline-none focus:ring-2 focus:ring-dark-text-blue">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-medium text-dark-text-light">{currentZoom}%</span>
                  <button onClick={handleZoomIn} className="p-1 rounded-md hover:bg-dark-border-light transition-all focus:outline-none focus:ring-2 focus:ring-dark-text-blue">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button onClick={handleResetZoom} className="text-xs px-2 py-1 rounded-md hover:bg-dark-border-light transition-all focus:outline-none focus:ring-2 focus:ring-dark-text-blue text-dark-text-light">
                    Reset
                  </button>
                </div>

                {onSaveResume && (
                  <button
                    onClick={onSaveResume}
                    className="bg-green-600 text-white hover:bg-green-700 font-bold px-4 py-2 rounded-full transition-colors flex items-center font-inter"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </button>
                )}

                <button
                  onClick={onDownloadPdf}
                  className="bg-blue-call-to-action text-white hover:bg-blue-button-hover font-bold px-4 py-2 rounded-full transition-colors flex items-center font-inter"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </button>
              </>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-dark-text-blue transition-all ${
                    userProfileImageUrl
                      ? 'bg-cover bg-center bg-no-repeat'
                      : 'bg-light-accent-button text-dark-bg-main'
                  }`}
                  style={userProfileImageUrl ? { backgroundImage: `url("${userProfileImageUrl}")` } : {}}
                >
                  {!userProfileImageUrl && userInitial}
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-dark-bg-main rounded-md shadow-lg py-1 z-10">
                    <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" /> Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 flex items-center gap-2">
                      <X className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {!user && (
              <Link href="/auth/login" passHref>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-button-hover transition-colors font-inter">
                  <span className="truncate">Login</span>
                </button>
              </Link>
            )}
          </div>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => onToggleMobileSidebar && onToggleMobileSidebar()}
            className="p-2 rounded-md hover:bg-dark-bg-card focus:outline-none focus:ring-2 focus:ring-dark-text-blue"
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}