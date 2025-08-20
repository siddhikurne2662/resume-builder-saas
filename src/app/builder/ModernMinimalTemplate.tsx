// src/app/components/templates/ModernMinimalTemplate.tsx
import { ResumeData } from '@/types/resume';
import React from 'react';

// Function to generate the HTML for the 'modern-minimal' template
// based on the HTML structure you provided, populated with resumeData.
export const generateModernMinimalHtml = (data: ResumeData): string => {
  const personal = data.personalInfo;
  const summary = data.summary;
  const experiences = data.experience;
  const education = data.education;
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