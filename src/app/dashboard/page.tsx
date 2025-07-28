// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import { Home, FileText, ListOrdered, Settings, HelpCircle } from 'lucide-react'; // Lucide icons

// Helper component for resume cards
interface ResumeCardProps {
  title: string;
  lastEdited: string;
  imageUrl: string;
  id: string; // To link to builder
}

const ResumeCard: React.FC<ResumeCardProps> = ({ title, lastEdited, imageUrl, id }) => (
  <div className="flex items-stretch justify-between gap-4 rounded-xl border border-dark-border-medium bg-dark-bg-medium p-4 hover:shadow-lg hover:border-dark-border-light transition-all duration-300">
    <div className="flex flex-[2_2_0px] flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-white text-base font-bold leading-tight font-outfit">{title}</p>
        <p className="text-dark-text-blue text-sm font-normal leading-normal font-inter">Last edited: {lastEdited}</p>
      </div>
      <Link href={`/builder?resumeId=${id}`} passHref>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 flex-row-reverse bg-dark-bg-card text-white text-sm font-medium leading-normal hover:bg-dark-border-light transition-colors font-inter">
          <span className="truncate">Edit</span>
        </button>
      </Link>
    </div>
    <div
      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
      style={{ backgroundImage: `url("${imageUrl}")` }}
    ></div>
  </div>
);

export default function DashboardPage() {
  const sampleUserName = "Sophia";
  const sampleUserProfileImage = 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const userResumes = [
    { id: 'resume-1', title: 'Software Engineer Resume', lastEdited: 'July 15, 2024', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'resume-2', title: 'Product Manager Resume', lastEdited: 'June 22, 2024', imageUrl: 'https://images.unsplash.com/photo-1543286386-8d59103de0cd?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'resume-3', title: 'Marketing Specialist Resume', lastEdited: 'May 10, 2024', imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f054f21?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const templates = [
    { name: 'Modern', imageUrl: 'https://images.unsplash.com/photo-1599305412497-6c3c54a9c3b8?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Classic', imageUrl: 'https://images.unsplash.com/photo-1621935293699-075e7a9e2f4f?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Creative', imageUrl: 'https://images.unsplash.com/photo-1582570054328-9a9c2f6d0a7a?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Minimalist', imageUrl: 'https://images.unsplash.com/photo-1520692770258-2964e5251a3c?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main font-inter">
      <Header userName={sampleUserName} userProfileImageUrl={sampleUserProfileImage} /> {/* Pass props */}
      <div className="gap-1 px-4 sm:px-6 lg:px-6 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-80 lg:w-[280px] xl:w-[320px] bg-dark-bg-main p-4">
          <div className="flex h-full min-h-[700px] flex-col justify-between bg-dark-bg-main p-4">
            <div className="flex flex-col gap-4">
              {/* User Profile Info on Sidebar */}
              <div className="flex gap-3 items-center">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                  style={{ backgroundImage: `url("${sampleUserProfileImage}")` }} // Use the sample image from the header props
                ></div>
                <h1 className="text-white text-base font-medium leading-normal font-inter">Sophia Carter</h1>
              </div>
              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <Home className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Dashboard</p>
                </Link>
                <Link href="/builder" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-bg-card hover:bg-dark-bg-card transition-colors">
                  <FileText className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">My Resumes</p>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <ListOrdered className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Templates</p>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <Settings className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Settings</p>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-dark-bg-card transition-colors">
                  <HelpCircle className="text-white h-6 w-6" />
                  <p className="text-white text-sm font-medium leading-normal font-inter">Help</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area (My Resumes & Templates List) */}
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* My Resumes Header and New Resume Button */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white text-4xl font-bold leading-tight min-w-72 font-outfit">My Resumes</p>
            <Link href="/builder" passHref>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-dark-bg-card text-white text-sm font-medium leading-normal hover:bg-dark-border-light transition-colors font-inter"
              >
                <span className="truncate">New Resume</span>
              </button>
            </Link>
          </div>

          {/* List of User Resumes */}
          <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 font-outfit">My Resumes</h3>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userResumes.map(resume => (
              <ResumeCard
                key={resume.id}
                id={resume.id}
                title={resume.title}
                lastEdited={resume.lastEdited}
                imageUrl={resume.imageUrl}
              />
            ))}
          </div>

          {/* Templates Section */}
          <h3 className="text-white text-xl font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 font-outfit">Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {templates.map((template, index) => (
              <div key={index} className="flex flex-col gap-3 pb-3">
                <Link href={`/builder?template=${template.name.toLowerCase().replace(' ', '-')}`} passHref>
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