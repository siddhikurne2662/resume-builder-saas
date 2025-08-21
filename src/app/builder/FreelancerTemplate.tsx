// src/app/builder/FreelancerTemplate.tsx

import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface FreelancerTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold border-b border-black mb-3 tracking-wider">{children}</h2>
);

const FreelancerTemplate: React.FC<FreelancerTemplateProps> = ({ resumeData }) => {
  const { personalInfo, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold tracking-wider mb-2">{personalInfo.name}</h1>
      <div className="text-sm">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} • {personalInfo.linkedin}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6">
      <SectionTitle>EXPERIENCE</SectionTitle>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold text-sm">{exp.company}</h3>
              <p className="italic text-sm">{exp.title}</p>
            </div>
            <div className="text-right text-sm">
              <div>{exp.startDate} – {exp.endDate}</div>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm ml-4">
            {exp.description.map((bullet, bIndex) => (
              <li key={bIndex}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6">
      <SectionTitle>EDUCATION</SectionTitle>
      {education.map((edu, index) => (
        <div key={edu.id || index} className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-bold text-sm">{edu.institution}</h3>
            <p className="italic text-sm">{edu.degree}</p>
            {edu.gpa && <p className="text-sm">{edu.gpa}</p>}
          </div>
          <div className="text-right text-sm">
            <div>{edu.endDate}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div>
      <SectionTitle>SKILLS & OTHER</SectionTitle>
      <div className="space-y-1 text-sm">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <span className="font-bold capitalize">{category.replace(/([A-Z])/g, ' $1')}: </span>
            {skillList.join(', ')}
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
    <div className="max-w-4xl mx-auto p-8 bg-white font-serif text-black">
      {renderContactInfo()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default FreelancerTemplate;