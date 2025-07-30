"use client";
import React, { useState, useCallback } from 'react';
import {
  Download,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  Eye,
  ChevronDown,
  CheckCircle
} from 'lucide-react';

// Types
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  address: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface Skills {
  frontend: string[];
  tools: string[];
  other: string[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skills;
}

// Initial data
const initialResumeData: ResumeData = {
  personalInfo: {
    name: 'Eric Johnson',
    email: 'eric.johnson@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/ericjohnson',
    portfolio: 'ericjohnson.dev',
    address: 'San Francisco, CA',
  },
  summary: "Results-driven Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications and leading cross-functional teams to success.",
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      startDate: '2022',
      endDate: 'Present',
      description: [
        'Led development of microservices architecture serving 1M+ users',
        'Improved application performance by 40% through code optimization',
        'Mentored junior developers and conducted code reviews'
      ],
    },
    {
      id: 'exp-2',
      title: 'Software Engineer',
      company: 'Digital Innovations Co.',
      startDate: '2020',
      endDate: '2022',
      description: [
        'Developed responsive web applications using React and Node.js',
        'Collaborated with UX/UI team to implement user-centered designs',
        'Reduced bug reports by 35% through comprehensive testing'
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California, Berkeley',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8/4.0',
    },
  ],
  skills: {
    frontend: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'HTML5', 'CSS3'],
    tools: ['Git', 'Docker', 'AWS', 'Jenkins', 'Jira', 'Figma'],
    other: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
  },
};

// Form Components
const FormSection = ({ title, icon: Icon, children, isOpen = true }: {
  title: string;
  icon: any;
  children: React.ReactNode;
  isOpen?: boolean;
}) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <div className="mb-6 bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4 pt-0 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text" }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
    />
  </div>
);

// Resume Preview Component
const ResumePreview = ({ data }: { data: ResumeData }) => (
  <div className="bg-white p-8 shadow-lg max-w-full" style={{ minHeight: '842px', width: '595px' }}>
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name}</h1>
      <div className="text-gray-600 space-y-1">
        <p>{data.personalInfo.email} • {data.personalInfo.phone}</p>
        <p>{data.personalInfo.linkedin}</p>
        <p>{data.personalInfo.address}</p>
      </div>
    </div>

    {/* Professional Summary */}
    {data.summary && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL SUMMARY</h2>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">PROFESSIONAL EXPERIENCE</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-gray-900">{exp.title}</h3>
              <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
            </div>
            <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {exp.description.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">EDUCATION</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
              <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">TECHNICAL SKILLS</h2>
      <div className="space-y-2">
        {Object.entries(data.skills).map(([category, skills]) => (
          <div key={category}>
            <span className="font-medium text-gray-900 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}: </span>
            <span className="text-gray-700">{skills.join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main Component
export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value: string) => {
    setResumeData(prev => ({ ...prev, summary: value }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: [''],
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const calculateCompletionPercentage = useCallback(() => {
    let completedFields = 0;
    let totalFields = 0;

    // Personal info fields
    Object.values(resumeData.personalInfo).forEach(value => {
      totalFields++;
      if (value.trim()) completedFields++;
    });

    // Summary
    totalFields++;
    if (resumeData.summary.trim()) completedFields++;

    // Experience
    totalFields += resumeData.experience.length * 5;
    resumeData.experience.forEach(exp => {
      if (exp.title.trim()) completedFields++;
      if (exp.company.trim()) completedFields++;
      if (exp.startDate.trim()) completedFields++;
      if (exp.endDate.trim()) completedFields++;
      if (exp.description.some(d => d.trim())) completedFields++;
    });

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [resumeData]);

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-blue-600">ResumeBuilder</div>
            <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {completionPercentage}% Complete
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Business and management</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                Resume template
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Ensure your resume fits the job opening</h3>
                  <p className="text-sm text-blue-700">
                    Add a job posting you're applying for and we'll show you what to optimize.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <FormSection title="Personal Details" icon={User}>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  value={resumeData.personalInfo.name.split(' ')[0] || ''}
                  onChange={(value) => {
                    const lastName = resumeData.personalInfo.name.split(' ').slice(1).join(' ');
                    updatePersonalInfo('name', `${value} ${lastName}`.trim());
                  }}
                  placeholder="Eric"
                />
                <InputField
                  label="Last Name"
                  value={resumeData.personalInfo.name.split(' ').slice(1).join(' ') || ''}
                  onChange={(value) => {
                    const firstName = resumeData.personalInfo.name.split(' ')[0] || '';
                    updatePersonalInfo('name', `${firstName} ${value}`.trim());
                  }}
                  placeholder="Johnson"
                />
              </div>
              <InputField
                label="Email"
                value={resumeData.personalInfo.email}
                onChange={(value) => updatePersonalInfo('email', value)}
                placeholder="eric.johnson@example.com"
                type="email"
              />
              <InputField
                label="Phone"
                value={resumeData.personalInfo.phone}
                onChange={(value) => updatePersonalInfo('phone', value)}
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
              <InputField
                label="LinkedIn"
                value={resumeData.personalInfo.linkedin}
                onChange={(value) => updatePersonalInfo('linkedin', value)}
                placeholder="linkedin.com/in/ericjohnson"
              />
              <InputField
                label="Address"
                value={resumeData.personalInfo.address}
                onChange={(value) => updatePersonalInfo('address', value)}
                placeholder="San Francisco, CA"
              />
            </FormSection>

            {/* Professional Summary */}
            <FormSection title="Professional Summary" icon={FileText}>
              <TextAreaField
                label="Summary"
                value={resumeData.summary}
                onChange={updateSummary}
                placeholder="Write a brief summary of your professional background..."
                rows={4}
              />
            </FormSection>

            {/* Experience */}
            <FormSection title="Work Experience" icon={Briefcase}>
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <InputField
                    label="Job Title"
                    value={exp.title}
                    onChange={(value) => updateExperience(exp.id, 'title', value)}
                    placeholder="Senior Software Engineer"
                  />
                  <InputField
                    label="Company"
                    value={exp.company}
                    onChange={(value) => updateExperience(exp.id, 'company', value)}
                    placeholder="Tech Solutions Inc."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="Start Date"
                      value={exp.startDate}
                      onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                      placeholder="2022"
                    />
                    <InputField
                      label="End Date"
                      value={exp.endDate}
                      onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                      placeholder="Present"
                    />
                  </div>
                  <TextAreaField
                    label="Description"
                    value={exp.description.join('\n')}
                    onChange={(value) => updateExperience(exp.id, 'description', value.split('\n'))}
                    placeholder="• Led development of microservices architecture&#10;• Improved application performance by 40%"
                    rows={4}
                  />
                </div>
              ))}
              <button
                onClick={addExperience}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </FormSection>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-white p-6 overflow-y-auto">
          <div className="flex justify-center">
            <div className="transform scale-75 origin-top">
              <ResumePreview data={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}