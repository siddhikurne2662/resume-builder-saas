// src/app/builder/page.tsx
"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic'; // Import dynamic

import {
  Download,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import EditorSection from '../components/EditorSection'; // This is the old EditorSection
import ResumePreview from '../components/ResumePreview';
import RightSidebar from '../components/RightSidebar';
import Header from '../components/Header';
import MobileTabs from '../components/MobileTabs';
import { ResumeData } from '@/types/resume';
// Removed direct import: import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';
import { getAuth } from 'firebase/auth';
import FloatingLabelInput from '../components/FloatingLabelInput'; // Re-import FloatingLabelInput
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Dynamically import html2pdf.js to ensure it's only loaded on the client side
const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });


// Initial Resume Data (updated with generic skills)
const initialResumeData: ResumeData = {
  template: 'modern-minimal', // Default template
  personalInfo: {
    name: 'Eric Johnson',
    email: 'eric.johnson@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/ericjohnson',
    portfolio: 'ericjohnson.dev',
    address: 'San Francisco, CA',
  },
  summary: "Results-driven professional with 5+ years of experience in my field. Proven track record of delivering high-quality results and leading cross-functional teams to success.",
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Professional',
      company: 'Solutions Inc.',
      startDate: '2022',
      endDate: 'Present',
      description: [
        'Led key projects serving 1M+ customers',
        'Improved operational efficiency by 40% through process optimization',
        'Mentored junior team members and conducted performance reviews'
      ],
    },
    {
      id: 'exp-2',
      title: 'Professional',
      company: 'Innovations Co.',
      startDate: '2020',
      endDate: '2022',
      description: [
        'Developed and implemented strategic solutions',
        'Collaborated with cross-functional teams to achieve targets',
        'Reduced errors by 35% through comprehensive quality control'
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Business Administration',
      institution: 'University of California, Berkeley',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8/4.0',
    },
  ],
  skills: {
    Technical: ['Microsoft Office', 'Data Analysis', 'Project Management', 'CRM Software', 'Database Management', 'Reporting Tools'],
    Tools: ['Slack', 'Trello', 'Salesforce', 'Google Analytics', 'Zoom', 'Adobe Creative Suite'],
    Soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Strategic Planning', 'Time Management'],
  },
};

// Collapsible Section Component
const CollapsibleSection = ({ title, icon: Icon, children, isOpen, onToggle }: {
  title: string;
  icon: React.ElementType; // Changed to React.ElementType
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="bg-dark-bg-card border border-dark-border-light rounded-lg mb-10 overflow-hidden transition-all duration-200 hover-lift">
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-dark-bg-medium transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-light-button-accent rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white font-outfit">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-dark-text-blue" />
        ) : (
          <ChevronDown className="w-6 h-6 text-dark-text-blue" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};


export default function ResumeBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Section visibility states
  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const templateFromUrl = searchParams.get('template');
    if (templateFromUrl) {
      setResumeData(prev => ({ ...prev, template: templateFromUrl }));
    }
    const resumeIdFromUrl = searchParams.get('resumeId');
    if (resumeIdFromUrl) {
        setCurrentResumeId(resumeIdFromUrl);
        toast.info("Loading existing resume data (feature to be implemented).");
    }
  }, [searchParams]);

  const handleSelectTemplate = useCallback((template: string) => {
    setResumeData(prev => ({ ...prev, template }));
    toast.success(`Template changed to ${template}!`);
  }, []);

  const handleDownloadPdf = async () => {
    if (resumePreviewRef.current) {
      if (!html2pdf) { // Check if html2pdf is loaded
        toast.error('PDF library not yet loaded. Please try again in a moment.', { id: 'pdf-toast' });
        return; // Exit if html2pdf is not loaded
      }
      toast.loading('Generating PDF...', { id: 'pdf-toast' });
      const element = resumePreviewRef.current;

      const originalZoom = zoomLevel;
      setZoomLevel(1); // Set to 100% for accurate capture
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow re-render

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${resumeData.personalInfo.name.replace(/\s/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 4,
          useCORS: true,
          logging: false,
          allowTaint: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };

      try {
        await (html2pdf as any)().set(opt).from(element).save();
        toast.success('PDF downloaded successfully!', { id: 'pdf-toast' });
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Failed to download PDF. Please try again.', { id: 'pdf-toast' });
      } finally {
        setZoomLevel(originalZoom); // Restore original zoom level
      }
    }
  };

  const handleSaveResume = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        toast.error("You must be logged in to save your resume.");
        router.push('/auth/login');
        return;
    }

    toast.loading('Saving resume...', { id: 'save-toast' });

    try {
        const resumeTitle = resumeData.personalInfo.name.trim() || 'Untitled Resume';
        const resumeToSave = {
            ...resumeData,
            title: resumeTitle,
            lastUpdated: serverTimestamp(),
        };

        let resumeDocRef;
        if (currentResumeId) {
            resumeDocRef = doc(db, 'users', user.uid, 'resumes', currentResumeId);
            await setDoc(resumeDocRef, resumeToSave, { merge: true });
            toast.success('Resume updated successfully!', { id: 'save-toast' });
        } else {
            const newDocRef = doc(db, 'users', user.uid, 'resumes');
            await setDoc(newDocRef, { ...resumeToSave, createdAt: serverTimestamp() });
            setCurrentResumeId(newDocRef.id);
            toast.success('Resume saved successfully!', { id: 'save-toast' });
            router.push(`/builder?resumeId=${newDocRef.id}&template=${resumeData.template}`);
        }

    } catch (error: any) {
        console.error('Error saving resume:', error);
        toast.error(`Failed to save resume: ${error.message}`, { id: 'save-toast' });
    }
  };

  type PersonalInfo = ResumeData['personalInfo'];

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: value,
    }));
  };

  const addExperience = () => {
    const newExp: ResumeData['experience'][0] = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: [''],
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof ResumeData['experience'][0], value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu: ResumeData['education'][0] = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: keyof ResumeData['education'][0], value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSkillsChange = (category: keyof ResumeData['skills'], value: string) => {
    setResumeData(prevData => ({
      ...prevData,
      skills: {
        ...prevData.skills,
        [category]: value.split(',').map(s => s.trim()).filter(s => s !== ''),
      },
    }));
  };

  const calculateCompletionPercentage = useCallback(() => {
    let completedFields = 0;
    let totalFields = 0;

    Object.values(resumeData.personalInfo).forEach(value => {
      totalFields++;
      if (value && String(value).trim()) completedFields++;
    });

    totalFields++;
    if (resumeData.summary.trim()) completedFields++;

    totalFields += resumeData.experience.length * 5;
    resumeData.experience.forEach(exp => {
      if (exp.title.trim()) completedFields++;
      if (exp.company.trim()) completedFields++;
      if (exp.startDate.trim()) completedFields++;
      if (exp.endDate.trim()) completedFields++;
      if (exp.description.some(d => d.trim())) completedFields++;
    });

    totalFields += resumeData.education.length * 5;
    resumeData.education.forEach(edu => {
      if (edu.degree.trim()) completedFields++;
      if (edu.institution.trim()) completedFields++;
      if (edu.startDate.trim()) completedFields++;
      if (edu.endDate.trim()) completedFields++;
      if (edu.gpa && edu.gpa.trim()) completedFields++;
    });

    totalFields += Object.values(resumeData.skills).length;
    Object.values(resumeData.skills).forEach(skillArray => {
      if (skillArray.length > 0 && skillArray.some(s => s.trim() !== '')) completedFields++;
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [resumeData]);

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen flex flex-col font-inter bg-dark-bg-main">
      <Header
        onDownloadPdf={handleDownloadPdf}
        onSelectTemplate={handleSelectTemplate}
        onZoomChange={setZoomLevel}
        onToggleMobileSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isMobileSidebarOpen={isRightSidebarOpen}
        activeTemplate={resumeData.template}
        showBuilderActions={true}
        onSaveResume={handleSaveResume}
        userName="Guest User"
        userProfileImageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29329?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor (visible on desktop, conditionally visible on mobile) */}
        <div className={`w-full md:w-1/2 p-10 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out ${activeTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative absolute inset-0`}>
          <div className="max-w-lg mx-auto space-y-10">
            <div className="mb-10">
              <h1 className="text-white text-2xl font-bold font-outfit mb-3">Professional Resume Builder</h1>
              <div className="flex items-center gap-2 text-sm text-dark-text-blue">
                <FileText className="w-4 h-4" />
                Create Your Professional Resume
              </div>
            </div>

            <div className="bg-dark-bg-card border border-dark-border-light rounded-lg p-8 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-dark-bg-medium rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-light-button-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Tailor your resume for each opportunity</h3>
                  <p className="text-sm text-dark-text-blue leading-relaxed">
                    Customize your resume content to match specific job requirements and stand out.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dark-bg-card border border-dark-border-light rounded-lg p-8 mb-10">
              <h3 className="text-lg font-outfit font-semibold text-white mb-4">Resume Completion</h3>
              <div className="w-full bg-dark-border-light rounded-full h-3 mb-3">
                <div
                  className="bg-light-button-accent h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-dark-text-light text-center">{Math.round(completionPercentage)}% Complete</p>
            </div>

            <CollapsibleSection
              title="Personal Details"
              icon={User}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingLabelInput
                  id="firstName"
                  label="First Name"
                  type="text"
                  value={resumeData.personalInfo.name.split(' ')[0] || ''}
                  onChange={(e) => {
                    const lastName = resumeData.personalInfo.name.split(' ').slice(1).join(' ');
                    updatePersonalInfo('name', `${e.target.value} ${lastName}`.trim());
                  }}
                  placeholder="Eric"
                />
                <FloatingLabelInput
                  id="lastName"
                  label="Last Name"
                  type="text"
                  value={resumeData.personalInfo.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                    const firstName = resumeData.personalInfo.name.split(' ')[0] || '';
                    updatePersonalInfo('name', `${firstName} ${e.target.value}`.trim());
                  }}
                  placeholder="Johnson"
                />
              </div>
              <FloatingLabelInput
                id="email"
                label="Email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="eric.johnson@example.com"
              />
              <FloatingLabelInput
                id="phone"
                label="Phone"
                type="tel"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
              <FloatingLabelInput
                id="linkedin"
                label="LinkedIn Profile URL"
                type="url"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/ericjohnson"
              />
              <FloatingLabelInput
                id="portfolio"
                label="Portfolio/Website URL"
                type="url"
                value={resumeData.personalInfo.portfolio}
                onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                placeholder="ericjohnson.com"
              />
              <FloatingLabelInput
                id="address"
                label="Address (City, State)"
                type="text"
                value={resumeData.personalInfo.address}
                onChange={(e) => updatePersonalInfo('address', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Professional Summary"
              icon={Award}
              isOpen={openSections.summary}
              onToggle={() => toggleSection('summary')}
            >
              <FloatingLabelInput
                id="summary"
                label="A brief summary of your professional goals and experience..."
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                isTextArea
                rows={4}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Work Experience"
              icon={Briefcase}
              isOpen={openSections.experience}
              onToggle={() => toggleSection('experience')}
            >
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border border-dark-border-light p-8 rounded-lg mb-8 bg-dark-bg-medium shadow-sm relative group hover-lift transition-all-fast">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-medium text-white">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Remove Experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <FloatingLabelInput
                      id={`exp-title-${exp.id}`}
                      label="Job Title"
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Senior Professional"
                    />
                    <FloatingLabelInput
                      id={`exp-company-${exp.id}`}
                      label="Company"
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Solutions Inc."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingLabelInput
                        id={`exp-start-${exp.id}`}
                        label="Start Date (e.g., Jan 2022)"
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                      <FloatingLabelInput
                        id={`exp-end-${exp.id}`}
                        label="End Date (e.g., Present or Dec 2024)"
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <FloatingLabelInput
                      id={`exp-desc-${exp.id}`}
                      label="Responsibilities (one per line, use bullet points)"
                      value={exp.description.join('\n')}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                      isTextArea
                      rows={4}
                      placeholder="• Led key projects serving customers&#10;• Improved operational efficiency by 40%"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="btn-secondary !bg-dark-bg-medium hover:!bg-dark-border-light !text-white mt-8 flex items-center rounded-full px-6 h-12 w-full justify-center"
              >
                <Plus className="mr-2 h-5 w-5" /> Add New Experience
              </button>
            </CollapsibleSection>

            <CollapsibleSection
              title="Education"
              icon={GraduationCap}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
            >
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border border-dark-border-light p-8 rounded-lg mb-8 bg-dark-bg-medium shadow-sm relative group hover-lift transition-all-fast">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-medium text-white">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Remove Education"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <FloatingLabelInput
                      id={`edu-degree-${edu.id}`}
                      label="Degree/Field of Study"
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    />
                    <FloatingLabelInput
                      id={`edu-institution-${edu.id}`}
                      label="Institution Name"
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingLabelInput
                        id={`edu-start-${edu.id}`}
                        label="Start Date (e.g., Aug 2020)"
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                      <FloatingLabelInput
                        id={`edu-end-${edu.id}`}
                        label="End Date (e.g., May 2024)"
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <FloatingLabelInput
                      id={`edu-gpa-${edu.id}`}
                      label="GPA (Optional)"
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="btn-secondary !bg-dark-bg-medium hover:!bg-dark-border-light !text-white mt-8 flex items-center rounded-full px-6 h-12 w-full justify-center"
              >
                <Plus className="mr-2 h-5 w-5" /> Add New Education
              </button>
            </CollapsibleSection>

            <CollapsibleSection
              title="Skills & Competencies"
              icon={Award}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
            >
              <p className="text-sm text-dark-text-light mb-8 leading-relaxed">Enter skills comma-separated within each category.</p>
              <div className="space-y-6">
                <FloatingLabelInput
                  id="skills-technical"
                  label="Technical Skills"
                  value={resumeData.skills.Technical.join(', ')}
                  onChange={(e) => handleSkillsChange('Technical', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Microsoft Office, Data Analysis, Programming Languages"
                />
                <FloatingLabelInput
                  id="skills-tools"
                  label="Tools & Software"
                  value={resumeData.skills.Tools.join(', ')}
                  onChange={(e) => handleSkillsChange('Tools', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Slack, Trello, CRM Software, Analytics Tools"
                />
                <FloatingLabelInput
                  id="skills-soft"
                  label="Soft Skills & Languages"
                  value={resumeData.skills.Soft.join(', ')}
                  onChange={(e) => handleSkillsChange('Soft', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Leadership, Communication, Spanish, French"
                />
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Right Panel - Preview (visible on desktop, conditionally visible on mobile) */}
        <div className="hidden md:flex flex-col w-full md:w-1/2 p-10 overflow-y-auto custom-scrollbar items-center justify-start relative">
          <div className="relative" style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            flexShrink: 0,
          }}>
            <ResumePreview resumeData={resumeData} activeTemplate={resumeData.template} ref={resumePreviewRef} />
          </div>
        </div>

        {/* Right Sidebar (mobile view) */}
        {isRightSidebarOpen && (
          <div className="fixed inset-y-0 right-0 w-80 bg-dark-bg-main z-40 p-6 overflow-y-auto md:hidden">
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-dark-bg-card"
            >
              <Trash2 className="h-6 w-6" />
            </button>
            <RightSidebar
              resumeData={resumeData}
              onSelectTemplate={handleSelectTemplate}
              activeTemplate={resumeData.template}
            />
          </div>
        )}

        {/* Mobile Tabs */}
        <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}