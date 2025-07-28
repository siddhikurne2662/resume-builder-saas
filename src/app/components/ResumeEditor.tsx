// src/app/components/ResumeEditor.tsx
'use client';

import React from 'react';
import { Plus, Minus, User, Briefcase, GraduationCap, Sparkles, Award } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import FloatingLabelInput from './FloatingLabelInput';
import EditorSection from './EditorSection';

interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  completionPercentage: number;
}

export default function ResumeEditor({
  resumeData,
  setResumeData,
  completionPercentage,
}: ResumeEditorProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleSummaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResumeData(prevData => ({
      ...prevData,
      summary: e.target.value,
    }));
  };

  const handleArrayItemChange = (
    section: 'experience' | 'education',
    id: string,
    field: string,
    value: string | string[],
  ) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: prevData[section].map(item => {
        if (item.id === id) {
          if (field === 'description' && typeof value === 'string') {
            return { ...item, [field]: value.split('\n') };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    }));
  };

  const addArrayItem = (section: 'experience' | 'education') => {
    const newItemId = `${section}-${Date.now()}`;
    if (section === 'experience') {
      setResumeData(prevData => ({
        ...prevData,
        experience: [
          ...prevData.experience,
          { id: newItemId, title: '', company: '', startDate: '', endDate: '', description: [''] },
        ],
      }));
    } else if (section === 'education') {
      setResumeData(prevData => ({
        ...prevData,
        education: [
          ...prevData.education,
          { id: newItemId, degree: '', institution: '', startDate: '', endDate: '', gpa: '' },
        ],
      }));
    }
  };

  const removeArrayItem = (section: 'experience' | 'education', id: string) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: prevData[section].filter(item => item.id !== id),
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

  const handleSaveChanges = () => {
    console.log('Saving changes:', resumeData);
  };

  return (
    <div className="relative h-full pb-20">
      <div className="space-y-6">
        {/* Personal Info Section */}
        <EditorSection title="Contact Information" icon={User}> {/* Updated title based on provided HTML */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput id="name" name="name" label="Full Name" type="text" value={personalInfo.name} onChange={handlePersonalInfoChange} />
            <FloatingLabelInput id="email" name="email" label="Email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} />
            <FloatingLabelInput id="phone" name="phone" label="Phone Number" type="tel" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
            <FloatingLabelInput id="linkedin" name="linkedin" label="LinkedIn Profile URL" type="url" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} />
            <FloatingLabelInput id="portfolio" name="portfolio" label="Portfolio URL" type="url" value={personalInfo.portfolio} onChange={handlePersonalInfoChange} />
            <FloatingLabelInput id="address" name="address" label="Address (City, Country)" type="text" value={personalInfo.address} onChange={handlePersonalInfoChange} />
          </div>
        </EditorSection>

        {/* Summary Section */}
        <EditorSection title="Summary" icon={Award}> {/* Updated title */}
          <FloatingLabelInput
            id="summary"
            name="summary"
            label="A brief summary of your professional goals and experience..."
            value={summary}
            onChange={handleSummaryChange}
            isTextArea
            rows={5}
          />
        </EditorSection>

        {/* Experience Section */}
        <EditorSection title="Work Experience" icon={Briefcase}>
          {experience.map((exp, index) => (
            <div key={exp.id} className="border border-dark-border-light p-4 rounded-lg mb-4 bg-dark-bg-medium shadow-sm relative group hover-lift transition-all-fast"> {/* Used new custom colors */}
              <h4 className="text-lg font-outfit font-semibold text-white mb-3">Experience {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FloatingLabelInput id={`exp-title-${exp.id}`} label="Job Title" type="text" value={exp.title} onChange={(e) => handleArrayItemChange('experience', exp.id, 'title', e.target.value)} />
                <FloatingLabelInput id={`exp-company-${exp.id}`} label="Company Name" type="text" value={exp.company} onChange={(e) => handleArrayItemChange('experience', exp.id, 'company', e.target.value)} />
                <FloatingLabelInput id={`exp-start-${exp.id}`} label="Start Date (e.g., Jan 2023)" type="text" value={exp.startDate} onChange={(e) => handleArrayItemChange('experience', exp.id, 'startDate', e.target.value)} />
                <FloatingLabelInput id={`exp-end-${exp.id}`} label="End Date (e.g., Dec 2023 or Present)" type="text" value={exp.endDate} onChange={(e) => handleArrayItemChange('experience', exp.id, 'endDate', e.target.value)} />
              </div>
              <FloatingLabelInput
                id={`exp-desc-${exp.id}`}
                label="Responsibilities (one per line)"
                value={exp.description.join('\n')}
                onChange={(e) => handleArrayItemChange('experience', exp.id, 'description', e.target.value)}
                isTextArea
                rows={4}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => removeArrayItem('experience', exp.id)}
                  className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Remove Experience"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => addArrayItem('experience')} className="btn-secondary !bg-dark-bg-card hover:!bg-dark-border-light !text-white mt-4 flex items-center rounded-full px-4 h-10"> {/* Adapted styling */}
            <Plus className="mr-2 h-5 w-5" /> Add New Experience
          </button>
        </EditorSection>

        {/* Education Section */}
        <EditorSection title="Education" icon={GraduationCap}>
          {education.map((edu, index) => (
            <div key={edu.id} className="border border-dark-border-light p-4 rounded-lg mb-4 bg-dark-bg-medium shadow-sm relative group hover-lift transition-all-fast"> {/* Used new custom colors */}
              <h4 className="text-lg font-outfit font-semibold text-white mb-3">Education {index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FloatingLabelInput id={`edu-degree-${edu.id}`} label="Degree/Field of Study" type="text" value={edu.degree} onChange={(e) => handleArrayItemChange('education', edu.id, 'degree', e.target.value)} />
                <FloatingLabelInput id={`edu-institution-${edu.id}`} label="Institution Name" type="text" value={edu.institution} onChange={(e) => handleArrayItemChange('education', edu.id, 'institution', e.target.value)} />
                <FloatingLabelInput id={`edu-start-${edu.id}`} label="Start Date (e.g., Aug 2020)" type="text" value={edu.startDate} onChange={(e) => handleArrayItemChange('education', edu.id, 'startDate', e.target.value)} />
                <FloatingLabelInput id={`edu-end-${edu.id}`} label="End Date (e.g., May 2024)" type="text" value={edu.endDate} onChange={(e) => handleArrayItemChange('education', edu.id, 'endDate', e.target.value)} />
              </div>
              <FloatingLabelInput id={`edu-gpa-${edu.id}`} label="GPA (Optional)" type="text" value={edu.gpa} onChange={(e) => handleArrayItemChange('education', edu.id, 'gpa', e.target.value)} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => removeArrayItem('education', edu.id)}
                  className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Remove Education"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => addArrayItem('education')} className="btn-secondary !bg-dark-bg-card hover:!bg-dark-border-light !text-white mt-4 flex items-center rounded-full px-4 h-10">
            <Plus className="mr-2 h-5 w-5" /> Add New Education
          </button>
        </EditorSection>

        {/* Skills Section */}
        <EditorSection title="Skills" icon={Sparkles}>
          <p className="text-sm text-dark-text-light mb-3">Enter skills comma-separated within each category. Separate with commas.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <FloatingLabelInput
                id="skills-frontend"
                label="Frontend Skills"
                value={skills.frontend.join(', ')}
                onChange={(e) => handleSkillsChange('frontend', e.target.value)}
                isTextArea
                rows={3}
              />
            </div>
            <div>
              <FloatingLabelInput
                id="skills-tools"
                label="Tools & Technologies"
                value={skills.tools.join(', ')}
                onChange={(e) => handleSkillsChange('tools', e.target.value)}
                isTextArea
                rows={3}
              />
            </div>
            <div>
              <FloatingLabelInput
                id="skills-other"
                label="Other Skills"
                value={skills.other.join(', ')}
                onChange={(e) => handleSkillsChange('other', e.target.value)}
                isTextArea
                rows={3}
              />
            </div>
          </div>
        </EditorSection>

        {/* Progress Indicator */}
        <div className="section-card p-4 bg-dark-bg-card border border-dark-border-light"> {/* Used new custom colors */}
          <h3 className="text-xl font-outfit font-semibold text-white mb-4">Resume Completion</h3>
          <div className="w-full bg-dark-border-light rounded-full h-3"> {/* Used new custom colors */}
            <div
              className="bg-light-button-accent h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-dark-text-light mt-2 text-center">{Math.round(completionPercentage)}% Complete</p>
        </div>

      </div>

      {/* Sticky Save Changes Button */}
      <div className="sticky-bottom-bar bg-dark-bg-medium border-t border-dark-border-light p-4 shadow-lg flex justify-end"> {/* Updated colors */}
        <button onClick={handleSaveChanges} className="bg-blue-call-to-action text-white hover:bg-blue-button-hover font-bold px-4 py-2 rounded-full transition-colors font-inter">
          Save Changes
        </button>
      </div>
    </div>
  );
}