"use client";
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Download,
  LayoutTemplate,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  Settings,
  Mail,
  Phone,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Save,
  Palette,
  ClipboardList,
  FileText
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import Header from '../components/Header';
import MobileTabs from '../components/MobileTabs';
import { EnhancedResumeData, CustomSection, ResumeData } from '@/types/resume';
import { Toaster, toast } from 'react-hot-toast';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { initializeFirebase, db, auth } from '@/lib/firebase';
import { initialResumeData } from '@/data/initialResumeData';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { generateAiContent } from '@/lib/aiService';
import AuthLayout from '../components/AuthLayout';
import AtsChecker from '../components/AtsChecker';

// Dynamically import html2pdf.js without ssr to avoid window errors
const Html2Pdf = dynamic(() => import('html2pdf.js'), { ssr: false });

// A sleek, collapsible section for the new UI
const ElegantCollapsibleSection = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onToggle,
  onRename,
  canRename = false,
  onDelete,
  canDelete = false,
  aiSuggest,
  isGenerating
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
  aiSuggest?: () => void;
  isGenerating?: boolean;
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
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 transition-all duration-300 hover:shadow-lg group">
      <div className="flex items-center justify-between p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center gap-4 flex-1 text-left">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
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
                className="bg-transparent border-b border-white/30 rounded-none px-0 py-1 text-base font-medium text-white flex-1 focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
              <button type="button" onClick={handleRename} className="p-1 text-green-400 hover:text-green-300">
                <Check className="w-4 h-4" />
              </button>
              <button type="button" onClick={handleCancel} className="p-1 text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-base font-semibold text-white">{title}</h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          {aiSuggest && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); aiSuggest(); }}
              disabled={isGenerating}
              className="p-2 text-cyan-400 hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="AI Suggest"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}
          {canRename && !isEditing && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-2 text-gray-400 hover:text-gray-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Rename section"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="p-2 text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Delete section"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <div onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-gray-300 transition-all duration-200">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="px-5 pb-5 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

const AddSectionModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (title: string, icon: 'FileText' | 'Award' | 'Settings' | 'Briefcase' | 'GraduationCap' | 'User' | 'Palette' | 'ClipboardList') => void }) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('FileText');
  const iconOptions = [
    { name: 'FileText', icon: FileText },
    { name: 'Award', icon: Award },
    { name: 'Settings', icon: Settings },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'User', icon: User },
    { name: 'Palette', icon: Palette },
    { name: 'ClipboardList', icon: ClipboardList },
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
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-white mb-4">Add New Section</h3>
        <div className="space-y-4">
          <FloatingLabelInput
            id="new-section-title"
            label="Section Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Projects, Certifications, Languages"
          />
          <div>
            <label className="block text-sm text-slate-400 font-medium mb-2">Icon</label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map(({ name, icon: IconComponent }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedIcon(name)}
                  className={`p-3 rounded-lg border transition-colors flex flex-col items-center justify-center ${
                    selectedIcon === name ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-400 mt-1">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim()}
            type="button"
            className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'ats'>('edit');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); // This state seems unused
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Initialize Firebase on the client side
  useEffect(() => {
    initializeFirebase();
  }, []);

  const user = auth?.currentUser;
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingExperience, setIsGeneratingExperience] = useState<string | null>(null);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // NEW: State to store the dynamically imported html2pdf library
  const [html2pdfInstance, setHtml2PdfInstance] = useState<any>(null);
  const [isHtml2PdfReady, setIsHtml2PdfReady] = useState(false);

  useEffect(() => {
    import('html2pdf.js').then((module) => {
      setHtml2PdfInstance(module.default);
      setIsHtml2PdfReady(true);
    });
  }, []);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: true,
    education: true,
    skills: true
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    const templateFromUrl = searchParams.get('template');
    if (templateFromUrl) {
      setResumeData(prev => ({ ...prev, template: templateFromUrl }));
    }
    const resumeIdFromUrl = searchParams.get('resumeId');
    if (resumeIdFromUrl) {
      setCurrentResumeId(resumeIdFromUrl);
      const fetchResumeData = async () => {
        try {
          if (!db) {
            toast.error("Database not initialized. Please refresh.");
            return;
          }
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
      if (!isHtml2PdfReady || !html2pdfInstance) {
        toast.error('PDF library not yet loaded. Please try again in a moment.', { id: 'pdf-toast' });
        return;
      }
      toast.loading('Generating PDF...', { id: 'pdf-toast' });
      const element = resumePreviewRef.current;
      const originalZoom = zoomLevel;
      setZoomLevel(1);
      await new Promise(resolve => setTimeout(resolve, 100));
      const pdf = await html2pdfInstance().from(element).set({
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
    if (!user || !db) {
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

  const addCustomSection = (title: string, icon: 'FileText' | 'Award' | 'Settings' | 'Briefcase' | 'GraduationCap' | 'User' | 'Palette' | 'ClipboardList') => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title,
      content: '',
      icon
    };
    setResumeData(prev => ({ ...prev, customSections: [...prev.customSections, newSection] }));
    setOpenSections(prev => ({ ...prev, [newSection.id]: true }));
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
    setResumeData(prev => ({ ...prev, customSections: prev.customSections.filter(section => section.id !== id) }));
    setOpenSections(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const renameCustomSection = (id: string, newTitle: string) => {
    updateCustomSection(id, 'title', newTitle);
  };

  type PersonalInfo = ResumeData['personalInfo'];
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const handleAiSuggestSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const suggestedSummary = await generateAiContent({
        sectionType: 'summary',
        jobTitle: resumeData.experience[0]?.title || 'Tech Student',
        experienceLevel: resumeData.experience.length > 0 ? 'experienced' : 'entry-level',
        context: resumeData.summary,
        techSkills: [...resumeData.skills.Technical, ...resumeData.skills.Tools, ...resumeData.skills.Soft],
      });
      if (typeof suggestedSummary === 'string') {
        setResumeData(prevData => ({ ...prevData, summary: suggestedSummary }));
        toast.success('AI suggested summary!');
      } else {
        toast.error('AI could not generate summary.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary with AI.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const addExperience = () => {
    const newExp: ResumeData['experience'][0] = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: [''],
      address: undefined
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof ResumeData['experience'][0], value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleAiSuggestExperienceDescription = async (expId: string, currentDescription: string[]) => {
    setIsGeneratingExperience(expId);
    try {
      const currentExp = resumeData.experience.find(exp => exp.id === expId);
      if (!currentExp) {
        toast.error('Experience item not found.');
        return;
      }
      const suggestedDescription = await generateAiContent({
        sectionType: 'experience',
        context: currentDescription.join('\n'),
        jobTitle: currentExp.title,
        experienceLevel: 'experienced',
        techSkills: [...resumeData.skills.Technical, ...resumeData.skills.Tools, ...resumeData.skills.Soft],
      });
      if (typeof suggestedDescription === 'string') {
        updateExperience(expId, 'description', suggestedDescription.split('\n'));
        toast.success('AI suggested experience points!');
      } else {
        toast.error('AI could not generate experience points.');
      }
    } catch (error) {
      console.error('Error generating experience:', error);
      toast.error('Failed to generate experience with AI.');
    } finally {
      setIsGeneratingExperience(null);
    }
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addEducation = () => {
    const newEdu: ResumeData['education'][0] = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      gpa: '',
      address: undefined
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
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
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

  const handleAiSuggestSkills = async () => {
    setIsGeneratingSkills(true);
    try {
      const suggestedSkills = await generateAiContent({
        sectionType: 'skill',
        jobTitle: resumeData.experience[0]?.title || 'Software Engineer',
        experienceLevel: resumeData.experience.length > 0 ? 'experienced' : 'entry-level',
        techSkills: [...resumeData.skills.Technical, ...resumeData.skills.Tools, ...resumeData.skills.Soft],
      });
      if (typeof suggestedSkills === 'string') {
        const newSkills = suggestedSkills.split(',').map(s => s.trim());
        setResumeData(prevData => ({
          ...prevData,
          skills: {
            Technical: newSkills.filter((s, i) => i % 3 === 0),
            Tools: newSkills.filter((s, i) => i % 3 === 1),
            Soft: newSkills.filter((s, i) => i % 3 === 2),
          }
        }));
        toast.success('AI suggested skills!');
      } else {
        toast.error('AI could not generate skills.');
      }
    } catch (error) {
      console.error('Error generating skills:', error);
      toast.error('Failed to generate skills with AI.');
    } finally {
      setIsGeneratingSkills(false);
    }
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
    totalFields += resumeData.customSections.length;
    resumeData.customSections.forEach(section => {
      if (section.content.trim()) completedFields++;
    });
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [resumeData]);

  const completionPercentage = calculateCompletionPercentage();

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = { FileText, Award, Settings, Briefcase, GraduationCap, User, Palette, ClipboardList, LinkIcon, Mail, Phone, MapPin };
    return iconMap[iconName] || FileText;
  };

  if (!user) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex flex-col font-inter bg-slate-900">
        <Header
          onDownloadPdf={isHtml2PdfReady ? handleDownloadPdf : undefined}
          onSelectTemplate={handleSelectTemplate}
          onZoomChange={setZoomLevel} // This prop is not used in Header.tsx
          onToggleMobileSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          isMobileSidebarOpen={isRightSidebarOpen}
          activeTemplate={resumeData.template}
          showBuilderActions={true}
          userName={user.displayName || user.email?.split('@')[0] || 'User'}
          userProfileImageUrl={user.photoURL || ''}
          onSaveResume={user && db ? handleSaveResume : undefined}
        />

        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - Editor */}
          <div className={`w-full md:w-[480px] p-6 overflow-y-auto custom-scrollbar bg-slate-900 transition-all duration-300 ease-in-out md:relative absolute inset-0 z-20 ${activeTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="max-w-lg mx-auto space-y-6">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-base font-medium text-white mb-3">Resume Completion</h3>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 text-center">{Math.round(completionPercentage)}% Complete</p>
              </div>

              <ElegantCollapsibleSection
                title="Personal Details"
                icon={User}
                isOpen={openSections.personal}
                onToggle={() => toggleSection('personal')}
              >
                <FloatingLabelInput id="name" label="Full Name" type="text" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} placeholder="Eric Johnson" icon={User} />
                <FloatingLabelInput id="email" label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="eric.johnson@example.com" icon={Mail} />
                <FloatingLabelInput id="phone" label="Phone" type="tel" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 123-4567" icon={Phone} />
                <FloatingLabelInput id="linkedin" label="LinkedIn Profile" type="url" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/ericjohnson" icon={LinkIcon} />
                <FloatingLabelInput id="portfolio" label="Portfolio/Website" type="url" value={resumeData.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} placeholder="ericjohnson.com" icon={LinkIcon} />
                <FloatingLabelInput id="address" label="Address (City, State)" value={resumeData.personalInfo.address} onChange={(e) => updatePersonalInfo('address', e.target.value)} placeholder="San Francisco, CA" icon={MapPin} />
              </ElegantCollapsibleSection>

              <ElegantCollapsibleSection
                title="Professional Summary"
                icon={Award}
                isOpen={openSections.summary}
                onToggle={() => toggleSection('summary')}
                aiSuggest={handleAiSuggestSummary}
                isGenerating={isGeneratingSummary}
              >
                <FloatingLabelInput
                  id="summary"
                  label="A brief summary of your professional goals and experience..."
                  value={resumeData.summary}
                  onChange={(e) => updateSummary(e.target.value)}
                  isTextArea
                  rows={4}
                  placeholder="A brief summary of your professional goals and experience..."
                />
              </ElegantCollapsibleSection>

              <ElegantCollapsibleSection
                title="Work Experience"
                icon={Briefcase}
                isOpen={openSections.experience}
                onToggle={() => toggleSection('experience')}
              >
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="p-4 rounded-xl mb-4 bg-slate-800/50 border border-slate-700/50 relative group">
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
                      <FloatingLabelInput id={`exp-title-${exp.id}`} label="Job Title" type="text" value={exp.title} onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} placeholder="Senior Professional" />
                      <FloatingLabelInput id={`exp-company-${exp.id}`} label="Company" type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Solutions Inc." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabelInput id={`exp-start-${exp.id}`} label="Start Date" type="text" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                        <FloatingLabelInput id={`exp-end-${exp.id}`} label="End Date" type="text" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="Present" />
                      </div>
                      <FloatingLabelInput
                        id={`exp-desc-${exp.id}`}
                        label="Responsibilities (one per line)"
                        value={exp.description.join('\n')}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value.split('\n'))}
                        isTextArea
                        rows={4}
                        placeholder="• Led key projects serving customers"
                      />
                      <button
                        onClick={() => handleAiSuggestExperienceDescription(exp.id, exp.description)}
                        disabled={isGeneratingExperience === exp.id}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-slate-700 text-white text-sm font-medium leading-normal hover:bg-slate-600 transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingExperience === exp.id ? (
                          <div className="flex items-center justify-center gap-1">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Generating...
                          </div>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" /> AI Suggest
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="w-full py-3 bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-600 transition-colors"
                >
                  <Plus className="h-5 w-5" /> Add Experience
                </button>
              </ElegantCollapsibleSection>

              <ElegantCollapsibleSection
                title="Education"
                icon={GraduationCap}
                isOpen={openSections.education}
                onToggle={() => toggleSection('education')}
              >
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 rounded-xl mb-4 bg-slate-800/50 border border-slate-700/50 relative group">
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
                      <FloatingLabelInput id={`edu-degree-${edu.id}`} label="Degree/Field of Study" type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science in Computer Science" />
                      <FloatingLabelInput id={`edu-institution-${edu.id}`} label="Institution Name" type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University of California" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabelInput id={`edu-start-${edu.id}`} label="Start Date" type="text" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} placeholder="Aug 2020" />
                        <FloatingLabelInput id={`edu-end-${edu.id}`} label="End Date" type="text" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} placeholder="May 2024" />
                      </div>
                      <FloatingLabelInput id={`edu-gpa-${edu.id}`} label="GPA (Optional)" type="text" value={edu.gpa} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8" />
                    </div>
                  </div>
                ))}
                <button onClick={addEducation} className="w-full py-3 bg-slate-700 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-600 transition-colors">
                  <Plus className="h-5 w-5" /> Add Education
                </button>
              </ElegantCollapsibleSection>

              <ElegantCollapsibleSection
                title="Skills & Competencies"
                icon={ClipboardList}
                isOpen={openSections.skills}
                onToggle={() => toggleSection('skills')}
                aiSuggest={handleAiSuggestSkills}
                isGenerating={isGeneratingSkills}
              >
                <p className="text-sm text-slate-400 mb-4">Enter skills comma-separated within each category.</p>
                <div className="space-y-4">
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
              </ElegantCollapsibleSection>

              {resumeData.customSections.map((section) => {
                const IconComponent = getIconComponent(section.icon);
                return (
                  <ElegantCollapsibleSection
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
                    <FloatingLabelInput
                      id={`custom-content-${section.id}`}
                      label={`${section.title} Content`}
                      value={section.content}
                      onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                      isTextArea
                      rows={4}
                      placeholder={`Add your ${section.title.toLowerCase()} details here...`}
                    />
                  </ElegantCollapsibleSection>
                );
              })}

              <button
                onClick={() => setShowAddSectionModal(true)}
                className="w-full py-3 bg-cyan-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-600 transition-colors"
              >
                <Plus className="h-5 w-5" /> Add New Section
              </button>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex justify-center items-start md:relative absolute inset-0 z-10 transition-transform duration-300 ease-in-out md:translate-x-0 bg-slate-900"
            style={{ transform: activeTab === 'preview' ? 'translateX(0)' : 'translateX(100%)' }}
          >
            <div className="relative w-[595px] flex-shrink-0" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <ResumePreview resumeData={resumeData} activeTemplate={resumeData.template} ref={resumePreviewRef} />
            </div>
          </div>
        </div>
      </div>
      <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onAdd={addCustomSection}
      />
    </AuthLayout>
  );
}
