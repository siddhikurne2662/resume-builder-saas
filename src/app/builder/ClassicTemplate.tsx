// Updated ClassicTemplate with smaller text sizes
// src/app/builder/ClassicTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface ClassicTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-bold border-b border-black mb-3 tracking-wider uppercase text-black print:text-black break-inside-avoid">{children}</h2>
);

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6 print:mb-4 break-inside-avoid">
      <h1 className="text-xl font-bold tracking-wider mb-2 text-black print:text-black print:text-lg">{personalInfo.name}</h1>
      <div className="text-xs text-black print:text-black">
        {[personalInfo.address, personalInfo.email, personalInfo.phone, personalInfo.linkedin]
          .filter(Boolean)
          .join(' • ')}
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="mb-4 break-inside-avoid">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-xs text-black print:text-black">{exp.company}</h3>
              <p className="font-semibold text-xs text-black print:text-black">{exp.title}</p>
            </div>
            <div className="text-right text-xs text-black print:text-black">
              <p className="font-bold">{exp.address}</p>
              <p>{exp.startDate} – {exp.endDate}</p>
            </div>
          </div>
          {exp.description.length > 0 && (
            <ul className="list-disc list-inside text-xs ml-3 space-y-0.5 text-black print:text-black">
              {exp.description.map((bullet, bIndex) => (
                <li key={bIndex}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Education</SectionTitle>
      {education.map((edu, index) => (
        <div key={edu.id || index} className="mb-3 break-inside-avoid">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-2">
              <h3 className="font-bold text-xs text-black print:text-black">{edu.institution}</h3>
              <p className="italic text-xs text-black print:text-black">{edu.degree}</p>
            </div>
            <div className="text-right text-xs text-black print:text-black">
              <div className="font-bold">{edu.address}</div>
              <div>{edu.startDate} – {edu.endDate}</div>
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
    <div className="mb-4 break-inside-avoid">
      <SectionTitle>Additional Information</SectionTitle>
      <div className="space-y-1 text-black print:text-black">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <span className="font-bold capitalize text-xs">{category.replace(/([A-Z])/g, ' $1')}: </span>
            <span className="text-xs">{skillList.join(', ')}</span>
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
    <div className="max-w-4xl mx-auto p-6 bg-white font-serif text-black print:p-8">
      {renderContactInfo()}
      {summary && (
        <div className="mb-4 break-inside-avoid">
          <SectionTitle>SUMMARY</SectionTitle>
          <p className="text-xs leading-relaxed text-black print:text-black">{summary}</p>
        </div>
      )}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default ClassicTemplate;