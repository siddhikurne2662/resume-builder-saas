// src/app/templates/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from '../components/Header';
import { Home, FileText, ListOrdered, Settings } from 'lucide-react'; // Icons

export default function TemplatesPage() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Authenticate User for sidebar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const currentUserName = user?.displayName || user?.email?.split('@')[0] || "User";
  const currentUserProfileImage = user?.photoURL; // Fallback removed to let Header handle it

  // Define all your templates with specific image URLs from the public/images folder
  const allTemplates = [
    // Titles updated to be more descriptive of the design style, rather than specific roles
    { name: 'Sleek Software Design', value: 'modern-minimal', imageUrl: '/images/imgi_5_software-engineering-lead.png' },
    { name: 'Professional Classic Layout', value: 'classic-pro', imageUrl: '/images/imgi_1_financial-data-analyst.png' },
    { name: 'Bold Modern Profile', value: 'creative-bold', imageUrl: '/images/imgi_11_marketing-manager.png' },
    { name: 'Clean Data-Focused', value: 'minimalist', imageUrl: '/images/imgi_9_big-data-engineer.png' },
    { name: 'Structured Data Analyst', value: 'linkedin-modern', imageUrl: '/images/imgi_12_data-analyst.png' },
    { name: 'Timeless Business Professional', value: 'linkedin-professional', imageUrl: '/images/imgi_14_core-template-business-analyst.png' },
    { name: 'Concise Freelancer', value: 'linkedin-minimal', imageUrl: '/images/imgi_22_freelance-v1.png' },
    // You can add more templates and their corresponding image paths here,
    // e.g., using imgi_10_e-commerce-chief-financial-officer.jpg for another style.
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
      <Header />
      <div className="gap-1 px-4 sm:px-6 lg:px-6 flex flex-1 justify-center py-5">
        {/* Left Sidebar - Reusing Dashboard sidebar structure */}
        <div className="layout-content-container flex flex-col w-80 lg:w-[280px] xl:w-[320px] bg-dark-bg-main p-4">
          <div className="flex h-full min-h-[700px] flex-col justify-between bg-dark-bg-main p-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${currentUserProfileImage || ''}")` }}
                ></div>
                {/* REMOVED: The user's name from the sidebar */}
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

        {/* Main Content Area - Templates List */}
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white text-4xl font-bold leading-tight min-w-72 font-outfit">Templates</p>
          </div>

          <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 font-outfit">Choose a Template to Get Started</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {allTemplates.map((template, index) => (
              <div key={index} className="flex flex-col gap-3 pb-3">
                {/* Link to builder page with selected template */}
                <Link href={`/builder?template=${template.value}`} passHref>
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-xl hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ backgroundImage: `url("${template.imageUrl}")` }}
                  ></div>
                </Link>
                <p className="text-white text-base font-medium leading-normal font-inter">{template.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}