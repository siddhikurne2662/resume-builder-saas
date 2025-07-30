// src/types/resume.ts

// Define the ResumeData interface here, with 'id' as string
export interface ResumeData {
  template: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    address: string;
  };
  summary: string;
  experience: {
    id: string; // CORRECTED: Type is string
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    id: string; // CORRECTED: Type is string
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  skills: {
    frontend: string[];
    tools: string[];
    other: string[];
  };
}