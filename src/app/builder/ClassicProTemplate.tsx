// src/app/builder/ClassicProTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface ClassicProTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold border-b border-black mb-4 tracking-wider uppercase">{children}</h2>
);

const ClassicProTemplate: React.FC<ClassicProTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold tracking-wider mb-2">{personalInfo.name}</h1>
      <div className="text-sm">
        {personalInfo.address} • {personalInfo.email} • {personalInfo.phone} • {personalInfo.linkedin}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-8">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-base">{exp.company}</h3>
              <p className="italic text-base">{exp.title}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-base">{exp.endDate}</p>
              <p className="text-base">{exp.address}</p>
            </div>
          </div>
          <ul className="list-disc list-inside text-sm ml-4 space-y-1">
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
      {education.map((edu, index) => (
        <div key={edu.id || index} className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold text-base">{edu.institution}</h3>
              <p className="italic text-base">{edu.degree}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-base">{edu.endDate}</p>
              <p className="text-base">{edu.address}</p>
            </div>
          </div>
          {edu.gpa && (
            <p className="text-sm mt-1">GPA: {edu.gpa}</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6">
      <SectionTitle>Additional Information</SectionTitle>
      <div className="space-y-2">
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
    <div className="max-w-4xl mx-auto p-8 bg-white text-black font-serif">
      {renderContactInfo()}
      {summary && (
        <div className="mb-6">
          <SectionTitle>SUMMARY</SectionTitle>
          <p className="text-sm leading-relaxed">{summary}</p>
        </div>
      )}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default ClassicProTemplate;
