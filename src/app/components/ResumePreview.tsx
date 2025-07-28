// src/app/components/ResumePreview.tsx
import React from 'react';
import SectionTitle from './SectionTitle';
import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
}

export default function ResumePreview({ resumeData, zoomLevel = 1, activeTemplate = 'modern-minimal' }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  const templateClasses: { [key: string]: string } = {
    'modern-minimal': 'p-8',
    'classic-pro': 'p-10 font-serif',
    'creative-bold': 'p-6 bg-blue-50',
  };

  return (
    <div
      className={`bg-white border border-gray-200 shadow-xl rounded-lg min-h-[A4] font-inter text-gray-700 transition-all duration-300 ease-in-out ${templateClasses[activeTemplate as keyof typeof templateClasses]}`}
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
    >
      {/* Header - Personal Info */}
      <header className="text-center mb-8 pb-5 border-b-2 border-blue-600">
        <h1 className="text-5xl font-outfit font-extrabold text-blue-700 mb-2 leading-tight">{personalInfo.name}</h1>
        <p className="text-lg text-gray-600 space-x-2">
          <span>{personalInfo.email}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline hover:text-blue-700 transition-colors">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span>|</span>
              <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline hover:text-blue-700 transition-colors">
                Portfolio
              </a>
            </>
          )}
          <br/>
          <span className="text-md text-gray-500">{personalInfo.address}</span>
        </p>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 last:mb-0 pb-3 border-b border-gray-200 last:border-b-0">
              <h3 className="text-xl font-outfit font-semibold text-gray-800 mb-1">{exp.title}</h3>
              <p className="text-gray-600 italic text-sm mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</p>
              <ul className="list-disc list-inside text-gray-700 mt-2 pl-4 space-y-1">
                {exp.description.map((desc, idx) => (
                  <li key={idx} className="leading-snug">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Education</SectionTitle>
          {education.map((edu) => (
            <div key={edu.id} className="mb-5 last:mb-0 pb-3 border-b border-gray-200 last:border-b-0">
              <h3 className="text-xl font-outfit font-semibold text-gray-800 mb-1">{edu.degree}</h3>
              <p className="text-gray-600 italic text-sm mb-1">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
              {edu.gpa && <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <h3 className="font-outfit font-semibold text-blue-600 mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {skillList.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}