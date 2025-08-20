// src/app/components/ResumePreview.tsx
import React from 'react';
import SectionTitle from './SectionTitle';
import { ResumeData } from '@/types/resume';
// CORRECTED: Import the function as a named export using curly braces.
import { generateModernMinimalHtml } from '@/app/builder/ModernMinimalTemplate';

interface ResumePreviewProps {
  resumeData: ResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, zoomLevel = 1, activeTemplate = 'modern-minimal' }, ref) => {

    const templateStyles: { [key: string]: React.CSSProperties } = {
      'modern-minimal': {
        padding: '2.5rem',
        fontFamily: 'var(--font-inter), sans-serif',
        color: '#1f2937',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      'classic-pro': {
        padding: '2rem',
        fontFamily: 'Georgia, serif',
        color: '#374151',
        border: '1px solid #d1d5db',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      'creative-bold': {
        padding: '2rem',
        fontFamily: 'var(--font-outfit), sans-serif',
        color: '#1f2937',
        border: '1px solid #bfdbfe',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backgroundColor: '#f8fafc',
      },
      'linkedin-modern': {
        padding: '2rem 3rem',
        fontFamily: 'Arial, sans-serif',
        color: '#333333',
        border: 'none',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        lineHeight: '1.4',
      },
      'linkedin-professional': {
        padding: '2rem',
        fontFamily: '"Times New Roman", serif',
        color: '#222222',
        border: '1px solid #eeeeee',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        backgroundColor: '#ffffff',
        lineHeight: '1.35',
      },
      'linkedin-minimal': {
        padding: '3rem',
        fontFamily: 'Verdana, sans-serif',
        color: '#444444',
        border: 'none',
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        lineHeight: '1.5',
      },
      'minimalist': {
        padding: '2.5rem',
        fontFamily: 'var(--font-inter), sans-serif',
        color: '#1a202c',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff',
      }
    };

    const sectionTitleClasses: { [key: string]: string } = {
      'modern-minimal': 'text-gray-800 border-blue-600',
      'classic-pro': 'text-gray-700 border-gray-400 font-serif italic',
      'creative-bold': 'text-blue-700 border-blue-400 font-outfit uppercase',
      'linkedin-modern': 'text-blue-700 border-blue-700 font-bold tracking-wide uppercase text-lg',
      'linkedin-professional': 'text-gray-800 border-gray-500 font-bold text-xl',
      'linkedin-minimal': 'text-gray-700 border-gray-300 font-semibold text-lg',
      'minimalist': 'text-gray-800 border-gray-300'
    };

    const headerNameClasses: { [key: string]: string } = {
      'modern-minimal': 'text-blue-800 font-bold',
      'classic-pro': 'text-gray-800 font-serif font-extrabold',
      'creative-bold': 'text-blue-700 font-outfit font-black',
      'linkedin-modern': 'text-blue-800 font-bold',
      'linkedin-professional': 'text-gray-900 font-bold',
      'linkedin-minimal': 'text-gray-800 font-bold',
      'minimalist': 'text-gray-900 font-bold'
    };

    let content;
    if (activeTemplate === 'modern-minimal') {
      content = generateModernMinimalHtml(resumeData);
    } else {
      const { personalInfo, summary, experience, education, skills } = resumeData;
      content = (
        <div
          className={`bg-white rounded-lg min-h-[A4]`}
          style={{
            ...templateStyles[activeTemplate as keyof typeof templateStyles],
          }}
        >
          <header className={`text-center mb-8 pb-5 border-b-2 ${sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]?.split(' ')[1]}`}>
            <h1 className={`text-5xl mb-2 leading-tight ${headerNameClasses[activeTemplate as keyof typeof headerNameClasses]}`}>
              {personalInfo.name}
            </h1>
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

          {summary && (
            <section className="mb-8">
              <SectionTitle className={sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]}>Summary</SectionTitle>
              <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-8">
              <SectionTitle className={sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]}>Experience</SectionTitle>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-5 last:mb-0 pb-3 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{exp.title}</h3>
                  <p className="text-gray-600 italic text-sm mb-2">{exp.company} | {exp.startDate} - ${exp.endDate}</p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 pl-4 space-y-1">
                    {exp.description.map((desc, idx) => (
                      <li key={idx} className="leading-snug">{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-8">
              <SectionTitle className={sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]}>Education</SectionTitle>
              {education.map((edu) => (
                <div key={edu.id} className="mb-5 last:mb-0 pb-3 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{edu.degree}</h3>
                  <p className="text-gray-600 italic text-sm mb-1">{edu.institution} | {edu.startDate} - ${edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-700 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </section>
          )}

          {skills && (
            <section>
              <SectionTitle className={sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]}>Skills</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category}>
                    <h3 className={`font-semibold text-blue-600 mb-2 capitalize ${activeTemplate === 'creative-bold' ? 'font-outfit' : ''}`}>{category.replace(/([A-Z])/g, ' $1')}</h3>
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

    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg min-h-[A4] transition-all duration-300 ease-in-out`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          width: '595px',
          minHeight: '842px',
        }}
      >
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;