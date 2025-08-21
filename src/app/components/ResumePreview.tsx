// src/app/components/ResumePreview.tsx
import React, { lazy, Suspense } from 'react';
import { EnhancedResumeData } from '@/types/resume';
import SectionTitle from '@/app/components/SectionTitle';

// Dynamically import all template components using absolute paths
// Each of these template files needs to be created in the specified path
const templateComponents: { [key: string]: React.ElementType } = {
  // New template mapping
  'data-analyst-template': lazy(() => import('@/app/builder/DataAnalystTemplate')),
};

interface ResumePreviewProps {
  resumeData: EnhancedResumeData;
  zoomLevel?: number;
  activeTemplate?: string;
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, zoomLevel = 1, activeTemplate = 'data-analyst-template' }, ref) => {

    const TemplateComponent = templateComponents[activeTemplate];

    if (!TemplateComponent) {
      return (
        <div className="flex justify-center items-center h-full">
          Template not found.
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
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Suspense fallback={<div>Loading template...</div>}>
          <TemplateComponent resumeData={resumeData} />
        </Suspense>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
