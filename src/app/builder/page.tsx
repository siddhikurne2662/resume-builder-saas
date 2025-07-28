// src/app/builder/page.tsx
'use client'; // This directive makes the component a Client Component.

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header'; // Reusing Header
import ResumeEditor from '../components/ResumeEditor';
import ResumePreview from '../components/ResumePreview';
import MobileTabs from '../components/MobileTabs';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { ResumeData } from '@/types/resume';
import { Toaster, toast } from 'react-hot-toast';

// Initial state for your resume data.
const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Siddhant Kurne',
    email: 'siddhant.k@example.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/siddhantkurne',
    portfolio: 'siddhant.dev',
    address: 'Navi Mumbai, Maharashtra, India',
  },
  summary: "A highly motivated third-year diploma student with hands-on front-end development experience, specializing in building responsive and user-friendly web applications. Currently leading front-end initiatives at Pristine Pads and with two valuable internships under my belt, eager to contribute robust solutions and learn full-stack concepts.",
  experience: [
    {
      id: 'exp-1',
      title: 'Lead Front-End Developer',
      company: 'Pristine Pads',
      startDate: 'Jan 2024',
      endDate: 'Present',
      description: [
        'Led development of responsive user interfaces using React and Tailwind CSS for key client projects.',
        'Collaborated closely with UX/UI designers to translate wireframes and mockups into pixel-perfect, interactive web experiences.',
        'Optimized application performance and loading times by implementing code splitting and lazy loading techniques, resulting in a 20% reduction in initial load time.',
        'Mentored junior developers on best practices in front-end development and code quality.',
      ],
    },
    {
      id: 'exp-2',
      title: 'Front-End Development Intern',
      company: 'Tech Solutions Inc.',
      startDate: 'May 2023',
      endDate: 'Aug 2023',
      description: [
        'Assisted in developing and maintaining client-side applications, contributing to feature development cycles.',
        'Implemented new UI components and integrated APIs under the guidance of senior developers.',
        'Participated in code reviews and contributed to improving front-end code consistency and maintainability.',
      ],
    },
    {
      id: 'exp-3',
      title: 'Web Development Intern',
      company: 'Digital Innovators Co.',
      startDate: 'Jan 2023',
      endDate: 'Apr 2023',
      description: [
        'Developed static and dynamic web pages using HTML, CSS, and JavaScript.',
        'Learned fundamental concepts of responsive design and cross-browser compatibility.',
        'Assisted in content management system updates and website maintenance tasks.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Third-Year Diploma in Computer Engineering',
      institution: 'Government Polytechnic, Mumbai',
      startDate: 'Aug 2022',
      endDate: 'Expected May 2025',
      gpa: '9.0/10 (Current)',
    },
  ],
  skills: {
    frontend: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap', 'Sass/Less', 'Responsive Design', 'Webpack'],
    tools: ['Git & GitHub', 'VS Code', 'Figma', 'Postman', 'NPM/Yarn', 'ESLint', 'Prettier'],
    other: ['API Integration', 'Problem Solving', 'Team Collaboration', 'Agile Methodologies', 'UI/UX Principles', 'Debugging'],
  },
};

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimal');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Resume data loaded!');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const calculateCompletionPercentage = useCallback(() => {
    let completedFields = 0;
    let totalFields = 0;
    for (const key in resumeData.personalInfo) { totalFields++; if (resumeData.personalInfo[key as keyof typeof resumeData.personalInfo]) { completedFields++; } }
    totalFields++; if (resumeData.summary) completedFields++;
    totalFields += resumeData.experience.length * 5;
    resumeData.experience.forEach(exp => {
      if (exp.title) completedFields++; if (exp.company) completedFields++; if (exp.startDate) completedFields++; if (exp.endDate) completedFields++;
      if (exp.description.filter(d => d.trim() !== '').length > 0) completedFields++;
    });
    totalFields += resumeData.education.length * 4;
    resumeData.education.forEach(edu => {
      if (edu.degree) completedFields++; if (edu.institution) completedFields++; if (edu.startDate) completedFields++; if (edu.endDate) completedFields++;
      if (edu.gpa) completedFields++;
    });
    totalFields += Object.keys(resumeData.skills).length;
    for (const category in resumeData.skills) {
      if (resumeData.skills[category as keyof typeof resumeData.skills].length > 0) { completedFields++; }
    }
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
  }, [resumeData]);

  const completionPercentage = calculateCompletionPercentage();

  const handleDownloadPdf = () => {
    toast.success('PDF download initiated! (Feature coming soon)');
  };

  const handleZoomChange = (scale: number) => {
    setZoomLevel(scale);
  };

  const handleSelectTemplate = (template: string) => {
    setSelectedTemplate(template);
    toast.success(`Template changed to ${template.replace('-', ' ')}!`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Header
        onDownloadPdf={handleDownloadPdf}
        onSelectTemplate={handleSelectTemplate}
        onZoomChange={handleZoomChange}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        activeTemplate={selectedTemplate}
      />

      <div className="flex-grow flex flex-col md:flex-row gap-6 p-4 md:p-6 relative">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          ></div>
        )}

        <div
          className={`
            w-full md:w-2/5 lg:w-2/5
            bg-white rounded-xl shadow-lg border border-gray-100
            overflow-y-auto custom-scrollbar
            md:relative md:top-0 md:h-auto
            fixed top-0 left-0 h-full z-40
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
            pb-20 md:pb-0
          `}
        >
          <div className="p-6">
            <h2 className="text-3xl font-outfit font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
              Edit Your Resume
            </h2>
            {isLoading ? (
              <LoadingSkeleton lines={10} height="h-10" />
            ) : (
              <ResumeEditor
                resumeData={resumeData}
                setResumeData={setResumeData}
                completionPercentage={completionPercentage}
              />
            )}
          </div>
        </div>

        <div
          className={`
            w-full md:w-3/5 lg:w-3/5
            bg-white rounded-xl shadow-lg border border-gray-100
            overflow-y-auto custom-scrollbar
            ${activeTab === 'preview' ? 'block' : 'hidden'} md:block
            pb-20 md:pb-0
          `}
        >
          <div className="p-6 h-full flex items-center justify-center">
            {isLoading ? (
              <LoadingSkeleton lines={20} height="h-6" width="w-3/4" />
            ) : (
              <ResumePreview resumeData={resumeData} zoomLevel={zoomLevel} activeTemplate={selectedTemplate} />
            )}
          </div>
        </div>
      </div>

      <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}