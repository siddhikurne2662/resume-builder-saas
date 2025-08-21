// Updated DataAnalystTemplate with smaller text sizes
// src/app/builder/DataAnalystTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface DataAnalystTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-center mb-3 break-inside-avoid">
    <h2 className="text-sm font-bold uppercase text-black print:text-black">{children}</h2>
    <hr className="border-t-2 border-black mt-1" />
  </div>
);

const DataAnalystTemplate: React.FC<DataAnalystTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-4 print:mb-3 break-inside-avoid">
      <h1 className="text-xl font-bold mb-2 text-black print:text-black print:text-lg">{personalInfo.name}</h1>
      <p className="text-xs text-gray-700 text-black print:text-black">
        {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin]
          .filter(Boolean)
          .join(' • ')}
      </p>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-4 text-xs text-gray-600 italic text-black print:text-black break-inside-avoid">
      <p>{summary}</p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="mb-4 break-inside-avoid">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-xs text-black print:text-black">{exp.company}{exp.address ? `, ${exp.address}` : ''}</h3>
              <h4 className="font-bold text-xs text-black print:text-black">{exp.title}</h4>
            </div>
            <div className="text-xs font-medium text-right text-black print:text-black">
              {exp.startDate} – {exp.endDate}
            </div>
          </div>
          <ul className="list-disc list-inside ml-3 space-y-1 text-black print:text-black">
            {exp.description.map((resp, respIndex) => (
              <li key={respIndex} className="text-xs leading-relaxed">{resp}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Education</SectionTitle>
      {education.map((edu, index) => (
        <div key={edu.id || index} className="mb-3 break-inside-avoid">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-xs text-black print:text-black">{edu.institution}{edu.address ? `, ${edu.address}` : ''}</h3>
              <p className="text-xs font-bold text-black print:text-black">{edu.degree}</p>
            </div>
            <div className="text-xs font-medium text-black print:text-black">
              {edu.endDate}
            </div>
          </div>
          {edu.gpa && (
            <p className="text-xs mt-1 text-black print:text-black">GPA: {edu.gpa}</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="break-inside-avoid">
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-1 text-xs text-black print:text-black">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <span className="font-bold capitalize">{category.replace(/([A-Z])/g, ' $1')}:</span>{' '}{skillList.join(', ')}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-4 break-inside-avoid">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-gray-700 text-xs leading-relaxed text-black print:text-black whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white font-sans text-black print:p-8">
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