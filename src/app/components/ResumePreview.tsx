// src/app/components/ResumePreview.tsx
import React from 'react';
import SectionTitle from './SectionTitle';
import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  zoomLevel?: number;
  activeTemplate?: string; // Still 'string' here
}

export default function ResumePreview({ resumeData, zoomLevel = 1, activeTemplate = 'modern-minimal' }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills } = resumeData;

  // Define templateClasses with explicit type
  const templateClasses: { [key: string]: string } = { // Added index signature here
    'modern-minimal': 'p-8',
    'classic-pro': 'p-10 font-serif',
    'creative-bold': 'p-6 bg-blue-50',
  };

  return (
    <div
      // Use type assertion to tell TypeScript activeTemplate is a valid key
      className={`bg-white border border-[var(--color-border-light)] shadow-xl rounded-lg min-h-[A4] font-inter text-[var(--color-text-medium)] transition-all duration-300 ease-in-out ${templateClasses[activeTemplate as keyof typeof templateClasses]}`}
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
    >
      {/* Header - Personal Info */}
      <header className="text-center mb-8 pb-5 border-b-2 border-[var(--color-primary)]">
        <h1 className="text-5xl font-outfit font-extrabold text-[var(--color-primary-darker)] mb-2 leading-tight">{personalInfo.name}</h1>
        <p className="text-lg text-[var(--color-text-medium)] space-x-2">
          <span>{personalInfo.email}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-primary-dark)] transition-colors">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.portfolio && (
            <>
              <span>|</span>
              <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] hover:underline hover:text-[var(--color-primary-dark)] transition-colors">
                Portfolio
              </a>
            </>
          )}
          <br/>
          <span className="text-md text-[var(--color-text-light)]">{personalInfo.address}</span>
        </p>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-8">
          <SectionTitle>Summary</SectionTitle>
          <p className="text-[var(--color-text-medium)] leading-relaxed text-base">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 last:mb-0 pb-3 border-b border-[var(--color-border-light)] last:border-b-0">
              <h3 className="text-xl font-outfit font-semibold text-[var(--color-text-dark)] mb-1">{exp.title}</h3>
              <p className="text-[var(--color-text-medium)] italic text-sm mb-2">{exp.company} | {exp.startDate} - {exp.endDate}</p>
              <ul className="list-disc list-inside text-[var(--color-text-medium)] mt-2 pl-4 space-y-1">
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
            <div key={edu.id} className="mb-5 last:mb-0 pb-3 border-b border-[var(--color-border-light)] last:border-b-0">
              <h3 className="text-xl font-outfit font-semibold text-[var(--color-text-dark)] mb-1">{edu.degree}</h3>
              <p className="text-[var(--color-text-medium)] italic text-sm mb-1">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
              {edu.gpa && <p className="text-[var(--color-text-medium)] text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section>
          <SectionTitle>Skills</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-[var(--color-text-medium)]">
            {Object.entries(skills).map(([category, skillList]) => (
              <div key={category}>
                <h3 className="font-outfit font-semibold text-[var(--color-primary-dark)] mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
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