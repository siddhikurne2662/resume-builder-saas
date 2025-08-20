// src/app/components/templates/ModernMinimalTemplate.tsx
import React from 'react';
import { ResumeData, CustomSection } from '@/types/resume';

interface ModernMinimalTemplateProps {
  resumeData: ResumeData & { customSections?: CustomSection[] };
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 uppercase tracking-wider">
    {children}
  </h2>
);

const ModernMinimalTemplate: React.FC<ModernMinimalTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-1">{personalInfo.name}</h1>
      <p className="text-gray-600 mb-1 text-sm">Software Engineering Lead</p>
      <p className="text-gray-600 text-xs">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email}
        {personalInfo.linkedin && (
          <>
            {' '}• <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
          </>
        )}
        {personalInfo.portfolio && (
          <>
            {' '}• <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Portfolio</a>
          </>
        )}
      </p>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-6">
      <p className="text-gray-700 text-xs leading-relaxed">
        {summary}
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map(exp => (
        <div key={exp.id} className="mb-5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-xs text-gray-800">{exp.title}</h3>
            <span className="text-xs text-gray-600 font-medium">{exp.startDate} – {exp.endDate}</span>
          </div>
          {exp.company && <p className="text-xs text-gray-600 mb-2 italic">{exp.company}</p>}
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 ml-2">
            {exp.description.map((bullet, idx) => (
              <li key={idx} className="leading-snug">{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6">
      <SectionTitle>Education</SectionTitle>
      {education.map(edu => (
        <div key={edu.id} className="mb-5">
          <h3 className="font-semibold text-xs text-gray-800">{edu.degree}</h3>
          <p className="text-xs text-gray-600 italic">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
          {edu.gpa && <p className="text-xs text-gray-700">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div>
      <SectionTitle>Skills & Other</SectionTitle>
      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className="mb-2">
          <span className="font-semibold text-xs text-gray-800 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}:</span>
          <span className="text-xs text-gray-700 ml-1">{skillList.join(', ')}</span>
        </div>
      ))}
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-6">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed">
      {renderContactInfo()}
      {summary && renderSummary()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default ModernMinimalTemplate;