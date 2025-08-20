import React from 'react';
import { EnhancedResumeData } from '@/types/resume';

interface TwoColumnModernProps {
  resumeData: EnhancedResumeData;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-blue-600 mb-4 uppercase tracking-wide">
    {children}
  </h3>
);

const TwoColumnModern: React.FC<TwoColumnModernProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  const renderContactInfo = () => (
    <div className="text-right mb-6">
      {personalInfo.address && <p className="text-gray-700">{personalInfo.address}</p>}
      {personalInfo.phone && <p className="text-gray-700">{personalInfo.phone}</p>}
      {personalInfo.email && <p className="text-blue-600 underline">{personalInfo.email}</p>}
      {personalInfo.linkedin && <p className="text-gray-700">{personalInfo.linkedin}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans">
      <div className="grid grid-cols-3 gap-8 print:grid-cols-1 print:gap-0">
        {/* Left Column - Main Content */}
        <div className="col-span-2 print:col-span-1">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">{personalInfo.name}</h1>
            {experience.length > 0 && (
              <h2 className="text-xl font-semibold text-black mb-4">{experience[0].title}</h2>
            )}
            {summary && (
              <p className="text-gray-700 leading-relaxed">
                {summary}
              </p>
            )}
          </header>

          {experience.length > 0 && (
            <section className="mb-8">
              <SectionTitle>Experience</SectionTitle>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-black">{exp.company}</h4>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold italic text-black">{exp.title}</h5>
                    <span className="text-gray-600">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    {exp.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right Column - Contact & Skills */}
        <div className="col-span-1 print:col-span-1">
          {renderContactInfo()}

          {Object.keys(skills).length > 0 && (
            <section className="mb-8">
              <SectionTitle>Skills</SectionTitle>
              <div className="space-y-2">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category}>
                    <h4 className="font-bold text-black capitalize">{category.replace(/([A-Z])/g, ' $1')}:</h4>
                    <p className="text-gray-700">{skillList.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-8">
              <SectionTitle>Education</SectionTitle>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h4 className="font-bold text-black">{edu.institution}</h4>
                  <p className="text-gray-700 font-semibold">{edu.degree}</p>
                  <p className="text-gray-600 mb-3">{edu.startDate} – {edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          )}

          {customSections && customSections.length > 0 && (
            <section>
              <SectionTitle>Other</SectionTitle>
              {customSections.map((section) => (
                <div key={section.id} className="mb-4">
                  <h4 className="font-bold text-black">{section.title}</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnModern;