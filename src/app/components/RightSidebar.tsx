// src/app/components/RightSidebar.tsx
'use client';

import React from 'react';
import { Settings, CheckCircle } from 'lucide-react';
import AtsChecker from './AtsChecker'; // Import the new AtsChecker component
import { ResumeData } from '@/types/resume'; // Import ResumeData type

interface RightSidebarProps {
  resumeData: ResumeData; // Pass resumeData to AtsChecker
  onSelectTemplate: (template: string) => void; // Add prop for template selection
  activeTemplate: string; // Add prop to show active template
}

export default function RightSidebar({ resumeData, onSelectTemplate, activeTemplate }: RightSidebarProps) {
  return (
    <div className="layout-content-container flex flex-col w-[300px] xl:w-[360px] p-6 bg-dark-bg-main rounded-xl shadow-lg border border-dark-border">
      {/* Formatting Section */}
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 font-outfit">Formatting</h2>
      <div className="space-y-4 mb-8">
        <label className="flex flex-col flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2 font-inter">Template</p>
          <select
            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border border-dark-border-light bg-dark-bg-card focus:border-dark-border-light h-12 placeholder:text-dark-text-light p-3 text-base font-normal leading-normal"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(146,173,200)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")' }}
            value={activeTemplate} // Bind selected value
            onChange={(e) => onSelectTemplate(e.target.value)} // Handle change
          >
            <option value="modern-minimal">Modern</option>
            <option value="classic-pro">Classic</option>
            <option value="creative-bold">Creative</option>
          </select>
        </label>
        <label className="flex flex-col flex-1">
          <p className="text-white text-base font-medium leading-normal pb-2 font-inter">Font</p>
          <select
            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border border-dark-border-light bg-dark-bg-card focus:border-dark-border-light h-12 placeholder:text-dark-text-light p-3 text-base font-normal leading-normal"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(146,173,200)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")' }}
          >
            <option value="inter">Inter</option>
            <option value="outfit">Outfit</option>
          </select>
        </label>
      </div>

      {/* NEW: ATS Checker Component */}
      <AtsChecker resumeData={resumeData} />

      {/* Check for Errors Section - Simplified, as ATS Checker handles much */}
      <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em] mb-4 font-outfit">Other Checks</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-dark-bg-card px-4 min-h-[72px] py-2 justify-between rounded-lg border border-dark-border">
          <div className="flex flex-col justify-center">
            <p className="text-white text-base font-medium leading-normal line-clamp-1 font-inter">Grammar & Spelling</p>
            <p className="text-dark-text-light text-sm font-normal leading-normal line-clamp-2 font-inter">Check for common mistakes in grammar and spelling.</p>
          </div>
          <div className="shrink-0">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-dark-bg-card text-white text-sm font-medium leading-normal w-fit hover:bg-dark-border-light transition-colors font-inter"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}