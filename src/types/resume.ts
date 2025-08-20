// src/types/resume.ts
import { FileText, Award, Briefcase, GraduationCap, User, Settings } from 'lucide-react';

// Custom section type
export interface CustomSection {
  id: string;
  title: string;
  content: string;
    icon: "FileText" | "Award" | "Settings" | "Briefcase" | "GraduationCap" | "User"
  }

// Map of icon names to components
const iconMap = {
  FileText,
  Award,
  Settings,
  Briefcase,
  GraduationCap,
  User,
};

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
    Technical: string[];
    Tools: string[];
    Soft: string[];
  };
}

// Enhanced resume data type with custom sections
export interface EnhancedResumeData extends ResumeData {
  customSections: CustomSection[];
}