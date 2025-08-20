// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { FileText, PencilLine, Share2, Sparkles, UserCheck } from 'lucide-react';

import Header from './components/Header';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-1 gap-3 rounded-lg border border-dark-border-medium bg-dark-bg-card p-4 flex-col hover-lift transition-all-fast">
    <div className="text-white">
      <Icon size={24} />
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-white text-base font-bold leading-tight font-outfit">{title}</h2>
      <p className="text-dark-text-blue text-sm font-normal leading-normal font-inter">{description}</p>
    </div>
  </div>
);

export default function LandingPage() {
  // Sample user details, as this is a landing page before authentication
  const sampleUserName = "Guest User";
  const sampleUserProfileImage = 'https://images.unsplash.com/photo-1534528736603-514e8f17a944?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header userProfileImageUrl={sampleUserProfileImage} userName={sampleUserName} />

        <div className="px-5 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Hero Section */}
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                  style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
                >
                  <div className="flex flex-col gap-2 text-center animate-fade-in-down">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] font-outfit">
                      Craft a Resume That Gets You Hired
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal font-inter">
                      Our intuitive, AI-powered builder helps you create a professional resume that passes Applicant Tracking Systems (ATS) and lands you the job you deserve.
                    </h2>
                  </div>
                  <Link href="/auth/register" passHref>
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-blue-call-to-action text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit hover:bg-blue-button-hover transition-colors animate-fade-in-up font-inter"
                    >
                      <span className="truncate">Create your Resume</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-outfit">
                    Key Features
                  </h1>
                  <p className="text-white text-base font-normal leading-normal max-w-[720px] font-inter">
                    ResumeCraft offers a range of features designed to make resume building simple, intelligent, and effective.
                  </p>
                </div>
                <Link href="/auth/login" passHref>
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-light-accent-button text-dark-bg-card text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit hover:opacity-90 transition-opacity font-inter"
                  >
                    <span className="truncate">Explore Templates</span>
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <FeatureCard
                  icon={FileText}
                  title="Professional Templates"
                  description="Choose from a variety of professionally designed templates to suit your industry and experience level, including modern and classic layouts."
                />
                <FeatureCard
                  icon={Sparkles}
                  title="AI-Powered Suggestions"
                  description="Instantly generate or improve your professional summary and experience descriptions with our integrated AI."
                />
                <FeatureCard
                  icon={UserCheck}
                  title="ATS Optimization"
                  description="Get an instant score and tailored feedback to ensure your resume is optimized to pass Applicant Tracking Systems."
                />
                <FeatureCard
                  icon={Share2}
                  title="Save & Download"
                  description="Save your resume to your account and easily export it to PDF, ready to share with potential employers."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-dark-text-light text-base font-normal leading-normal min-w-40 hover:text-white transition-colors font-inter" href="#">About Us</a>
                <a className="text-dark-text-light text-base font-normal leading-normal min-w-40 hover:text-white transition-colors font-inter" href="#">Contact</a>
                <a className="text-dark-text-light text-base font-normal leading-normal min-w-40 hover:text-white transition-colors font-inter" href="#">Privacy Policy</a>
                <a className="text-dark-text-light text-base font-normal leading-normal min-w-40 hover:text-white transition-colors font-inter" href="#">Terms of Service</a>
              </div>
              <p className="text-dark-text-light text-base font-normal leading-normal font-inter">© {new Date().getFullYear()} ResumeCraft. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  );
}