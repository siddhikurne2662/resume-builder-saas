// src/app/components/ResumePreview.tsx
import React from 'react';
import SectionTitle from './SectionTitle';
import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  resumeData: ResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
}

// Function to generate the HTML for the 'modern-minimal' template
// based on the HTML structure you provided, populated with resumeData.
const generateModernMinimalHtml = (data: ResumeData): string => {
  const personal = data.personalInfo;
  const summary = data.summary;
  const experiences = data.experience;
  const education = data.education; // Assuming only one education entry for simplicity, adapt if multiple
  const skills = data.skills;

  // Header content
  const headerHtml = `
    <div class="mb-6" style="margin-bottom: 1.5rem;">
      <h1 class="text-2xl font-bold text-blue-600 mb-1" style="font-size: 1.5rem; line-height: 2rem; font-weight: 700; color: #2563eb; margin-bottom: 0.25rem;">${personal.name}</h1>
      <p class="text-gray-600 mb-1" style="color: #4b5563; margin-bottom: 0.25rem;">Software Engineering Lead</p>
      <p class="text-gray-600 text-xs" style="color: #4b5563; font-size: 0.75rem; line-height: 1rem;">
        ${personal.address} • ${personal.phone} • ${personal.email} • ${personal.linkedin ? `<a href="https://${personal.linkedin}" target="_blank" rel="noopener noreferrer" style="color: #2566c4; text-decoration: underline;">LinkedIn</a>` : ''} • ${personal.portfolio ? `<a href="https://${personal.portfolio}" target="_blank" rel="noopener noreferrer" style="color: #2566c4; text-decoration: underline;">Portfolio</a>` : ''}
      </p>
    </div>
  `;

  // Summary content
  const summaryHtml = summary ? `
    <div class="mb-6" style="margin-bottom: 1.5rem;">
      <p class="text-gray-700 text-xs leading-relaxed" style="color: #374151; font-size: 0.75rem; line-height: 1.625;">
        ${summary}
      </p>
    </div>
  ` : '';

  // Experience content
  const experiencesHtml = experiences.map(exp => `
    <div class="mb-5" style="margin-bottom: 1.25rem;">
      <div class="flex justify-between items-start mb-1" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
        <h3 class="font-semibold text-xs text-gray-800" style="font-size: 0.75rem; line-height: 1rem; font-weight: 600; color: #1f2937;">${exp.title}</h3>
        <span class="text-xs text-gray-600 font-medium" style="font-size: 0.75rem; line-height: 1rem; color: #4b5563; font-weight: 500;">${exp.startDate} – ${exp.endDate}</span>
      </div>
      ${exp.company ? `<p class="text-xs text-gray-600 mb-2 italic" style="font-size: 0.75rem; line-height: 1rem; color: #4b5563; margin-bottom: 0.5rem; font-style: italic;">${exp.company}</p>` : ''}
      <p class="text-xs text-gray-700 mb-2 leading-relaxed" style="color: #374151; font-size: 0.75rem; line-height: 1.625; margin-bottom: 0.5rem;">${exp.description.join(' ')}</p>
      <ul class="list-disc list-inside text-xs text-gray-700 space-y-1 ml-2" style="list-style-type: disc; list-style-position: inside; color: #374151; font-size: 0.75rem; line-height: 1rem; margin-top: 0.25rem; margin-left: 0.5rem;">
        ${exp.description.map(bullet => `<li style="line-height: 1.625;">${bullet}</li>`).join('')}
      </ul>
    </div>
  `).join('');


  // Education content (assuming the template shows only one education entry, adjust if array needs mapping)
  const educationHtml = education.length > 0 ? `
    <div class="mb-6" style="margin-bottom: 1.5rem;">
      <h2 class="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1" style="font-size: 0.875rem; line-height: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; border-bottom-width: 1px; border-color: #d1d5db; padding-bottom: 0.25rem;">EDUCATION</h2>
      <div>
        <h3 class="font-semibold text-xs text-gray-800" style="font-size: 0.75rem; line-height: 1rem; font-weight: 600; color: #1f2937;">${education[0].degree}</h3>
        <p class="text-xs text-gray-600 italic" style="font-size: 0.75rem; line-height: 1rem; color: #4b5563; font-style: italic;">${education[0].institution} | ${education[0].startDate} - ${education[0].endDate}</p>
        ${education[0].gpa ? `<p class="text-xs text-gray-700" style="font-size: 0.75rem; line-height: 1rem; color: #374151;">GPA: ${education[0].gpa}</p>` : ''}
      </div>
    </div>
  ` : '';

  // Skills content
  const skillsHtml = Object.entries(skills).map(([category, skillList]) => `
    <div class="mb-2" style="margin-bottom: 0.5rem;">
      <span class="font-semibold text-xs text-gray-800" style="font-size: 0.75rem; line-height: 1rem; font-weight: 600; color: #1f2937;">${category.replace(/([A-Z])/g, ' $1').trim()}:</span>
      <span class="text-xs text-gray-700 ml-1" style="font-size: 0.75rem; line-height: 1rem; color: #374151; margin-left: 0.25rem;">${skillList.join(', ')}</span>
    </div>
  `).join('');

  return `
    <div class="max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed" style="max-width: 48rem; margin-left: auto; margin-right: auto; padding: 2rem; background-color: #ffffff; font-size: 0.875rem; line-height: 1.25rem; line-height: 1.625;">
      ${headerHtml}
      ${summaryHtml}
      <div class="mb-6" style="margin-bottom: 1.5rem;">
        <h2 class="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1" style="font-size: 0.875rem; line-height: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; border-bottom-width: 1px; border-color: #d1d5db; padding-bottom: 0.25rem;">PROFESSIONAL EXPERIENCE</h2>
        ${experiencesHtml}
      </div>
      ${educationHtml}
      <div>
        <h2 class="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1" style="font-size: 0.875rem; line-height: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.75rem; border-bottom-width: 1px; border-color: #d1d5db; padding-bottom: 0.25rem;">SKILLS & OTHER</h2>
        ${skillsHtml}
      </div>
    </div>
  `;
};


const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, zoomLevel = 1, activeTemplate = 'modern-minimal' }, ref) => {

    // Define comprehensive ATS-friendly styles for each template
    const templateStyles: { [key: string]: React.CSSProperties } = {
      'modern-minimal': {
        // This will be overridden by dangerouslySetInnerHTML, but kept for consistency
        // or if you ever switch back to a JSX-based rendering for 'modern-minimal'
        // These are fallback styles if dangerouslySetInnerHTML doesn't apply all.
        padding: '2.5rem',
        fontFamily: 'var(--font-inter), sans-serif', // Use global font variable
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
      'minimalist': { // Mapping your new minimalist template
        padding: '2.5rem',
        fontFamily: 'var(--font-inter), sans-serif',
        color: '#1a202c',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff',
      }
    };

    const sectionTitleClasses: { [key: string]: string } = {
      'modern-minimal': 'text-gray-800 border-blue-600', // This will be handled by the inline CSS
      'classic-pro': 'text-gray-700 border-gray-400 font-serif italic',
      'creative-bold': 'text-blue-700 border-blue-400 font-outfit uppercase',
      'linkedin-modern': 'text-blue-700 border-blue-700 font-bold tracking-wide uppercase text-lg',
      'linkedin-professional': 'text-gray-800 border-gray-500 font-bold text-xl',
      'linkedin-minimal': 'text-gray-700 border-gray-300 font-semibold text-lg',
      'minimalist': 'text-gray-800 border-gray-300'
    };

    const headerNameClasses: { [key: string]: string } = {
      'modern-minimal': 'text-blue-800 font-bold', // This will be handled by the inline CSS
      'classic-pro': 'text-gray-800 font-serif font-extrabold',
      'creative-bold': 'text-blue-700 font-outfit font-black',
      'linkedin-modern': 'text-blue-800 font-bold',
      'linkedin-professional': 'text-gray-900 font-bold',
      'linkedin-minimal': 'text-gray-800 font-bold',
      'minimalist': 'text-gray-900 font-bold'
    };

    // Render based on activeTemplate
    let content;
    if (activeTemplate === 'modern-minimal') {
      content = generateModernMinimalHtml(resumeData);
    } else {
      // Original JSX rendering for other templates
      const { personalInfo, summary, experience, education, skills } = resumeData;
      content = (
        <div
          // Standard A4 dimensions
          className={`bg-white rounded-lg min-h-[A4]`}
          style={{
            ...templateStyles[activeTemplate as keyof typeof templateStyles],
          }}
        >
          {/* Header - Personal Info */}
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

          {/* Summary */}
          {summary && (
            <section className="mb-8">
              <SectionTitle className={sectionTitleClasses[activeTemplate as keyof typeof sectionTitleClasses]}>Summary</SectionTitle>
              <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
            </section>
          )}

          {/* Experience */}
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

          {/* Education */}
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

          {/* Skills */}
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
        ref={ref} // Forward the ref here
        className={`bg-white rounded-lg min-h-[A4] transition-all duration-300 ease-in-out`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'top left',
          width: '595px', // Standard A4 width in pixels at 96 DPI
          minHeight: '842px', // Standard A4 height in pixels at 96 DPI
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

ResumePreview.displayName = 'ResumePreview'; // Important for forwardRef

export default ResumePreview;