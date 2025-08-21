// src/app/builder/SoftwareEngineeringLeadTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface SoftwareEngineeringLeadTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold text-blue-600 mb-3 tracking-wider uppercase text-black print:text-black break-inside-avoid">
    {children}
  </h3>
);

const SoftwareEngineeringLeadTemplate: React.FC<SoftwareEngineeringLeadTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <h1 className="text-2xl font-light text-blue-600 mb-2 text-black print:text-black print:text-lg">{personalInfo.name}</h1>
      {experience.length > 0 && (
        <h2 className="text-base text-gray-600 mb-2 text-black print:text-black print:text-xs">{experience[0].title}</h2>
      )}
      <div className="text-xs text-gray-600 text-black print:text-black">
        {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin]
          .filter(Boolean)
          .join(' • ')}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <p className="text-xs leading-relaxed text-gray-700 text-black print:text-black">{summary}</p>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Work Experience</SectionTitle>
      {experience.map((exp) => (
        <div key={exp.id} className="mb-4 break-inside-avoid">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 pr-2">
              <h4 className="font-semibold text-gray-800 text-xs text-black print:text-black">{exp.title}</h4>
              <p className="text-gray-600 text-xs text-black print:text-black">{exp.company}, {exp.address}</p>
            </div>
            <div className="text-xs text-gray-600 text-right text-black print:text-black">
              {exp.startDate} – {exp.endDate}
            </div>
          </div>
          <ul className="list-disc list-inside text-xs ml-3 text-gray-700 space-y-0.5 text-black print:text-black">
            {exp.description.map((bullet, bIndex) => (
              <li key={bIndex}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Education</SectionTitle>
      {education.map((edu) => (
        <div key={edu.id} className="flex justify-between items-start mb-1 break-inside-avoid">
          <div className="flex-1 pr-2">
            <h4 className="font-semibold text-gray-800 text-xs text-black print:text-black">{edu.institution}</h4>
            <p className="italic text-xs text-gray-600 text-black print:text-black">{edu.degree}</p>
          </div>
          <div className="text-right text-xs text-gray-600 text-black print:text-black">
            <div>{edu.endDate}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="break-inside-avoid">
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-1 text-black print:text-black">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className="text-xs">
            <span className="font-semibold text-gray-800 capitalize text-black print:text-black">{category.replace(/([A-Z])/g, ' $1')}: </span>
            <span className="text-gray-700 text-black print:text-black">{skillList.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-4 break-inside-avoid">
          <h2 className="text-sm font-bold border-b border-black mb-2 pb-1 uppercase tracking-wider text-black print:text-black">
            {section.title}
          </h2>
          <div className="text-xs leading-relaxed text-black print:text-black">
            {section.content.split('\n').map((line, index) => {
              if (!line.trim()) return <br key={index} />;

              if (line.trim().startsWith('winner') || line.trim().match(/^\w+\s+\d{4}$/)) {
                return <div key={index} className="ml-3 italic font-medium">{line.trim()}</div>;
              }

              return <p key={index} className="mb-0.5">{line.trim()}</p>;
            })}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white font-serif text-black print:p-8">
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