// src/data/initialResumeData.ts
import { ResumeData } from '@/types/resume';

export const initialResumeData: ResumeData = {
  template: 'classic-pro-template',
  personalInfo: {
    name: 'Eric Johnson',
    email: 'eric.johnson@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/ericjohnson',
    portfolio: 'ericjohnson.dev',
    address: 'San Francisco, CA',
  },
  summary: "Results-driven professional with 5+ years of experience in my field. Proven track record of delivering high-quality results and leading cross-functional teams to success.",
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Professional',
      company: 'Solutions Inc.',
      startDate: '2022',
      endDate: 'Present',
      description: [
        'Led key projects serving 1M+ customers',
        'Improved operational efficiency by 40% through process optimization',
        'Mentored junior team members and conducted performance reviews'
      ],
      address: undefined
    },
    {
      id: 'exp-2',
      title: 'Professional',
      company: 'Innovations Co.',
      startDate: '2020',
      endDate: '2022',
      description: [
        'Developed and implemented strategic solutions',
        'Collaborated with cross-functional teams to achieve targets',
        'Reduced errors by 35% through comprehensive quality control'
      ],
      address: undefined
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Business Administration',
      institution: 'University of California, Berkeley',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8/4.0',
      address: undefined
    },
  ],
  skills: {
    Technical: ['Microsoft Office', 'Data Analysis', 'Project Management', 'CRM Software', 'Database Management', 'Reporting Tools'],
    Tools: ['Slack', 'Trello', 'Salesforce', 'Google Analytics', 'Zoom', 'Adobe Creative Suite'],
    Soft: ['Leadership', 'Communication', 'Problem Solving', 'Team Management', 'Strategic Planning', 'Time Management'],
  },
};