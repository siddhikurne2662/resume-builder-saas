// src/app/builder/DataAnalystTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface DataAnalystTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center mb-4">
    <h2 className="text-lg font-bold uppercase">{children}</h2>
    <hr className="border-t-2 border-black mt-1" />
  </div>
);

const DataAnalystTemplate: React.FC<DataAnalystTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold mb-2">{personalInfo.name}</h1>
      <p className="text-sm text-gray-700">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} • {personalInfo.linkedin}
      </p>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-6 text-sm text-gray-600 italic">
      <p>
        {summary}
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-8">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-sm">{exp.company}, {exp.address}</h3>
              <h4 className="font-bold text-sm">{exp.title}</h4>
            </div>
            <div className="text-sm font-medium text-right">
              {exp.startDate} – {exp.endDate}
            </div>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-2">
            {exp.description.map((resp, respIndex) => (
              <li key={respIndex} className="text-sm leading-relaxed">{resp}</li>
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
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-sm">{edu.institution}, {edu.address}</h3>
              <p className="text-sm font-bold">{edu.degree}</p>
            </div>
            <div className="text-sm font-medium">
              {edu.endDate}
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
    <div>
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-2 text-sm">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <span className="font-bold capitalize">{category.replace(/([A-Z])/g, ' $1')}:</span> {skillList.join(', ')}
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
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans">
      {renderContactInfo()}
      {summary && renderSummary()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default DataAnalystTemplate;
