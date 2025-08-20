import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface ProfessionalWithTipsProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="border-b-2 border-black pb-2 mb-4">
    <h2 className="text-xl font-bold text-black uppercase tracking-wide">{children}</h2>
  </div>
);

const ProfessionalWithTips: React.FC<ProfessionalWithTipsProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <header className="text-center mb-6">
      <h1 className="text-4xl font-bold text-black uppercase tracking-wide mb-2">{personalInfo.name}</h1>
      <div className="text-gray-600">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} • {personalInfo.linkedin}
      </div>
    </header>
  );

  const renderExperience = () => (
    <section className="mb-8">
      <SectionTitle>Professional Experience</SectionTitle>
      {experience.map((exp) => (
        <div key={exp.id} className="mb-8">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold text-black">{exp.company}</h3>
              <h4 className="font-semibold text-black">{exp.title}</h4>
            </div>
            <p className="text-black">{exp.startDate} – {exp.endDate}</p>
          </div>
          <ul className="list-disc list-inside text-black space-y-2 ml-4">
            {exp.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );

  const renderEducation = () => (
    <section className="mb-8">
      <SectionTitle>Education</SectionTitle>
      {education.map((edu) => (
        <div key={edu.id} className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-black">{edu.institution}</h3>
            <p className="text-black">{edu.degree}</p>
          </div>
          <p className="text-black">{edu.endDate}</p>
        </div>
      ))}
    </section>
  );

  const renderSkills = () => (
    <section>
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-2">
        {Object.entries(skills).map(([category, skillList]) => (
          <p key={category} className="text-black">
            <strong>{category.replace(/([A-Z])/g, ' $1')}:</strong> {skillList.join(', ')}
          </p>
        ))}
      </div>
    </section>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <section key={section.id} className="mb-8">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-black whitespace-pre-wrap">{section.content}</p>
        </section>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {renderContactInfo()}
      {summary && (
        <div className="bg-gray-100 p-3 mt-4 text-sm text-gray-700 italic">
          <p className="mb-2"><strong>Summary:</strong></p>
          <p>{summary}</p>
        </div>
      )}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default ProfessionalWithTips;