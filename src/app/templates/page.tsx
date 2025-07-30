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
  const currentUserProfileImage = user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Fallback

  // Define all your templates, including the new LinkedIn ones
  const allTemplates = [
    { name: 'Modern Minimal', value: 'modern-minimal', imageUrl: 'https://images.unsplash.com/photo-1599305412497-6c3c54a9c3b8?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Classic Professional', value: 'classic-pro', imageUrl: 'https://images.unsplash.com/photo-1621935293699-075e7a9e2f4f?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Creative Bold', value: 'creative-bold', imageUrl: 'https://images.unsplash.com/photo-1582570054328-9a9c2f6d0a7a?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Minimalist', value: 'minimalist', imageUrl: 'https://images.unsplash.com/photo-1520692770258-2964e5251a3c?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'LinkedIn Modern', value: 'linkedin-modern', imageUrl: 'http://googleusercontent.com/file_content/0' }, // Use content ID for uploaded image
    { name: 'LinkedIn Professional', value: 'linkedin-professional', imageUrl: 'http://googleusercontent.com/file_content/1' }, // Use content ID for uploaded image
    { name: 'LinkedIn Minimal', value: 'linkedin-minimal', imageUrl: 'http://googleusercontent.com/file_content/2' }, // Use content ID for uploaded image
    // You might need to add placeholder image URLs if the provided image links aren't directly loadable in the browser.
    // For these image URLs (file_content/0, 1, 2), you'll need to replace them with actual public URLs
    // if you deploy the app, or store them in your /public directory and link to them like '/images/linkedin_modern.png'.
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
      <Header userName={currentUserName} userProfileImageUrl={currentUserProfileImage} />
      <div className="gap-1 px-4 sm:px-6 lg:px-6 flex flex-1 justify-center py-5">
        {/* Left Sidebar - Reusing Dashboard sidebar structure */}
        <div className="layout-content-container flex flex-col w-80 lg:w-[280px] xl:w-[320px] bg-dark-bg-main p-4">
          <div className="flex h-full min-h-[700px] flex-col justify-between bg-dark-bg-main p-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${currentUserProfileImage}")` }}
                ></div>
                <h1 className="text-white text-base font-medium leading-normal font-inter">{currentUserName}</h1>
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