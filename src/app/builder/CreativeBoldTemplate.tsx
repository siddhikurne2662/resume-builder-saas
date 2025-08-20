import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface CreativeBoldTemplateProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-blue-600 mb-4 uppercase tracking-wide">
    {children}
  </h3>
);

const CreativeBoldTemplate: React.FC<CreativeBoldTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <header className="mb-8">
      <h1 className="text-4xl font-light text-blue-600 mb-2">{personalInfo.name}</h1>
      {experience.length > 0 && (
        <h2 className="text-xl text-gray-600 mb-3">{experience[0].title}</h2>
      )}
      <p className="text-sm text-gray-600">
        {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} • {personalInfo.linkedin}
      </p>
    </header>
  );

  const renderSummary = () => (
    <div className="mb-6">
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  );

  const renderExperience = () => (
    <section className="mb-8">
      <SectionTitle>Work Experience</SectionTitle>
      {experience.map(exp => (
        <div key={exp.id} className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-lg">{exp.title}</h4>
              <p className="text-gray-600">{exp.company}</p>
            </div>
            <p className="text-gray-600">{exp.startDate} – {exp.endDate}</p>
          </div>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
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
      {education.map(edu => (
        <div key={edu.id}>
          <h4 className="font-semibold">{edu.institution}</h4>
          <p className="text-gray-600">{edu.degree}</p>
          <p className="text-gray-600 mb-3">{edu.startDate} – {edu.endDate}</p>
          {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
        </div>
      ))}
    </section>
  );

  const renderSkills = () => (
    <section>
      <SectionTitle>Skills & Other</SectionTitle>
      <div className="space-y-2 text-gray-700">
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <p><span className="font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1')}:</span> {skillList.join(', ')}</p>
          </div>
        ))}
      </div>
    </section>
  );

  const renderCustomSections = () => (
    <>
      {customSections?.map((section) => (
        <section key={section.id} className="mb-8">
          <SectionTitle>{section.title}</SectionTitle>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </section>
      ))}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans">
      {renderContactInfo()}
      {summary && renderSummary()}
      {experience.length > 0 && renderExperience()}
      {education.length > 0 && renderEducation()}
      {skills && renderSkills()}
      {customSections && customSections.length > 0 && renderCustomSections()}
    </div>
  );
};

export default CreativeBoldTemplate;