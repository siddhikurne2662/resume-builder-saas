// Updated BigDataEngineerTemplate with smaller text sizes
// src/app/builder/BigDataEngineerTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface BigDataEngineerTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-bold border-b-2 border-black mb-2 pb-1 uppercase tracking-wider text-black print:text-black break-inside-avoid">
    {children}
  </h2>
);

const BigDataEngineerTemplate: React.FC<BigDataEngineerTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6 print:mb-4 break-inside-avoid">
      <h1 className="text-xl font-bold tracking-wider mb-2 text-black print:text-black print:text-lg">{personalInfo.name}</h1>
      <p className="text-xs text-black print:text-black">
        {[personalInfo.address, personalInfo.phone, personalInfo.email, personalInfo.linkedin]
          .filter(Boolean)
          .join(' • ')}
      </p>
    </div>
  );

  const renderSummary = () => (
    <div className="mb-6 print:mb-4 break-inside-avoid">
      <SectionTitle>Summary</SectionTitle>
      <p className="text-xs leading-relaxed text-black print:text-black">
        {summary}
      </p>
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
            <div className="text-xs text-black print:text-black text-right whitespace-nowrap">
              {exp.startDate} – {exp.endDate}
            </div>
          </div>
          <ul className="list-disc list-inside ml-3 space-y-0.5 text-black print:text-black">
            {exp.description.map((bullet, respIndex) => (
              <li key={respIndex} className="text-xs leading-tight">{bullet}</li>
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
              <p className="text-xs text-black print:text-black">{edu.degree}</p>
            </div>
            <div className="text-xs text-black print:text-black text-right whitespace-nowrap">
              {edu.endDate}
            </div>
          </div>
          {edu.gpa && (
            <ul className="list-disc list-inside ml-3 space-y-0.5 text-black print:text-black">
              <li className="text-xs">GPA: {edu.gpa}</li>
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="mb-6 break-inside-avoid">
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-1 text-xs text-black print:text-black">
        {Object.entries(skills).map(([category, skillList]) => (
          skillList && skillList.length > 0 && (
            <div key={category}>
              <span className="font-bold capitalize">{category.replace(/([A-Z])/g, ' $1')}: </span>
              {skillList.join(', ')}
            </div>
          )
        ))}
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-6 break-inside-avoid">
          <h2 className="text-sm font-bold border-b-2 border-black mb-2 pb-1 uppercase tracking-wider text-black print:text-black">
            {section.title}
          </h2>
          <div className="text-xs leading-relaxed text-black print:text-black">
            {section.content.split('\n').map((line, index) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return <br key={index} />;

              // Handle "winner 2025" type entries
              if (trimmedLine.match(/^(winner|achieved|completed|finalist|placed|awarded)\s+\d{4}/i)) {
                return (
                  <div key={index} className="ml-3">
                    <span className="font-medium">{trimmedLine}</span>
                  </div>
                );
              }

              // Handle bullet points
              if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                return (
                  <div key={index} className="ml-3 mb-0.5">
                    <span>• {trimmedLine.replace(/^[•\-]\s*/, '')}</span>
                  </div>
                );
              }

              // Regular text
              return (
                <div key={index} className="mb-0.5">
                  {trimmedLine}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 font-serif text-black print:p-8">
      {renderContactInfo()}
      {summary && renderSummary()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default BigDataEngineerTemplate;