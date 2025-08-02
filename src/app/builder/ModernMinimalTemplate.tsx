// src/app/components/templates/ModernMinimalTemplate.tsx
import React from 'react';
import { EnhancedResumeData } from '@/types/resume';
import { FileText, Award, Settings, Briefcase, GraduationCap, User } from 'lucide-react';

interface ModernMinimalTemplateProps {
  resumeData: EnhancedResumeData;
}

// Helper function to get icon component
const getIconComponent = (iconName: string): React.ElementType => {
  const iconMap: Record<string, React.ElementType> = {
    FileText,
    Award,
    Settings,
    Briefcase,
    GraduationCap,
    User,
  };
  return iconMap[iconName] || FileText;
};


const ModernMinimalTemplate: React.FC<ModernMinimalTemplateProps> = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, customSections } = resumeData;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-1 font-outfit">
          {personalInfo.name}
        </h1>
        <p className="text-gray-600 mb-1">Software Engineering Lead</p>
        <p className="text-gray-600 text-xs font-inter">
          {personalInfo.address} • {personalInfo.phone} • {personalInfo.email} •{' '}
          {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">LinkedIn</a>} •{' '}
          {personalInfo.portfolio && <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Portfolio</a>}
        </p>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 font-outfit">SUMMARY</h2>
          <p className="text-gray-700 text-xs leading-relaxed font-inter">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 font-outfit">EXPERIENCE</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-xs text-gray-800 font-inter">{exp.title}</h3>
                <span className="text-xs text-gray-600 font-medium font-inter">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              {exp.company && <p className="text-xs text-gray-600 mb-2 italic font-inter">{exp.company}</p>}
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 ml-2 font-inter">
                {exp.description.map((bullet, idx) => (
                  <li key={idx} className="leading-snug">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 font-outfit">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id}>
              <h3 className="font-semibold text-xs text-gray-800 font-inter">{edu.degree}</h3>
              <p className="text-xs text-gray-600 italic font-inter">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
              {edu.gpa && <p className="text-xs text-gray-700 font-inter">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills & Other */}
      {Object.values(skills).some(skillList => skillList.length > 0) && (
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 font-outfit">SKILLS & OTHER</h2>
          {Object.entries(skills).map(([category, skillList]) => (
            skillList.length > 0 && (
              <div key={category} className="mb-2 last:mb-0">
                <span className="font-semibold text-xs text-gray-800 font-inter">{category}:</span>
                <span className="text-xs text-gray-700 ml-1 font-inter">{skillList.join(', ')}</span>
              </div>
            )
          ))}
        </div>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1 font-outfit uppercase">{section.title}</h2>
          <div className="text-xs text-gray-700 leading-relaxed font-inter">
            {section.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModernMinimalTemplate;