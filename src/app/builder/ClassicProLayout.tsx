import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface ClassicProLayoutProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold border-b border-black mb-3">{children}</h2>
);

const ClassicProLayout: React.FC<ClassicProLayoutProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold mb-2">{personalInfo.name}</h1>
      <p className="text-sm">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email}
        {personalInfo.linkedin && (
          <>
            {' '}• <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
          </>
        )}
      </p>
    </div>
  );

  const renderExperience = () => (
    <section className="mb-6">
      <SectionTitle>Experience</SectionTitle>
      {experience.map(exp => (
        <div key={exp.id} className="mb-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="font-bold">{exp.company}</h3>
              <p className="italic">{exp.title}</p>
            </div>
            <div className="text-right">
              <p>{exp.startDate} – {exp.endDate}</p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
            {exp.description.map((desc, idx) => (
              <li key={idx}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );

  const renderEducation = () => (
    <section className="mb-6">
      <SectionTitle>Education</SectionTitle>
      {education.map(edu => (
        <div key={edu.id} className="mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">{edu.institution}</h3>
              <p className="italic">{edu.degree}</p>
            </div>
            <div className="text-right">
              <p>{edu.startDate} – {edu.endDate}</p>
            </div>
          </div>
          {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </section>
  );

  const renderSkills = () => (
    <section>
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-1 text-sm">
        {Object.entries(skills).map(([category, skillList]) => (
          <p key={category}>
            <span className="font-bold">{category.replace(/([A-Z])/g, ' $1').trim()}:</span> {skillList.join(', ')}
          </p>
        ))}
      </div>
    </section>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <div key={section.id} className="mb-6">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg font-serif">
      {renderContactInfo()}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold border-b border-black mb-3">SUMMARY</h2>
          <p className="text-sm">{summary}</p>
        </div>
      )}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default ClassicProLayout;