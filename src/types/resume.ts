// src/types/resume.ts
import { FileText, Award, Briefcase, GraduationCap, User, Settings, Palette, ClipboardList } from 'lucide-react';
import { ReactNode } from 'react';

// Custom section type
export interface CustomSection {
  id: string;
  title: string;
  content: string;
  icon: "FileText" | "Award" | "Settings" | "Briefcase" | "GraduationCap" | "User" | "Palette" | "ClipboardList";
}

// Map of icon names to components
const iconMap = {
  FileText,
  Award,
  Settings,
  Briefcase,
  GraduationCap,
  User,
  Palette,
  ClipboardList
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
    address: ReactNode;
    id: string; // CORRECTED: Type is string
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
  education: {
    address: ReactNode;
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