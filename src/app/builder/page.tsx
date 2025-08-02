// src/app/builder/page.tsx
"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import {
  Download,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  LayoutTemplate,
  Edit3,
  Check,
  X,
  Settings
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import RightSidebar from '../components/RightSidebar';
import Header from '../components/Header';
import MobileTabs from '../components/MobileTabs';
import { ResumeData, EnhancedResumeData, CustomSection } from '@/types/resume';
import { toast } from 'react-hot-toast';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { doc, setDoc, serverTimestamp, getDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { initialResumeData } from '@/data/initialResumeData';

// Dynamically import html2pdf.js
const html2pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

// Minimal input component
const MinimalInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  isTextArea = false,
  rows = 3
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  isTextArea?: boolean;
  rows?: number;
}) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-300 font-medium">{label}</label>
      <InputComponent
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={isTextArea ? rows : undefined}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
      />
    </div>
  );
};

// Minimal collapsible section
const MinimalCollapsibleSection = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
  onRename,
  canRename = false,
  onDelete,
  canDelete = false
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onRename?: (newTitle: string) => void;
  canRename?: boolean;
  onDelete?: () => void;
  canDelete?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleRename = () => {
    if (onRename && editTitle.trim()) {
      onRename(editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg mb-4 overflow-hidden">
      <div className="flex items-center justify-between p-4 hover:bg-gray-750 transition-colors">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <Icon className="w-5 h-5 text-gray-400" />
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') handleCancel();
                }}
                className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-sm text-white flex-1"
                autoFocus
              />
              <button
                onClick={handleRename}
                className="p-1 text-green-400 hover:text-green-300"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-base font-medium text-white">{title}</h3>
          )}
        </button>

        <div className="flex items-center gap-2">
          {canRename && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-300"
              title="Rename section"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1 text-red-400 hover:text-red-300"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

// Add new section modal
const AddSectionModal = ({
  isOpen,
  onClose,
  onAdd
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, icon: string) => void;
}) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('FileText');

  const iconOptions = [
    { name: 'FileText', icon: FileText },
    { name: 'Award', icon: Award },
    { name: 'Settings', icon: Settings },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'User', icon: User },
  ];

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim(), selectedIcon);
      setTitle('');
      setSelectedIcon('FileText');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-white mb-4">Add New Section</h3>

        <div className="space-y-4">
          <MinimalInput
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Projects, Certifications, Languages"
          />

          <div>
            <label className="block text-sm text-gray-300 font-medium mb-2">Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {iconOptions.map(({ name, icon: IconComponent }) => (
                <button
                  key={name}
                  onClick={() => setSelectedIcon(name)}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                    selectedIcon === name
                      ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<EnhancedResumeData>({
    ...initialResumeData,
    customSections: []
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const auth = getAuth();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: false,
    experience: false,
    education: false,
    skills: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    const templateFromUrl = searchParams.get('template');
    if (templateFromUrl) {
      setResumeData(prev => ({ ...prev, template: templateFromUrl }));
    }
    const resumeIdFromUrl = searchParams.get('resumeId');
    if (resumeIdFromUrl && user) {
      setCurrentResumeId(resumeIdFromUrl);
      const fetchResumeData = async () => {
        try {
          const resumeDocRef = doc(db, 'users', user.uid, 'resumes', resumeIdFromUrl);
          const docSnap = await getDoc(resumeDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as EnhancedResumeData;
            setResumeData({
              ...data,
              customSections: data.customSections || []
            });
            toast.success("Resume loaded successfully!");
          } else {
            toast.error("Resume not found.");
            router.push('/dashboard');
          }
        } catch (error) {
          console.error("Error fetching resume:", error);
          toast.error("Failed to load resume.");
        }
      };
      fetchResumeData();
    }
  }, [searchParams, user, router]);

  const handleSelectTemplate = useCallback((template: string) => {
    setResumeData(prev => ({ ...prev, template }));
    toast.success(`Template changed to ${template}!`);
  }, []);

  const handleDownloadPdf = async () => {
    if (resumePreviewRef.current) {
      if (!html2pdf) {
        toast.error('PDF library not yet loaded. Please try again in a moment.', { id: 'pdf-toast' });
        return;
      }
      toast.loading('Generating PDF...', { id: 'pdf-toast' });
      const element = resumePreviewRef.current;

      const originalZoom = zoomLevel;
      setZoomLevel(1);
      await new Promise(resolve => setTimeout(resolve, 100));

      const pdf = await html2pdf().from(element).set({
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
      }).save();

      toast.success('PDF downloaded successfully!', { id: 'pdf-toast' });
      setZoomLevel(originalZoom);

    }
  };

  const handleSaveResume = async () => {
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
            const newDocRef = doc(db, 'users', user.uid, 'resumes',);
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

  // Custom sections handlers
  const addCustomSection = (title: string, icon: string) => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title,
      content: '',
      icon
    };
    setResumeData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
    setOpenSections(prev => ({
      ...prev,
      [newSection.id]: true
    }));
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  const deleteCustomSection = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id)
    }));
    setOpenSections(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renameCustomSection = (id: string, newTitle: string) => {
    updateCustomSection(id, 'title', newTitle);
  };

  // All other handlers remain the same...
  type PersonalInfo = ResumeData['personalInfo'];
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
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
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof ResumeData['experience'][0], value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
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
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof ResumeData['education'][0], value: any) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
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

    // Add custom sections to calculation
    totalFields += resumeData.customSections.length;
    resumeData.customSections.forEach(section => {
      if (section.content.trim()) completedFields++;
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [resumeData]);

  const completionPercentage = calculateCompletionPercentage();

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      FileText,
      Award,
      Settings,
      Briefcase,
      GraduationCap,
      User,
    };
    return iconMap[iconName] || FileText;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col font-inter bg-gray-900">
      <Header
        onDownloadPdf={handleDownloadPdf}
        onSelectTemplate={handleSelectTemplate}
        onZoomChange={setZoomLevel}
        onToggleMobileSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isMobileSidebarOpen={isRightSidebarOpen}
        activeTemplate={resumeData.template}
        showBuilderActions={true}
        onSaveResume={handleSaveResume}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className={`w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out ${activeTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative absolute inset-0`}>
          <div className="max-w-lg mx-auto space-y-6">
            {/* Completion Progress */}
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
              <h3 className="text-base font-medium text-white mb-3">Resume Completion</h3>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 text-center">{Math.round(completionPercentage)}% Complete</p>
            </div>

            {/* Personal Details */}
            <MinimalCollapsibleSection
              title="Personal Details"
              icon={User}
              isOpen={openSections.personal}
              onToggle={() => toggleSection('personal')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MinimalInput
                  label="First Name"
                  value={resumeData.personalInfo.name.split(' ')[0] || ''}
                  onChange={(e) => {
                    const lastName = resumeData.personalInfo.name.split(' ').slice(1).join(' ');
                    updatePersonalInfo('name', `${e.target.value} ${lastName}`.trim());
                  }}
                  placeholder="Eric"
                />
                <MinimalInput
                  label="Last Name"
                  value={resumeData.personalInfo.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(e) => {
                    const firstName = resumeData.personalInfo.name.split(' ')[0] || '';
                    updatePersonalInfo('name', `${firstName} ${e.target.value}`.trim());
                  }}
                  placeholder="Johnson"
                />
              </div>
              <MinimalInput id="email" label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="eric.johnson@example.com" />
              <MinimalInput id="phone" label="Phone" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
              <MinimalInput id="linkedin" label="LinkedIn Profile" type="url" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/ericjohnson" />
              <MinimalInput id="portfolio" label="Portfolio/Website" type="url" value={resumeData.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} placeholder="ericjohnson.com" />
              <MinimalInput id="address" label="Address (City, State)" value={resumeData.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="San Francisco, CA" />
            </MinimalCollapsibleSection>

            {/* Professional Summary */}
            <MinimalCollapsibleSection
              title="Professional Summary"
              icon={Award}
              isOpen={openSections.summary}
              onToggle={() => toggleSection('summary')}
            >
              <MinimalInput
                label="Professional Summary"
                value={resumeData.summary}
                onChange={(e) => updateSummary(e.target.value)}
                isTextArea
                rows={4}
                placeholder="A brief summary of your professional goals and experience..."
              />
            </MinimalCollapsibleSection>

            {/* Work Experience */}
            <MinimalCollapsibleSection
              title="Work Experience"
              icon={Briefcase}
              isOpen={openSections.experience}
              onToggle={() => toggleSection('experience')}
            >
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border border-gray-600 p-4 rounded-lg mb-4 bg-gray-750">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Remove Experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <MinimalInput
                      label="Job Title"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Senior Professional"
                    />
                    <MinimalInput
                      label="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Solutions Inc."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MinimalInput
                        label="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="Jan 2022"
                      />
                      <MinimalInput
                        label="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="Present"
                      />
                    </div>
                    <MinimalInput
                      label="Responsibilities (one per line)"
                      value={exp.description.join('\n')}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                      isTextArea
                      rows={4}
                      placeholder="• Led key projects serving customers"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="w-full py-3 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <Plus className="h-5 w-5" /> Add Experience
              </button>
            </MinimalCollapsibleSection>

            {/* Education */}
            <MinimalCollapsibleSection
              title="Education"
              icon={GraduationCap}
              isOpen={openSections.education}
              onToggle={() => toggleSection('education')}
            >
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-600 p-4 rounded-lg mb-4 bg-gray-750">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                      title="Remove Education"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <MinimalInput
                      label="Degree/Field of Study"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor of Science in Computer Science"
                    />
                    <MinimalInput
                      label="Institution Name"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="University of California"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MinimalInput
                        label="Start Date"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        placeholder="Aug 2020"
                      />
                      <MinimalInput
                        label="End Date"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        placeholder="May 2024"
                      />
                    </div>
                    <MinimalInput
                      label="GPA (Optional)"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8"
                    />
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="w-full py-3 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors">
                <Plus className="h-5 w-5" /> Add Education
              </button>
            </MinimalCollapsibleSection>

            {/* Skills */}
            <MinimalCollapsibleSection
              title="Skills & Competencies"
              icon={Award}
              isOpen={openSections.skills}
              onToggle={() => toggleSection('skills')}
            >
              <p className="text-sm text-gray-400 mb-4">Enter skills comma-separated within each category.</p>
              <div className="space-y-4">
                <MinimalInput
                  label="Technical Skills"
                  value={resumeData.skills.Technical.join(', ')}
                  onChange={(e) => handleSkillsChange('Technical', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Microsoft Office, Data Analysis, Programming Languages"
                />
                <MinimalInput
                  label="Tools & Software"
                  value={resumeData.skills.Tools.join(', ')}
                  onChange={(e) => handleSkillsChange('Tools', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Slack, Trello, CRM Software, Analytics Tools"
                />
                <MinimalInput
                  label="Soft Skills & Languages"
                  value={resumeData.skills.Soft.join(', ')}
                  onChange={(e) => handleSkillsChange('Soft', e.target.value)}
                  isTextArea
                  rows={3}
                  placeholder="Leadership, Communication, Spanish, French"
                />
              </div>
            </MinimalCollapsibleSection>

            {/* Custom Sections */}
            {resumeData.customSections.map((section) => {
              const IconComponent = getIconComponent(section.icon);
              return (
                <MinimalCollapsibleSection
                  key={section.id}
                  title={section.title}
                  icon={IconComponent}
                  isOpen={openSections[section.id] || false}
                  onToggle={() => toggleSection(section.id)}
                  canRename={true}
                  onRename={(newTitle) => renameCustomSection(section.id, newTitle)}
                  canDelete={true}
                  onDelete={() => deleteCustomSection(section.id)}
                >
                  <MinimalInput
                    label={`${section.title} Content`}
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                    isTextArea
                    rows={4}
                    placeholder={`Add your ${section.title.toLowerCase()} details here...`}
                  />
                </MinimalCollapsibleSection>
              );
            })}

            {/* Add New Section Button */}
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors"
            >
              <Plus className="h-5 w-5" /> Add New Section
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden md:flex flex-col w-full md:w-1/2 p-8 overflow-y-auto custom-scrollbar items-center justify-start relative">
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
          <div className="fixed inset-y-0 right-0 w-80 bg-gray-900 z-40 p-6 overflow-y-auto md:hidden">
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
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

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAdd={addCustomSection}
      />
    </div>
  );
}