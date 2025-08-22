// src/app/templates/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import { Home, FileText, ListOrdered, Settings, X } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Authenticate User for sidebar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const currentUserName = user?.displayName || user?.email?.split('@')[0] || "User";
  const currentUserProfileImage = user?.photoURL;

  const allTemplates = [
    { name: 'Software Engineering Lead', value: 'software-engineering-lead', imageUrl: '/images/imgi_5_software-engineering-lead.png' },
    { name: 'E-Commerce CFO', value: 'e-commerce-cfo', imageUrl: '/images/imgi_10_e-commerce-chief-financial-officer.png' },
    { name: 'Classic Professional', value: 'classic-pro-template', imageUrl: '/images/imgi_1_financial-data-analyst.png' },
    { name: 'Big Data Engineer', value: 'big-data-engineer-template', imageUrl: '/images/imgi_9_big-data-engineer.png' },
    { name: 'Data Analyst', value: 'data-analyst-template', imageUrl: '/images/imgi_12_data-analyst.png' },
    { name: 'Product Manager', value: 'product-manager-template', imageUrl: '/images/imgi_14_core-template-business-analyst.png' },
    { name: 'Creative Bold Template', value: 'creative-bold-template', imageUrl: '/images/imgi_11_marketing-manager.png' },
    { name: 'Freelancer', value: 'freelancer-template', imageUrl: '/images/imgi_22_freelance-v1.png' },
  ];

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg-main text-white text-lg">
        Loading templates...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
        <Toaster position="bottom-right" reverseOrder={false} />
        <Header
          userName={currentUserName}
          userProfileImageUrl={currentUserProfileImage || ''}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />

        {/* Main Layout Container */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="hidden md:flex flex-col w-80 lg:w-[280px] xl:w-[320px] bg-dark-bg-main p-4 border-r border-dark-border-medium">
            <div className="flex flex-col h-full bg-dark-bg-main p-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-center">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{ backgroundImage: `url("${currentUserProfileImage || ''}")` }}
                  ></div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                    <Home className="text-white h-6 w-6" />
                    <p className="text-white text-sm font-medium leading-normal font-inter">Dashboard</p>
                  </Link>
                  <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                    <FileText className="text-white h-6 w-6" />
                    <p className="text-white text-sm font-medium leading-normal font-inter">My Resumes</p>
                  </Link>
                  <Link href="/templates" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg-card transition-colors">
                    <ListOrdered className="text-white h-6 w-6" />
                    <p className="text-white text-sm font-medium leading-normal font-inter">Templates</p>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                    <Settings className="text-white h-6 w-6" />
                    <p className="text-white text-sm font-medium leading-normal font-inter">Settings</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar (Slide-in menu) */}
          <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-dark-bg-main transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold font-outfit text-white">Menu</h1>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-full hover:bg-dark-bg-card text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors" onClick={() => setIsMobileSidebarOpen(false)}>
                  <Home className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Dashboard</p>
                </Link>
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors" onClick={() => setIsMobileSidebarOpen(false)}>
                    <FileText className="text-white h-6 w-6" />
                    <p className="text-white text-sm font-medium leading-normal font-inter">My Resumes</p>
                  </Link>
                <Link href="/templates" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg-card transition-colors" onClick={() => setIsMobileSidebarOpen(false)}>
                  <ListOrdered className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Templates</p>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors" onClick={() => setIsMobileSidebarOpen(false)}>
                  <Settings className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Settings</p>
                </Link>
              </div>
            </div>
          </div>
          {isMobileSidebarOpen && <div className="fixed inset-0 z-40 bg-black opacity-50 md:hidden" onClick={() => setIsMobileSidebarOpen(false)}></div>}

          {/* Main Content Area - Templates List */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-[1200px] mx-auto">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <p className="text-white text-4xl font-bold leading-tight min-w-72 font-outfit">Templates</p>
              </div>

              <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 font-outfit">Choose a Template to Get Started</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {allTemplates.map((template, index) => (
                  <div key={index} className="flex flex-col gap-3 pb-3">
                    <Link href={`/builder?template=${template.value}`} passHref>
                      <div
                        className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer border border-dark-border"
                        style={{ backgroundImage: `url("${template.imageUrl}")` }}
                      ></div>
                    </Link>
                    <p className="text-white text-base font-medium leading-normal font-inter">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthLayout>
  );
}