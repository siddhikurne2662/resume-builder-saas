// src/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { FileText, PencilLine, Share2 } from 'lucide-react';

import Header from './components/Header'; // Ensure Header is imported

// Helper component for the feature cards (redefined as it's not imported)
interface FeatureCardProps {
  icon: React.ElementType; // Lucide icon component
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-1 gap-3 rounded-lg border border-dark-border-primary bg-dark-bg-secondary p-4 flex-col hover-lift transition-all-fast">
    <div className="text-white">
      <Icon size={24} /> {/* Use Lucide icon */}
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-white text-base font-bold leading-tight font-outfit">{title}</h2>
      <p className="text-dark-text-light text-sm font-normal leading-normal font-inter">{description}</p>
    </div>
  </div>
);

export default function LandingPage() {
  // Define a sample user name and profile image URL for the header
  const sampleUserName = "Siddhant"; // Sample name for initial
  const sampleUserProfileImage = 'https://images.unsplash.com/photo-1534528736603-514e8f17a944?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Sample image

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-dark-bg-main dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Pass userProfileImageUrl and userName to Header */}
        <Header userProfileImageUrl={sampleUserProfileImage} userName={sampleUserName} />

        {/* Main Content Area */}
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
                      Our intuitive resume builder helps you create a professional resume that highlights your skills and experience, landing you the job you deserve.
                    </h2>
                  </div>
                  <Link href="/auth/register" passHref> {/* CHANGED: Redirect to register page */}
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-light-accent-button text-dark-bg-primary text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit hover:opacity-90 transition-opacity animate-fade-in-up font-inter"
                    >
                      <span className="truncate">Get Started</span>
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
                    ResumeCraft offers a range of features designed to make resume building easy and effective.
                  </p>
                </div>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-light-accent-button text-dark-bg-primary text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] w-fit hover:opacity-90 transition-opacity font-inter"
                >
                  <span className="truncate">View All Features</span>
                </button>
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <FeatureCard
                  icon={FileText}
                  title="Professional Templates"
                  description="Choose from a variety of professionally designed templates to suit your industry and experience level."
                />
                <FeatureCard
                  icon={PencilLine}
                  title="Easy Customization"
                  description="Customize your resume with our drag-and-drop editor, ensuring it reflects your unique qualifications."
                />
                <FeatureCard
                  icon={Share2}
                  title="Export & Share"
                  description="Easily export your resume in various formats and share it with potential employers."
                />
              </div>
            </div>

            {/* Call to Action Section */}
            <div className="px-4 py-10 @container">
              <div className="flex flex-col justify-end gap-6 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                <div className="flex flex-col gap-2 text-center">
                  <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px] font-outfit">
                    Ready to Take the Next Step?
                  </h1>
                  <p className="text-white text-base font-normal leading-normal max-w-[720px] font-inter">Start building your professional resume today and take control of your career.</p>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="flex justify-center">
                    <Link href="/auth/register" passHref> {/* CHANGED: Redirect to register page */}
                      <button
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-light-accent-button text-dark-bg-primary text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow hover:opacity-90 transition-opacity font-inter"
                      >
                        <span className="truncate">Create My Resume</span>
                      </button>
                    </Link>
                  </div>
                </div>
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