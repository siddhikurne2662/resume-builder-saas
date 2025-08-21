// src/app/builder/SoftwareEngineeringLeadTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface SoftwareEngineeringLeadTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-blue-600 mb-4 tracking-wider uppercase">
    {children}
  </h3>
);

const SoftwareEngineeringLeadTemplate: React.FC<SoftwareEngineeringLeadTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="mb-8">
      <h1 className="text-4xl font-light text-blue-600 mb-2">{personalInfo.name}</h1>
      {experience.length > 0 && (
        <h2 className="text-xl text-gray-600 mb-3">{experience[0].title}</h2>
      )}
      <div className="text-sm text-gray-600">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} • {personalInfo.linkedin}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-8">
      <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-8">
      <SectionTitle>Work Experience</SectionTitle>
      {experience.map((exp) => (
        <div key={exp.id} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{exp.title}</h4>
              <p className="text-gray-600 text-sm">{exp.company}, {exp.address}</p>
            </div>
            <div className="text-sm text-gray-600 text-right">
              {exp.startDate} – {exp.endDate}
            </div>
          </div>
          <ul className="list-disc list-inside text-sm ml-4 text-gray-700 space-y-1">
            {exp.description.map((bullet, bIndex) => (
              <li key={bIndex}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-8">
      <SectionTitle>Education</SectionTitle>
      {education.map((edu) => (
        <div key={edu.id} className="flex justify-between items-start mb-1">
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{edu.institution}</h4>
            <p className="italic text-sm text-gray-600">{edu.degree}</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>{edu.endDate}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div>
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-2">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className="text-sm">
            <span className="font-semibold text-gray-800 capitalize">{category.replace(/([A-Z])/g, ' $1')}: </span>
            <span className="text-gray-700">{skillList.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-6">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white font-serif text-gray-800">
      {renderContactInfo()}
      {summary && renderSummary()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default SoftwareEngineeringLeadTemplate;
