// src/app/builder/EcommerceCfoTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface EcommerceCfoTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold border-b border-black mb-4 tracking-wider uppercase">{children}</h2>
);

const EcommerceCfoTemplate: React.FC<EcommerceCfoTemplateProps> = ({ resumeData }) => {
  const { personalInfo, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold tracking-wider mb-2">{personalInfo.name}</h1>
      {experience.length > 0 && (
        <h2 className="text-lg font-bold mb-3">{experience[0].title}</h2>
      )}
      <div className="text-sm">
        {personalInfo.address} • {personalInfo.email} • {personalInfo.phone}
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
              <h3 className="font-bold text-sm">{exp.company}</h3>
              <p className="font-semibold text-sm">{exp.title}</p>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold">{exp.address}</div>
              <div>{exp.startDate} – {exp.endDate}</div>
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
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm">{edu.institution}</h3>
              <p className="italic text-sm">{edu.degree}</p>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold">{edu.address}</div>
              <div>{edu.startDate} – {edu.endDate}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6">
      <SectionTitle>Additional Information</SectionTitle>
      <div className="space-y-2 text-sm">
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

export default EcommerceCfoTemplate;
